# JobPulse

A focused React + TypeScript application tracking recurring requirements across Remote and Estonia/EU full-stack listings and turning them into prioritized project features.

[![CI Status](https://github.com/Taan1el/jobpulse/actions/workflows/ci.yml/badge.svg)](https://github.com/Taan1el/jobpulse/actions)

---

## 2-Minute Walkthrough

If you have 2 minutes to inspect this project, here is what matters:

1. **The Problem It Solves**: Full-stack listings in Europe and Remote hubs frequently repeat the same stack demands: typed React interfaces, REST resilience, reusable component architecture, and clean testing habits. JobPulse visualizes these signals and connects them directly to project deliverables.
2. **Intentional Frontend Scoping**: Instead of shipping an unnecessary toy server, the app is 100% frontend-only. It proves integration readiness by simulating REST lifecycle states (Loading skeletons, Data views, Empty fallbacks, Error recovery), handling JSON import/export, and using structured `localStorage` persistence.
3. **Engineering Rigor**:
   - **Type Safety**: End-to-end typed contracts in `shared/jobpulse.ts`.
   - **Component Modularity**: Single-responsibility components in `src/components/` (SummaryGrid, FocusStrip, ListingMatrix, IntegrationStates, SignalList, ProjectQueue, DataActionsPanel, SignalForm).
   - **Accessibility (a11y)**: Explicit form label associations, high-contrast `:focus-visible` styling, ARIA live announcements, and semantic HTML throughout.
   - **Automated Quality**: Vitest unit suite covering state mutations, search, sorting, reset actions, and error recovery; Oxlint with 0 warnings; TypeScript strict build; and automated Playwright screenshot tests.

---

## Visual Preview

| Desktop Dashboard (1440px) | Mobile View (390px) |
| :---: | :---: |
| ![JobPulse Desktop](./docs/screenshots/jobpulse-desktop.png) | ![JobPulse Mobile](./docs/screenshots/jobpulse-mobile.png) |

Detailed demo inspection notes and testing scenarios are documented in [docs/demo.md](docs/demo.md).

---

## Features

- **Live Market Signals**: Browse recurring requirements with instant text search and sorting (Most mentions vs Alphabetical A-Z).
- **Category Filter Tabs**: Isolate skills across Frontend, Backend, Product, and Quality areas.
- **Target Listing Matrix**: Direct comparison against real European & Remote job specifications (Operations Tracker, Frontend Console, Component Studio, SaaS Metrics Lab).
- **REST State Simulator**: Interactive toggle between Ready, Loading, Empty, and Error states demonstrating resilient UI data handling.
- **Project Build Backlog**: Track project tasks through development stages (`Next` &rarr; `In progress` &rarr; `Done`).
- **Data Handoff**: Mock import batch ingestion and full JSON snapshot export.
- **Reviewer Reset**: One-click "Reset demo data" helper to restore sample data back to pristine baseline.
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
# Install dependencies
npm install

# Start local dev server (http://localhost:5173)
npm run dev
```

---

## Quality Checks

```bash
# Run unit test suite (12 tests)
npm test

# Run linter
npm run lint

# Run production build (TypeScript + Vite)
npm run build
```

---

## Capture Fresh Screenshots

To capture fresh high-resolution desktop and mobile screenshots:

```bash
npm run screenshots
```

---

## Architecture & Code Structure

```
jobpulse/
├── .github/workflows/ci.yml     # Automated CI pipeline (lint, test, build)
├── docs/
│   ├── demo.md                  # Demo guide & verification steps
│   ├── job-fit-strategy.md      # Market analysis and project roadmap
│   └── screenshots/             # Desktop and mobile screenshots
├── scripts/
│   └── capture-screenshots.mjs  # Automated Playwright capture script
├── shared/
│   └── jobpulse.ts              # Domain types, initial seed data, contracts
├── src/
│   ├── components/              # Modular, accessible UI components
│   │   ├── DataActionsPanel.tsx # Import, export, and reset controls
│   │   ├── FocusStrip.tsx       # Priority signal & next move highlights
│   │   ├── IntegrationStates.tsx# REST state simulator
│   │   ├── ListingMatrix.tsx    # Target job listings match cards
│   │   ├── ProjectQueue.tsx     # Development backlog progression
│   │   ├── SignalForm.tsx       # Accessible requirement submission form
│   │   ├── SignalList.tsx       # Searchable, filterable signal cards
│   │   ├── SummaryGrid.tsx      # Top-level project metrics
│   │   └── index.ts             # Clean component barrel exports
│   ├── App.css                  # Custom design tokens, focus styles, responsive layout
│   ├── App.test.tsx             # Comprehensive Vitest test suite
│   ├── App.tsx                  # Root state orchestration & persistence
│   └── main.tsx                 # Application entry point
├── package.json
└── tsconfig.json
```
