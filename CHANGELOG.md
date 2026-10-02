# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Gave the interface its own look, styled as field notes on warm paper with one rust accent. Headings use Bricolage Grotesque, text uses DM Sans, and figures use Red Hat Mono.
- Replaced the table under a stats strip with a ranked leaderboard. Each signal is a row with a wide inline bar and its mention count in large numerals, and the strongest signal comes first.
- Category filters and connection-state switching are now underline tabs with a thick accent underline.
- Moved the selected signal and the numbered build order into the right column, with the sample batch, export and new signal form below them.
- Replaced the stats strip with a short tally of skills, mentions and closed tasks beside the title, and turned the panels into open sections divided by rules.
- Rows on narrow screens stack the bar under the skill name, and every control stays at least 44px tall.

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
- Stale documentation screenshots, regenerated against the current UI and copy.
