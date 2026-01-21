# Repository Guidelines

## Context Summary (Scorecard Report)
- Workbook default is `assets/IT Scorecard 2026.xlsx` with weekly sheet `EOS 2026` and monthly sheet `IT Monthly 2026`.
- Weekly cadence uses a rolling 4-week window and sorts columns by actual date order.
- Panic thresholds are parsed from the “Panic #” column; comparator supports "More than/Greater than/Above" and "Less than/Below".
- Executive Summary groups by category and includes Panic + Latest values with a threshold indicator arrow.
- Overall score gauge (grade + percent) is known good and should remain on the first PDF page.
- Metric cards show sparklines with subtle axis labels and point markers; ensure trends remain chronological.
- Print/PDF hides the trend focus section, trims card spacing, and forces each category to a new page.

## Project Structure & Module Organization
- Core data loaders live in `lib/`, e.g., `lib/scorecard.js` (Excel ingestion) and `lib/metrics.js` (filter helpers). Keep those pure so both API routes and pages can reuse them.
- UI lives in `components/` and `pages/`; reuse presentational components (`MetricCard`, `MetricChart`) rather than embedding JSX in pages.
- Mirror business logic with tests under `tests/` (e.g., `tests/lib/scorecard.test.js`) so every helper has fixture coverage.
- Store static inputs such as `assets/IT Scorecard.xlsx` and sample fixtures under `tests/fixtures/` to avoid hitting production files in unit tests.

## Build, Test, and Development Commands
- `npm install` – install or refresh dependencies before any code generation pass.
- `npm run dev` – start the Next.js dev server (http://localhost:3000) with hot reload.
- `npm run build` – bundle or transpile to `dist/`; log the output directory so subsequent steps can package artifacts.
- `npm test` – runs the Vitest suite (see `tests/lib/scorecard.test.js`) to verify the Excel loader logic stays intact.
- `npm run cache:clear` – removes cached scorecard payloads under `.cache/` (or `SCORECARD_CACHE_DIR`) so the workbook is re-read on the next request.

## Coding Style & Naming Conventions
- Use 2-space indentation, trailing commas where legal, and Modern JS syntax (const/let, optional chaining).
- File names should be kebab-case for scripts (`score-card-runner.js`) and PascalCase only for React-style components.
- Prefer pure functions; when a module performs I/O, expose a factory named `createXService`.
- Run `npx prettier --write "src/**/*.js" "tests/**/*.js"` prior to opening a PR to guarantee consistent formatting.

## Testing Guidelines
- Use Vitest (already configured); keep test files under `tests/` with the suffix `.test.js`.
- Aim for 80% line coverage; add `--coverage` to `npm test` and upload the `coverage/` folder to CI artifacts.
- When consuming spreadsheet data, add fixture slices under `tests/fixtures/` to avoid hitting the full Excel file during unit tests.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: add scoring weights cache`) so automation can infer release notes.
- Each PR should include: a one-paragraph summary, bullet list of changes, test output snippet, and a link to the tracking ticket.
- Squash merge after approval; rebase if your branch drifts more than five commits behind `main`.

## Security & Configuration Tips
- Never commit real credentials or full spreadsheets containing PII—store sanitized samples under `assets/samples/`.
- Document any required environment variables in `.env.example`, and keep that file synchronized with code expectations.
- Review dependency changes with `npm audit` before merging; note high-severity issues in the PR description with remediation steps.
- Parsed scorecard payloads are cached by default under `.cache/`; tune `SCORECARD_CACHE_MODE`/`SCORECARD_CACHE_DIR` or clear the folder if values look stale.
- The upload endpoint (`/api/upload`) overwrites whatever file `SOURCE_SPREADSHEET` points to. Make sure that path is writable locally and never exposes sensitive data in shared environments.

## Deployment Notes
- Docker deployment uses `docker-compose.yml` with port `3005:3000` and a standalone Next.js build.
- Keep `assets/` in the repo but ignore uploaded files; ensure the workbook exists on the Docker host under `/srv/scorecard/assets/`.
