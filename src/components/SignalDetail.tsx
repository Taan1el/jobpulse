import type { WorkSignal } from '../../shared/signaldesk'
import { formatCount } from '../utils/pluralize'

type SignalDetailProps = {
  signal?: WorkSignal
}

export function SignalDetail({ signal }: SignalDetailProps) {
  return (
    <section aria-labelledby="signal-detail-heading" className="signal-detail">
      <p className="label" id="signal-detail-heading">
        Selected signal
      </p>
      {signal ? (
        <>
          <h3>{signal.skill}</h3>
          <p className="mentions-line">
            <span>{formatCount(signal.mentions, 'mention')}</span> &middot;{' '}
            <span className="category-badge">{signal.category}</span>
          </p>
          <dl>
            <dt>Evidence</dt>
            <dd>{signal.evidence}</dd>
            <dt>Project angle</dt>
            <dd>{signal.projectAngle}</dd>
          </dl>
        </>
      ) : (
        <p>Add a technical signal to see its detail here.</p>
      )}
    </section>
  )
}
