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
  type SignalSortOption,
} from '../shared/jobpulse'
import {
  ExportPanel,
  FocusStrip,
  ImportPanel,
  IntegrationStates,
  ListingMatrix,
  ProjectQueue,
  ResetDataPanel,
  SignalForm,
  SignalList,
  SummaryGrid,
  type NewSignalForm,
} from './components'
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

function loadState(): JobPulseState {
  try {
    const savedState = window.localStorage.getItem(storageKey)
    if (!savedState) {
      return initialState
    }
    const parsed = JSON.parse(savedState) as JobPulseState
    if (!parsed || !Array.isArray(parsed.signals) || !Array.isArray(parsed.tasks)) {
      return initialState
    }
    return parsed
  } catch {
    return initialState
  }
}

function App() {
  const [state, setState] = useState<JobPulseState>(loadState)
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SignalSortOption>('mentions')
  const [activeScenarioId, setActiveScenarioId] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [form, setForm] = useState<NewSignalForm>({
    skill: '',
    category: 'Frontend',
    evidence: '',
    projectAngle: '',
  })

  function showToast(message: string) {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current))
    }, 3500)
  }

  function saveState(nextState: JobPulseState) {
    setState(nextState)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextState))
    } catch {
      // Quota exceeded or private mode fallback
    }
  }

  const filteredSignals = useMemo(() => {
    let result = state.signals

    if (activeCategory !== 'All') {
      result = result.filter((signal) => signal.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (signal) =>
          signal.skill.toLowerCase().includes(query) ||
          signal.category.toLowerCase().includes(query) ||
          signal.evidence.toLowerCase().includes(query) ||
          signal.projectAngle.toLowerCase().includes(query),
      )
    }

    const sorted = [...result]
    if (sortOption === 'mentions') {
      sorted.sort((first, second) => second.mentions - first.mentions)
    } else if (sortOption === 'alphabetical') {
      sorted.sort((first, second) => first.skill.localeCompare(second.skill))
    }

    return sorted
  }, [activeCategory, searchQuery, sortOption, state.signals])

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
    showToast(`Added requirement: "${nextSignal.skill}"`)
  }

  function increaseMention(signalId: number) {
    const targetSignal = state.signals.find((s) => s.id === signalId)
    saveState({
      ...state,
      signals: state.signals.map((signal) =>
        signal.id === signalId
          ? { ...signal, mentions: signal.mentions + 1 }
          : signal,
      ),
    })
    if (targetSignal) {
      showToast(`Incremented mentions for ${targetSignal.skill}`)
    }
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
    showToast(`Imported ${requirements.length} sample requirements`)
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
    showToast('Exported signals snapshot as JSON')
  }

  function resetDemoData() {
    saveState(initialState)
    setSearchQuery('')
    setActiveCategory('All')
    setSortOption('mentions')
    showToast('Reset all signals and queue to default demo state')
  }

  return (
    <div className="app-shell">
      {toastMessage && (
        <aside aria-live="polite" className="toast-notification" role="status">
          {toastMessage}
        </aside>
      )}

      <header className="workspace-header">
        <div>
          <div className="header-meta">
            <span className="eyebrow">Full-Stack Market Tracker</span>
            <span className="location-badge">Remote + Estonia / EU</span>
          </div>
          <h1>JobPulse</h1>
          <p className="subtitle">
            Turn real market requirements into prioritized project features.
          </p>
          <div className="meta-pills">
            <span className="storage-status">Storage: Local browser</span>
            <span className="stack-badge">Vite + React 19 + TypeScript</span>
            <span className="mode-badge">Frontend Only</span>
          </div>
        </div>
        <SummaryGrid
          closedTaskCount={closedTaskCount}
          signalCount={state.signals.length}
          totalMentions={totalMentions}
        />
      </header>

      <main>
        <FocusStrip nextTask={nextTask} topSignal={topSignal} />
        <ListingMatrix listings={targetListings} />
        <IntegrationStates
          activeScenario={activeScenario}
          onScenarioChange={setActiveScenarioId}
          scenarios={integrationScenarios}
        />

        <div className="content-grid">
          <SignalList
            activeCategory={activeCategory}
            categories={categories}
            onCategoryChange={setActiveCategory}
            onIncreaseMention={increaseMention}
            onSearchChange={setSearchQuery}
            onSortChange={setSortOption}
            searchQuery={searchQuery}
            signals={filteredSignals}
            sortOption={sortOption}
          />

          <aside className="side-panel">
            <ProjectQueue onAdvanceTask={advanceTask} tasks={state.tasks} />
            <ImportPanel
              importedCount={sampleListingBatch.length}
              onImport={() => importRequirements(sampleListingBatch)}
            />
            <ExportPanel onExport={exportSignals} />
            <ResetDataPanel onReset={resetDemoData} />
            <SignalForm
              categories={signalCategories}
              form={form}
              onFormChange={setForm}
              onSubmit={addSignal}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
