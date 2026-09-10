# JobPulse

JobPulse is a small full-stack project in progress. The first version is a React and TypeScript dashboard for turning job-listing requirements into a practical project backlog.

## Why This Project Exists

Full-stack listings for Remote and Europe-based roles often repeat the same themes: typed React interfaces, API work, SaaS workflows, persistence, clean delivery habits, and deployment readiness. JobPulse makes those signals visible and turns them into concrete project tasks.

## Current Features

- Track skills and requirements found in job listings.
- Filter requirements by frontend, backend, product, and quality categories.
- Save new requirement signals through a local Node API with browser fallback.
- Maintain a small build queue that maps requirements to project work.
- Show summary metrics for tracked skills, listing mentions, and closed tasks.
- Export the current signals and build queue as JSON.

## Tech Stack

- React
- TypeScript
- Vite
- Oxlint
- Node HTTP API
- JSON file persistence

## Run Locally

```bash
npm install
npm run dev:api
```

In a second terminal:

```bash
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Next Improvements

- Add a small Node API for saved signals and tasks.
- Move JSON storage to SQLite or PostgreSQL.
- Add tests around signal filtering and task status changes.
- Add screenshots after the first UI polish pass.
- Deploy a private preview build for review.
