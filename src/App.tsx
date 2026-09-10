import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  initialState,
  integrationScenarios,
  sampleListingBatch,
  targetListings,
  type ImportedRequirement,
  type JobPulseState,
  type JobSignal,
  type SignalCategory,
} from '../shared/jobpulse'
import {
  ExportPanel,
  FocusStrip,
  ImportPanel,
  IntegrationStates,
  ListingMatrix,
  ProjectQueue,
  SignalForm,
  SignalList,
  SummaryGrid,
  type NewSignalForm,
} from './components/DashboardSections'
import './App.css'

const storageKey = 'jobpulse-state-v1'

const categories: Array<'All' | SignalCategory> = [
  'All',
  'Frontend',
  'Backend',
  'Product',
  'Quality',
]
const signalCategories = categories.filter(
  (category): category is SignalCategory => category !== 'All',
)

function loadState() {
  try {
    const savedState = window.localStorage.getItem(storageKey)

    if (!savedState) {
      return initialState
    }

    return JSON.parse(savedState) as JobPulseState
  } catch {
    return initialState
  }
}

function App() {
  const [state, setState] = useState(loadState)
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All')
  const [activeScenarioId, setActiveScenarioId] = useState(1)
  const [form, setForm] = useState<NewSignalForm>({
    skill: '',
    category: 'Frontend',
    evidence: '',
    projectAngle: '',
  })

  const filteredSignals = useMemo(() => {
    if (activeCategory === 'All') {
      return state.signals
    }

    return state.signals.filter((signal) => signal.category === activeCategory)
  }, [activeCategory, state.signals])

  const topSignal = useMemo(
    () =>
      [...state.signals].sort((first, second) => second.mentions - first.mentions)[0],
    [state.signals],
  )

  const totalMentions = state.signals.reduce(
    (total, signal) => total + signal.mentions,
    0,
  )
  const closedTaskCount = state.tasks.filter((task) => task.status === 'Done').length
  const nextTask = state.tasks.find((task) => task.status !== 'Done')
  const activeScenario =
    integrationScenarios.find((scenario) => scenario.id === activeScenarioId) ??
    integrationScenarios[0]

  function saveState(nextState: typeof state) {
    setState(nextState)
    window.localStorage.setItem(storageKey, JSON.stringify(nextState))
  }

  function addSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.skill.trim() || !form.evidence.trim() || !form.projectAngle.trim()) {
      return
    }

    const nextSignal: JobSignal = {
      id: Date.now(),
      skill: form.skill.trim(),
      category: form.category,
      mentions: 1,
      evidence: form.evidence.trim(),
      projectAngle: form.projectAngle.trim(),
    }

    saveState({ ...state, signals: [nextSignal, ...state.signals] })
    setForm({
      skill: '',
      category: 'Frontend',
      evidence: '',
      projectAngle: '',
    })
  }

  function increaseMention(signalId: number) {
    saveState({
      ...state,
      signals: state.signals.map((signal) =>
        signal.id === signalId
          ? { ...signal, mentions: signal.mentions + 1 }
          : signal,
      ),
    })
  }

  function advanceTask(taskId: number) {
    saveState({
      ...state,
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        if (task.status === 'Next') {
          return { ...task, status: 'In progress' }
        }

        if (task.status === 'In progress') {
          return { ...task, status: 'Done' }
        }

        return { ...task, status: 'Next' }
      }),
    })
  }

  function importRequirements(requirements: ImportedRequirement[]) {
    const existingSkills = new Map(
      state.signals.map((signal) => [signal.skill.toLowerCase(), signal]),
    )
    const updatedSignals = state.signals.map((signal) => {
      const importedRequirement = requirements.find(
        (requirement) =>
          requirement.skill.toLowerCase() === signal.skill.toLowerCase(),
      )

      if (!importedRequirement) {
        return signal
      }

      return {
        ...signal,
        evidence: importedRequirement.evidence,
        mentions: signal.mentions + 1,
        projectAngle: importedRequirement.projectAngle,
      }
    })
    const newSignals = requirements
      .filter(
        (requirement) => !existingSkills.has(requirement.skill.toLowerCase()),
      )
      .map((requirement, index) => ({
        id: Date.now() + index,
        mentions: 1,
        ...requirement,
      }))

    saveState({ ...state, signals: [...newSignals, ...updatedSignals] })
  }

  function exportSignals() {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      signals: state.signals,
      tasks: state.tasks,
    }
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'jobpulse-signals.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app-shell">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">full-stack market tracker</p>
          <h1>JobPulse</h1>
          <p className="storage-status">Storage: Local browser</p>
        </div>
        <SummaryGrid
          closedTaskCount={closedTaskCount}
          signalCount={state.signals.length}
          totalMentions={totalMentions}
        />
      </section>

      <FocusStrip nextTask={nextTask} topSignal={topSignal} />
      <ListingMatrix listings={targetListings} />
      <IntegrationStates
        activeScenario={activeScenario}
        onScenarioChange={setActiveScenarioId}
        scenarios={integrationScenarios}
      />

      <section className="content-grid">
        <SignalList
          activeCategory={activeCategory}
          categories={categories}
          onCategoryChange={setActiveCategory}
          onIncreaseMention={increaseMention}
          signals={filteredSignals}
        />

        <aside className="side-panel">
          <ProjectQueue onAdvanceTask={advanceTask} tasks={state.tasks} />
          <ImportPanel
            importedCount={sampleListingBatch.length}
            onImport={() => importRequirements(sampleListingBatch)}
          />
          <ExportPanel onExport={exportSignals} />
          <SignalForm
            categories={signalCategories}
            form={form}
            onFormChange={setForm}
            onSubmit={addSignal}
          />
        </aside>
      </section>
    </main>
  )
}

export default App
