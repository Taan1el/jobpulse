import type { SignalCategory, SignalSortOption, WorkSignal } from '../../shared/signaldesk'

type SignalListProps = {
  activeCategory: 'All' | SignalCategory
  categories: Array<'All' | SignalCategory>
  signals: WorkSignal[]
  totalCount: number
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
  totalCount,
  searchQuery,
  sortOption,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onIncreaseMention,
}: SignalListProps) {
  return (
    <section className="signal-panel" aria-labelledby="signals-heading">
      <div className="section-heading">
        <div>
          <p className="label">Requirements</p>
          <h2 id="signals-heading">Technical signals</h2>
        </div>
        <fieldset className="tabs">
          <legend className="visually-hidden">Filter by category</legend>
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
        </fieldset>
      </div>

      <div className="signal-controls">
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

      <output aria-live="polite" className="result-count" htmlFor="signal-search">
        Showing {signals.length} of {totalCount}{' '}
        {totalCount === 1 ? 'signal' : 'signals'}
      </output>

      {signals.length === 0 ? (
        <div className="empty-signals-state">
          <p className="empty-title">No matching requirement signals</p>
          <p className="empty-desc">
            Try adjusting your search query or switching the category filter above.
          </p>
        </div>
      ) : (
        <ul className="signal-list" aria-label="Filtered requirement signals">
          {signals.map((signal) => (
            <li key={signal.id}>
              <article className="signal-card">
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
