import {
  initialState,
  type JobPulseState,
  type JobSignal,
  type ProjectTask,
} from '../../shared/jobpulse'

export const storageKey = 'jobpulse-state-v1'

const signalCategories: ReadonlySet<string> = new Set([
  'Frontend',
  'Backend',
  'Product',
  'Quality',
])
const taskStatuses: ReadonlySet<string> = new Set(['Next', 'In progress', 'Done'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isJobSignal(value: unknown): value is JobSignal {
  return (
    isRecord(value) &&
    Number.isInteger(value.id) &&
    typeof value.skill === 'string' &&
    typeof value.category === 'string' &&
    signalCategories.has(value.category) &&
    Number.isInteger(value.mentions) &&
    typeof value.evidence === 'string' &&
    typeof value.projectAngle === 'string'
  )
}

function isProjectTask(value: unknown): value is ProjectTask {
  return (
    isRecord(value) &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.requirement === 'string' &&
    typeof value.status === 'string' &&
    taskStatuses.has(value.status)
  )
}

// Saved data may come from an older version of the app or be edited by hand,
// so anything that doesn't match the current shape falls back to the seed data
// instead of crashing the dashboard.
export function parseSavedState(savedState: string | null): JobPulseState {
  if (!savedState) {
    return initialState
  }

  try {
    const parsed: unknown = JSON.parse(savedState)

    if (
      isRecord(parsed) &&
      Array.isArray(parsed.signals) &&
      parsed.signals.every(isJobSignal) &&
      Array.isArray(parsed.tasks) &&
      parsed.tasks.every(isProjectTask)
    ) {
      // Saves from before batch tracking have no importedBatchIds.
      const importedBatchIds = Array.isArray(parsed.importedBatchIds)
        ? parsed.importedBatchIds.filter((id): id is string => typeof id === 'string')
        : []

      return { signals: parsed.signals, tasks: parsed.tasks, importedBatchIds }
    }
  } catch {
    // Unreadable JSON is treated the same as an unexpected shape.
  }

  return initialState
}

export function loadState(): JobPulseState {
  try {
    return parseSavedState(window.localStorage.getItem(storageKey))
  } catch {
    // Accessing localStorage throws when the browser blocks site data.
    return initialState
  }
}

export function saveState(state: JobPulseState) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // Full or blocked storage should not break the in-memory dashboard.
  }
}
