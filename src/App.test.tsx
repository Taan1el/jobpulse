import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('JobPulse', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows target listings and the best next project move', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'JobPulse' })).toBeInTheDocument()
    expect(screen.getByText('Operations Tracker')).toBeInTheDocument()
    expect(
      screen.getByText('Full-Stack JavaScript Developer'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Add screenshots and responsive review')).toHaveLength(2)
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

  it('adds a new job signal and saves it locally', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Skill'), 'Accessibility')
    await user.selectOptions(screen.getByLabelText('Category'), 'Quality')
    await user.type(
      screen.getByLabelText('Evidence'),
      'Frontend roles mention accessible interfaces and semantic markup.',
    )
    await user.type(
      screen.getByLabelText('Project angle'),
      'Add keyboard-friendly controls and screen-reader labels.',
    )
    await user.click(screen.getByRole('button', { name: 'Save signal' }))

    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(window.localStorage.getItem('jobpulse-state-v1')).toContain(
      'Accessibility',
    )
  })

  it('switches REST-style integration states', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByText('Imported job signals')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Error' }))

    expect(screen.getByText('Source unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Last local snapshot/)).toBeInTheDocument()
  })

  it('imports a sample listing batch into local planning data', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Import sample batch' }))

    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Responsive dashboards')).toBeInTheDocument()
    expect(window.localStorage.getItem('jobpulse-state-v1')).toContain(
      'Responsive dashboards',
    )
  })

  it('advances tasks through the project queue', async () => {
    const user = userEvent.setup()

    render(<App />)

    const taskCard = screen
      .getByRole('button', {
        name: 'Advance Add screenshots and responsive review from Next',
      })
      .closest('article')

    expect(taskCard).not.toBeNull()

    await user.click(
      within(taskCard as HTMLElement).getByRole('button', {
        name: 'Advance Add screenshots and responsive review from Next',
      }),
    )

    expect(
      within(taskCard as HTMLElement).getByRole('button', {
        name: 'Advance Add screenshots and responsive review from In progress',
      }),
    ).toBeInTheDocument()
  })

  it('exports the current signals as JSON', async () => {
    const user = userEvent.setup()
    const createObjectUrl = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:jobpulse')
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
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:jobpulse')
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

    const signalHeaders = within(screen.getByLabelText('Filtered requirement signals'))
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)

    expect(signalHeaders[0]).toBe('Component systems')
  })

  it('resets demo data back to default baseline', async () => {
    const user = userEvent.setup()

    render(<App />)

    // Add mention to change state
    const addMentionBtn = screen.getByRole('button', {
      name: 'Add mention for React + TypeScript',
    })
    await user.click(addMentionBtn)
    expect(screen.getByText('10 mentions')).toBeInTheDocument()

    // Click reset
    await user.click(
      screen.getByRole('button', { name: 'Reset project data to defaults' }),
    )

    // Baseline mentions for React + TypeScript is 9
    expect(screen.getByText('9 mentions')).toBeInTheDocument()
  })

  it('handles corrupted localStorage data without crashing', () => {
    window.localStorage.setItem('jobpulse-state-v1', '{invalid-json')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'JobPulse' })).toBeInTheDocument()
    expect(screen.getAllByText('React + TypeScript').length).toBeGreaterThanOrEqual(1)
  })
})
