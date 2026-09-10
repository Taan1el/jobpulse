# JobPulse walkthrough

A short tour of the app.

## 1. Header and focus strip

The summary counts tracked skills, total listing mentions, and closed tasks. Below it, the focus strip shows the skill with the most mentions and the next unfinished task.

## 2. Target listings

Four sample listings with their requirements; the company names are fictional. The fit label (Best match, Good match, Stretch) and the note on each card show how well the tracked skills cover the role.

## 3. Connection states

Pick Ready, Loading, Empty, or Error to see how the dashboard presents a job-board source in each state. The Loading view shows a skeleton. These are sample states; nothing is fetched.

## 4. Requirement signals

- Filter by category, search skills and evidence, or sort by mentions or name. The count above the list updates as the filters change.
- Add a mention on any card. The total in the header updates and the change is saved in `localStorage`.

## 5. Build queue

Each task shows its status and a button for the next step: Start, Complete, or Reopen.

## 6. Import, export, and reset

- **Import sample batch** merges three sample requirements once. Importing again is blocked until the demo data is reset.
- **Export JSON** downloads the current signals and tasks.
- **Reset to defaults** restores the sample data.

## 7. Add a signal

Submit the form empty, or with a skill that is already tracked, to see the inline errors. Focus moves to the first field that needs attention.

## Screenshots

### Desktop (1440px)

![JobPulse desktop layout](./screenshots/jobpulse-desktop.png)

### Mobile (390px)

![JobPulse mobile layout](./screenshots/jobpulse-mobile.png)

Regenerate them with `npm run screenshots` after installing Playwright's Chromium once with `npx playwright install chromium`.
