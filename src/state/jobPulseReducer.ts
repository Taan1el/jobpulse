import type {
  ImportedRequirement,
  JobPulseState,
  JobSignal,
  ProjectTask,
} from '../../shared/jobpulse'

export type NewSignal = Omit<JobSignal, 'id' | 'mentions'>

export type JobPulseAction =
  | { type: 'signalAdded'; signal: NewSignal }
  | { type: 'mentionAdded'; signalId: number }
  | { type: 'taskAdvanced'; taskId: number }
  | { type: 'requirementsImported'; requirements: ImportedRequirement[] }
  | { type: 'stateReset'; state: JobPulseState }

const nextTaskStatus: Record<ProjectTask['status'], ProjectTask['status']> = {
  Next: 'In progress',
  'In progress': 'Done',
  Done: 'Next',
}

export function nextSignalId(signals: JobSignal[]) {
  return signals.reduce((highestId, signal) => Math.max(highestId, signal.id), 0) + 1
}

function importRequirements(
  signals: JobSignal[],
  requirements: ImportedRequirement[],
): JobSignal[] {
  const requirementsBySkill = new Map(
    requirements.map((requirement) => [requirement.skill.toLowerCase(), requirement]),
  )
  const trackedSkills = new Set(signals.map((signal) => signal.skill.toLowerCase()))
  const firstNewId = nextSignalId(signals)

  const updatedSignals = signals.map((signal) => {
    const requirement = requirementsBySkill.get(signal.skill.toLowerCase())

    return requirement
      ? {
          ...signal,
          evidence: requirement.evidence,
          mentions: signal.mentions + 1,
          projectAngle: requirement.projectAngle,
        }
      : signal
  })
  const newSignals = requirements
    .filter((requirement) => !trackedSkills.has(requirement.skill.toLowerCase()))
    .map((requirement, index) => ({
      ...requirement,
      id: firstNewId + index,
      mentions: 1,
    }))

  return [...newSignals, ...updatedSignals]
}

export function jobPulseReducer(
  state: JobPulseState,
  action: JobPulseAction,
): JobPulseState {
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
    case 'requirementsImported':
      return {
        ...state,
        signals: importRequirements(state.signals, action.requirements),
      }
    case 'stateReset':
      return action.state
  }
}
