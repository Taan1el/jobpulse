import { pluralize } from '../utils/pluralize'

type SummaryGridProps = {
  signalCount: number
  totalMentions: number
  closedTaskCount: number
}

export function SummaryGrid({
  signalCount,
  totalMentions,
  closedTaskCount,
}: SummaryGridProps) {
  const metrics = [
    { label: pluralize(signalCount, 'tracked skill'), value: signalCount },
    { label: pluralize(totalMentions, 'signal mention'), value: totalMentions },
    { label: pluralize(closedTaskCount, 'task') + ' closed', value: closedTaskCount },
  ]

  return (
    <dl className="tally">
      {metrics.map((metric) => (
        <div className="tally-row" key={metric.label}>
          <dt className="tally-label">{metric.label}</dt>
          <dd className="tally-value">{metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}
