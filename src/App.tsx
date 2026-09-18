import { useEffect, useMemo, useReducer, useState } from 'react'
import {
  initialState,
  integrationScenarios,
  referenceProfiles,
  sampleSignalBatch,
  type SignalCategory,
  type SignalSortOption,
} from '../shared/signaldesk'
import {
  DemoBanner,
  ExportPanel,
  Header,
  ImportPanel,
  IntegrationStates,
  ProjectQueue,
  ReferenceMatrix,
  SignalDetail,
  SignalForm,
  SignalList,
  SummaryGrid,
} from './components'
import {
  findNewSignals,
  signalDeskReducer,
  type NewSignal,
} from './state/signalDeskReducer'
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

// A fresh id per message restarts the dismiss timer even when the text repeats.
type StatusMessage = {
  id: number
  text: string
}

function App() {
  const [state, dispatch] = useReducer(signalDeskReducer, undefined, loadState)
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SignalSortOption>('mentions')
  const [activeScenarioId, setActiveScenarioId] = useState(1)
  const [selectedSignalId, setSelectedSignalId] = useState<number>()
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

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

  const selectedSignal =
    state.signals.find((signal) => signal.id === selectedSignalId) ?? topSignal

  const totalMentions = state.signals.reduce(
    (total, signal) => total + signal.mentions,
    0,
  )
  const closedTaskCount = state.tasks.filter((task) => task.status === 'Done').length
  const trackedSkills = state.signals.map((signal) => signal.skill)
  const sampleBatchImported = state.importedBatchIds.includes(sampleSignalBatch.id)
  const activeScenario =
    integrationScenarios.find((scenario) => scenario.id === activeScenarioId) ??
    integrationScenarios[0]

  function addSignal(signal: NewSignal) {
    dispatch({ type: 'signalAdded', signal })
    showToast(`Added signal: "${signal.skill}"`)
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

    const { requirements } = sampleSignalBatch
    const newCount = findNewSignals(state.signals, requirements).length

    dispatch({ type: 'batchImported', batch: sampleSignalBatch })
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
    link.download = 'signaldesk-signals.json'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Exported signals snapshot as JSON')
  }

  function resetDemoData() {
    dispatch({ type: 'stateReset', state: initialState })
    setSearchQuery('')
    setActiveCategory('All')
    setSortOption('mentions')
    setSelectedSignalId(undefined)
    showToast('Reset all signals and queue to default demo state')
  }

  return (
    <div className="app-shell">
      <DemoBanner onReset={resetDemoData} />
      <Header />

      <main className="app-main">
        <SummaryGrid
          closedTaskCount={closedTaskCount}
          signalCount={state.signals.length}
          totalMentions={totalMentions}
        />

        <div className="content-grid">
          <div className="main-column">
            <SignalList
              activeCategory={activeCategory}
              categories={categories}
              onCategoryChange={setActiveCategory}
              onIncreaseMention={increaseMention}
              onSearchChange={setSearchQuery}
              onSelectSignal={setSelectedSignalId}
              onSortChange={setSortOption}
              searchQuery={searchQuery}
              selectedSignalId={selectedSignal?.id}
              signals={filteredSignals}
              sortOption={sortOption}
              totalCount={state.signals.length}
            />
            <ReferenceMatrix profiles={referenceProfiles} />
            <IntegrationStates
              activeScenario={activeScenario}
              onScenarioChange={setActiveScenarioId}
              scenarios={integrationScenarios}
            />
          </div>

          <aside className="side-column">
            <SignalDetail signal={selectedSignal} />
            <ProjectQueue onAdvanceTask={advanceTask} tasks={state.tasks} />
            <div className="data-actions">
              <ImportPanel
                imported={sampleBatchImported}
                onImport={importSampleBatch}
                requirementCount={sampleSignalBatch.requirements.length}
              />
              <ExportPanel onExport={exportSignals} />
            </div>
            <SignalForm
              categories={signalCategories}
              existingSkills={trackedSkills}
              onAdd={addSignal}
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
