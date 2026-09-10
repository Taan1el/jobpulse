import type { ProjectTask, WorkSignal } from '../../shared/signaldesk'

type FocusStripProps = {
  topSignal?: WorkSignal
  nextTask?: ProjectTask
}

export function FocusStrip({ topSignal, nextTask }: FocusStripProps) {
  return (
    <section className="focus-strip" aria-label="Current focus areas">
      <div>
        <p className="label">Strongest signal</p>
        <h2>{topSignal?.skill ?? 'No signals yet'}</h2>
        <p>{topSignal?.projectAngle ?? 'Add a technical signal to begin.'}</p>
      </div>
      <div>
        <p className="label">Next project step</p>
        <h2>{nextTask?.title ?? 'Build queue clear'}</h2>
        <p>{nextTask?.requirement ?? 'Add a task to the build queue.'}</p>
      </div>
    </section>
  )
}
