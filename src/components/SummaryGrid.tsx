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
    { label: 'tracked skills', value: signalCount },
    { label: 'signal mentions', value: totalMentions },
    { label: 'tasks closed', value: closedTaskCount },
  ]

  return (
    <dl className="summary-grid">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}
