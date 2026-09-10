import type { JobSignal, ProjectTask } from '../../shared/jobpulse'

type FocusStripProps = {
  topSignal?: JobSignal
  nextTask?: ProjectTask
}

export function FocusStrip({ topSignal, nextTask }: FocusStripProps) {
  return (
    <section className="focus-strip" aria-label="Current focus areas">
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
