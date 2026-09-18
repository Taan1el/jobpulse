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
    { label: 'Tracked skills', value: signalCount },
    { label: 'Signal mentions', value: totalMentions },
    { label: 'Tasks closed', value: closedTaskCount },
  ]

  return (
    <div className="stats-strip">
      {metrics.map((metric) => (
        <div className="stat-cell" key={metric.label}>
          <span className="stat-label">{metric.label}</span>
          <span className="stat-value">{metric.value}</span>
        </div>
      ))}
    </div>
  )
}
