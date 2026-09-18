import type { IntegrationScenario } from '../../shared/signaldesk'

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
    <section aria-labelledby="integration-heading">
      <h2 className="section-heading" id="integration-heading">
        Connection states
      </h2>
      <p className="section-description">
        How the dashboard presents a remote source while it loads, when nothing
        matches, and when it fails. These are sample states; nothing is fetched.
      </p>
      <fieldset className="segmented">
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
      <article className={`scenario-panel ${activeScenario.status.toLowerCase()}`}>
        <span className="scenario-status">{activeScenario.status}</span>
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
    </section>
  )
}
