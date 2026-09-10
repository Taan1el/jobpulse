import type { ProjectTask } from '../../shared/jobpulse'

type ProjectQueueProps = {
  tasks: ProjectTask[]
  onAdvanceTask: (taskId: number) => void
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
      <div className="task-list" aria-label="Project task list">
        {tasks.map((task) => {
          const statusClass = task.status.toLowerCase().replace(' ', '-')

          return (
            <article className={`task-card status-${statusClass}`} key={task.id}>
              <div>
                <span className={`task-badge ${statusClass}`}>{task.status}</span>
                <h3>{task.title}</h3>
                <p>{task.requirement}</p>
              </div>
              <button
                aria-label={`Advance ${task.title} from ${task.status}`}
                className={`task-action-btn ${statusClass}`}
                onClick={() => onAdvanceTask(task.id)}
                type="button"
              >
                {task.status}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
