import type { ReferenceProfile } from '../../shared/signaldesk'

type ReferenceMatrixProps = {
  profiles: ReferenceProfile[]
}

export function ReferenceMatrix({ profiles }: ReferenceMatrixProps) {
  return (
    <section aria-labelledby="reference-heading">
      <p className="label">Reference fit</p>
      <h2 className="section-heading" id="reference-heading">
        Project profiles
      </h2>
      <p className="section-description">
        Sample product profiles, rated by how well the tracked skills cover their
        technical needs.
      </p>
      <div className="reference-list">
        {profiles.map((profile) => (
          <article
            aria-label={`${profile.company}: ${profile.role}`}
            className="reference-row"
            key={profile.id}
          >
            <span className="fit-badge">{profile.fit}</span>
            <div>
              <h3>{profile.company}</h3>
              <p className="reference-role">{profile.role}</p>
              <ul
                aria-label={`${profile.company} technical needs`}
                className="requirement-tags"
              >
                {profile.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
              <p className="reference-note">{profile.projectMove}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
