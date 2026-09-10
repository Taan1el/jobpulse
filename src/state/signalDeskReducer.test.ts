import { describe, expect, it } from 'vitest'
import {
  initialState,
  type SignalBatch,
  type SignalDeskState,
} from '../../shared/signaldesk'
import { findNewSignals, nextSignalId, signalDeskReducer } from './signalDeskReducer'

function mentionsFor(state: SignalDeskState, signalId: number) {
  return state.signals.find((signal) => signal.id === signalId)?.mentions
}

const batch: SignalBatch = {
  id: 'test-batch',
  requirements: [
    {
      skill: 'react + typescript',
      category: 'Frontend',
      evidence: 'Seen again in a new planning source.',
      projectAngle: 'Keep the dashboard typed end to end.',
    },
    {
      skill: 'Accessibility',
      category: 'Quality',
      evidence: 'Usability checks mention keyboard support.',
      projectAngle: 'Test focus and labels.',
    },
  ],
}

describe('signalDeskReducer', () => {
  it('adds a signal with the next free id and one mention', () => {
    const newSignal = {
      skill: 'GraphQL',
      category: 'Backend' as const,
      evidence: 'Two project notes mention GraphQL APIs.',
      projectAngle: 'Add a typed GraphQL client to a later project.',
    }

    const state = signalDeskReducer(initialState, {
      type: 'signalAdded',
      signal: newSignal,
    })

    expect(state.signals[0]).toEqual({ ...newSignal, id: 6, mentions: 1 })
    expect(state.signals).toHaveLength(initialState.signals.length + 1)
  })

  it('adds a mention to one signal without touching the others', () => {
    const state = signalDeskReducer(initialState, { type: 'mentionAdded', signalId: 2 })

    expect(mentionsFor(state, 2)).toBe(8)
    expect(mentionsFor(state, 1)).toBe(9)
  })

  it('cycles a task from Next to In progress to Done and back', () => {
    const advance = (state: SignalDeskState) =>
      signalDeskReducer(state, { type: 'taskAdvanced', taskId: 5 })
    const statusOf = (state: SignalDeskState) =>
      state.tasks.find((task) => task.id === 5)?.status

    const inProgress = advance(initialState)
    const done = advance(inProgress)
    const reopened = advance(done)

    expect([statusOf(inProgress), statusOf(done), statusOf(reopened)]).toEqual([
      'In progress',
      'Done',
      'Next',
    ])
  })

  it('imports new requirements and bumps skills that are already tracked', () => {
    const state = signalDeskReducer(initialState, { type: 'batchImported', batch })

    expect(mentionsFor(state, 1)).toBe(10)
    expect(state.signals[0]).toMatchObject({ id: 6, skill: 'Accessibility', mentions: 1 })
    expect(state.importedBatchIds).toEqual(['test-batch'])
  })

  it('keeps the evidence and project angle already tracked for a skill', () => {
    const state = signalDeskReducer(initialState, { type: 'batchImported', batch })
    const reactSignal = state.signals.find((signal) => signal.id === 1)

    expect(reactSignal?.evidence).toBe(initialState.signals[0].evidence)
    expect(reactSignal?.projectAngle).toBe(initialState.signals[0].projectAngle)
  })

  it('ignores a batch that was already imported', () => {
    const once = signalDeskReducer(initialState, { type: 'batchImported', batch })
    const twice = signalDeskReducer(once, { type: 'batchImported', batch })

    expect(twice).toBe(once)
  })

  it('leaves the previous state untouched', () => {
    const snapshot = JSON.stringify(initialState)

    signalDeskReducer(initialState, { type: 'mentionAdded', signalId: 1 })
    signalDeskReducer(initialState, { type: 'taskAdvanced', taskId: 5 })
    signalDeskReducer(initialState, { type: 'batchImported', batch })

    expect(JSON.stringify(initialState)).toBe(snapshot)
  })
})

describe('findNewSignals', () => {
  it('matches tracked skills case-insensitively', () => {
    const newSkills = findNewSignals(initialState.signals, batch.requirements).map(
      (requirement) => requirement.skill,
    )

    expect(newSkills).toEqual(['Accessibility'])
  })
})

describe('nextSignalId', () => {
  it('returns one more than the highest id', () => {
    const [first, second] = initialState.signals

    expect(nextSignalId([{ ...first, id: 41 }, { ...second, id: 7 }])).toBe(42)
  })

  it('starts at 1 for an empty list', () => {
    expect(nextSignalId([])).toBe(1)
  })
})
