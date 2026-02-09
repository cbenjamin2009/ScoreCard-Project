import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';

const CADENCE_CONFIG = {
  weekly: {
    label: 'Weekly',
    sheetEnv: 'SCORECARD_WEEKLY_SHEET',
    rollingPeriods: 4,
  },
  monthly: {
    label: 'Monthly',
    sheetEnv: 'SCORECARD_MONTHLY_SHEET',
    rollingPeriods: null,
  },
};
const DEFAULT_CACHE_DIR = '.cache';
const CACHE_FILE_PREFIX = 'scorecard';
const CACHE_MODE_OFF = 'off';
const DEFAULT_TEMPLATE_PATH = path.join(process.cwd(), 'assets/samples/Scorecard Template.xlsx');

const sanitizeNumber = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isNaN(value) ? null : value;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  if (!cleaned) return null;
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parsePanicCell = (cellValue) => {
  if (!cellValue) {
    return { text: '', threshold: null, comparator: null, isPercent: false };
  }

  const text = String(cellValue).trim();
  const cleaned = text.replace(/^p:\s*/i, '').trim();
  const lower = cleaned.toLowerCase();
  const comparator = /more\s+than|greater\s+than|above/.test(lower)
    ? 'more'
    : /less\s+than|below/.test(lower)
      ? 'less'
      : null;
  const isPercent = /%/.test(cleaned);
  const rawThreshold = sanitizeNumber(cleaned);
  const threshold = rawThreshold === null ? null : isPercent ? rawThreshold / 100 : rawThreshold;

  if (comparator === null && threshold === 0) {
    return { text, threshold, comparator: 'more', isPercent };
  }

  return { text, threshold, comparator, isPercent };
};

const getCacheSettings = () => {
  const mode = (process.env.SCORECARD_CACHE_MODE || 'file').trim().toLowerCase();
  const enabled = mode !== CACHE_MODE_OFF;
  const dirSetting = process.env.SCORECARD_CACHE_DIR?.trim() || DEFAULT_CACHE_DIR;
  const dir = path.isAbsolute(dirSetting) ? dirSetting : path.join(process.cwd(), dirSetting);
  return { enabled, dir };
};

const getCacheContext = (workbookPath, sheetName, cadenceKey) => {
  const settings = getCacheSettings();
  if (!settings.enabled) {
    return { enabled: false };
  }

  const hash = crypto
    .createHash('sha1')
    .update(`${workbookPath}::${sheetName}::${cadenceKey || 'weekly'}`)
    .digest('hex');
  const filePath = path.join(settings.dir, `${CACHE_FILE_PREFIX}-${hash}.json`);

  return { enabled: true, filePath };
};

const readCachePayload = (context, workbookMeta, cadenceKey) => {
  if (!context.enabled || !context.filePath) return null;
  if (!fs.existsSync(context.filePath)) return null;

  try {
    const raw = fs.readFileSync(context.filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const meta = parsed.meta || {};

    if (
      meta.sourceMtimeMs !== workbookMeta.mtimeMs ||
      meta.workbookPath !== workbookMeta.path ||
      meta.sheetName !== workbookMeta.sheet ||
      meta.cadence !== cadenceKey
    ) {
      return null;
    }

    return parsed.payload;
  } catch {
    return null;
  }
};

const writeCachePayload = (context, workbookMeta, payload, cadenceKey) => {
  if (!context.enabled || !context.filePath) return;

  try {
    fs.mkdirSync(path.dirname(context.filePath), { recursive: true });
    const cacheBlob = {
      meta: {
        workbookPath: workbookMeta.path,
        sheetName: workbookMeta.sheet,
        sourceMtimeMs: workbookMeta.mtimeMs,
        cadence: cadenceKey,
        cachedAt: new Date().toISOString(),
      },
      payload,
    };
    fs.writeFileSync(context.filePath, JSON.stringify(cacheBlob, null, 2));
  } catch (error) {
    console.warn('[scorecard-cache] Unable to persist cache:', error.message);
  }
};

export const resolveWorkbookPath = () => {
  const configured = process.env.SOURCE_SPREADSHEET?.trim();
  const defaultPath = 'assets/Scorecard Template.xlsx';
  const candidate = configured || defaultPath;
  return path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
};

export const resolveTemplatePath = () => {
  const fallback = path.join(process.cwd(), 'assets/Scorecard Template.xlsx');
  return fs.existsSync(DEFAULT_TEMPLATE_PATH) ? DEFAULT_TEMPLATE_PATH : fallback;
};

const formatPeriodLabel = (value, cadence) => {
  if (value === undefined || value === null || value === '') return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed?.y && parsed?.m && parsed?.d) {
      const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  const text = String(value).trim();
  if (cadence === 'monthly' && text.length > 3) {
    return text;
  }
  return text;
};

const parsePeriodSortKey = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed?.y && parsed?.m && parsed?.d) {
      return Date.UTC(parsed.y, parsed.m - 1, parsed.d);
    }
  }
  return null;
};

const normalizeHeader = (value) => String(value || '').trim().toLowerCase();

const isMetricHeader = (value) => {
  const normalized = normalizeHeader(value);
  return (
    normalized === 'metric' ||
    normalized === 'metrics' ||
    normalized === 'metric name' ||
    normalized === 'metric names' ||
    normalized === 'kpi' ||
    normalized === 'kpis'
  );
};

const findHeaderIndex = (rows) => {
  let bestIndex = -1;
  let bestScore = -1;

  rows.forEach((row, index) => {
    if (!row) return;
    const labels = row.map(normalizeHeader);
    const metricIndex = labels.findIndex((cell) => isMetricHeader(cell));
    if (metricIndex === -1) return;

    let score = 1;
    if (labels.some((cell) => cell === 'category')) score += 1;
    if (labels.some((cell) => cell === 'description' || cell === 'desc')) score += 1;
    if (labels.some((cell) => cell.includes('panic'))) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
};

const findLastHeaderColumn = (headerRow, startIndex) => {
  for (let colIndex = headerRow.length - 1; colIndex >= startIndex; colIndex -= 1) {
    const cell = headerRow[colIndex];
    if (cell !== null && cell !== undefined && cell !== '') {
      return colIndex;
    }
  }
  return startIndex - 1;
};

const findLastDataColumn = (rows, headerIndex, startIndex, endIndex) => {
  for (let colIndex = endIndex; colIndex >= startIndex; colIndex -= 1) {
    for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      if (!row) continue;
      const cell = row[colIndex];
      if (cell !== null && cell !== undefined && cell !== '') {
        return colIndex;
      }
    }
  }
  return endIndex;
};

const buildColumnWindow = (rows, headerIndex, headerRow, cadenceConfig, headerIndexes) => {
  const { metricIndex, descriptionIndex, panicIndex } = headerIndexes;
  const metaIndexes = [metricIndex, descriptionIndex, panicIndex].filter((index) => index !== -1);
  const valueStart = metaIndexes.length ? Math.max(...metaIndexes) + 1 : 4;
  let valueEnd = findLastHeaderColumn(headerRow, valueStart);

  const averageIndex = headerRow.findIndex((cell) =>
    normalizeHeader(cell).startsWith('average'),
  );
  if (averageIndex !== -1) {
    valueEnd = averageIndex - 1;
  }
  if (valueEnd < valueStart) {
    valueEnd = valueStart;
  }

  if (Array.isArray(rows) && rows.length > headerIndex + 1) {
    const lastDataIndex = findLastDataColumn(rows, headerIndex, valueStart, valueEnd);
    valueEnd = Math.max(valueStart, lastDataIndex);
  }

  if (cadenceConfig?.rollingPeriods) {
    const windowStart = Math.max(valueStart, valueEnd - cadenceConfig.rollingPeriods + 1);
    return { valueStart: windowStart, valueEnd };
  }

  return { valueStart, valueEnd };
};

const extractMetricRows = (rows, cadence) => {
  const headerIndex = findHeaderIndex(rows);
  if (headerIndex === -1) {
    throw new Error('Unable to locate the "Metric" header row inside the worksheet.');
  }

  const headerRow = rows[headerIndex];
  const headerLabels = headerRow.map(normalizeHeader);
  const metricIndex = headerLabels.findIndex((cell) => isMetricHeader(cell));
  if (metricIndex === -1) {
    throw new Error(
      'Unable to locate the "Metric" header row inside the worksheet. Expected a header like "Metric", "Metric Name", or "KPI".',
    );
  }
  const categoryIndex = headerLabels.findIndex((cell) => cell === 'category');
  const descriptionIndex = headerLabels.findIndex((cell) => cell === 'description' || cell === 'desc');
  const panicIndex = headerLabels.findIndex((cell) => cell.includes('panic'));

  const cadenceConfig = CADENCE_CONFIG[cadence] || CADENCE_CONFIG.weekly;
  const { valueStart, valueEnd } = buildColumnWindow(rows, headerIndex, headerRow, cadenceConfig, {
    metricIndex,
    descriptionIndex,
    panicIndex,
  });
  const columns = [];
  for (let colIndex = valueStart; colIndex <= valueEnd; colIndex += 1) {
    const label = headerRow[colIndex];
    const formatted = formatPeriodLabel(label, cadence);
    columns.push({
      colIndex,
      label: formatted || (cadence === 'monthly' ? `Month ${colIndex - valueStart + 1}` : `Week ${colIndex - valueStart + 1}`),
      sortKey: cadence === 'weekly' ? parsePeriodSortKey(label) : null,
    });
  }

  let orderedColumns = columns;
  if (cadence === 'weekly' && columns.length > 1 && columns.every((col) => col.sortKey !== null)) {
    orderedColumns = [...columns].sort((a, b) => a.sortKey - b.sortKey);
  }

  const periodLabels = orderedColumns.map((col) => col.label);

  const metrics = [];
  let lastCategory = '';
  let hasSeenMetric = false;

  for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!row || row.every((cell) => cell === undefined || cell === null || cell === '')) {
      if (hasSeenMetric) {
        break;
      }
      continue;
    }

    if (categoryIndex !== -1 && row[categoryIndex]) {
      lastCategory = String(row[categoryIndex]).trim();
    }

    const metricName = row[metricIndex];
    if (!metricName) continue;

    hasSeenMetric = true;
    const hasPeriodData = orderedColumns.some((col) => {
      const rawValue = row[col.colIndex];
      return rawValue !== undefined && rawValue !== null && rawValue !== '';
    });
    if (!hasPeriodData) continue;

    const trimmedMetric = String(metricName).trim();
    const category = lastCategory || 'General';
    const description =
      descriptionIndex !== -1 && row[descriptionIndex] ? String(row[descriptionIndex]).trim() : '';
    const panic = panicIndex !== -1 ? parsePanicCell(row[panicIndex]) : parsePanicCell(null);

    const series = orderedColumns.map((col) => {
      const rawValue = row[col.colIndex];
      return {
        period: col.label,
        raw: rawValue === undefined || rawValue === null ? null : String(rawValue),
        value: sanitizeNumber(rawValue),
      };
    });

    const latestPoint = [...series].reverse().find((point) => point.raw !== null && point.raw !== '');
    const fallbackPeriod = periodLabels[periodLabels.length - 1] || 'Latest';
    const latest = latestPoint
      ? { ...latestPoint, display: latestPoint.raw }
      : { period: fallbackPeriod, raw: null, value: null, display: '—' };

    let status = 'unknown';
    if (panic.threshold !== null && panic.comparator && latest.value !== null) {
      if (panic.comparator === 'more') {
        status = latest.value > panic.threshold ? 'at-risk' : 'on-track';
      } else if (panic.comparator === 'less') {
        status = latest.value < panic.threshold ? 'at-risk' : 'on-track';
      }
    }

    metrics.push({
      id: slugify(`${category}-${trimmedMetric}`),
      category,
      name: trimmedMetric,
      description,
      panic,
      series,
      latest,
      status,
    });
  }

  const hasAnyPanic = metrics.some(
    (metric) => metric?.panic?.threshold !== null && metric?.panic?.comparator,
  );
  if (!hasAnyPanic) {
    metrics.forEach((metric) => {
      metric.status = 'on-track';
    });
  }

  return { metrics, periodLabels };
};

const resolveCadenceConfig = (cadence) => {
  const key = cadence && CADENCE_CONFIG[cadence] ? cadence : 'weekly';
  const config = CADENCE_CONFIG[key];
  const sheetName = process.env[config.sheetEnv]?.trim();
  return { key, sheetName, label: config.label };
};

const findSheetByKeyword = (sheetNames, keywords) => {
  const lowered = sheetNames.map((name) => ({ name, lower: name.toLowerCase() }));
  for (const keyword of keywords) {
    const match = lowered.find((sheet) => sheet.lower.includes(keyword));
    if (match) return match.name;
  }
  return null;
};

const detectAvailableCadences = (sheetNames, workbook) => {
  const detected = {
    weekly: Boolean(findSheetByKeyword(sheetNames, ['weekly', 'week'])),
    monthly: Boolean(findSheetByKeyword(sheetNames, ['monthly', 'month'])),
  };

  if (!workbook) return detected;

  const cadenceKeys = ['weekly', 'monthly'];
  cadenceKeys.forEach((cadenceKey) => {
    if (detected[cadenceKey]) return;
    const best = findBestMetricsForCadence(workbook, cadenceKey);
    if (best?.metrics?.length) {
      detected[cadenceKey] = true;
    }
  });

  return detected;
};

const extractMetricsForSheet = (worksheet, cadenceKey) => {
  if (!worksheet) return null;
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  const { metrics, periodLabels } = extractMetricRows(rows, cadenceKey);
  return { metrics, periodLabels };
};

const findBestMetricsForCadence = (workbook, cadenceKey) => {
  let best = null;

  for (const sheetName of workbook.SheetNames || []) {
    const worksheet = workbook.Sheets[sheetName];
    try {
      const result = extractMetricsForSheet(worksheet, cadenceKey);
      if (!result) continue;
      if (!best || result.metrics.length > best.metrics.length) {
        best = { ...result, sheetName, cadenceKey };
      }
    } catch {
      /* ignore sheets that do not match the expected header */
    }
  }

  return best;
};

const findBestMetrics = (workbook) => {
  let best = null;
  const cadences = ['weekly', 'monthly'];

  for (const sheetName of workbook.SheetNames || []) {
    const worksheet = workbook.Sheets[sheetName];
    for (const cadenceKey of cadences) {
      try {
        const result = extractMetricsForSheet(worksheet, cadenceKey);
        if (!result) continue;
        if (!best || result.metrics.length > best.metrics.length) {
          best = { ...result, sheetName, cadenceKey };
        }
      } catch {
        /* ignore sheets that do not match the expected header */
      }
    }
  }

  return best;
};

const resolveSheetName = ({ cadenceKey, sheetNames, configuredSheet }) => {
  if (configuredSheet) {
    if (sheetNames.includes(configuredSheet)) {
      return configuredSheet;
    }
    throw new Error(`Worksheet "${configuredSheet}" was not found. Available sheets: ${sheetNames.join(', ')}.`);
  }

  const weeklyMatch = findSheetByKeyword(sheetNames, ['weekly', 'week']);
  const monthlyMatch = findSheetByKeyword(sheetNames, ['monthly', 'month']);

  if (cadenceKey === 'weekly' && weeklyMatch) return weeklyMatch;
  if (cadenceKey === 'monthly' && monthlyMatch) return monthlyMatch;

  if (cadenceKey === 'weekly' && monthlyMatch && sheetNames.length === 2) {
    return sheetNames.find((name) => name !== monthlyMatch) || sheetNames[0];
  }

  if (cadenceKey === 'monthly' && weeklyMatch && sheetNames.length === 2) {
    return sheetNames.find((name) => name !== weeklyMatch) || sheetNames[1];
  }

  if (sheetNames.length === 1) {
    return sheetNames[0];
  }

  if (sheetNames.length === 2) {
    return cadenceKey === 'weekly' ? sheetNames[0] : sheetNames[1];
  }

  throw new Error(
    `Unable to determine the ${cadenceKey} worksheet. Rename a sheet to include "Weekly" or "Monthly", or set ${CADENCE_CONFIG[cadenceKey].sheetEnv}.`,
  );
};


export const getScorecardData = ({
  cadence = 'weekly',
  workbookPath: providedPath,
  allowFallback = true,
} = {}) => {
  const workbookPath = providedPath || resolveWorkbookPath();
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Spreadsheet not found at ${workbookPath}. Update SOURCE_SPREADSHEET to a valid file.`);
  }

  const workbookStats = fs.statSync(workbookPath);
  const workbook = XLSX.readFile(workbookPath, { cellDates: true });
  const sheetNames = workbook.SheetNames || [];
  const { key: requestedKey, sheetName: configuredSheet } = resolveCadenceConfig(cadence);
  const availableCadences = detectAvailableCadences(sheetNames, workbook);
  let cadenceKey = requestedKey;
  let cadenceFallback = false;

  let cadenceLabel = CADENCE_CONFIG[cadenceKey]?.label || CADENCE_CONFIG.weekly.label;
  let bestForRequested = null;
  let sheetName = null;

  try {
    sheetName = resolveSheetName({
      cadenceKey,
      sheetNames,
      configuredSheet,
    });
  } catch (error) {
    if (configuredSheet) {
      throw error;
    }
    bestForRequested = findBestMetricsForCadence(workbook, cadenceKey);
    if (!bestForRequested) {
      throw error;
    }
    sheetName = bestForRequested.sheetName;
  }
  let workbookMeta = { path: workbookPath, sheet: sheetName, mtimeMs: workbookStats.mtimeMs };
  let cacheContext = getCacheContext(workbookPath, sheetName, cadenceKey);

  const cachedPayload = readCachePayload(cacheContext, workbookMeta, cadenceKey);
  if (cachedPayload && Array.isArray(cachedPayload.metrics) && cachedPayload.metrics.length > 0) {
    return {
      ...cachedPayload,
      cadence: cadenceKey,
      cadenceLabel,
      cadenceFallback,
      availableCadences,
      cacheInfo: {
        status: 'hit',
        mode: cacheContext.enabled ? 'file' : 'off',
        filePath: cacheContext.filePath || null,
      },
      lastUpdatedAt: new Date(workbookStats.mtime).toISOString(),
    };
  }

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Worksheet "${sheetName}" was not found in ${workbookPath}.`);
  }

  let { metrics, periodLabels } = bestForRequested && bestForRequested.sheetName === sheetName
    ? bestForRequested
    : extractMetricsForSheet(worksheet, cadenceKey) || {
      metrics: [],
      periodLabels: [],
    };

  if (!configuredSheet && metrics.length === 0) {
    const bestForCadence = findBestMetricsForCadence(workbook, cadenceKey);
    if (bestForCadence && bestForCadence.metrics.length > 0) {
      metrics = bestForCadence.metrics;
      periodLabels = bestForCadence.periodLabels;
      sheetName = bestForCadence.sheetName;
      workbookMeta = { path: workbookPath, sheet: sheetName, mtimeMs: workbookStats.mtimeMs };
      cacheContext = getCacheContext(workbookPath, sheetName, cadenceKey);
    } else {
      const best = findBestMetrics(workbook);
      if (best && best.metrics.length > 0) {
        metrics = best.metrics;
        periodLabels = best.periodLabels;
        cadenceKey = best.cadenceKey;
        cadenceLabel = CADENCE_CONFIG[cadenceKey]?.label || CADENCE_CONFIG.weekly.label;
        sheetName = best.sheetName;
        cadenceFallback = true;
        workbookMeta = { path: workbookPath, sheet: sheetName, mtimeMs: workbookStats.mtimeMs };
        cacheContext = getCacheContext(workbookPath, sheetName, cadenceKey);
      }
    }
  }

  if (allowFallback && providedPath && workbookPath !== resolveWorkbookPath() && metrics.length === 0) {
    return getScorecardData({ cadence, workbookPath: resolveWorkbookPath(), allowFallback: false });
  }

  const payload = {
    sheetName,
    source: workbookPath,
    generatedAt: new Date().toISOString(),
    cadence: cadenceKey,
    cadenceLabel,
    cadenceFallback,
    availableCadences: availableCadences.weekly || availableCadences.monthly
      ? availableCadences
      : { weekly: cadenceKey === 'weekly', monthly: cadenceKey === 'monthly' },
    periods: periodLabels,
    metrics,
  };

  writeCachePayload(cacheContext, workbookMeta, payload, cadenceKey);

  return {
    ...payload,
    cacheInfo: {
      status: cacheContext.enabled ? 'miss' : 'disabled',
      mode: cacheContext.enabled ? 'file' : 'off',
      filePath: cacheContext.filePath || null,
    },
    lastUpdatedAt: new Date(workbookStats.mtime).toISOString(),
  };
};
