import type { FormEvent } from 'react'
import type {
  IntegrationScenario,
  JobSignal,
  ProjectTask,
  SignalCategory,
  TargetListing,
} from '../../shared/jobpulse'

type SummaryGridProps = {
  signalCount: number
  totalMentions: number
  closedTaskCount: number
}

type FocusStripProps = {
  topSignal?: JobSignal
  nextTask?: ProjectTask
}

type ListingMatrixProps = {
  listings: TargetListing[]
}

type IntegrationStatesProps = {
  activeScenario: IntegrationScenario
  scenarios: IntegrationScenario[]
  onScenarioChange: (scenarioId: number) => void
}

type SignalListProps = {
  activeCategory: 'All' | SignalCategory
  categories: Array<'All' | SignalCategory>
  signals: JobSignal[]
  onCategoryChange: (category: 'All' | SignalCategory) => void
  onIncreaseMention: (signalId: number) => void
}

type ProjectQueueProps = {
  tasks: ProjectTask[]
  onAdvanceTask: (taskId: number) => void
}

export type NewSignalForm = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

type SignalFormProps = {
  categories: SignalCategory[]
  form: NewSignalForm
  onFormChange: (form: NewSignalForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SummaryGrid({
  signalCount,
  totalMentions,
  closedTaskCount,
}: SummaryGridProps) {
  return (
    <div className="summary-grid" aria-label="Project signal summary">
      <article>
        <span>{signalCount}</span>
        <p>tracked skills</p>
      </article>
      <article>
        <span>{totalMentions}</span>
        <p>listing mentions</p>
      </article>
      <article>
        <span>{closedTaskCount}</span>
        <p>tasks closed</p>
      </article>
    </div>
  )
}

export function FocusStrip({ topSignal, nextTask }: FocusStripProps) {
  return (
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
  )
}

export function ListingMatrix({ listings }: ListingMatrixProps) {
  return (
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
        {listings.map((listing) => (
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
  )
}

export function IntegrationStates({
  activeScenario,
  scenarios,
  onScenarioChange,
}: IntegrationStatesProps) {
  return (
    <section className="integration-section">
      <div className="section-heading">
        <div>
          <p className="label">REST-style states</p>
          <h2>Integration readiness</h2>
        </div>
        <p>
          Shows how the dashboard would behave around remote data without adding
          a custom server.
        </p>
      </div>
      <div className="integration-grid">
        <div className="scenario-tabs" aria-label="Choose integration state">
          {scenarios.map((scenario) => (
            <button
              className={scenario.id === activeScenario.id ? 'active' : ''}
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              type="button"
            >
              {scenario.status}
            </button>
          ))}
        </div>
        <article className={`scenario-card ${activeScenario.status.toLowerCase()}`}>
          <span>{activeScenario.status}</span>
          <h3>{activeScenario.title}</h3>
          <p>{activeScenario.description}</p>
          <code>{activeScenario.sample}</code>
        </article>
      </div>
    </section>
  )
}

export function SignalList({
  activeCategory,
  categories,
  signals,
  onCategoryChange,
  onIncreaseMention,
}: SignalListProps) {
  return (
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
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="signal-list" aria-label="Filtered requirement signals">
        {signals.map((signal) => (
          <article className="signal-card" key={signal.id}>
            <div>
              <span className="category">{signal.category}</span>
              <h3>{signal.skill}</h3>
            </div>
            <p>{signal.evidence}</p>
            <p className="project-angle">{signal.projectAngle}</p>
            <div className="card-actions">
              <span>{signal.mentions} mentions</span>
              <button onClick={() => onIncreaseMention(signal.id)} type="button">
                Add mention
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function ProjectQueue({ tasks, onAdvanceTask }: ProjectQueueProps) {
  return (
    <section>
      <div className="section-heading compact">
        <div>
          <p className="label">Project queue</p>
          <h2>Build order</h2>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.requirement}</p>
            </div>
            <button onClick={() => onAdvanceTask(task.id)} type="button">
              {task.status}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ExportPanel({ onExport }: { onExport: () => void }) {
  return (
    <section className="export-panel">
      <div>
        <p className="label">Data handoff</p>
        <h2>Export snapshot</h2>
        <p>
          Download the current signals and build queue for a project note or
          project-planning review.
        </p>
      </div>
      <button onClick={onExport} type="button">
        Export JSON
      </button>
    </section>
  )
}

export function SignalForm({
  categories,
  form,
  onFormChange,
  onSubmit,
}: SignalFormProps) {
  return (
    <form className="signal-form" onSubmit={onSubmit}>
      <div>
        <p className="label">Add signal</p>
        <h2>New requirement</h2>
      </div>
      <label>
        Skill
        <input
          onChange={(event) => onFormChange({ ...form, skill: event.target.value })}
          placeholder="GraphQL, Prisma, CI..."
          value={form.skill}
        />
      </label>
      <label>
        Category
        <select
          onChange={(event) =>
            onFormChange({
              ...form,
              category: event.target.value as SignalCategory,
            })
          }
          value={form.category}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        Evidence
        <textarea
          onChange={(event) => onFormChange({ ...form, evidence: event.target.value })}
          placeholder="Where it appeared and why it matters"
          value={form.evidence}
        />
      </label>
      <label>
        Project angle
        <textarea
          onChange={(event) =>
            onFormChange({ ...form, projectAngle: event.target.value })
          }
          placeholder="How the project can show it"
          value={form.projectAngle}
        />
      </label>
      <button className="primary-action" type="submit">
        Save signal
      </button>
    </form>
  )
}
