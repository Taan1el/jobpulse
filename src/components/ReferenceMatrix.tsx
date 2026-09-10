import type { ReferenceProfile } from '../../shared/signaldesk'

type ReferenceMatrixProps = {
  profiles: ReferenceProfile[]
}

export function ReferenceMatrix({ profiles }: ReferenceMatrixProps) {
  return (
    <section className="fit-section" aria-labelledby="reference-heading">
      <div className="section-heading">
        <div>
          <p className="label">Reference fit</p>
          <h2 id="reference-heading">Project profile matrix</h2>
        </div>
        <p>
          Ranked by how directly SignalDesk and the next product improvements
          support common dashboard, API, and delivery patterns.
        </p>
      </div>
      <div className="reference-grid">
        {profiles.map((profile) => (
          <article
            aria-label={`${profile.company}: ${profile.role}`}
            className="reference-card"
            key={profile.id}
          >
            <div className="reference-title">
              <div>
                <span
                  className={`fit-pill ${profile.fit.toLowerCase().replace(' ', '-')}`}
                >
                  {profile.fit}
                </span>
                <h3>{profile.company}</h3>
                <p>{profile.role}</p>
              </div>
            </div>
            <div className="requirement-tags" aria-label="Key requirements">
              {profile.requirements.map((requirement) => (
                <span key={requirement}>{requirement}</span>
              ))}
            </div>
            <p className="project-angle">{profile.projectMove}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
