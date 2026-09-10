import { beforeEach, describe, expect, it } from 'vitest'
import { initialState } from '../../shared/signaldesk'
import { loadState, parseSavedState, saveState, storageKey } from './storage'

const [firstSignal] = initialState.signals
const [firstTask] = initialState.tasks

describe('parseSavedState', () => {
  it('returns the seed data when nothing is saved', () => {
    expect(parseSavedState(null)).toBe(initialState)
  })

  it('returns the seed data for unreadable JSON', () => {
    expect(parseSavedState('{not json')).toBe(initialState)
  })

  it('rejects a signal with a missing field', () => {
    const { mentions: _mentions, ...signalWithoutMentions } = firstSignal
    const saved = JSON.stringify({ signals: [signalWithoutMentions], tasks: [] })

    expect(parseSavedState(saved)).toBe(initialState)
  })

  it('rejects unknown categories and task statuses', () => {
    const unknownCategory = JSON.stringify({
      signals: [{ ...firstSignal, category: 'Design' }],
      tasks: [],
    })
    const unknownStatus = JSON.stringify({
      signals: [],
      tasks: [{ ...firstTask, status: 'Blocked' }],
    })

    expect(parseSavedState(unknownCategory)).toBe(initialState)
    expect(parseSavedState(unknownStatus)).toBe(initialState)
  })

  it('restores a valid saved state', () => {
    const saved = {
      signals: [firstSignal],
      tasks: [firstTask],
      importedBatchIds: ['sample-batch'],
    }

    expect(parseSavedState(JSON.stringify(saved))).toEqual(saved)
  })

  it('treats saves without imported batch ids as having none', () => {
    const saved = { signals: [firstSignal], tasks: [firstTask] }

    expect(parseSavedState(JSON.stringify(saved))).toEqual({
      ...saved,
      importedBatchIds: [],
    })
  })
})

describe('loadState and saveState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips state through localStorage', () => {
    const state = {
      signals: [{ ...firstSignal, mentions: 12 }],
      tasks: [],
      importedBatchIds: [],
    }

    saveState(state)

    expect(window.localStorage.getItem(storageKey)).toContain('"mentions":12')
    expect(loadState()).toEqual(state)
  })
})
