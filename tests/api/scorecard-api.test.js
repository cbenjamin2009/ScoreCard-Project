import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { afterEach, describe, expect, it } from 'vitest';
import handler from '../../pages/api/scorecard.js';
import { getSessionPaths } from '../../lib/session.js';

const createWorkbookFileAt = (filePath, rows, sheetName = 'Weekly') => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  XLSX.writeFile(workbook, filePath);
};

const createTempWorkbook = (rows, sheetName = 'Weekly') => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scorecard-api-'));
  const filePath = path.join(tmpDir, 'scorecard.xlsx');
  createWorkbookFileAt(filePath, rows, sheetName);
  return filePath;
};

const makeRes = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
};

const sessionId = '11111111-1111-1111-1111-111111111111';
const pathsToCleanup = [];

afterEach(() => {
  pathsToCleanup.forEach((entry) => {
    try {
      fs.rmSync(entry, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });
  pathsToCleanup.length = 0;
  delete process.env.SOURCE_SPREADSHEET;
  delete process.env.SCORECARD_CACHE_MODE;
});

describe('/api/scorecard', () => {
  it('uses the session workbook when a valid session cookie exists', () => {
    const { dir, workbookPath } = getSessionPaths(sessionId);
    createWorkbookFileAt(
      workbookPath,
      [
        ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
        ['Tickets', 'Opened', 'Desc', 'P: More than 50', '47'],
      ],
      'Weekly',
    );
    pathsToCleanup.push(dir);

    const defaultWorkbook = createTempWorkbook([
      ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
      ['Tickets', 'Opened', 'Desc', 'P: More than 50', '99'],
    ]);
    pathsToCleanup.push(path.dirname(defaultWorkbook));
    process.env.SOURCE_SPREADSHEET = defaultWorkbook;
    process.env.SCORECARD_CACHE_MODE = 'off';

    const req = {
      query: { cadence: 'weekly' },
      headers: { cookie: `scorecard-session=${sessionId}` },
    };
    const res = makeRes();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body?.metrics?.[0]?.latest?.raw).toBe('47');
  });

  it('falls back to the default workbook when no session exists', () => {
    const defaultWorkbook = createTempWorkbook([
      ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
      ['Tickets', 'Opened', 'Desc', 'P: More than 50', '88'],
    ]);
    pathsToCleanup.push(path.dirname(defaultWorkbook));
    process.env.SOURCE_SPREADSHEET = defaultWorkbook;
    process.env.SCORECARD_CACHE_MODE = 'off';

    const req = {
      query: { cadence: 'weekly' },
      headers: { cookie: '' },
    };
    const res = makeRes();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body?.metrics?.[0]?.latest?.raw).toBe('88');
  });
});
