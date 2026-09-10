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
