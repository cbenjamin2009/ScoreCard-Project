# Deployment Checklist

## Pre-Deployment
- Confirm `SOURCE_SPREADSHEET` points to the intended workbook.
- Ensure the workbook exists on the host (Docker: `/srv/scorecard/assets/Scorecard Template.xlsx`).
- Verify `.cache/` is writable (or set `SCORECARD_CACHE_MODE=off`).
- Run tests:
  - `npm test`
  - `npm run cy:run`
- Review dependency risks: `npm audit` (note any high-severity items in release notes).

## Deploy (Docker)
1. Pull latest code on the host:
   ```bash
   cd /srv/scorecard
   git fetch
   git pull
   ```
2. Build + run:
   ```bash
   docker compose up -d --build
   ```
3. Confirm the service:
   - `http://<host>:3005`

## Post-Deployment Verification
- Load the dashboard and confirm metrics render.
- Switch cadence (Weekly/Monthly) and confirm the header updates.
- Upload a workbook and verify the session-only behavior.
- Click “Reset template” and confirm the default template returns.

## Rollback
1. Revert to previous commit:
   ```bash
   git checkout <previous-commit>
   docker compose up -d --build
   ```
