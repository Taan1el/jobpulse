import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('SignalDesk', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows reference profiles and the build queue', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'SignalDesk' })).toBeInTheDocument()
    expect(screen.getByText('Operations Tracker')).toBeInTheDocument()
    expect(
      screen.getByText('Full-stack dashboard profile'),
    ).toBeInTheDocument()
    expect(screen.getByText('Write component tests')).toBeInTheDocument()
  })

  it('filters requirement signals by category', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Backend' }))

    const signalList = screen.getByLabelText('Filtered requirement signals')

    expect(within(signalList).getByText('REST integration')).toBeInTheDocument()
    expect(within(signalList).queryByText('React + TypeScript')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Backend' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('adds a new technical signal and saves it locally', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Skill'), 'Accessibility')
    await user.selectOptions(screen.getByLabelText('Category'), 'Quality')
    await user.type(
      screen.getByLabelText('Evidence'),
      'Frontend reviews mention accessible interfaces and semantic markup.',
    )
    await user.type(
      screen.getByLabelText('Project angle'),
      'Add keyboard-friendly controls and screen-reader labels.',
    )
    await user.click(screen.getByRole('button', { name: 'Save signal' }))

    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(window.localStorage.getItem('signaldesk-state-v1')).toContain(
      'Accessibility',
    )
  })

  it('shows inline errors instead of saving an incomplete signal', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Skill'), '   ')
    await user.click(screen.getByRole('button', { name: 'Save signal' }))

    const skillInput = screen.getByLabelText('Skill')

    expect(skillInput).toHaveFocus()
    expect(skillInput).toHaveAttribute('aria-invalid', 'true')
    expect(skillInput).toHaveAccessibleDescription('Enter the skill or requirement.')
    expect(screen.getByLabelText('Evidence')).toHaveAccessibleDescription(
      'Describe where the requirement appeared.',
    )
    expect(screen.getByText('Showing 5 of 5 signals')).toBeInTheDocument()

    await user.type(skillInput, 'GraphQL')

    expect(skillInput).not.toHaveAttribute('aria-invalid')
  })

  it('points to Add mention when the skill is already tracked', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Skill'), 'rest integration')
    await user.type(screen.getByLabelText('Evidence'), 'Seen in another project note.')
    await user.type(screen.getByLabelText('Project angle'), 'Nothing new to build.')
    await user.click(screen.getByRole('button', { name: 'Save signal' }))

    expect(screen.getByLabelText('Skill')).toHaveAccessibleDescription(
      '"rest integration" is already tracked. Use "Add mention" on its card instead.',
    )
    expect(screen.getByText('Showing 5 of 5 signals')).toBeInTheDocument()
  })

  it('switches between connection states', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByText('Signal batch synced')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Error' }))

    expect(screen.getByText('Source unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Last local snapshot/)).toBeInTheDocument()
  })

  it('imports a sample signal batch into local planning data', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Import sample batch' }))

    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Responsive dashboards')).toBeInTheDocument()
    expect(window.localStorage.getItem('signaldesk-state-v1')).toContain(
      'Responsive dashboards',
    )
  })

  it('imports the sample batch only once', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Import sample batch' }))

    expect(screen.getByRole('button', { name: 'Sample batch imported' })).toBeDisabled()
    expect(screen.getByRole('status', { name: 'Notifications' })).toHaveTextContent(
      'Imported sample batch: 3 new, 0 already tracked',
    )
  })

  it('moves a task through the build queue', async () => {
    const user = userEvent.setup()
    const task = 'Deploy a preview build'

    render(<App />)

    await user.click(screen.getByRole('button', { name: `Start: ${task}` }))

    const taskCard = screen
      .getByRole('button', { name: `Complete: ${task}` })
      .closest('article')

    expect(taskCard).toHaveTextContent('In progress')

    await user.click(
      within(taskCard as HTMLElement).getByRole('button', { name: `Complete: ${task}` }),
    )

    expect(taskCard).toHaveTextContent('Done')
    expect(
      within(taskCard as HTMLElement).getByRole('button', { name: `Reopen: ${task}` }),
    ).toBeInTheDocument()
  })

  it('exports the current signals as JSON', async () => {
    const user = userEvent.setup()
    const createObjectUrl = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:signaldesk')
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(
      () => undefined,
    )
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Export JSON' }))

    expect(createObjectUrl).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:signaldesk')
  })

  it('filters signals using the live search input', async () => {
    const user = userEvent.setup()

    render(<App />)

    const searchInput = screen.getByLabelText('Search skills & requirements')
    await user.type(searchInput, 'testing')

    const signalList = screen.getByLabelText('Filtered requirement signals')
    expect(within(signalList).getByText('Testing and linting')).toBeInTheDocument()
    expect(within(signalList).queryByText('React + TypeScript')).not.toBeInTheDocument()
  })

  it('shows an empty state when search query matches nothing', async () => {
    const user = userEvent.setup()

    render(<App />)

    const searchInput = screen.getByLabelText('Search skills & requirements')
    await user.type(searchInput, 'NonExistentSkillXYZ')

    expect(screen.getByText('No matching requirement signals')).toBeInTheDocument()
    expect(
      screen.getByText(/Try adjusting your search query/),
    ).toBeInTheDocument()
  })

  it('sorts signals alphabetically when selected', async () => {
    const user = userEvent.setup()

    render(<App />)

    const sortSelect = screen.getByLabelText('Sort by')
    await user.selectOptions(sortSelect, 'alphabetical')

    const table = screen.getByLabelText('Filtered requirement signals')
    const skillButtons = within(table).getAllByRole('button', {
      name: (accessibleName) => !accessibleName.startsWith('Add mention'),
    })

    expect(skillButtons[0]).toHaveTextContent('Component systems')
  })

  it('resets demo data back to default baseline', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<App />)

    // Add mention to change state; React + TypeScript is the strongest
    // signal, so it starts selected in the side detail panel.
    const addMentionBtn = screen.getByRole('button', {
      name: 'Add mention for React + TypeScript',
    })
    await user.click(addMentionBtn)
    expect(screen.getByText('10 mentions')).toBeInTheDocument()

    // Click reset in the demo bar
    await user.click(screen.getByRole('button', { name: 'Reset sample data' }))

    // Baseline mentions for React + TypeScript is 9
    expect(screen.getByText('9 mentions')).toBeInTheDocument()
  })

  it('announces actions through a status region that stays mounted', async () => {
    const user = userEvent.setup()

    render(<App />)

    const notifications = screen.getByRole('status', { name: 'Notifications' })
    expect(notifications).toBeEmptyDOMElement()

    await user.click(
      screen.getByRole('button', { name: 'Add mention for React + TypeScript' }),
    )

    expect(notifications).toHaveTextContent(
      'Incremented mentions for React + TypeScript',
    )
  })

  it('reports how many signals match the current filters', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByText('Showing 5 of 5 signals')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search skills & requirements'), 'testing')

    expect(screen.getByText('Showing 1 of 5 signals')).toBeInTheDocument()
  })

  it('handles corrupted localStorage data without crashing', () => {
    window.localStorage.setItem('signaldesk-state-v1', '{invalid-json')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'SignalDesk' })).toBeInTheDocument()
    expect(screen.getAllByText('React + TypeScript').length).toBeGreaterThanOrEqual(1)
  })
})
