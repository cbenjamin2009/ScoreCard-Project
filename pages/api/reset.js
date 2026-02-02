import fs from 'node:fs';
import path from 'node:path';
import { getScorecardData, resolveWorkbookPath } from '@/lib/scorecard';
import { clearSessionCookie, getSessionIdFromCookie, getSessionPaths } from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sessionId = getSessionIdFromCookie(req.headers?.cookie);
    if (sessionId) {
      const { dir } = getSessionPaths(sessionId);
      try {
        await fs.promises.rm(dir, { recursive: true, force: true });
      } catch {
        /* ignore delete errors */
      }
      clearSessionCookie(res);
    }

    const cadence = Array.isArray(req.query?.cadence) ? req.query.cadence[0] : req.query?.cadence;
    const defaultWorkbook = resolveWorkbookPath();
    const payload = getScorecardData({ cadence, workbookPath: defaultWorkbook });
    const stats = fs.existsSync(defaultWorkbook) ? fs.statSync(defaultWorkbook) : null;
    const updatedAt = stats?.mtime ? stats.mtime.toISOString() : new Date().toISOString();
    const displayName = path.basename(defaultWorkbook);

    return res.status(200).json({
      message: 'Session cleared. Showing default template.',
      data: payload,
      file: {
        name: displayName,
        updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Reset failed.' });
  }
}
