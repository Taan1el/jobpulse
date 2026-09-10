import { describe, expect, it } from 'vitest'
import { initialState, type JobPulseState } from '../../shared/jobpulse'
import { jobPulseReducer, nextSignalId } from './jobPulseReducer'

function mentionsFor(state: JobPulseState, signalId: number) {
  return state.signals.find((signal) => signal.id === signalId)?.mentions
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
    const state = jobPulseReducer(initialState, {
      type: 'requirementsImported',
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
    })

    expect(mentionsFor(state, 1)).toBe(10)
    expect(state.signals[0]).toMatchObject({ id: 6, skill: 'Accessibility', mentions: 1 })
  })

  it('leaves the previous state untouched', () => {
    const snapshot = JSON.stringify(initialState)

    jobPulseReducer(initialState, { type: 'mentionAdded', signalId: 1 })
    jobPulseReducer(initialState, { type: 'taskAdvanced', taskId: 5 })

    expect(JSON.stringify(initialState)).toBe(snapshot)
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
