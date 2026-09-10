# JobPulse

[![CI](https://github.com/Taan1el/jobpulse/actions/workflows/ci.yml/badge.svg)](https://github.com/Taan1el/jobpulse/actions/workflows/ci.yml)

JobPulse is a project: a React and TypeScript dashboard for tracking which skills keep showing up in frontend and full-stack job listings (Remote and Estonia/EU) and turning them into a build queue of project work. It runs entirely in the browser and stores its data in `localStorage`.

![JobPulse dashboard at 1440px wide](docs/screenshots/jobpulse-desktop.png)

A short walkthrough of each part of the app is in [docs/demo.md](docs/demo.md).

## Features

- **Requirement signals**: filter by category, search skills and evidence, sort by mentions or name, and add a mention when a skill shows up again.
- **Target listing matrix**: four reference listings with their requirements and how a project could answer them.
- **Build queue**: project tasks move from Next to In progress to Done (and can be reopened), and the header counts closed tasks.
- **Sample batch import**: merges three sample requirements once. Skills that are already tracked get one more mention and keep the text you wrote.
- **Add signal form**: inline validation for empty fields and for skills that are already tracked.
- **Integration states**: Ready, Loading, Empty, and Error views for a remote listing source. These are static demo states; the app makes no network requests.
- **Export and reset**: download the current signals and tasks as JSON, or restore the seed data.

## How it's built

- **State**: every change goes through a typed reducer ([src/state/jobPulseReducer.ts](src/state/jobPulseReducer.ts)) with one action per user intent. It is a pure function with its own unit tests.
- **Persistence**: [src/state/storage.ts](src/state/storage.ts) saves to `localStorage` and checks every saved signal and task before restoring them. Anything malformed falls back to the seed data instead of crashing the page.
- **Components**: presentational components live in [src/components](src/components). The signal form owns its field state and validation and passes a clean `NewSignal` up to the app.
- **Accessibility**: semantic landmarks, lists, and fieldsets; labelled controls; visible focus styles; status messages through a live region that stays mounted; form errors linked with `aria-describedby`; reduced-motion support. axe-core runs in the test suite, and oxlint's jsx-a11y rules run in CI.
- **Tests**: Vitest and React Testing Library cover user-facing behavior; the reducer and storage have unit tests.
- **CI**: GitHub Actions runs lint, tests, and a production build on every push and pull request to `master`.

## Tech stack

React 19, TypeScript, Vite, Vitest, React Testing Library, axe-core, oxlint, GitHub Actions, and Playwright for the screenshot script.

## Run locally

Requires Node.js 22.12 or newer (CI uses Node 24).

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm test` | Run the test suite once |
| `npm run lint` | Run oxlint |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build |
| `npm run screenshots` | Capture desktop and mobile screenshots into `docs/screenshots/` |

`npm run screenshots` needs Playwright's Chromium. Install it once with `npx playwright install chromium`.

## Project structure

```text
shared/jobpulse.ts       Domain types and seed data
src/App.tsx              Page layout, derived values, and event handlers
src/components/          Presentational components and the signal form
src/state/               Reducer, storage, and their unit tests
src/App.test.tsx         Behavior tests through the UI
src/App.a11y.test.tsx    axe checks for the main screen states
scripts/                 Screenshot capture
docs/                    Walkthrough, job-fit notes, and screenshots
```

## Data and scope

- The target listings and their requirements come from the job-search notes in [docs/job-fit-strategy.md](docs/job-fit-strategy.md). Mention counts in the seed data are starting values for the demo, not scraped statistics.
- There is no backend by design. Persistence is isolated in `src/state/storage.ts`, which is the piece an API client would replace.

## Next steps

- Extract the reusable UI pieces into a separate component library.
- Deploy a preview build.
