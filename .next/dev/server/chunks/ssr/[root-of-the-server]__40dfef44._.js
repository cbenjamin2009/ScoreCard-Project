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
function MetricCard({ metric }) {
    if (!metric) return null;
    const delta = formatDelta(metric.latest.value, metric.targetValue);
    const statusClass = metric.status === 'on-track' ? 'status-on-track' : metric.status === 'at-risk' ? 'status-at-risk' : 'status-unknown';
    const latestWeek = metric.latest?.week || '—';
    const latestValue = metric.latest?.display || formatNumber(metric.latest?.raw);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
        className: `metric-card ${statusClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "metric-card__category",
                children: metric.category
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "metric-card__title",
                children: metric.name
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 27,
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
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: latestValue
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "label",
                                children: "Goal"
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "value",
                                children: metric.goal.goal || metric.goal.text || '—'
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: "metric-card__footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "status-pill",
                        children: (metric.status || 'unknown').replace('-', ' ')
                    }, void 0, false, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 39,
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
                        lineNumber: 40,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MetricCard.jsx",
        lineNumber: 25,
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
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const getLatestValue = (metric)=>metric.latest?.display || metric.latest?.raw || '—';
function ScorecardDashboard({ metrics, generatedAt }) {
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
    const [selectedMetricId, setSelectedMetricId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const selectedMetric = orderedMetrics.find((metric)=>metric.id === selectedMetricId) || orderedMetrics[0] || null;
    const activeMetricId = selectedMetric?.id || '';
    const heroMetrics = orderedMetrics.slice(0, 6);
    const hasMetrics = orderedMetrics.length > 0;
    if (!hasMetrics) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "error-panel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    children: "No metrics available"
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "Verify that the spreadsheet contains the “Weekly EOS Scorecard” worksheet."
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ScorecardDashboard.jsx",
            lineNumber: 35,
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
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                children: "IT Scorecard Overview"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: "Rendering data pulled directly from the Excel workbook."
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "timestamp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: "Last refreshed"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                children: formatTimestamp(generatedAt)
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "Key Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-card-grid",
                        children: heroMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                metric: metric
                            }, metric.id, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 56,
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
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "Select a metric to visualize its weekly trend."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: activeMetricId,
                                onChange: (event)=>setSelectedMetricId(event.target.value),
                                children: orderedMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: metric.id,
                                        children: [
                                            metric.category,
                                            " — ",
                                            metric.name
                                        ]
                                    }, metric.id, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    selectedMetric ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                metric: selectedMetric
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 81,
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
                                                        lineNumber: 86,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        children: "Value"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 87,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: selectedMetric.series.map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: point.week
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 93,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            children: point.raw || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 94,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, `${selectedMetric.id}-${point.week}`, true, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 92,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 90,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: "No metric selected."
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "All Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "metric-table-wrapper",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Metric"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Goal"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Latest Week"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Latest Value"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                                lineNumber: 117,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    children: orderedMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: metric.category
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 123,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: metric.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 124,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: metric.goal.goal || metric.goal.text || '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 125,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: metric.latest.week
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 126,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: getLatestValue(metric)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 127,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: `status-badge status-${metric.status || 'unknown'}`,
                                                    children: metric.status || 'unknown'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, `table-${metric.id}`, true, {
                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ScorecardDashboard.jsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ScorecardDashboard.jsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ScorecardDashboard.jsx",
        lineNumber: 43,
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
            }
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
        }
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
                    metrics: data.metrics,
                    generatedAt: data.generatedAt
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

//# sourceMappingURL=%5Broot-of-the-server%5D__40dfef44._.js.map