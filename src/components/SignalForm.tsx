import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SignalCategory } from '../../shared/signaldesk'
import type { NewSignal } from '../state/signalDeskReducer'

type SignalFormProps = {
  categories: SignalCategory[]
  existingSkills: string[]
  onAdd: (signal: NewSignal) => void
}

type TextField = 'skill' | 'evidence' | 'projectAngle'
type FieldErrors = Partial<Record<TextField, string>>

const textFields: TextField[] = ['skill', 'evidence', 'projectAngle']

const emptyValues: NewSignal = {
  skill: '',
  category: 'Frontend',
  evidence: '',
  projectAngle: '',
}

function validate(values: NewSignal, existingSkills: string[]): FieldErrors {
  const errors: FieldErrors = {}
  const skill = values.skill.trim()
  const alreadyTracked = existingSkills.some(
    (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
  )

  if (!skill) {
    errors.skill = 'Enter the skill or requirement.'
  } else if (alreadyTracked) {
    errors.skill = `"${skill}" is already tracked. Use "Add mention" on its card instead.`
  }

  if (!values.evidence.trim()) {
    errors.evidence = 'Describe where the requirement appeared.'
  }

  if (!values.projectAngle.trim()) {
    errors.projectAngle = 'Describe how a project could use it.'
  }

  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p className="field-error" id={id}>
      {message}
    </p>
  )
}

export function SignalForm({ categories, existingSkills, onAdd }: SignalFormProps) {
  const [values, setValues] = useState<NewSignal>(emptyValues)
  // Errors appear after the first failed submit, then update as the user types.
  const [showErrors, setShowErrors] = useState(false)
  const errors = showErrors ? validate(values, existingSkills) : {}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const submitErrors = validate(values, existingSkills)
    const firstInvalidField = textFields.find((field) => submitErrors[field])

    if (firstInvalidField) {
      setShowErrors(true)

      const field = event.currentTarget.elements.namedItem(firstInvalidField)

      if (field instanceof HTMLElement) {
        field.focus()
      }

      return
    }

    onAdd({
      skill: values.skill.trim(),
      category: values.category,
      evidence: values.evidence.trim(),
      projectAngle: values.projectAngle.trim(),
    })
    setValues(emptyValues)
    setShowErrors(false)
  }

  return (
    <form
      aria-labelledby="form-heading"
      className="signal-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <p className="label">Add signal</p>
        <h3 className="panel-heading" id="form-heading">
          New requirement
        </h3>
      </div>

      <div className="form-group">
        <label htmlFor="signal-skill-input">Skill</label>
        <input
          aria-describedby={errors.skill ? 'signal-skill-error' : undefined}
          aria-invalid={errors.skill ? true : undefined}
          id="signal-skill-input"
          name="skill"
          onChange={(event) => {
            const skill = event.target.value
            setValues((current) => ({ ...current, skill }))
          }}
          placeholder="GraphQL, Prisma, CI, Accessibility..."
          required
          value={values.skill}
        />
        <FieldError id="signal-skill-error" message={errors.skill} />
      </div>

      <div className="form-group">
        <label htmlFor="signal-category-select">Category</label>
        <select
          id="signal-category-select"
          name="category"
          onChange={(event) => {
            const category = event.target.value as SignalCategory
            setValues((current) => ({ ...current, category }))
          }}
          value={values.category}
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
          aria-describedby={errors.evidence ? 'signal-evidence-error' : undefined}
          aria-invalid={errors.evidence ? true : undefined}
          id="signal-evidence-input"
          name="evidence"
          onChange={(event) => {
            const evidence = event.target.value
            setValues((current) => ({ ...current, evidence }))
          }}
          placeholder="Where it appeared and why it matters"
          required
          value={values.evidence}
        />
        <FieldError id="signal-evidence-error" message={errors.evidence} />
      </div>

      <div className="form-group">
        <label htmlFor="signal-angle-input">Project angle</label>
        <textarea
          aria-describedby={errors.projectAngle ? 'signal-angle-error' : undefined}
          aria-invalid={errors.projectAngle ? true : undefined}
          id="signal-angle-input"
          name="projectAngle"
          onChange={(event) => {
            const projectAngle = event.target.value
            setValues((current) => ({ ...current, projectAngle }))
          }}
          placeholder="A project that would use this skill"
          required
          value={values.projectAngle}
        />
        <FieldError id="signal-angle-error" message={errors.projectAngle} />
      </div>

      <button className="btn btn-primary" type="submit">
        Save signal
      </button>
    </form>
  )
}
