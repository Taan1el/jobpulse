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

  it('advances tasks through the project queue', async () => {
    const user = userEvent.setup()

    render(<App />)

    const taskCard = screen.getByRole('button', { name: 'Next' }).closest('article')

    expect(taskCard).not.toBeNull()

    await user.click(
      within(taskCard as HTMLElement).getByRole('button', {
        name: 'Next',
      }),
    )

    expect(
      within(taskCard as HTMLElement).getByRole('button', { name: 'In progress' }),
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
})
