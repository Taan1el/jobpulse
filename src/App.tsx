import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  initialState,
  targetListings,
  type JobPulseState,
  type JobSignal,
  type SignalCategory,
} from '../shared/jobpulse'
import './App.css'

type NewSignalForm = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

const storageKey = 'jobpulse-state-v1'

const categories: Array<'All' | SignalCategory> = [
  'All',
  'Frontend',
  'Backend',
  'Product',
  'Quality',
]

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

  const nextTask = state.tasks.find((task) => task.status !== 'Done')

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
        <div className="summary-grid" aria-label="Project signal summary">
          <article>
            <span>{state.signals.length}</span>
            <p>tracked skills</p>
          </article>
          <article>
            <span>{totalMentions}</span>
            <p>listing mentions</p>
          </article>
          <article>
            <span>{state.tasks.filter((task) => task.status === 'Done').length}</span>
            <p>tasks closed</p>
          </article>
        </div>
      </section>

      <section className="focus-strip">
        <div>
          <p className="label">Strongest signal</p>
          <h2>{topSignal?.skill ?? 'No signals yet'}</h2>
          <p>{topSignal?.projectAngle ?? 'Add a job requirement to begin.'}</p>
        </div>
        <div>
          <p className="label">Next project move</p>
          <h2>{nextTask?.title ?? 'Project queue clear'}</h2>
          <p>{nextTask?.requirement ?? 'Add a fresh improvement from the market.'}</p>
        </div>
      </section>

      <section className="fit-section">
        <div className="section-heading">
          <div>
            <p className="label">Job fit</p>
            <h2>Target listing matrix</h2>
          </div>
          <p>
            Ranked by how directly JobPulse and the next projects can
            answer the requirements.
          </p>
        </div>
        <div className="listing-grid">
          {targetListings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <div className="listing-title">
                <div>
                  <span className={`fit-pill ${listing.fit.toLowerCase().replace(' ', '-')}`}>
                    {listing.fit}
                  </span>
                  <h3>{listing.company}</h3>
                  <p>{listing.role}</p>
                </div>
              </div>
              <div className="requirement-tags">
                {listing.requirements.map((requirement) => (
                  <span key={requirement}>{requirement}</span>
                ))}
              </div>
              <p className="project-angle">{listing.projectMove}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <div className="signal-panel">
          <div className="section-heading">
            <div>
              <p className="label">Requirements</p>
              <h2>Signals from listings</h2>
            </div>
            <div className="tabs" aria-label="Filter requirement signals">
              {categories.map((category) => (
                <button
                  className={category === activeCategory ? 'active' : ''}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="signal-list">
            {filteredSignals.map((signal) => (
              <article className="signal-card" key={signal.id}>
                <div>
                  <span className="category">{signal.category}</span>
                  <h3>{signal.skill}</h3>
                </div>
                <p>{signal.evidence}</p>
                <p className="project-angle">{signal.projectAngle}</p>
                <div className="card-actions">
                  <span>{signal.mentions} mentions</span>
                  <button onClick={() => increaseMention(signal.id)} type="button">
                    Add mention
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="side-panel">
          <section>
            <div className="section-heading compact">
              <div>
                <p className="label">Project queue</p>
                <h2>Build order</h2>
              </div>
            </div>
            <div className="task-list">
              {state.tasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.requirement}</p>
                  </div>
                  <button onClick={() => advanceTask(task.id)} type="button">
                    {task.status}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="export-panel">
            <div>
              <p className="label">Data handoff</p>
              <h2>Export snapshot</h2>
              <p>
                Download the current signals and build queue for a project note
                or project-planning review.
              </p>
            </div>
            <button onClick={exportSignals} type="button">
              Export JSON
            </button>
          </section>

          <form className="signal-form" onSubmit={addSignal}>
            <div>
              <p className="label">Add signal</p>
              <h2>New requirement</h2>
            </div>
            <label>
              Skill
              <input
                onChange={(event) =>
                  setForm({ ...form, skill: event.target.value })
                }
                placeholder="GraphQL, Prisma, CI..."
                value={form.skill}
              />
            </label>
            <label>
              Category
              <select
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value as SignalCategory,
                  })
                }
                value={form.category}
              >
                {categories.slice(1).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Evidence
              <textarea
                onChange={(event) =>
                  setForm({ ...form, evidence: event.target.value })
                }
                placeholder="Where it appeared and why it matters"
                value={form.evidence}
              />
            </label>
            <label>
              Project angle
              <textarea
                onChange={(event) =>
                  setForm({ ...form, projectAngle: event.target.value })
                }
                placeholder="How the project can show it"
                value={form.projectAngle}
              />
            </label>
            <button className="primary-action" type="submit">
              Save signal
            </button>
          </form>
        </aside>
      </section>
    </main>
  )
}

export default App
