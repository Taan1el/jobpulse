# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-09-13

### Added

- Technical signal tracker: filter by category, search skills and evidence, sort by mentions or name, and add a mention when a skill comes up again.
- Reference profile matrix rating how well tracked skills cover four sample product profiles.
- Build queue where tasks move from Next to In progress to Done and can be reopened.
- Sample connection states (Ready, Loading, Empty, Error) that show how the dashboard would present a remote source, without making any network request.
- Sample batch import that merges three sample requirements once per reset.
- Export of the current signals and build queue as a JSON snapshot.
- Reset control that restores the sample data.
- Persistence to `localStorage`, with validation on load so malformed or outdated saved data falls back to the sample data instead of crashing the page.
- GitHub Pages build (`npm run build:pages`) with a base path for `https://taan1el.github.io/jobpulse/`, plus a `pages.yml` workflow.
- Accessibility coverage: semantic landmarks, labelled form controls, visible focus styles, a persistent live region for status messages, and axe-core checks in the test suite.
- MIT license and package metadata for the 1.0.0 release.

### Fixed

- Header line height so the descender in "SignalDesk" no longer overlaps the subtitle.
- Stale documentation screenshots that still showed the earlier job-search framing; regenerated against the current UI and copy.
