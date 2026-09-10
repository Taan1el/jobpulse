import type { IntegrationScenario } from '../../shared/jobpulse'

type IntegrationStatesProps = {
  activeScenario: IntegrationScenario
  scenarios: IntegrationScenario[]
  onScenarioChange: (scenarioId: number) => void
}

export function IntegrationStates({
  activeScenario,
  scenarios,
  onScenarioChange,
}: IntegrationStatesProps) {
  return (
    <section className="integration-section" aria-labelledby="integration-heading">
      <div className="section-heading">
        <div>
          <p className="label">REST-style states</p>
          <h2 id="integration-heading">Integration readiness</h2>
        </div>
        <p>
          Demonstrates client-side state resilience (loading skeletons, data view, empty
          fallbacks, error states) without adding backend dependencies.
        </p>
      </div>
      <div className="integration-grid">
        <fieldset className="scenario-tabs">
          <legend className="visually-hidden">Choose integration state</legend>
          {scenarios.map((scenario) => (
            <button
              aria-pressed={scenario.id === activeScenario.id}
              className={scenario.id === activeScenario.id ? 'active' : ''}
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              type="button"
            >
              {scenario.status}
            </button>
          ))}
        </fieldset>
        <article className={`scenario-card ${activeScenario.status.toLowerCase()}`}>
          <span>{activeScenario.status}</span>
          <h3>{activeScenario.title}</h3>
          <p>{activeScenario.description}</p>
          <code>{activeScenario.sample}</code>
        </article>
      </div>
    </section>
  )
}
