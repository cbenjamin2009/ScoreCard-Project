import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { afterEach, describe, expect, it } from 'vitest';
import { getScorecardData } from '../../lib/scorecard.js';

const WORKSHEET = 'EOS 2026';

const createWorkbookFile = ({ rows, sheetName = WORKSHEET }) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scorecard-'));
  const filePath = path.join(tmpDir, 'scorecard.xlsx');
  XLSX.writeFile(workbook, filePath);
  return filePath;
};

let filesToCleanup = [];
let tempDirs = [];

const cleanup = () => {
  filesToCleanup.forEach((filePath) => {
    try {
      fs.rmSync(path.dirname(filePath), { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });
  tempDirs.forEach((dirPath) => {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });
  filesToCleanup = [];
  tempDirs = [];
  delete process.env.SOURCE_SPREADSHEET;
  delete process.env.SCORECARD_CACHE_DIR;
  delete process.env.SCORECARD_CACHE_MODE;
  delete process.env.SCORECARD_WEEKLY_SHEET;
  delete process.env.SCORECARD_MONTHLY_SHEET;
};

afterEach(() => {
  cleanup();
});

describe('getScorecardData', () => {
  it('parses metrics and classifies status relative to panic threshold', () => {
    const filePath = createWorkbookFile({
      rows: [
        [null, 'Heading'],
        [],
        ['Category', 'Metric', 'Description', 'Panic #', 'Week 1', 'Week 2'],
        ['Tickets', 'Tickets Opened', 'New tickets', 'P: More than 50', '45', '55'],
        [null, 'Tickets Closed', 'Closed tickets', 'P: Less than 50', '60', '40'],
      ],
    });
    filesToCleanup.push(filePath);
    process.env.SOURCE_SPREADSHEET = filePath;
    process.env.SCORECARD_WEEKLY_SHEET = WORKSHEET;

    const result = getScorecardData({ cadence: 'weekly' });
    expect(result.metrics).toHaveLength(2);

    const opened = result.metrics.find((metric) => metric.name === 'Tickets Opened');
    expect(opened).toBeDefined();
    expect(opened.category).toBe('Tickets');
    expect(opened.series).toHaveLength(2);
    expect(opened.status).toBe('at-risk');
    expect(opened.latest.period).toBe('Week 2');
    expect(opened.latest.raw).toBe('55');

    const closed = result.metrics.find((metric) => metric.name === 'Tickets Closed');
    expect(closed.status).toBe('at-risk');
    expect(closed.series[0].period).toBe('Week 1');
  });

  it('throws when the expected worksheet is missing', () => {
    const filePath = createWorkbookFile({
      sheetName: 'Another Sheet',
      rows: [
        ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
        ['Group', 'Sample Metric', 'Desc', 'P: More than 50', '42'],
      ],
    });
    filesToCleanup.push(filePath);
    process.env.SOURCE_SPREADSHEET = filePath;
    process.env.SCORECARD_WEEKLY_SHEET = WORKSHEET;

    expect(() => getScorecardData({ cadence: 'weekly' })).toThrow(/Worksheet "EOS 2026"/);
  });

  it('serves cached payload when workbook is unchanged', () => {
    const filePath = createWorkbookFile({
      rows: [
        ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
        ['Tickets', 'Opened', 'Desc', 'P: More than 50', '40'],
      ],
    });
    filesToCleanup.push(filePath);
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-dir-'));
    tempDirs.push(cacheDir);

    process.env.SOURCE_SPREADSHEET = filePath;
    process.env.SCORECARD_CACHE_DIR = cacheDir;

    process.env.SCORECARD_WEEKLY_SHEET = WORKSHEET;
    const first = getScorecardData({ cadence: 'weekly' });
    const second = getScorecardData({ cadence: 'weekly' });

    expect(first.metrics[0].latest.raw).toBe('40');
    expect(second.generatedAt).toBe(first.generatedAt);
    expect(second.cacheInfo?.status).toBe('hit');
    const cacheFiles = fs.readdirSync(cacheDir);
    expect(cacheFiles.some((file) => file.endsWith('.json'))).toBe(true);
  });

  it('invalidates cache when workbook changes', () => {
    const filePath = createWorkbookFile({
      rows: [
        ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
        ['Tickets', 'Opened', 'Desc', 'P: More than 50', '40'],
      ],
    });
    filesToCleanup.push(filePath);
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-dir-'));
    tempDirs.push(cacheDir);

    process.env.SOURCE_SPREADSHEET = filePath;
    process.env.SCORECARD_CACHE_DIR = cacheDir;

    process.env.SCORECARD_WEEKLY_SHEET = WORKSHEET;
    const first = getScorecardData({ cadence: 'weekly' });
    expect(first.metrics[0].latest.raw).toBe('40');
    expect(first.cacheInfo?.status).toBe('miss');

    // Rewrite workbook with updated value to bump mtime and content.
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Category', 'Metric', 'Description', 'Panic #', 'Week 1'],
      ['Tickets', 'Opened', 'Desc', 'P: More than 50', '55'],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, WORKSHEET);
    XLSX.writeFile(workbook, filePath);
    const future = new Date(Date.now() + 1000);
    fs.utimesSync(filePath, future, future);

    const second = getScorecardData({ cadence: 'weekly' });
    expect(second.metrics[0].latest.raw).toBe('55');
    expect(second.cacheInfo?.status).toBe('miss');
  });
});
