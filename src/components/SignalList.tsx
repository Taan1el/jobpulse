import type { SignalCategory, SignalSortOption, WorkSignal } from '../../shared/signaldesk'
import { pluralize } from '../utils/pluralize'

type SignalListProps = {
  activeCategory: 'All' | SignalCategory
  categories: Array<'All' | SignalCategory>
  signals: WorkSignal[]
  totalCount: number
  searchQuery: string
  sortOption: SignalSortOption
  selectedSignalId?: number
  onCategoryChange: (category: 'All' | SignalCategory) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: SignalSortOption) => void
  onIncreaseMention: (signalId: number) => void
  onSelectSignal: (signalId: number) => void
}

export function SignalList({
  activeCategory,
  categories,
  signals,
  totalCount,
  searchQuery,
  sortOption,
  selectedSignalId,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onIncreaseMention,
  onSelectSignal,
}: SignalListProps) {
  return (
    <section aria-labelledby="signals-heading">
      <div className="section-heading-row">
        <div>
          <p className="label">Requirements</p>
          <h2 className="section-heading" id="signals-heading">
            Technical signals
          </h2>
        </div>
        <fieldset className="segmented">
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
            onChange={(event) => onSortChange(event.target.value as SignalSortOption)}
            value={sortOption}
          >
            <option value="mentions">Most mentions</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <output aria-live="polite" className="result-count" htmlFor="signal-search">
        Showing {signals.length} of {totalCount} {pluralize(totalCount, 'signal')}
      </output>

      {signals.length === 0 ? (
        <div className="empty-signals-state">
          <p className="empty-title">No matching requirement signals</p>
          <p className="empty-desc">
            Try adjusting your search query or switching the category filter above.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table aria-label="Filtered requirement signals" className="signal-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Mentions</th>
                <th>
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal) => (
                <tr className={signal.id === selectedSignalId ? 'selected' : ''} key={signal.id}>
                  <td>
                    <div className="skill-cell">
                      <button
                        aria-label={signal.skill}
                        aria-pressed={signal.id === selectedSignalId}
                        onClick={() => onSelectSignal(signal.id)}
                        type="button"
                      >
                        {signal.skill}
                      </button>
                      <span className="skill-evidence">{signal.evidence}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{signal.category}</span>
                  </td>
                  <td className="mentions-cell">{signal.mentions}</td>
                  <td>
                    <button
                      aria-label={`Add mention for ${signal.skill}`}
                      className="mention-btn"
                      onClick={() => onIncreaseMention(signal.id)}
                      type="button"
                    >
                      Add mention
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
