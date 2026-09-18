import { describe, expect, it } from 'vitest'
import { formatCount, pluralize } from './pluralize'

describe('pluralize', () => {
  it('uses the singular form for exactly 1', () => {
    expect(pluralize(1, 'signal')).toBe('signal')
    expect(pluralize(-1, 'signal')).toBe('signal')
  })

  it('uses the regular plural form (adds "s") for any other count', () => {
    expect(pluralize(0, 'signal')).toBe('signals')
    expect(pluralize(2, 'signal')).toBe('signals')
    expect(pluralize(30, 'mention')).toBe('mentions')
  })

  it('uses an explicit irregular plural when given one', () => {
    expect(pluralize(1, 'match', 'matches')).toBe('match')
    expect(pluralize(2, 'match', 'matches')).toBe('matches')
    expect(pluralize(0, 'match', 'matches')).toBe('matches')
  })
})

describe('formatCount', () => {
  it('joins the count and the correctly pluralized noun', () => {
    expect(formatCount(1, 'signal')).toBe('1 signal')
    expect(formatCount(2, 'signal')).toBe('2 signals')
    expect(formatCount(0, 'mention')).toBe('0 mentions')
    expect(formatCount(1, 'match', 'matches')).toBe('1 match')
    expect(formatCount(5, 'match', 'matches')).toBe('5 matches')
  })
})
