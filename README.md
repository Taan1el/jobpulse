# SignalDesk

A focused React + TypeScript application for tracking recurring technical signals and turning them into prioritized project work.

## 2-Minute Product Walkthrough

SignalDesk helps a small product or learning team decide what to build next when many technical ideas compete for attention.

1. **Signal Planning**: Capture repeated technical themes, group them by category, and connect them to concrete project improvements.
2. **Frontend Scoping**: The app is intentionally frontend-only. It demonstrates REST lifecycle states with loading, data, empty, and error views while keeping persistence in structured `localStorage`.
3. **Engineering Rigor**:
   - **Type Safety**: Shared domain contracts in `shared/signaldesk.ts`.
   - **Component Modularity**: Single-responsibility components in `src/components/` (SummaryGrid, FocusStrip, ReferenceMatrix, IntegrationStates, SignalList, ProjectQueue, DataActionsPanel, SignalForm).
   - **Accessibility**: Explicit form label associations, high-contrast `:focus-visible` styling, ARIA live announcements, and semantic HTML throughout.
   - **Automated Quality**: Vitest unit suite covering state mutations, search, sorting, reset actions, and error recovery; Oxlint with 0 warnings; TypeScript strict build; and automated Playwright screenshot tests.

---

## Visual Preview

| Desktop Dashboard (1440px) | Mobile View (390px) |
| :---: | :---: |
| ![SignalDesk Desktop](./docs/screenshots/signaldesk-desktop.png) | ![SignalDesk Mobile](./docs/screenshots/signaldesk-mobile.png) |

Detailed demo notes and testing scenarios are documented in [docs/demo.md](docs/demo.md).

---

## Features

- **Technical Signals**: Browse recurring technical themes with instant text search and sorting.
- **Category Filter Tabs**: Isolate skills across Frontend, Backend, Product, and Quality areas.
- **Reference Matrix**: Compare project ideas against reusable dashboard, API, and delivery profiles.
- **REST State Simulator**: Toggle between Ready, Loading, Empty, and Error states for resilient UI behavior.
- **Project Queue**: Track project tasks through development stages (`Next` &rarr; `In progress` &rarr; `Done`).
- **Data Handoff**: Mock import batch ingestion and full JSON snapshot export.
- **Demo Reset**: One-click "Reset demo data" helper to restore sample data back to the baseline.
- **Local Persistence**: Client-side storage in browser `localStorage` with graceful recovery from malformed data.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **Linter**: Oxlint
- **Testing**: Vitest + React Testing Library + jsdom
- **Visual Capture**: Playwright Chromium automation
- **CI / Automation**: GitHub Actions (`.github/workflows/ci.yml`)

---

## Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Quality Checks

```bash
npm test
npm run lint
npm run build
```

---

## Capture Fresh Screenshots

```bash
npm run screenshots
```

---

## Architecture & Code Structure

```text
signaldesk/
├── .github/workflows/ci.yml     # Automated CI pipeline (lint, test, build)
├── docs/
│   ├── demo.md                  # Demo guide and verification steps
│   ├── product-roadmap.md       # Product direction and improvement plan
│   └── screenshots/             # Desktop and mobile screenshots
├── scripts/
│   └── capture-screenshots.mjs  # Automated Playwright capture script
├── shared/
│   └── signaldesk.ts            # Domain types, initial seed data, contracts
├── src/
│   ├── components/              # Modular, accessible UI components
│   │   ├── DataActionsPanel.tsx # Import, export, and reset controls
│   │   ├── FocusStrip.tsx       # Priority signal and next move highlights
│   │   ├── IntegrationStates.tsx# REST state simulator
│   │   ├── ReferenceMatrix.tsx  # Project profile cards
│   │   ├── ProjectQueue.tsx     # Development backlog progression
│   │   ├── SignalForm.tsx       # Accessible signal submission form
│   │   ├── SignalList.tsx       # Searchable, filterable signal cards
│   │   ├── SummaryGrid.tsx      # Top-level project metrics
│   │   └── index.ts             # Component exports
│   ├── App.css                  # Design tokens, focus styles, responsive layout
│   ├── App.test.tsx             # Vitest test suite
│   ├── App.tsx                  # Root state orchestration and persistence
│   └── main.tsx                 # Application entry point
├── package.json
└── tsconfig.json
```
