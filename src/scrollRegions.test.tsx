import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

// jsdom cannot measure scrolling, so this checks the markup that lets
// keyboard users reach every container that can scroll sideways.
const scrollSelector = '.table-wrapper, [class*="scroll"], [class*="overflow"]'

function expectRegions(container: HTMLElement) {
  const wrappers = Array.from(container.querySelectorAll<HTMLElement>(scrollSelector))
  expect(wrappers.length).toBeGreaterThan(0)
  for (const el of wrappers) {
    expect(el.getAttribute('role')).toBe('region')
    expect(el.getAttribute('tabindex')).toBe('0')
    expect(el.getAttribute('aria-label')?.trim()).toBeTruthy()
  }
}

describe('scrollable regions', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(cleanup)

  it('labels every scroll wrapper in the leaderboard view', () => {
    const { container } = render(<App />)
    expectRegions(container)
    expect(container.querySelector('.table-wrapper')).not.toBeNull()
  })

  it('keeps the wrappers after selecting a signal and switching states', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(container.querySelectorAll<HTMLElement>('.skill-btn')[1])
    for (const tab of container.querySelectorAll<HTMLElement>('.tabs button')) {
      await user.click(tab)
    }
    expectRegions(container)
    expect(container.querySelector('.table-wrapper')).not.toBeNull()
  })
})
