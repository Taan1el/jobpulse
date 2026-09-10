import { useEffect, useMemo, useReducer, useState } from 'react'
import type { FormEvent } from 'react'
import {
  initialState,
  integrationScenarios,
  sampleListingBatch,
  targetListings,
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
import { findNewRequirements, jobPulseReducer } from './state/jobPulseReducer'
import { loadState, saveState } from './state/storage'
import './App.css'

const statusMessageDuration = 3500

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

const emptyForm: NewSignalForm = {
  skill: '',
  category: 'Frontend',
  evidence: '',
  projectAngle: '',
}

// A fresh id per message restarts the dismiss timer even when the text repeats.
type StatusMessage = {
  id: number
  text: string
}

function App() {
  const [state, dispatch] = useReducer(jobPulseReducer, undefined, loadState)
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SignalSortOption>('mentions')
  const [activeScenarioId, setActiveScenarioId] = useState(1)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [form, setForm] = useState<NewSignalForm>(emptyForm)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    const timeoutId = window.setTimeout(
      () => setStatusMessage(null),
      statusMessageDuration,
    )

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  function showToast(text: string) {
    setStatusMessage({ id: Date.now(), text })
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
  const sampleBatchImported = state.importedBatchIds.includes(sampleListingBatch.id)
  const activeScenario =
    integrationScenarios.find((scenario) => scenario.id === activeScenarioId) ??
    integrationScenarios[0]

  function addSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const skill = form.skill.trim()
    const evidence = form.evidence.trim()
    const projectAngle = form.projectAngle.trim()

    if (!skill || !evidence || !projectAngle) {
      return
    }

    dispatch({
      type: 'signalAdded',
      signal: { skill, category: form.category, evidence, projectAngle },
    })
    setForm(emptyForm)
    showToast(`Added requirement: "${skill}"`)
  }

  function increaseMention(signalId: number) {
    const signal = state.signals.find((item) => item.id === signalId)

    if (!signal) {
      return
    }

    dispatch({ type: 'mentionAdded', signalId })
    showToast(`Incremented mentions for ${signal.skill}`)
  }

  function advanceTask(taskId: number) {
    dispatch({ type: 'taskAdvanced', taskId })
  }

  function importSampleBatch() {
    if (sampleBatchImported) {
      return
    }

    const { requirements } = sampleListingBatch
    const newCount = findNewRequirements(state.signals, requirements).length

    dispatch({ type: 'batchImported', batch: sampleListingBatch })
    showToast(
      `Imported sample batch: ${newCount} new, ${requirements.length - newCount} already tracked`,
    )
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
    dispatch({ type: 'stateReset', state: initialState })
    setSearchQuery('')
    setActiveCategory('All')
    setSortOption('mentions')
    showToast('Reset all signals and queue to default demo state')
  }

  return (
    <div className="app-shell">
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
            totalCount={state.signals.length}
          />

          <aside className="side-panel">
            <ProjectQueue onAdvanceTask={advanceTask} tasks={state.tasks} />
            <ImportPanel
              imported={sampleBatchImported}
              onImport={importSampleBatch}
              requirementCount={sampleListingBatch.requirements.length}
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

        {/* Stays mounted so screen readers pick up each new message. */}
        <output aria-label="Notifications" aria-live="polite" className="status-region">
          {statusMessage && (
            <span className="toast-notification" key={statusMessage.id}>
              {statusMessage.text}
            </span>
          )}
        </output>
      </main>
    </div>
  )
}

export default App
