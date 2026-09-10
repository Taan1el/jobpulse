import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

// jsdom has no layout engine, so axe cannot measure color contrast here.
const rulesJsdomCannotCheck = new Set(['color-contrast'])

// axe reports some problems, such as aria-label on an element without a role,
// as "incomplete" instead of a violation, so both lists are treated as failures.
// Returns "rule-id: selector" strings so a failing test shows what to fix.
async function findViolations(container: HTMLElement) {
  const results = await axe.run(container)

  return [...results.violations, ...results.incomplete]
    .filter((result) => !rulesJsdomCannotCheck.has(result.id))
    .map(
      (result) =>
        `${result.id}: ${result.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    )
}

describe('JobPulse accessibility', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('has no axe violations on first load', async () => {
    const { container } = render(<App />)

    expect(await findViolations(container)).toEqual([])
  }, 15000)

  it('has no axe violations when a search matches nothing', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.type(
      screen.getByLabelText('Search skills & requirements'),
      'no-such-skill',
    )

    expect(await findViolations(container)).toEqual([])
  }, 15000)
})
