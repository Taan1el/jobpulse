# JobPulse

JobPulse is a small full-stack project in progress. The first version is a React and TypeScript dashboard for turning job-listing requirements into a practical project backlog.

## Why This Project Exists

Full-stack listings for Remote and Europe-based roles often repeat the same themes: typed React interfaces, API work, SaaS workflows, persistence, clean delivery habits, and deployment readiness. JobPulse makes those signals visible and turns them into concrete project tasks.

## Current Features

- Track skills and requirements found in job listings.
- Filter requirements by frontend, backend, product, and quality categories.
- Save new requirement signals in local browser storage.
- Maintain a small build queue that maps requirements to project work.
- Show summary metrics for tracked skills, listing mentions, and closed tasks.

## Tech Stack

- React
- TypeScript
- Vite
- Oxlint
- Browser localStorage for the first persistence layer

## Run Locally

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Next Improvements

- Add a small Node API for saved signals and tasks.
- Move storage from localStorage to a simple database.
- Add tests around signal filtering and task status changes.
- Add screenshots after the first UI polish pass.
- Prepare a private GitHub repository once GitHub CLI auth is available.
