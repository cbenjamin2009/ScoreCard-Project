module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/xlsx [external] (xlsx, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("xlsx", () => require("xlsx"));

module.exports = mod;
}),
"[project]/lib/scorecard.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getScorecardData",
    ()=>getScorecardData,
    "resolveWorkbookPath",
    ()=>resolveWorkbookPath
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$xlsx__$5b$external$5d$__$28$xlsx$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/xlsx [external] (xlsx, cjs)");
;
;
;
;
const CADENCE_CONFIG = {
    weekly: {
        label: 'Weekly',
        defaultSheet: 'EOS 2026',
        sheetEnv: 'SCORECARD_WEEKLY_SHEET',
        rollingPeriods: 4
    },
    monthly: {
        label: 'Monthly',
        defaultSheet: 'IT Monthly 2026',
        sheetEnv: 'SCORECARD_MONTHLY_SHEET',
        rollingPeriods: null
    }
};
const DEFAULT_CACHE_DIR = '.cache';
const CACHE_FILE_PREFIX = 'scorecard';
const CACHE_MODE_OFF = 'off';
const sanitizeNumber = (value)=>{
    if (value === undefined || value === null) return null;
    if (typeof value === 'number') return Number.isNaN(value) ? null : value;
    const cleaned = String(value).replace(/[^0-9.-]/g, '');
    if (!cleaned) return null;
    const parsed = Number.parseFloat(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
};
const slugify = (value)=>String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const parsePanicCell = (cellValue)=>{
    if (!cellValue) {
        return {
            text: '',
            threshold: null,
            comparator: null,
            isPercent: false
        };
    }
    const text = String(cellValue).trim();
    const cleaned = text.replace(/^p:\s*/i, '').trim();
    const lower = cleaned.toLowerCase();
    const comparator = /more\s+than/.test(lower) ? 'more' : /less\s+than/.test(lower) ? 'less' : null;
    const isPercent = /%/.test(cleaned);
    const rawThreshold = sanitizeNumber(cleaned);
    const threshold = rawThreshold === null ? null : isPercent ? rawThreshold / 100 : rawThreshold;
    return {
        text,
        threshold,
        comparator,
        isPercent
    };
};
const getCacheSettings = ()=>{
    const mode = (process.env.SCORECARD_CACHE_MODE || 'file').trim().toLowerCase();
    const enabled = mode !== CACHE_MODE_OFF;
    const dirSetting = process.env.SCORECARD_CACHE_DIR?.trim() || DEFAULT_CACHE_DIR;
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(dirSetting) ? dirSetting : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), dirSetting);
    return {
        enabled,
        dir
    };
};
const getCacheContext = (workbookPath, sheetName)=>{
    const settings = getCacheSettings();
    if (!settings.enabled) {
        return {
            enabled: false
        };
    }
    const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHash('sha1').update(`${workbookPath}::${sheetName}`).digest('hex');
    const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(settings.dir, `${CACHE_FILE_PREFIX}-${hash}.json`);
    return {
        enabled: true,
        filePath
    };
};
const readCachePayload = (context, workbookMeta)=>{
    if (!context.enabled || !context.filePath) return null;
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(context.filePath)) return null;
    try {
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync(context.filePath, 'utf8');
        const parsed = JSON.parse(raw);
        const meta = parsed.meta || {};
        if (meta.sourceMtimeMs !== workbookMeta.mtimeMs || meta.workbookPath !== workbookMeta.path || meta.sheetName !== workbookMeta.sheet) {
            return null;
        }
        return parsed.payload;
    } catch  {
        return null;
    }
};
const writeCachePayload = (context, workbookMeta, payload)=>{
    if (!context.enabled || !context.filePath) return;
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].mkdirSync(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].dirname(context.filePath), {
            recursive: true
        });
        const cacheBlob = {
            meta: {
                workbookPath: workbookMeta.path,
                sheetName: workbookMeta.sheet,
                sourceMtimeMs: workbookMeta.mtimeMs,
                cachedAt: new Date().toISOString()
            },
            payload
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].writeFileSync(context.filePath, JSON.stringify(cacheBlob, null, 2));
    } catch (error) {
        console.warn('[scorecard-cache] Unable to persist cache:', error.message);
    }
};
const resolveWorkbookPath = ()=>{
    const configured = process.env.SOURCE_SPREADSHEET?.trim();
    const defaultPath = 'assets/IT Scorecard 2026.xlsx';
    const candidate = configured || defaultPath;
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(candidate) ? candidate : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), candidate);
};
const formatPeriodLabel = (value, cadence)=>{
    if (value === undefined || value === null || value === '') return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    if (typeof value === 'number') {
        const parsed = __TURBOPACK__imported__module__$5b$externals$5d2f$xlsx__$5b$external$5d$__$28$xlsx$2c$__cjs$29$__["SSF"].parse_date_code(value);
        if (parsed?.y && parsed?.m && parsed?.d) {
            const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    }
    const text = String(value).trim();
    if (cadence === 'monthly' && text.length > 3) {
        return text;
    }
    return text;
};
const findHeaderIndex = (rows)=>rows.findIndex((row)=>{
        const metricLabel = String(row?.[1] || '').trim().toLowerCase();
        const panicLabel = String(row?.[3] || '').trim().toLowerCase();
        return metricLabel === 'metric' && panicLabel.includes('panic');
    });
const findLastDataColumn = (rows, headerIndex, startIndex)=>{
    let lastIndex = startIndex;
    for(let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1){
        const row = rows[rowIndex];
        if (!row) continue;
        for(let colIndex = startIndex; colIndex < row.length; colIndex += 1){
            const cell = row[colIndex];
            if (cell !== null && cell !== undefined && cell !== '') {
                lastIndex = Math.max(lastIndex, colIndex);
            }
        }
    }
    return lastIndex;
};
const buildColumnWindow = (headerRow, rows, headerIndex, cadenceConfig)=>{
    const panicIndex = headerRow.findIndex((cell)=>String(cell || '').toLowerCase().includes('panic'));
    const valueStart = panicIndex === -1 ? 4 : panicIndex + 1;
    let valueEnd = headerRow.length - 1;
    const averageIndex = headerRow.findIndex((cell)=>String(cell || '').trim().toLowerCase().startsWith('average'));
    if (averageIndex !== -1) {
        valueEnd = averageIndex - 1;
    }
    const lastDataIndex = findLastDataColumn(rows, headerIndex, valueStart);
    if (lastDataIndex >= valueStart) {
        valueEnd = Math.min(valueEnd, lastDataIndex);
    }
    if (cadenceConfig?.rollingPeriods) {
        const windowStart = Math.max(valueStart, valueEnd - cadenceConfig.rollingPeriods + 1);
        return {
            valueStart: windowStart,
            valueEnd
        };
    }
    return {
        valueStart,
        valueEnd
    };
};
const extractMetricRows = (rows, cadence)=>{
    const headerIndex = findHeaderIndex(rows);
    if (headerIndex === -1) {
        throw new Error('Unable to locate the "Metric" header row inside the worksheet.');
    }
    const headerRow = rows[headerIndex];
    const cadenceConfig = CADENCE_CONFIG[cadence] || CADENCE_CONFIG.weekly;
    const { valueStart, valueEnd } = buildColumnWindow(headerRow, rows, headerIndex, cadenceConfig);
    const periodLabels = headerRow.slice(valueStart, valueEnd + 1).map((label, idx)=>{
        const formatted = formatPeriodLabel(label, cadence);
        if (formatted) return formatted;
        return cadence === 'monthly' ? `Month ${idx + 1}` : `Week ${idx + 1}`;
    });
    const metrics = [];
    let lastCategory = '';
    for(let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1){
        const row = rows[rowIndex];
        if (!row || row.every((cell)=>cell === undefined || cell === null || cell === '')) {
            continue;
        }
        if (row[0]) {
            lastCategory = String(row[0]).trim();
        }
        const metricName = row[1];
        if (!metricName) continue;
        const trimmedMetric = String(metricName).trim();
        const category = lastCategory || 'General';
        const description = row[2] ? String(row[2]).trim() : '';
        const panic = parsePanicCell(row[3]);
        const series = periodLabels.map((label, periodIdx)=>{
            const rawValue = row[valueStart + periodIdx];
            return {
                period: label,
                raw: rawValue === undefined || rawValue === null ? null : String(rawValue),
                value: sanitizeNumber(rawValue)
            };
        });
        const latestPoint = [
            ...series
        ].reverse().find((point)=>point.raw !== null && point.raw !== '');
        const fallbackPeriod = periodLabels[periodLabels.length - 1] || 'Latest';
        const latest = latestPoint ? {
            ...latestPoint,
            display: latestPoint.raw
        } : {
            period: fallbackPeriod,
            raw: null,
            value: null,
            display: '—'
        };
        let status = 'unknown';
        if (latest.value !== null && panic.threshold !== null && panic.comparator) {
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
            status
        });
    }
    return {
        metrics,
        periodLabels
    };
};
const resolveCadenceConfig = (cadence)=>{
    const key = cadence && CADENCE_CONFIG[cadence] ? cadence : 'weekly';
    const config = CADENCE_CONFIG[key];
    const sheetName = process.env[config.sheetEnv]?.trim() || config.defaultSheet;
    return {
        key,
        sheetName,
        label: config.label
    };
};
const getScorecardData = ({ cadence = 'weekly' } = {})=>{
    const workbookPath = resolveWorkbookPath();
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(workbookPath)) {
        throw new Error(`Spreadsheet not found at ${workbookPath}. Update SOURCE_SPREADSHEET to a valid file.`);
    }
    const { key: cadenceKey, sheetName, label: cadenceLabel } = resolveCadenceConfig(cadence);
    const workbookStats = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].statSync(workbookPath);
    const workbookMeta = {
        path: workbookPath,
        sheet: sheetName,
        mtimeMs: workbookStats.mtimeMs
    };
    const cacheContext = getCacheContext(workbookPath, sheetName);
    const cachedPayload = readCachePayload(cacheContext, workbookMeta);
    if (cachedPayload) {
        return {
            ...cachedPayload,
            cadence: cadenceKey,
            cadenceLabel,
            cacheInfo: {
                status: 'hit',
                mode: cacheContext.enabled ? 'file' : 'off',
                filePath: cacheContext.filePath || null
            },
            lastUpdatedAt: new Date(workbookStats.mtime).toISOString()
        };
    }
    const workbook = __TURBOPACK__imported__module__$5b$externals$5d2f$xlsx__$5b$external$5d$__$28$xlsx$2c$__cjs$29$__["readFile"](workbookPath, {
        cellDates: true
    });
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" was not found in ${workbookPath}.`);
    }
    const rows = __TURBOPACK__imported__module__$5b$externals$5d2f$xlsx__$5b$external$5d$__$28$xlsx$2c$__cjs$29$__["utils"].sheet_to_json(worksheet, {
        header: 1,
        defval: null
    });
    const { metrics, periodLabels } = extractMetricRows(rows, cadenceKey);
    const payload = {
        sheetName,
        source: workbookPath,
        generatedAt: new Date().toISOString(),
        cadence: cadenceKey,
        cadenceLabel,
        periods: periodLabels,
        metrics
    };
    writeCachePayload(cacheContext, workbookMeta, payload);
    return {
        ...payload,
        cacheInfo: {
            status: cacheContext.enabled ? 'miss' : 'disabled',
            mode: cacheContext.enabled ? 'file' : 'off',
            filePath: cacheContext.filePath || null
        },
        lastUpdatedAt: new Date(workbookStats.mtime).toISOString()
    };
};
}),
"[project]/pages/api/scorecard.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scorecard$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scorecard.js [api] (ecmascript)");
;
function handler(req, res) {
    try {
        const cadence = Array.isArray(req.query?.cadence) ? req.query.cadence[0] : req.query?.cadence;
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scorecard$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getScorecardData"])({
            cadence
        });
        res.status(200).json(payload);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1dc829cb._.js.map