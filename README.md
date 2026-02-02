# 2026 Scorecard Dashboard

Next.js application that reads weekly and monthly scorecard worksheets from an Excel workbook and renders a leadership-ready dashboard with cards, tables, charts, and a PDF export.

## Prerequisites

- Node.js 18+
- Default workbook under `assets/Scorecard Template.xlsx` (update `SOURCE_SPREADSHEET` in `.env` if yours lives elsewhere). The template tabs are named `Weekly` and `Monthly`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) create `.env` from the provided template and tweak any paths:
   ```bash
   cp .env.example .env
   ```
3. Run the dev server and open the UI at http://localhost:3000:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` – starts Next.js in development mode with hot reload.
- `npm run build` – creates an optimized production bundle in `.next/`.
- `npm run start` – serves the production build.
- `npm run lint` – runs ESLint (flat config) across `*.js`/`*.jsx`.
- `npm test` – executes Vitest unit tests (currently focused on the Excel parsing layer).
- `npm run cache:clear` – deletes cached scorecard payloads (respects `SCORECARD_CACHE_DIR`).
- `npm run cy:open` – opens Cypress for end-to-end testing.
- `npm run cy:run` – runs Cypress tests headlessly.

## Architecture Notes

- Backend parsing logic lives in `lib/scorecard.js`. It uses `xlsx` to ingest the workbook, normalizes categories/metrics, and exposes `getScorecardData()` for both API routes and server-side rendering (weekly uses a rolling 4-week window, monthly shows year-to-date). Weekly columns are sorted by actual dates to keep trends chronological. If the requested cadence sheet is missing, the loader falls back to the available sheet and surfaces a toast in the UI.
- API route `pages/api/scorecard.js` returns the parsed JSON payload should you want to integrate with other front-ends.
- The UI lives in `pages/index.jsx` and composes reusable components under `components/` (`ScorecardDashboard`, `MetricCard`, `MetricChart`) with styling in `styles/globals.css`.
- Charts rely on `react-chartjs-2`/`chart.js`. If you deploy beyond local, consider persisting the parsed results or protecting the workbook path with environment variables.
- Parsed workbook data is cached to JSON files under `.cache/` by default to avoid re-reading the spreadsheet on each request. The cache automatically invalidates when the source Excel file changes.
- Session uploads are stored under `.cache/sessions/<session-id>/scorecard.xlsx` and never overwrite the default template. The session is tracked by the `scorecard-session` cookie.

## UI Controls & Refresh

- Use the “Refresh data” button whenever the Excel workbook is updated; it calls `/api/scorecard` and rehydrates the dashboard without a page reload. Errors surface inline.
- Metric cards include inline sparklines with subtle axes (min/max + first/last period labels) and point markers to make week-to-week changes visible. The header shows the last refresh timestamp, the workbook’s last modified time, and a relative “x mins ago” badge so stakeholders can judge data freshness at a glance.
- Drag-and-drop a new workbook (or click to browse) in the “Upload updated workbook” panel; uploads are handled by `/api/upload`, the file is stored for the current session only, and the dashboard refreshes automatically on success.
- The “Reset template” button clears the session and returns the UI to the default template workbook.

## Configuration

- `SOURCE_SPREADSHEET` – absolute or relative path to the Excel workbook.
- `SCORECARD_CACHE_MODE` – `file` (default) writes cache files; set to `off` to disable caching.
- `SCORECARD_CACHE_DIR` – directory for cache artifacts (defaults to `.cache`).
- `SCORECARD_WEEKLY_SHEET` – optional override for the weekly worksheet name.
- `SCORECARD_MONTHLY_SHEET` – optional override for the monthly worksheet name.
- If you do not set these, the app will auto-detect sheets by name (`Weekly`/`Monthly`), otherwise it falls back to the first/second worksheet.
- Run `npm run cache:clear` whenever you need to force a refresh without changing the workbook.
## End-to-End Tests (Cypress)

1. Start the dev server in one terminal:
   ```bash
   npm run dev
   ```
2. In another terminal, run Cypress:
   ```bash
   npm run cy:run
   ```

Note: On Ubuntu, Cypress requires system libraries. If it fails to launch, install the packages listed in https://on.cypress.io/required-dependencies.

## Report Behavior Notes

- Executive Summary table groups metrics by category and includes Panic + Latest values with a threshold indicator arrow.
- The cadence header includes an overall score gauge (grade + percent) based on on-track count / total metrics.
- The upload panel exposes a download link for the latest workbook with filename + last-updated timestamp.
- Print/PDF output hides the detail trend section, trims card spacing, and forces each category to a new page for readability.

## Docker Deployment (Internal Server)

1. Clone the repo onto the Docker host:
   ```bash
   git clone <new-repo-url> scorecard
   cd scorecard
   ```
2. Build and start the container:
   ```bash
   mkdir -p .cache
   docker compose up -d --build
   ```
3. Open the app in a browser:
   - `http://<docker-host>:3005`

### Updating the deployment
```bash
cd /srv/scorecard
git fetch
git pull
docker compose up -d --build
```
