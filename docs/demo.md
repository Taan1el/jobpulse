# JobPulse Evaluator & Demo Guide

This guide is for engineers reviewing JobPulse to evaluate frontend engineering fundamentals, component architecture, accessibility, and client-side data resilience.

---

## 2-Minute Feature Tour

### 1. Market-to-Product Mapping
- **Target Listing Matrix**: Inspect the 4 reference listings (Operations Tracker, Frontend Console, Component Studio, SaaS Metrics Lab). Notice how the project maps directly to requirements found in Remote and Estonia/EU full-stack listings.
- **Top Signal & Next Move**: The top strip highlights the most-demanded skill (`React + TypeScript`) and the active roadmap task (`Add screenshots and responsive review`).

### 2. Client-Side State & Persistence
- **Requirement Search & Sort**: Use the search input to filter skills in real time (e.g. search "REST" or "Quality"). Toggle sorting between "Most mentions" and "Alphabetical (A-Z)".
- **Mention Counter**: Click "Add mention" on any requirement signal. The total mentions counter in the header updates immediately and saves to `localStorage`.
- **New Signal Form**: Fill out the accessible form at the bottom right and click "Save signal". The new requirement appears immediately at the top of the list and persists across browser refreshes.
- **Demo Data Reset**: Click "Reset to defaults" in the Reviewer Helper panel to restore pristine demo data at any time.

### 3. REST Integration Resilience
- Click through the **Ready**, **Loading**, **Empty**, and **Error** scenario buttons under "Integration readiness".
- Demonstrates how the frontend handles asynchronous lifecycle states and graceful fallbacks without introducing fragile external API dependencies.

### 4. Backlog Progression
- In the "Build order" queue, click the status button on any card (e.g. `Next`) to advance it to `In progress`, and again to advance to `Done`.
- Notice how the "tasks closed" summary counter reacts dynamically.

### 5. Data Ingestion & Export
- Click **Import sample batch** to simulate receiving new requirement payloads.
- Click **Export JSON** to trigger a client-generated blob download containing the complete active project state.

---

## Visual Previews

### Desktop Layout (1440px)
![JobPulse Desktop Dashboard](./screenshots/jobpulse-desktop.png)

### Mobile Responsive Layout (390px)
![JobPulse Mobile Dashboard](./screenshots/jobpulse-mobile.png)

---

## Automated Verification

Run the test suite, linter, and production build from the terminal:

```bash
# Execute 12 Vitest unit tests
npm test

# Run Oxlint static analysis
npm run lint

# Compile TypeScript and Vite production bundle
npm run build

# Capture fresh screenshots via Playwright
npm run screenshots
```
