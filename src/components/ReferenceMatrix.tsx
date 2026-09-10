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
          <h2 id="reference-heading">Project profiles</h2>
        </div>
        <p>
          Sample product profiles, rated by how well the tracked skills cover
          their technical needs.
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
            <ul
              aria-label={`${profile.company} technical needs`}
              className="requirement-tags"
            >
              {profile.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
            <p className="project-angle">{profile.projectMove}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
