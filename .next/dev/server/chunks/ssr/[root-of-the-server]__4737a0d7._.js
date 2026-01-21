module.exports = [
"[project]/lib/metrics.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STATUS_ORDER",
    ()=>STATUS_ORDER,
    "filterMetrics",
    ()=>filterMetrics,
    "formatMetricValue",
    ()=>formatMetricValue,
    "getMetricCategories",
    ()=>getMetricCategories
]);
const normalizeTerm = (value)=>value.trim().toLowerCase();
const formatMetricValue = (value, { isPercent } = {})=>{
    if (value === null || value === undefined || value === '') return '—';
    if (!Number.isFinite(value)) return value;
    if (isPercent) {
        return `${(value * 100).toFixed(1)}%`;
    }
    const fractionDigits = Number.isInteger(value) ? 0 : 2;
    return value.toLocaleString(undefined, {
        maximumFractionDigits: fractionDigits
    });
};
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
"[project]/components/MetricCard.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.js [ssr] (ecmascript)");
;
;
const SPARKLINE_WIDTH = 140;
const SPARKLINE_HEIGHT = 36;
const STATUS_COLORS = {
    'on-track': '#22c55e',
    'at-risk': '#dc2626',
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
            lineNumber: 58,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/MetricCard.jsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function MetricCard({ metric, index = 0 }) {
    if (!metric) return null;
    const statusClass = metric.status === 'on-track' ? 'status-on-track' : metric.status === 'at-risk' ? 'status-at-risk' : 'status-unknown';
    const latestPeriod = metric.latest?.period || '—';
    const latestValue = metric.latest?.value !== null && metric.latest?.value !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["formatMetricValue"])(metric.latest?.value, {
        isPercent: metric.panic?.isPercent
    }) : metric.latest?.raw || '—';
    const sparklineSeries = metric.series?.slice(-12);
    const panicText = metric.panic?.text ? metric.panic.text.replace(/^p:\s*/i, '') : '—';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
        className: `metric-card ${statusClass}`,
        style: {
            '--card-index': index
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "metric-card__category",
                children: metric.category
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "metric-card__title",
                children: metric.name
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            metric.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "metric-card__description",
                children: metric.description
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 79,
                columnNumber: 30
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
                                    latestPeriod,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: latestValue
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "label",
                                children: "Panic"
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: panicText
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 80,
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
                    lineNumber: 92,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 91,
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
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "metric-card__meta",
                        children: metric.panic?.isPercent ? 'Percent-based' : 'Absolute value'
                    }, void 0, false, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MetricCard.jsx",
        lineNumber: 76,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$chartjs$2d$2__$5b$external$5d$__$28$react$2d$chartjs$2d$2$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Chart"].register(__TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["CategoryScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["LinearScale"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["PointElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["LineElement"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Tooltip"], __TURBOPACK__imported__module__$5b$externals$5d2f$chart$2e$js__$5b$external$5d$__$28$chart$2e$js$2c$__esm_import$29$__["Legend"]);
const STATUS_COLORS = {
    'on-track': {
        stroke: '#0f766e',
        fill: 'rgba(20, 184, 166, 0.2)'
    },
    'at-risk': {
        stroke: '#dc2626',
        fill: 'rgba(248, 113, 113, 0.2)'
    },
    unknown: {
        stroke: '#64748b',
        fill: 'rgba(148, 163, 184, 0.2)'
    }
};
const buildDataset = (metric)=>{
    const labels = metric.series.map((point)=>point.period);
    const data = metric.series.map((point)=>point.value);
    const statusColors = STATUS_COLORS[metric.status] || STATUS_COLORS.unknown;
    const datasets = [
        {
            label: metric.name,
            data,
            borderColor: statusColors.stroke,
            backgroundColor: statusColors.fill,
            borderWidth: 2,
            fill: true,
            spanGaps: true,
            tension: 0.35,
            pointRadius: 3
        }
    ];
    if (metric.panic?.threshold !== null && metric.panic?.threshold !== undefined) {
        datasets.push({
            label: 'Panic threshold',
            data: labels.map(()=>metric.panic.threshold),
            borderColor: '#1f2937',
            borderDash: [
                4,
                4
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
                                const formatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["formatMetricValue"])(value, {
                                    isPercent: metric.panic?.isPercent
                                });
                                return `${label}: ${formatted}`;
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
                            callback: (value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["formatMetricValue"])(value, {
                                    isPercent: metric.panic?.isPercent
                                })
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
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MetricChart.jsx",
        lineNumber: 60,
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
function UploadPanel({ cadence = 'weekly', onSuccess }) {
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
            const response = await fetch(`/api/upload?cadence=${cadence}`, {
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
const CADENCE_COPY = {
    weekly: {
        label: 'Weekly',
        helper: 'Rolling 4 weeks'
    },
    monthly: {
        label: 'Monthly',
        helper: 'Year-to-date view'
    }
};
const getThresholdIndicator = (metric)=>{
    const latestValue = Number.isFinite(metric?.latest?.value) ? Number(metric.latest.value) : null;
    const threshold = Number.isFinite(metric?.panic?.threshold) ? Number(metric.panic.threshold) : null;
    const comparator = metric?.panic?.comparator;
    if (latestValue === null || threshold === null || !comparator) return 'flat';
    if (comparator === 'more') {
        return latestValue > threshold ? 'down' : 'up';
    }
    if (comparator === 'less') {
        return latestValue < threshold ? 'down' : 'up';
    }
    return 'flat';
};
function ScorecardDashboard({ initialData }) {
    const [payload, setPayload] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData);
    const [cadence, setCadence] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData?.cadence || 'weekly');
    const [selectedMetricId, setSelectedMetricId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData?.metrics?.[0]?.id || null);
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [refreshError, setRefreshError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const metrics = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>Array.isArray(payload?.metrics) ? payload.metrics : [], [
        payload
    ]);
    const generatedAt = payload?.generatedAt;
    const lastUpdatedAt = payload?.lastUpdatedAt;
    const cacheInfo = payload?.cacheInfo;
    const categories = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getMetricCategories"])(metrics), [
        metrics
    ]);
    const metricsByCategory = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>categories.map((category)=>({
                category,
                metrics: metrics.filter((metric)=>metric.category === category)
            })), [
        categories,
        metrics
    ]);
    const selectedMetric = metrics.find((metric)=>metric.id === selectedMetricId) || metrics[0] || null;
    const statusSummary = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const summary = {
            'on-track': 0,
            'at-risk': 0,
            unknown: 0
        };
        metrics.forEach((metric)=>{
            const key = summary[metric.status] !== undefined ? metric.status : 'unknown';
            summary[key] += 1;
        });
        return summary;
    }, [
        metrics
    ]);
    const handleCadenceChange = async (nextCadence)=>{
        if (nextCadence === cadence) return;
        setIsRefreshing(true);
        setRefreshError('');
        try {
            const response = await fetch(`/api/scorecard?cadence=${nextCadence}&ts=${Date.now()}`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to refresh data');
            }
            setPayload(result);
            setCadence(nextCadence);
            setSelectedMetricId(result.metrics?.[0]?.id || null);
        } catch (error) {
            setRefreshError(error.message);
        } finally{
            setIsRefreshing(false);
        }
    };
    const handleRefresh = async ()=>{
        setIsRefreshing(true);
        setRefreshError('');
        try {
            const response = await fetch(`/api/scorecard?cadence=${cadence}&ts=${Date.now()}`);
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
    const handleExport = ()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    };
    const handleUploadSuccess = (data)=>{
        if (!data) return;
        setPayload(data);
        setCadence(data.cadence || cadence);
        setSelectedMetricId(data.metrics?.[0]?.id || null);
        setRefreshError('');
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        let raf;
        const measureHeights = undefined;
        const scheduleMeasure = undefined;
        const resizeObserver = undefined;
    }, [
        metricsByCategory,
        cadence
    ]);
    if (!metrics.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "error-panel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    children: "No metrics available"
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "Verify that the worksheet contains the IT scorecard metrics."
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ScorecardDashboard.jsx",
            lineNumber: 198,
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
                                children: "IT Scorecard Report"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                children: "Operational Health Snapshot"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: CADENCE_COPY[cadence]?.helper || 'Leadership-ready trend report'
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 208,
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
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "freshness-label",
                                        children: timeAgoLabel(generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: "Data last updated"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(lastUpdatedAt || generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "freshness-label",
                                        children: timeAgoLabel(lastUpdatedAt || generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 221,
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
                                lineNumber: 227,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "dashboard__summary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-label",
                                children: "Cadence"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: CADENCE_COPY[cadence]?.label || cadence
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-foot",
                                children: payload?.sheetName
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-label",
                                children: "On track"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: statusSummary['on-track']
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-foot",
                                children: "Healthy metrics"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-label",
                                children: "At risk"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: statusSummary['at-risk']
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-foot",
                                children: "Needs attention"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "summary-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-label",
                                children: "Total metrics"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: metrics.length
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "summary-foot",
                                children: "Across 4 categories"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "dashboard__controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                children: "Cadence"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "segmented-control",
                                children: Object.keys(CADENCE_COPY).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `segment ${cadence === key ? 'segment--active' : ''}`,
                                        onClick: ()=>handleCadenceChange(key),
                                        disabled: isRefreshing,
                                        children: CADENCE_COPY[key].label
                                    }, key, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 259,
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
                                lineNumber: 276,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ghost-button",
                                onClick: handleExport,
                                children: "Export PDF"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this),
                    refreshError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "error-text",
                        children: refreshError
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 283,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 258,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "dashboard__upload",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UploadPanel$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    cadence: cadence,
                    onSuccess: handleUploadSuccess
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 287,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "executive-summary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "executive-summary__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                children: "Executive Summary"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: "Quick glance view of every metric."
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "executive-summary__table",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Metric"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Latest"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Trend"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: metricsByCategory.map(({ category, metrics: categoryMetrics })=>[
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "executive-summary__category",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    colSpan: 3,
                                                    children: category
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 308,
                                                    columnNumber: 21
                                                }, this)
                                            }, `summary-${category}-header`, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 307,
                                                columnNumber: 19
                                            }, this),
                                            ...categoryMetrics.map((metric)=>{
                                                const trend = getThresholdIndicator(metric);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: metric.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 314,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["formatMetricValue"])(metric.latest?.value, {
                                                                isPercent: metric.panic?.isPercent
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 315,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `trend trend--${trend}`,
                                                                "aria-label": `Threshold indicator ${trend}`,
                                                                children: trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                                lineNumber: 317,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 316,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, `summary-${metric.id}`, true, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 313,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        ])
                                }, void 0, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 304,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ScorecardDashboard.jsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            metricsByCategory.map(({ category, metrics: categoryMetrics }, categoryIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    className: "category-section",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "category-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: category
                                }, void 0, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 334,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "muted",
                                    children: [
                                        categoryMetrics.length,
                                        " metrics"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ScorecardDashboard.jsx",
                            lineNumber: 333,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "metric-card-grid",
                            children: categoryMetrics.map((metric, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: `metric-card-wrapper ${metric.id === selectedMetric?.id ? 'metric-card-wrapper--active' : ''}`,
                                    onClick: ()=>setSelectedMetricId(metric.id),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        metric: metric,
                                        index: index + categoryIndex * 4
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 345,
                                        columnNumber: 17
                                    }, this)
                                }, metric.id, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 339,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ScorecardDashboard.jsx",
                            lineNumber: 337,
                            columnNumber: 11
                        }, this)
                    ]
                }, category, true, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 332,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "metric-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-detail__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        children: "Trend Focus"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "Latest view for the selected metric."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedMetric?.id || '',
                                onChange: (event)=>setSelectedMetricId(event.target.value),
                                children: metrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: metric.id,
                                        children: [
                                            metric.category,
                                            " — ",
                                            metric.name
                                        ]
                                    }, metric.id, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    selectedMetric ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "metric-detail__body",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "metric-detail__summary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                children: selectedMetric.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 370,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "muted",
                                                children: selectedMetric.description || 'No description provided.'
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 371,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "metric-detail__panic",
                                                children: selectedMetric.panic?.text || 'Panic threshold not set.'
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 372,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 369,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        metric: selectedMetric
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 368,
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
                                                        children: cadence === 'monthly' ? 'Month' : 'Week'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 380,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        children: "Value"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 381,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: selectedMetric.series.map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: point.period
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 387,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["formatMetricValue"])(point.value, {
                                                                isPercent: selectedMetric.panic?.isPercent
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 388,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, `${selectedMetric.id}-${point.period}`, true, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 386,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 384,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 377,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 376,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: "No metric selected."
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 396,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 352,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ScorecardDashboard.jsx",
        lineNumber: 206,
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
                        children: "IT Scorecard Report"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.jsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Stylish report for weekly and monthly IT scorecard trends."
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
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scorecard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getScorecardData"])({
            cadence: 'weekly'
        });
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4737a0d7._.js.map