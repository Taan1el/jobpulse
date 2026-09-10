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
          <h2 id="job-fit-heading">Target listings</h2>
        </div>
        <p>
          Sample listings, rated by how well the tracked skills cover their
          requirements.
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
            <ul
              aria-label={`${listing.company} requirements`}
              className="requirement-tags"
            >
              {listing.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
            <p className="project-angle">{listing.projectMove}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
