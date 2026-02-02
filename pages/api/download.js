import fs from 'node:fs';
import path from 'node:path';
import { resolveWorkbookPath } from '@/lib/scorecard';
import { getSessionIdFromCookie, getSessionPaths, readSessionMeta } from '@/lib/session';

export default function handler(req, res) {
  try {
    const sessionId = getSessionIdFromCookie(req.headers?.cookie);
    let workbookPath = resolveWorkbookPath();
    let meta = null;
    if (sessionId) {
      const sessionPaths = getSessionPaths(sessionId);
      if (fs.existsSync(sessionPaths.workbookPath)) {
        workbookPath = sessionPaths.workbookPath;
        meta = readSessionMeta(sessionId);
      }
    }
    if (!fs.existsSync(workbookPath)) {
      return res.status(404).json({ message: 'Workbook not found.' });
    }

    const fileName = meta?.name || path.basename(workbookPath);
    const stats = fs.statSync(workbookPath);
    if (req.query?.meta) {
      return res.status(200).json({
        name: fileName,
        updatedAt: stats.mtime.toISOString(),
      });
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(workbookPath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
