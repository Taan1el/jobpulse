# SignalDesk Walkthrough

A short tour of the app.

## 1. Header and Totals

The header names the product and its purpose in one sentence. Below it, a stats
strip counts tracked skills, total signal mentions, and closed tasks.

## 2. Technical Signals

- Filter by category with the segmented control, search skills and evidence,
  or sort by mentions or name. The count above the table updates as the
  filters change.
- The table lists the strongest signal first by default. Click a skill name to
  select it; its full record appears in the side column.
- Add a mention with the row's button. The total in the stats strip updates
  and the change is saved to `localStorage`.

## 3. Reference Fit

Four sample product profiles list their technical needs as a dense list, not
cards. The fit label and note on each row show how well the tracked skills
support that profile.

## 4. Connection States

Pick Ready, Loading, Empty, or Error to see how the dashboard presents a
remote source in each state. The Loading view shows a skeleton. These are
sample states; nothing is fetched.

## 5. Selected Signal and Build Queue

The side column shows the selected signal's evidence and project angle, and
the build queue below it. Each task shows its status and a button for the
next step: Start, Complete, or Reopen.

## 6. Import, Export, and Reset

- **Import sample batch** merges three sample requirements once. Importing
  again is blocked until the demo data is reset.
- **Export JSON** downloads the current signals and tasks.
- **Reset sample data**, in the demo bar at the top, restores the sample data
  after a confirmation prompt.

## 7. Add a Signal

Submit the form empty, or with a skill that is already tracked, to see the
inline errors. Focus moves to the first field that needs attention.

## Screenshots

### Desktop (1440px)

![SignalDesk desktop layout](./screenshots/signaldesk-desktop.png)

### Mobile (390px)

![SignalDesk mobile layout](./screenshots/signaldesk-mobile.png)

Regenerate them with `npm run screenshots` after installing Playwright's Chromium once with `npx playwright install chromium`.
