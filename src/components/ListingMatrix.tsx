import type { TargetListing } from '../../shared/jobpulse'

type ListingMatrixProps = {
  listings: TargetListing[]
}

export function ListingMatrix({ listings }: ListingMatrixProps) {
  return (
    <section className="fit-section" aria-labelledby="job-fit-heading">
      <div className="section-heading">
        <div>
          <p className="label">Job fit</p>
          <h2 id="job-fit-heading">Target listing matrix</h2>
        </div>
        <p>
          Ranked by how directly JobPulse and the next projects can
          answer full-stack requirements across Remote and Estonia/EU postings.
        </p>
      </div>
      <div className="listing-grid">
        {listings.map((listing) => (
          <article
            aria-label={`${listing.company}: ${listing.role}`}
            className="listing-card"
            key={listing.id}
          >
            <div className="listing-title">
              <div>
                <span
                  className={`fit-pill ${listing.fit.toLowerCase().replace(' ', '-')}`}
                >
                  {listing.fit}
                </span>
                <h3>{listing.company}</h3>
                <p>{listing.role}</p>
              </div>
            </div>
            <div className="requirement-tags" aria-label="Key requirements">
              {listing.requirements.map((requirement) => (
                <span key={requirement}>{requirement}</span>
              ))}
            </div>
            <p className="project-angle">{listing.projectMove}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
