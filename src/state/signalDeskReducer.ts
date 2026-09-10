import type {
  ImportedSignal,
  ProjectTask,
  SignalBatch,
  SignalDeskState,
  WorkSignal,
} from '../../shared/signaldesk'

export type NewSignal = Omit<WorkSignal, 'id' | 'mentions'>

export type SignalDeskAction =
  | { type: 'signalAdded'; signal: NewSignal }
  | { type: 'mentionAdded'; signalId: number }
  | { type: 'taskAdvanced'; taskId: number }
  | { type: 'batchImported'; batch: SignalBatch }
  | { type: 'stateReset'; state: SignalDeskState }

const nextTaskStatus: Record<ProjectTask['status'], ProjectTask['status']> = {
  Next: 'In progress',
  'In progress': 'Done',
  Done: 'Next',
}

export function nextSignalId(signals: WorkSignal[]) {
  return signals.reduce((highestId, signal) => Math.max(highestId, signal.id), 0) + 1
}

// Signals whose skill is not tracked yet, compared case-insensitively.
export function findNewSignals(
  signals: WorkSignal[],
  requirements: ImportedSignal[],
) {
  const trackedSkills = new Set(signals.map((signal) => signal.skill.toLowerCase()))

  return requirements.filter(
    (requirement) => !trackedSkills.has(requirement.skill.toLowerCase()),
  )
}

// Skills that are already tracked get one more mention but keep the evidence
// and project angle the user wrote. New skills are added at the top.
function importSignals(
  signals: WorkSignal[],
  requirements: ImportedSignal[],
): WorkSignal[] {
  const importedSkills = new Set(
    requirements.map((requirement) => requirement.skill.toLowerCase()),
  )
  const firstNewId = nextSignalId(signals)

  const updatedSignals = signals.map((signal) =>
    importedSkills.has(signal.skill.toLowerCase())
      ? { ...signal, mentions: signal.mentions + 1 }
      : signal,
  )
  const newSignals = findNewSignals(signals, requirements).map(
    (requirement, index) => ({
      ...requirement,
      id: firstNewId + index,
      mentions: 1,
    }),
  )

  return [...newSignals, ...updatedSignals]
}

export function signalDeskReducer(
  state: SignalDeskState,
  action: SignalDeskAction,
): SignalDeskState {
  switch (action.type) {
    case 'signalAdded':
      return {
        ...state,
        signals: [
          { ...action.signal, id: nextSignalId(state.signals), mentions: 1 },
          ...state.signals,
        ],
      }
    case 'mentionAdded':
      return {
        ...state,
        signals: state.signals.map((signal) =>
          signal.id === action.signalId
            ? { ...signal, mentions: signal.mentions + 1 }
            : signal,
        ),
      }
    case 'taskAdvanced':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId
            ? { ...task, status: nextTaskStatus[task.status] }
            : task,
        ),
      }
    case 'batchImported':
      // Counting the same batch twice would inflate every mention it touches.
      if (state.importedBatchIds.includes(action.batch.id)) {
        return state
      }

      return {
        ...state,
        importedBatchIds: [...state.importedBatchIds, action.batch.id],
        signals: importSignals(state.signals, action.batch.requirements),
      }
    case 'stateReset':
      return action.state
  }
}
