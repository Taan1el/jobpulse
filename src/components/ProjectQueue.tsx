import type { ProjectTask } from '../../shared/signaldesk'

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
    <section aria-labelledby="queue-heading">
      <h3 className="panel-heading" id="queue-heading">
        Build order
      </h3>
      <ol className="queue-list">
        {tasks.map((task) => {
          const statusClass = task.status.toLowerCase().replace(' ', '-')
          const actionLabel = actionLabels[task.status]

          return (
            <li key={task.id}>
              <article className={`queue-item status-${statusClass}`}>
                <div className="queue-item-body">
                  <span className={`task-badge status-${statusClass}`}>{task.status}</span>
                  <h3>{task.title}</h3>
                  <p>{task.requirement}</p>
                </div>
                <button
                  aria-label={`${actionLabel}: ${task.title}`}
                  className="queue-action-btn"
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
