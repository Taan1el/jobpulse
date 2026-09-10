import type { ProjectTask } from '../../shared/jobpulse'

type ProjectQueueProps = {
  tasks: ProjectTask[]
  onAdvanceTask: (taskId: number) => void
}

// The button names the step it performs; the badge already shows the status.
const actionLabels: Record<ProjectTask['status'], string> = {
  Next: 'Start',
  'In progress': 'Complete',
  Done: 'Reopen',
}

export function ProjectQueue({ tasks, onAdvanceTask }: ProjectQueueProps) {
  return (
    <section className="queue-section" aria-labelledby="queue-heading">
      <div className="section-heading compact">
        <div>
          <p className="label">Project queue</p>
          <h2 id="queue-heading">Build order</h2>
        </div>
      </div>
      <ol className="task-list">
        {tasks.map((task) => {
          const statusClass = task.status.toLowerCase().replace(' ', '-')
          const actionLabel = actionLabels[task.status]

          return (
            <li key={task.id}>
              <article className={`task-card status-${statusClass}`}>
                <div>
                  <span className={`task-badge ${statusClass}`}>{task.status}</span>
                  <h3>{task.title}</h3>
                  <p>{task.requirement}</p>
                </div>
                <button
                  aria-label={`${actionLabel}: ${task.title}`}
                  className="task-action-btn"
                  onClick={() => onAdvanceTask(task.id)}
                  type="button"
                >
                  {actionLabel}
                </button>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
