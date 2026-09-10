import { describe, expect, it } from 'vitest'
import {
  initialState,
  type JobPulseState,
  type ListingBatch,
} from '../../shared/jobpulse'
import { findNewRequirements, jobPulseReducer, nextSignalId } from './jobPulseReducer'

function mentionsFor(state: JobPulseState, signalId: number) {
  return state.signals.find((signal) => signal.id === signalId)?.mentions
}

const batch: ListingBatch = {
  id: 'test-batch',
  requirements: [
    {
      skill: 'react + typescript',
      category: 'Frontend',
      evidence: 'Seen again in a new listing.',
      projectAngle: 'Keep the dashboard typed end to end.',
    },
    {
      skill: 'Accessibility',
      category: 'Quality',
      evidence: 'Listings mention keyboard support.',
      projectAngle: 'Test focus and labels.',
    },
  ],
}

describe('jobPulseReducer', () => {
  it('adds a signal with the next free id and one mention', () => {
    const newSignal = {
      skill: 'GraphQL',
      category: 'Backend' as const,
      evidence: 'Two listings ask for GraphQL APIs.',
      projectAngle: 'Add a typed GraphQL client to a later project.',
    }

    const state = jobPulseReducer(initialState, {
      type: 'signalAdded',
      signal: newSignal,
    })

    expect(state.signals[0]).toEqual({ ...newSignal, id: 6, mentions: 1 })
    expect(state.signals).toHaveLength(initialState.signals.length + 1)
  })

  it('adds a mention to one signal without touching the others', () => {
    const state = jobPulseReducer(initialState, { type: 'mentionAdded', signalId: 2 })

    expect(mentionsFor(state, 2)).toBe(8)
    expect(mentionsFor(state, 1)).toBe(9)
  })

  it('cycles a task from Next to In progress to Done and back', () => {
    const advance = (state: JobPulseState) =>
      jobPulseReducer(state, { type: 'taskAdvanced', taskId: 5 })
    const statusOf = (state: JobPulseState) =>
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
    const state = jobPulseReducer(initialState, { type: 'batchImported', batch })

    expect(mentionsFor(state, 1)).toBe(10)
    expect(state.signals[0]).toMatchObject({ id: 6, skill: 'Accessibility', mentions: 1 })
    expect(state.importedBatchIds).toEqual(['test-batch'])
  })

  it('keeps the evidence and project angle already tracked for a skill', () => {
    const state = jobPulseReducer(initialState, { type: 'batchImported', batch })
    const reactSignal = state.signals.find((signal) => signal.id === 1)

    expect(reactSignal?.evidence).toBe(initialState.signals[0].evidence)
    expect(reactSignal?.projectAngle).toBe(initialState.signals[0].projectAngle)
  })

  it('ignores a batch that was already imported', () => {
    const once = jobPulseReducer(initialState, { type: 'batchImported', batch })
    const twice = jobPulseReducer(once, { type: 'batchImported', batch })

    expect(twice).toBe(once)
  })

  it('leaves the previous state untouched', () => {
    const snapshot = JSON.stringify(initialState)

    jobPulseReducer(initialState, { type: 'mentionAdded', signalId: 1 })
    jobPulseReducer(initialState, { type: 'taskAdvanced', taskId: 5 })
    jobPulseReducer(initialState, { type: 'batchImported', batch })

    expect(JSON.stringify(initialState)).toBe(snapshot)
  })
})

describe('findNewRequirements', () => {
  it('matches tracked skills case-insensitively', () => {
    const newSkills = findNewRequirements(initialState.signals, batch.requirements).map(
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
