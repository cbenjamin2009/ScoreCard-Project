module.exports = [
"[project]/components/MetricCard.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const formatNumber = (value, fallback = '—')=>{
    if (value === null || value === undefined || value === '') return fallback;
    if (Number.isFinite(value)) return value.toLocaleString();
    return value;
};
const formatDelta = (latestValue, goalValue)=>{
    if (latestValue === null || latestValue === undefined) return null;
    if (goalValue === null || goalValue === undefined) return null;
    const delta = latestValue - goalValue;
    if (!Number.isFinite(delta) || delta === 0) return null;
    const prefix = delta > 0 ? '+' : '';
    return `${prefix}${delta.toFixed(1)}`;
};
const SPARKLINE_WIDTH = 140;
const SPARKLINE_HEIGHT = 36;
const STATUS_COLORS = {
    'on-track': '#22c55e',
    'at-risk': '#f97316',
    unknown: '#94a3b8'
};
const buildSparklinePath = (series = [])=>{
    if (!series.length) return '';
    const values = series.map((point)=>Number.isFinite(point?.value) ? Number(point.value) : null);
    const validValues = values.filter((value)=>value !== null);
    if (!validValues.length) {
        const midY = SPARKLINE_HEIGHT / 2;
        return `M 0 ${midY} L ${SPARKLINE_WIDTH} ${midY}`;
    }
    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const range = max - min || 1;
    const step = series.length > 1 ? SPARKLINE_WIDTH / (series.length - 1) : SPARKLINE_WIDTH;
    let path = '';
    let prevY = SPARKLINE_HEIGHT / 2;
    values.forEach((value, idx)=>{
        const x = idx * step;
        const y = value === null ? prevY : SPARKLINE_HEIGHT - (value - min) / range * SPARKLINE_HEIGHT || SPARKLINE_HEIGHT / 2;
        if (idx === 0) {
            path = `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }
        prevY = y;
    });
    return path;
};
const MetricSparkline = ({ series, status })=>{
    if (!series?.length) return null;
    const path = buildSparklinePath(series);
    const stroke = STATUS_COLORS[status] || STATUS_COLORS.unknown;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
        className: "metric-card__sparkline-chart",
        width: SPARKLINE_WIDTH,
        height: SPARKLINE_HEIGHT,
        viewBox: `0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`,
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": "Recent trend sparkline",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
            d: path,
            fill: "none",
            stroke: stroke,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/components/MetricCard.jsx",
            lineNumber: 71,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/MetricCard.jsx",
        lineNumber: 62,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function MetricCard({ metric }) {
    if (!metric) return null;
    const delta = formatDelta(metric.latest.value, metric.targetValue);
    const statusClass = metric.status === 'on-track' ? 'status-on-track' : metric.status === 'at-risk' ? 'status-at-risk' : 'status-unknown';
    const latestWeek = metric.latest?.week || '—';
    const latestValue = metric.latest?.display || formatNumber(metric.latest?.raw);
    const sparklineSeries = metric.series?.slice(-12);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
        className: `metric-card ${statusClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "metric-card__category",
                children: metric.category
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "metric-card__title",
                children: metric.name
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "metric-card__values",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "label",
                                children: [
                                    "Latest (",
                                    latestWeek,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: latestValue
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "label",
                                children: "Goal"
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: metric.goal.goal || metric.goal.text || '—'
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            sparklineSeries?.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "metric-card__sparkline",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(MetricSparkline, {
                    series: sparklineSeries,
                    status: metric.status || 'unknown'
                }, void 0, false, {
                    fileName: "[project]/components/MetricCard.jsx",
                    lineNumber: 101,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: "metric-card__footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "status-pill",
                        children: (metric.status || 'unknown').replace('-', ' ')
                    }, void 0, false, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    delta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "metric-card__delta",
                        children: [
                            delta,
                            " vs goal"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 106,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MetricCard.jsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
"[externals]/chart.js [external] (chart.js, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("chart.js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/react-chartjs-2 [external] (react-chartjs-2, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-chartjs-2");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/components/MetricChart.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>MetricChart
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/chart.js [external] (chart.js, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-chartjs-2 [external] (react-chartjs-2, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Chart"].register(__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["CategoryScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["LinearScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["PointElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["LineElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Tooltip"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Legend"]);
const buildDataset = (metric)=>{
    const labels = metric.series.map((point)=>point.week);
    const data = metric.series.map((point)=>point.value);
    const datasets = [
        {
            label: metric.name,
            data,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            borderWidth: 2,
            fill: true,
            spanGaps: true,
            tension: 0.35,
            pointRadius: 3
        }
    ];
    if (metric.targetValue !== null && metric.targetValue !== undefined) {
        datasets.push({
            label: 'Goal',
            data: labels.map(()=>metric.targetValue),
            borderColor: '#9ca3af',
            borderDash: [
                6,
                6
            ],
            borderWidth: 1,
            pointRadius: 0,
            fill: false
        });
    }
    return {
        labels,
        datasets
    };
};
function MetricChart({ metric }) {
    const chartConfig = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>buildDataset(metric), [
        metric
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "metric-chart",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__["Line"], {
            data: chartConfig,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context)=>{
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                if (value === null) return `${label}: —`;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(75,85,99,0.15)'
                        },
                        ticks: {
                            callback: (value)=>value
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        }, void 0, false, {
            fileName: "[project]/components/MetricChart.jsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MetricChart.jsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/UploadPanel.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const MAX_SIZE_BYTES = 50 * 1024 * 1024;
const readableSize = (bytes)=>{
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
function UploadPanel({ onSuccess }) {
    const inputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [variant, setVariant] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('muted');
    const resetState = ()=>{
        setIsDragging(false);
        setIsUploading(false);
    };
    const handleUpload = async (file)=>{
        if (!file) return;
        if (!file.name.endsWith('.xlsx')) {
            setVariant('error');
            setMessage('Only .xlsx files are supported.');
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            setVariant('error');
            setMessage(`File is too large. Max size is ${readableSize(MAX_SIZE_BYTES)}.`);
            return;
        }
        const formData = new FormData();
        formData.append('workbook', file);
        try {
            setIsUploading(true);
            setVariant('muted');
            setMessage('Uploading workbook...');
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }
            setVariant('success');
            setMessage('Upload complete. Dashboard refreshed.');
            if (onSuccess) {
                onSuccess(result.data);
            }
        } catch (error) {
            setVariant('error');
            setMessage(error.message);
        } finally{
            setIsUploading(false);
        }
    };
    const handleFiles = (files)=>{
        if (files?.length) {
            handleUpload(files[0]);
        }
    };
    const handleDrop = (event)=>{
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer?.files?.length) {
            handleUpload(event.dataTransfer.files[0]);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "upload-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "upload-panel__title",
                children: "Upload updated workbook"
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "Drag & drop a new .xlsx file or use the button below."
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `upload-dropzone ${isDragging ? 'upload-dropzone--active' : ''}`,
                onDragEnter: (event)=>{
                    event.preventDefault();
                    setIsDragging(true);
                },
                onDragOver: (event)=>event.preventDefault(),
                onDragLeave: (event)=>{
                    event.preventDefault();
                    setIsDragging(false);
                },
                onDrop: handleDrop,
                role: "button",
                tabIndex: 0,
                onKeyDown: (event)=>{
                    if (event.key === 'Enter' && inputRef.current) {
                        inputRef.current.click();
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: "Drop file here"
                    }, void 0, false, {
                        fileName: "[project]/components/UploadPanel.jsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: [
                            ".xlsx up to ",
                            readableSize(MAX_SIZE_BYTES)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/UploadPanel.jsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "ghost-button",
                        onClick: ()=>{
                            resetState();
                            inputRef.current?.click();
                        },
                        children: "Select from computer"
                    }, void 0, false, {
                        fileName: "[project]/components/UploadPanel.jsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "file",
                        accept: ".xlsx",
                        ref: inputRef,
                        hidden: true,
                        onChange: (event)=>{
                            if (event.target.files?.length) {
                                handleFiles(event.target.files);
                                event.target.value = '';
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/UploadPanel.jsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            isUploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "Uploading..."
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 128,
                columnNumber: 23
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: `upload-panel__message upload-panel__message--${variant}`,
                children: message
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 129,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/UploadPanel.jsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/metrics.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STATUS_ORDER",
    ()=>STATUS_ORDER,
    "filterMetrics",
    ()=>filterMetrics,
    "getMetricCategories",
    ()=>getMetricCategories
]);
const normalizeTerm = (value)=>value.trim().toLowerCase();
const getMetricCategories = (metrics = [])=>{
    const set = new Set();
    metrics.forEach((metric)=>{
        if (metric?.category) set.add(metric.category);
    });
    return Array.from(set).sort((a, b)=>a.localeCompare(b));
};
const filterMetrics = (metrics = [], { term = '', categories = null, statuses = null } = {})=>{
    const activeCategories = categories && categories.length ? new Set(categories) : null;
    const activeStatuses = statuses && statuses.length ? new Set(statuses) : null;
    const normalizedTerm = term ? normalizeTerm(term) : null;
    return metrics.filter((metric)=>{
        if (activeCategories && !activeCategories.has(metric.category)) return false;
        if (activeStatuses && !activeStatuses.has(metric.status || 'unknown')) return false;
        if (normalizedTerm) {
            const haystack = `${metric.category} ${metric.name}`.toLowerCase();
            if (!haystack.includes(normalizedTerm)) {
                return false;
            }
        }
        return true;
    });
};
const STATUS_ORDER = [
    'on-track',
    'at-risk',
    'unknown'
];
}),
"[project]/components/ScorecardDashboard.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ScorecardDashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MetricCard.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MetricChart.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UploadPanel$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/UploadPanel.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const formatTimestamp = (timestamp)=>{
    try {
        return new Date(timestamp).toLocaleString();
    } catch  {
        return timestamp;
    }
};
const timeAgoLabel = (timestamp)=>{
    if (!timestamp) return 'Unknown';
    const target = new Date(timestamp);
    if (Number.isNaN(target.getTime())) return 'Unknown';
    const now = new Date();
    const diffMs = now.getTime() - target.getTime();
    if (diffMs < 0) return 'Just now';
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mo ago`;
    const years = Math.floor(months / 12);
    return `${years} yr${years > 1 ? 's' : ''} ago`;
};
const getLatestValue = (metric)=>metric.latest?.display || metric.latest?.raw || '—';
const STORAGE_KEYS = {
    theme: 'scorecard-theme',
    search: 'scorecard-search',
    categories: 'scorecard-categories',
    statuses: 'scorecard-statuses'
};
const isBrowser = ()=>("TURBOPACK compile-time value", "undefined") !== 'undefined';
const readStoredArray = (key)=>{
    if (!isBrowser()) return null;
    //TURBOPACK unreachable
    ;
};
const writeStoredValue = (key, value)=>{
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
};
const writeStoredArray = (key, value)=>{
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
};
const statusLabels = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    unknown: 'Unknown'
};
function ScorecardDashboard({ initialData }) {
    const [payload, setPayload] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [selectedCategories, setSelectedCategories] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedStatuses, setSelectedStatuses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["STATUS_ORDER"]);
    const [selectedMetricId, setSelectedMetricId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData?.metrics?.[0]?.id || null);
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [refreshError, setRefreshError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('light');
    const savedFilters = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])({
        categories: null,
        statuses: null
    });
    const metrics = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>Array.isArray(payload?.metrics) ? payload.metrics : [], [
        payload
    ]);
    const generatedAt = payload?.generatedAt;
    const lastUpdatedAt = payload?.lastUpdatedAt;
    const cacheInfo = payload?.cacheInfo;
    const orderedMetrics = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const list = Array.isArray(metrics) ? metrics : [];
        return [
            ...list
        ].sort((a, b)=>{
            if (a.category === b.category) {
                return a.name.localeCompare(b.name);
            }
            return a.category.localeCompare(b.category);
        });
    }, [
        metrics
    ]);
    const categories = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getMetricCategories"])(orderedMetrics), [
        orderedMetrics
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isBrowser()) return;
        //TURBOPACK unreachable
        ;
        const savedTheme = undefined;
        const savedSearch = undefined;
        const savedStatuses = undefined;
        const savedCategories = undefined;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!categories.length) return;
        setSelectedCategories((prev)=>{
            const pending = savedFilters.current.categories;
            if (pending) {
                const valid = pending.filter((category)=>categories.includes(category));
                savedFilters.current.categories = null;
                if (valid.length) return valid;
            }
            if (!prev || !prev.length) return categories;
            const filtered = prev.filter((category)=>categories.includes(category));
            return filtered.length ? filtered : categories;
        });
    }, [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (typeof document === 'undefined') return;
        document.documentElement.dataset.theme = theme;
        return ()=>{
            document.documentElement.dataset.theme = 'light';
        };
    }, [
        theme
    ]);
    const filteredMetrics = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["filterMetrics"])(orderedMetrics, {
            term: searchTerm,
            categories: selectedCategories,
            statuses: selectedStatuses
        }), [
        orderedMetrics,
        searchTerm,
        selectedCategories,
        selectedStatuses
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!filteredMetrics.length) {
            setSelectedMetricId(null);
            return;
        }
        const stillVisible = filteredMetrics.find((metric)=>metric.id === selectedMetricId);
        if (!stillVisible) {
            setSelectedMetricId(filteredMetrics[0].id);
        }
    }, [
        filteredMetrics,
        selectedMetricId
    ]);
    const selectedMetric = filteredMetrics.find((metric)=>metric.id === selectedMetricId) || filteredMetrics[0] || null;
    const activeMetricId = selectedMetric?.id || '';
    const heroMetrics = filteredMetrics.slice(0, 6);
    const hasMetrics = orderedMetrics.length > 0;
    const handleToggleCategory = (category)=>{
        if (!category) {
            setSelectedCategories(categories);
            return;
        }
        setSelectedCategories((prev)=>{
            if (!prev.length) return [
                category
            ];
            if (prev.includes(category)) {
                const next = prev.filter((item)=>item !== category);
                return next.length ? next : categories;
            }
            return [
                ...prev,
                category
            ];
        });
    };
    const handleToggleStatus = (status)=>{
        setSelectedStatuses((prev)=>{
            if (prev.includes(status)) {
                const next = prev.filter((item)=>item !== status);
                return next.length ? next : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["STATUS_ORDER"];
            }
            return [
                ...prev,
                status
            ];
        });
    };
    const handleRefresh = async ()=>{
        setIsRefreshing(true);
        setRefreshError('');
        try {
            const response = await fetch(`/api/scorecard?ts=${Date.now()}`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to refresh data');
            }
            setPayload(result);
            setSelectedMetricId(result.metrics?.[0]?.id || null);
        } catch (error) {
            setRefreshError(error.message);
        } finally{
            setIsRefreshing(false);
        }
    };
    const handleThemeToggle = ()=>{
        setTheme((prev)=>prev === 'light' ? 'dark' : 'light');
    };
    const handleUploadSuccess = (data)=>{
        if (!data) return;
        setPayload(data);
        setSelectedMetricId(data.metrics?.[0]?.id || null);
        setRefreshError('');
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        writeStoredValue(STORAGE_KEYS.theme, theme);
    }, [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        writeStoredValue(STORAGE_KEYS.search, searchTerm);
    }, [
        searchTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!selectedStatuses?.length) return;
        writeStoredArray(STORAGE_KEYS.statuses, selectedStatuses);
    }, [
        selectedStatuses
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!selectedCategories?.length) return;
        writeStoredArray(STORAGE_KEYS.categories, selectedCategories);
    }, [
        selectedCategories
    ]);
    if (!hasMetrics) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "error-panel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    children: "No metrics available"
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "Verify that the spreadsheet contains the “Weekly EOS Scorecard” worksheet."
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ScorecardDashboard.jsx",
            lineNumber: 256,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "dashboard__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "Weekly EOS Scorecard"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                children: "IT Scorecard Overview"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: "Rendering data pulled directly from the Excel workbook."
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "timestamp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: "Last refreshed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "freshness-label",
                                        children: timeAgoLabel(generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: "Data last updated"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(lastUpdatedAt || generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "freshness-label",
                                        children: timeAgoLabel(lastUpdatedAt || generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            cacheInfo?.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "cache-indicator",
                                children: [
                                    "Cache ",
                                    cacheInfo.status,
                                    cacheInfo.mode ? ` (${cacheInfo.mode})` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "dashboard__controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "search-input",
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                id: "search-input",
                                type: "search",
                                placeholder: "Search metrics or categories",
                                value: searchTerm,
                                onChange: (event)=>setSearchTerm(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "control-group__label-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Categories"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "link-button",
                                        onClick: ()=>handleToggleCategory(null),
                                        children: "Reset"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "pill-group",
                                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `pill ${selectedCategories.includes(category) ? 'pill--active' : ''}`,
                                        onClick: ()=>handleToggleCategory(category),
                                        children: category
                                    }, category, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 311,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 309,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "control-group__label-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "link-button",
                                        onClick: ()=>setSelectedStatuses(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["STATUS_ORDER"]),
                                        children: "Reset"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "pill-group",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["STATUS_ORDER"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `pill ${selectedStatuses.includes(status) ? 'pill--active' : ''}`,
                                        onClick: ()=>handleToggleStatus(status),
                                        children: statusLabels[status]
                                    }, status, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 335,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "control-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "primary-button",
                                onClick: handleRefresh,
                                disabled: isRefreshing,
                                children: isRefreshing ? 'Refreshing…' : 'Refresh data'
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ghost-button",
                                onClick: handleThemeToggle,
                                children: [
                                    "Toggle ",
                                    theme === 'light' ? 'dark' : 'light',
                                    " mode"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    refreshError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "error-text",
                        children: refreshError
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 354,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UploadPanel$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onSuccess: handleUploadSuccess
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "Key Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    !heroMetrics.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: "No metrics match the current filters."
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 363,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-card-grid",
                        children: heroMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                metric: metric
                            }, metric.id, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 361,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "metric-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-detail__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        children: "Metric Detail"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 374,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "Select a metric to visualize its weekly trend."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: activeMetricId,
                                onChange: (event)=>setSelectedMetricId(event.target.value),
                                children: filteredMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: metric.id,
                                        children: [
                                            metric.category,
                                            " — ",
                                            metric.name
                                        ]
                                    }, metric.id, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this),
                    selectedMetric ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                metric: selectedMetric
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 387,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "metric-detail__table-wrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        children: "Week"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 392,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        children: "Value"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 393,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 391,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 390,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: selectedMetric.series.map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: point.week
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 399,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: point.raw || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 400,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, `${selectedMetric.id}-${point.week}`, true, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 398,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 396,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 389,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: "No metric selected."
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "All Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-table-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 418,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Metric"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Goal"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Latest Week"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Latest Value"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 422,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 417,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: filteredMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        children: metric.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 429,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        children: metric.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 430,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        children: metric.goal.goal || metric.goal.text || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 431,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        children: metric.latest.week
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 432,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        children: getLatestValue(metric)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 433,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: `status-badge status-${metric.status || 'unknown'}`,
                                                        children: metric.status || 'unknown'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 434,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, `table-${metric.id}`, true, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 428,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            !filteredMetrics.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: "No metrics match the current filters."
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 441,
                                columnNumber: 39
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 414,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 412,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ScorecardDashboard.jsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/lib/scorecard.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
const DEFAULT_SHEET = 'Weekly EOS Scorecard';
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
const parseGoalCell = (cellValue)=>{
    if (!cellValue) {
        return {
            goal: null,
            average: null,
            panic: null,
            text: ''
        };
    }
    const text = String(cellValue).trim();
    const parts = text.split('|').map((part)=>part.trim()).filter(Boolean);
    if (parts.length > 1) {
        const [goal, average, panic] = parts;
        return {
            goal: goal ?? null,
            average: average ?? null,
            panic: panic ?? null,
            text
        };
    }
    return {
        goal: text,
        average: null,
        panic: null,
        text
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
    const defaultPath = 'assets/IT Scorecard.xlsx';
    const candidate = configured || defaultPath;
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(candidate) ? candidate : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), candidate);
};
const extractMetricRows = (rows)=>{
    const headerIndex = rows.findIndex((row)=>String(row?.[1] || '').trim().toLowerCase() === 'metric');
    if (headerIndex === -1) {
        throw new Error('Unable to locate the "Metric" header row inside the worksheet.');
    }
    const headerRow = rows[headerIndex];
    const weekLabels = headerRow.slice(3).map((label, idx)=>{
        if (label === undefined || label === null || label === '') {
            return `Week ${idx + 1}`;
        }
        return String(label);
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
        const goal = parseGoalCell(row[2]);
        const series = weekLabels.map((label, weekIdx)=>{
            const rawValue = row[weekIdx + 3];
            return {
                week: label,
                raw: rawValue === undefined || rawValue === null ? null : String(rawValue),
                value: sanitizeNumber(rawValue)
            };
        });
        const latestPoint = [
            ...series
        ].reverse().find((point)=>point.raw !== null && point.raw !== '');
        const fallbackWeek = weekLabels[weekLabels.length - 1] || 'Latest';
        const latest = latestPoint ? {
            ...latestPoint,
            display: latestPoint.raw
        } : {
            week: fallbackWeek,
            raw: null,
            value: null,
            display: '—'
        };
        const targetValue = sanitizeNumber(goal.goal);
        let status = 'unknown';
        if (latest.value !== null && targetValue !== null) {
            status = latest.value >= targetValue ? 'on-track' : 'at-risk';
        }
        metrics.push({
            id: slugify(`${category}-${trimmedMetric}`),
            category,
            name: trimmedMetric,
            goal,
            targetValue,
            series,
            latest,
            status
        });
    }
    return {
        metrics,
        weekLabels
    };
};
const getScorecardData = ()=>{
    const workbookPath = resolveWorkbookPath();
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(workbookPath)) {
        throw new Error(`Spreadsheet not found at ${workbookPath}. Update SOURCE_SPREADSHEET to a valid file.`);
    }
    const sheetName = process.env.SCORECARD_SHEET_NAME?.trim() || DEFAULT_SHEET;
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
    const { metrics, weekLabels } = extractMetricRows(rows);
    const payload = {
        sheetName,
        source: workbookPath,
        generatedAt: new Date().toISOString(),
        weeks: weekLabels,
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
"[project]/pages/index.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Home,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScorecardDashboard.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scorecard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scorecard.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function Home({ data, error }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "IT Scorecard Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.jsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Visual dashboard for the Weekly EOS Scorecard."
                    }, void 0, false, {
                        fileName: "[project]/pages/index.jsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.jsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                children: error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "error-panel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                            children: "Unable to load the workbook"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.jsx",
                            lineNumber: 15,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/pages/index.jsx",
                            lineNumber: 16,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            children: "Verify the file path set in SOURCE_SPREADSHEET and restart the dev server."
                        }, void 0, false, {
                            fileName: "[project]/pages/index.jsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/index.jsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    initialData: data
                }, void 0, false, {
                    fileName: "[project]/pages/index.jsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.jsx",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
async function getServerSideProps() {
    try {
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scorecard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getScorecardData"])();
        return {
            props: {
                data: payload
            }
        };
    } catch (err) {
        return {
            props: {
                error: err.message,
                data: null
            }
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b56b1387._.js.map