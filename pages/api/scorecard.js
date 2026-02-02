import fs from 'node:fs';
import { getScorecardData } from '@/lib/scorecard';
import { getSessionIdFromCookie, getSessionPaths } from '@/lib/session';

export default function handler(req, res) {
  try {
    const cadence = Array.isArray(req.query?.cadence) ? req.query.cadence[0] : req.query?.cadence;
    const sessionId = getSessionIdFromCookie(req.headers?.cookie);
    let workbookPath;
    if (sessionId) {
      const sessionPaths = getSessionPaths(sessionId);
      if (fs.existsSync(sessionPaths.workbookPath)) {
        workbookPath = sessionPaths.workbookPath;
      }
    }
    const payload = getScorecardData({ cadence, workbookPath });
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
