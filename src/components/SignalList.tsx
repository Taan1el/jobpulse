import type { JobSignal, SignalCategory, SignalSortOption } from '../../shared/jobpulse'

type SignalListProps = {
  activeCategory: 'All' | SignalCategory
  categories: Array<'All' | SignalCategory>
  signals: JobSignal[]
  searchQuery: string
  sortOption: SignalSortOption
  onCategoryChange: (category: 'All' | SignalCategory) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: SignalSortOption) => void
  onIncreaseMention: (signalId: number) => void
}

export function SignalList({
  activeCategory,
  categories,
  signals,
  searchQuery,
  sortOption,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onIncreaseMention,
}: SignalListProps) {
  return (
    <div className="signal-panel">
      <div className="section-heading">
        <div>
          <p className="label">Requirements</p>
          <h2>Signals from listings</h2>
        </div>
        <div className="tabs" aria-label="Filter requirement signals">
          {categories.map((category) => (
            <button
              aria-pressed={category === activeCategory}
              className={category === activeCategory ? 'active' : ''}
              key={category}
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="signal-controls" aria-label="Search and sort signals">
        <div className="search-field">
          <label htmlFor="signal-search">Search skills & requirements</label>
          <input
            id="signal-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter by skill, category, or evidence..."
            type="search"
            value={searchQuery}
          />
        </div>
        <div className="sort-field">
          <label htmlFor="signal-sort">Sort by</label>
          <select
            id="signal-sort"
            onChange={(event) =>
              onSortChange(event.target.value as SignalSortOption)
            }
            value={sortOption}
          >
            <option value="mentions">Most mentions</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {signals.length === 0 ? (
        <div className="empty-signals-state" role="status">
          <p className="empty-title">No matching requirement signals</p>
          <p className="empty-desc">
            Try adjusting your search query or switching the category filter above.
          </p>
        </div>
      ) : (
        <div className="signal-list" aria-label="Filtered requirement signals">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.id}>
              <div>
                <span className="category">{signal.category}</span>
                <h3>{signal.skill}</h3>
              </div>
              <p>{signal.evidence}</p>
              <p className="project-angle">{signal.projectAngle}</p>
              <div className="card-actions">
                <span>
                  {signal.mentions} {signal.mentions === 1 ? 'mention' : 'mentions'}
                </span>
                <button
                  aria-label={`Add mention for ${signal.skill}`}
                  onClick={() => onIncreaseMention(signal.id)}
                  type="button"
                >
                  Add mention
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
