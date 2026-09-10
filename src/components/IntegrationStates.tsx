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
          <p className="label">Listing source</p>
          <h2 id="integration-heading">Connection states</h2>
        </div>
        <p>
          How the dashboard presents a job-board source while it loads, when nothing
          matches, and when it fails. These are sample states; nothing is fetched.
        </p>
      </div>
      <div className="integration-grid">
        <fieldset className="scenario-tabs">
          <legend className="visually-hidden">Choose a connection state</legend>
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
          {activeScenario.status === 'Loading' && (
            <div aria-hidden="true" className="skeleton-lines">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          )}
          <code>{activeScenario.sample}</code>
        </article>
      </div>
    </section>
  )
}
