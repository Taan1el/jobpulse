import type { FormEvent } from 'react'
import type { SignalCategory } from '../../shared/jobpulse'

export type NewSignalForm = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

type SignalFormProps = {
  categories: SignalCategory[]
  form: NewSignalForm
  onFormChange: (form: NewSignalForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SignalForm({
  categories,
  form,
  onFormChange,
  onSubmit,
}: SignalFormProps) {
  return (
    <form className="signal-form" onSubmit={onSubmit} aria-labelledby="form-heading">
      <div>
        <p className="label">Add signal</p>
        <h2 id="form-heading">New requirement</h2>
      </div>

      <div className="form-group">
        <label htmlFor="signal-skill-input">Skill</label>
        <input
          id="signal-skill-input"
          name="skill"
          onChange={(event) =>
            onFormChange({ ...form, skill: event.target.value })
          }
          placeholder="GraphQL, Prisma, CI, Accessibility..."
          required
          value={form.skill}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signal-category-select">Category</label>
        <select
          id="signal-category-select"
          name="category"
          onChange={(event) =>
            onFormChange({
              ...form,
              category: event.target.value as SignalCategory,
            })
          }
          value={form.category}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="signal-evidence-input">Evidence</label>
        <textarea
          id="signal-evidence-input"
          name="evidence"
          onChange={(event) =>
            onFormChange({ ...form, evidence: event.target.value })
          }
          placeholder="Where it appeared and why it matters"
          required
          value={form.evidence}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signal-angle-input">Project angle</label>
        <textarea
          id="signal-angle-input"
          name="projectAngle"
          onChange={(event) =>
            onFormChange({ ...form, projectAngle: event.target.value })
          }
          placeholder="How the project can show it"
          required
          value={form.projectAngle}
        />
      </div>

      <button className="primary-action" type="submit">
        Save signal
      </button>
    </form>
  )
}
