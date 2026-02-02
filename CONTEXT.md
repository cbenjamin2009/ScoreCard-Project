# Project Context

## Core Flow
- Default workbook is `assets/Scorecard Template.xlsx`.
- Scorecard data is loaded via `lib/scorecard.js` and exposed through `/api/scorecard`.
- Weekly cadence uses a rolling 4-week window and sorts columns by actual date order.
- If the requested cadence sheet is missing, the loader falls back to the available sheet and marks `cadenceFallback` in the payload (UI shows a toast).

## Session Uploads
- Uploads are session-local; files are stored under `.cache/sessions/<session-id>/scorecard.xlsx`.
- The session is tracked by the `scorecard-session` cookie (30-day TTL).
- `/api/upload` writes the session file and returns the parsed payload.
- `/api/reset` clears the session (deletes the session folder + expires the cookie) and returns the default template payload.
- `/api/download` returns the session workbook if present; otherwise the default template.

## UI Notes
- `components/ScorecardDashboard.jsx` handles cadence switching, refresh/reset/export, and renders the header logo from `public/header_am.png`.
- Overall Score gauge hides when there are no panic thresholds; metrics default to `on-track` only when *all* rows lack panic values.
- The dashboard control panel combines controls + upload panel for tighter spacing.

## Caching
- Parsed payloads are cached under `.cache/` by default.
- Cache entries are ignored if they contain zero metrics (to avoid stale "No metrics available" states).

## Tests
- Unit tests live under `tests/` (Vitest).
- E2E tests use Cypress (`npm run cy:run`), with fixtures under `cypress/fixtures/`.
