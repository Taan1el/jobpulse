# Contributing to SignalDesk

Bug reports, fixes and small improvements are welcome.

## Set up

```bash
git clone https://github.com/Taan1el/jobpulse.git
cd jobpulse
npm ci
npm run dev
```

The README lists the ports and environment variables.

## Before you open a pull request

Run the same checks as CI:

```bash
npm run lint
npm test
npm run build
npm run build:pages
```

## Guidelines

- Keep a change focused: one fix or feature per pull request.
- Add or update tests when behavior changes.
- Use the existing design tokens for colors, fonts and spacing instead of adding new ones.
- Write commit messages as short plain sentences that say what changed.
- Update the README and CHANGELOG when behavior or the API changes.
