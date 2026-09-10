# JobPulse

JobPulse is a frontend project in progress. It is a React and TypeScript dashboard for turning job-listing requirements into a practical project backlog.

## Why This Project Exists

Full-stack and frontend listings for Remote and Europe-based roles often repeat the same themes: typed React interfaces, REST integration, SaaS workflows, reusable components, clean delivery habits, and deployment readiness. JobPulse makes those signals visible and turns them into concrete project tasks.

## Current Features

- Track skills and requirements found in job listings.
- Filter requirements by frontend, backend, product, and quality categories.
- Save new requirement signals in local browser storage.
- Maintain a small build queue that maps requirements to project work.
- Show summary metrics for tracked skills, listing mentions, and closed tasks.
- Compare target job listings against the project roadmap.
- Export the current signals and build queue as JSON.

## Tech Stack

- React
- TypeScript
- Vite
- Oxlint
- Browser localStorage

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
- Extract reusable UI parts into a small component library.
- Add tests around signal filtering and task status changes.
- Add screenshots after the first UI polish pass.
- Deploy a private preview build for review.
