# IT Scorecard Dashboard

Next.js application that reads the `Weekly EOS Scorecard` worksheet from the provided Excel workbook (`assets/IT Scorecard.xlsx`) and renders the data in an interactive dashboard with cards, tables, and charts.

## Prerequisites

- Node.js 18+
- Local copy of the spreadsheet under `assets/IT Scorecard.xlsx` (update `SOURCE_SPREADSHEET` in `.env` if yours lives elsewhere)

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

## Architecture Notes

- Backend parsing logic lives in `lib/scorecard.js`. It uses `xlsx` to ingest the workbook, normalizes categories/metrics, and exposes `getScorecardData()` for both API routes and server-side rendering.
- API route `pages/api/scorecard.js` returns the parsed JSON payload should you want to integrate with other front-ends.
- The UI lives in `pages/index.jsx` and composes reusable components under `components/` (`ScorecardDashboard`, `MetricCard`, `MetricChart`) with styling in `styles/globals.css`.
- Charts rely on `react-chartjs-2`/`chart.js`. If you deploy beyond local, consider persisting the parsed results or protecting the workbook path with environment variables.
- Parsed workbook data is cached to JSON files under `.cache/` by default to avoid re-reading the spreadsheet on each request. The cache automatically invalidates when the source Excel file changes.

## UI Controls & Refresh

- Search, category pills, and status toggles live at the top of the dashboard so you can quickly narrow the metrics list (all grids respect the active filters).
- Use the “Refresh data” button whenever the Excel workbook is updated; it calls `/api/scorecard` and rehydrates the dashboard without a page reload. Errors surface inline.
- Toggle dark/light themes via the provided button (the preference, along with filters/search, is persisted in `localStorage`).
- Metric cards now include inline sparklines so you can quickly see the recent trend for each KPI without opening the full chart. The header shows the last refresh timestamp, the workbook’s last modified time, and a relative “x mins ago” badge so stakeholders can judge data freshness at a glance.
- Drag-and-drop a new workbook (or click to browse) in the “Upload updated workbook” panel; uploads are handled by `/api/upload`, the file overwrites `SOURCE_SPREADSHEET`, and the dashboard refreshes automatically on success.

## Configuration

- `SOURCE_SPREADSHEET` – absolute or relative path to the Excel workbook.
- `SCORECARD_CACHE_MODE` – `file` (default) writes cache files; set to `off` to disable caching.
- `SCORECARD_CACHE_DIR` – directory for cache artifacts (defaults to `.cache`).
- `SCORECARD_SHEET_NAME` – override the worksheet name if it differs from `Weekly EOS Scorecard`.
- Run `npm run cache:clear` whenever you need to force a refresh without changing the workbook.
