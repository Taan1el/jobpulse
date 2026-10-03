import { Plus } from 'lucide-react'
import type { SignalCategory, SignalSortOption, WorkSignal } from '../../shared/signaldesk'
import { pluralize } from '../utils/pluralize'

type SignalListProps = {
  activeCategory: 'All' | SignalCategory
  categories: Array<'All' | SignalCategory>
  signals: WorkSignal[]
  totalCount: number
  maxMentions: number
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
  maxMentions,
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
      <h2 className="board-heading" id="signals-heading">
        Technical signals
      </h2>
      <div className="board-bar">
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
        // Keyboard users need focus on this wrapper to scroll the table sideways.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role
        <div aria-label="Signal leaderboard table" className="table-wrapper" role="region" tabIndex={0}>
          <table aria-label="Filtered requirement signals" className="signal-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Skill</th>
                <th>Share of top signal</th>
                <th>Mentions</th>
                <th>
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr className={signal.id === selectedSignalId ? 'selected' : ''} key={signal.id}>
                  <td className="rank-cell">{index + 1}</td>
                  <td className="skill-cell">
                    <button
                      aria-label={signal.skill}
                      aria-pressed={signal.id === selectedSignalId}
                      className="skill-btn"
                      onClick={() => onSelectSignal(signal.id)}
                      type="button"
                    >
                      {signal.skill}
                    </button>
                    <span className="category-badge">{signal.category}</span>
                  </td>
                  <td className="bar-cell">
                    <span className="visually-hidden">
                      {Math.round((signal.mentions / maxMentions) * 100)}% of the top signal
                    </span>
                    <div aria-hidden="true" className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${Math.max(2, (signal.mentions / maxMentions) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="mentions-cell">{signal.mentions}</td>
                  <td className="action-cell">
                    <button
                      aria-label={`Add mention for ${signal.skill}`}
                      className="icon-btn"
                      onClick={() => onIncreaseMention(signal.id)}
                      title="Add mention"
                      type="button"
                    >
                      <Plus aria-hidden="true" size={16} strokeWidth={1.75} />
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
