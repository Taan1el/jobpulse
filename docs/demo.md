# SignalDesk Demo Guide

This guide covers the main product flows for checking frontend structure, component behavior, accessibility, and client-side data resilience.

---

## 2-Minute Feature Tour

### 1. Signal-to-Project Mapping
- **Project Profile Matrix**: Inspect the four reference profiles and how each one connects to dashboard, API, data, and delivery patterns.
- **Top Signal & Next Move**: The top strip highlights the strongest technical signal (`React + TypeScript`) and the active roadmap task (`Add screenshots and responsive review`).

### 2. Client-Side State & Persistence
- **Signal Search & Sort**: Use the search input to filter skills in real time. Toggle sorting between "Most mentions" and "Alphabetical (A-Z)".
- **Mention Counter**: Click "Add mention" on any signal. The total mentions counter in the header updates immediately and saves to `localStorage`.
- **New Signal Form**: Fill out the accessible form at the bottom right and click "Save signal". The new signal appears immediately at the top of the list and persists across browser refreshes.
- **Demo Data Reset**: Click "Reset to defaults" in the Demo Helper panel to restore baseline demo data at any time.

### 3. REST Integration Resilience
- Click through the **Ready**, **Loading**, **Empty**, and **Error** scenario buttons under "Integration readiness".
- The UI shows asynchronous lifecycle states and graceful fallbacks without requiring an external API.

### 4. Backlog Progression
- In the "Build order" queue, click the status button on any card to advance it from `Next` to `In progress`, and again to advance it to `Done`.
- Notice how the "tasks closed" summary counter reacts dynamically.

### 5. Data Ingestion & Export
- Click **Import sample batch** to simulate receiving new signal payloads.
- Click **Export JSON** to trigger a client-generated blob download containing the complete active project state.

---

## Visual Previews

### Desktop Layout (1440px)
![SignalDesk Desktop Dashboard](./screenshots/signaldesk-desktop.png)

### Mobile Responsive Layout (390px)
![SignalDesk Mobile Dashboard](./screenshots/signaldesk-mobile.png)

---

## Automated Verification

```bash
npm test
npm run lint
npm run build
npm run screenshots
```
