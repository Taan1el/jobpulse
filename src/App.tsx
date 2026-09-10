import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type SignalCategory = 'Frontend' | 'Backend' | 'Product' | 'Quality'

type JobSignal = {
  id: number
  skill: string
  category: SignalCategory
  mentions: number
  evidence: string
  projectAngle: string
}

type ProjectTask = {
  id: number
  title: string
  requirement: string
  status: 'Next' | 'In progress' | 'Done'
}

type NewSignalForm = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

const storageKey = 'jobpulse-state-v1'

const initialSignals: JobSignal[] = [
  {
    id: 1,
    skill: 'React + TypeScript',
    category: 'Frontend',
    mentions: 9,
    evidence: 'Remote EU listings repeatedly ask for typed React interfaces.',
    projectAngle: 'Build an interactive dashboard with typed components and state.',
  },
  {
    id: 2,
    skill: 'Node APIs',
    category: 'Backend',
    mentions: 7,
    evidence: 'Full-stack roles mention backend APIs, integrations, and maintenance.',
    projectAngle: 'Add a small API layer for saved job signals and project notes.',
  },
  {
    id: 3,
    skill: 'SaaS workflows',
    category: 'Product',
    mentions: 6,
    evidence: 'Listings describe modern SaaS platforms and customer-facing tools.',
    projectAngle: 'Model a real workflow with filtering, prioritization, and summaries.',
  },
  {
    id: 4,
    skill: 'Testing and linting',
    category: 'Quality',
    mentions: 5,
    evidence: 'Most roles still expect clean delivery habits.',
    projectAngle: 'Keep builds green and add focused component or domain tests.',
  },
]

const initialTasks: ProjectTask[] = [
  {
    id: 1,
    title: 'Ship the signal dashboard',
    requirement: 'React, TypeScript, product thinking',
    status: 'In progress',
  },
  {
    id: 2,
    title: 'Add persistent API storage',
    requirement: 'Node APIs, data modeling',
    status: 'Next',
  },
  {
    id: 3,
    title: 'Write acceptance tests',
    requirement: 'Quality habits, maintainability',
    status: 'Next',
  },
]

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
      return { signals: initialSignals, tasks: initialTasks }
    }

    return JSON.parse(savedState) as {
      signals: JobSignal[]
      tasks: ProjectTask[]
    }
  } catch {
    return { signals: initialSignals, tasks: initialTasks }
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
                or later API import.
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
