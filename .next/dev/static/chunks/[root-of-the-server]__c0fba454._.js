(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/MetricCard.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "metric-card__sparkline-chart",
        width: SPARKLINE_WIDTH,
        height: SPARKLINE_HEIGHT,
        viewBox: `0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`,
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": "Recent trend sparkline",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
_c = MetricSparkline;
function MetricCard({ metric }) {
    if (!metric) return null;
    const delta = formatDelta(metric.latest.value, metric.targetValue);
    const statusClass = metric.status === 'on-track' ? 'status-on-track' : metric.status === 'at-risk' ? 'status-at-risk' : 'status-unknown';
    const latestWeek = metric.latest?.week || '—';
    const latestValue = metric.latest?.display || formatNumber(metric.latest?.raw);
    const sparklineSeries = metric.series?.slice(-12);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `metric-card ${statusClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "metric-card__category",
                children: metric.category
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "metric-card__title",
                children: metric.name
            }, void 0, false, {
                fileName: "[project]/components/MetricCard.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "metric-card__values",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "label",
                                children: "Goal"
                            }, void 0, false, {
                                fileName: "[project]/components/MetricCard.jsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            sparklineSeries?.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "metric-card__sparkline",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricSparkline, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "metric-card__footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "status-pill",
                        children: (metric.status || 'unknown').replace('-', ' ')
                    }, void 0, false, {
                        fileName: "[project]/components/MetricCard.jsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    delta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c1 = MetricCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "MetricSparkline");
__turbopack_context__.k.register(_c1, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MetricChart.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
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
    _s();
    const chartConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MetricChart.useMemo[chartConfig]": ()=>buildDataset(metric)
    }["MetricChart.useMemo[chartConfig]"], [
        metric
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "metric-chart",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Line"], {
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
_s(MetricChart, "w1cNkR2PW6ZgquOm7JojnNVeXzc=");
_c = MetricChart;
var _c;
__turbopack_context__.k.register(_c, "MetricChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/UploadPanel.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const MAX_SIZE_BYTES = 50 * 1024 * 1024;
const readableSize = (bytes)=>{
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
function UploadPanel({ onSuccess }) {
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [variant, setVariant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('muted');
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "upload-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "upload-panel__title",
                children: "Upload updated workbook"
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "Drag & drop a new .xlsx file or use the button below."
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Drop file here"
                    }, void 0, false, {
                        fileName: "[project]/components/UploadPanel.jsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            isUploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "Uploading..."
            }, void 0, false, {
                fileName: "[project]/components/UploadPanel.jsx",
                lineNumber: 128,
                columnNumber: 23
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(UploadPanel, "60LWUbiKV9XQQP3O1Hl4mElsT8E=");
_c = UploadPanel;
var _c;
__turbopack_context__.k.register(_c, "UploadPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/metrics.js [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ScorecardDashboard.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScorecardDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MetricCard.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MetricChart.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UploadPanel$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/UploadPanel.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const isBrowser = ()=>("TURBOPACK compile-time value", "object") !== 'undefined';
const readStoredArray = (key)=>{
    if (!isBrowser()) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch  {
        return null;
    }
};
const writeStoredValue = (key, value)=>{
    if (!isBrowser()) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(key, value);
    } catch  {
    /* ignore storage errors */ }
};
const writeStoredArray = (key, value)=>{
    if (!isBrowser()) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch  {
    /* ignore storage errors */ }
};
const statusLabels = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    unknown: 'Unknown'
};
function ScorecardDashboard({ initialData }) {
    _s();
    const [payload, setPayload] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialData);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategories, setSelectedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStatuses, setSelectedStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"]);
    const [selectedMetricId, setSelectedMetricId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.metrics?.[0]?.id || null);
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refreshError, setRefreshError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const savedFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({
        categories: null,
        statuses: null
    });
    const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScorecardDashboard.useMemo[metrics]": ()=>Array.isArray(payload?.metrics) ? payload.metrics : []
    }["ScorecardDashboard.useMemo[metrics]"], [
        payload
    ]);
    const generatedAt = payload?.generatedAt;
    const lastUpdatedAt = payload?.lastUpdatedAt;
    const cacheInfo = payload?.cacheInfo;
    const orderedMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScorecardDashboard.useMemo[orderedMetrics]": ()=>{
            const list = Array.isArray(metrics) ? metrics : [];
            return [
                ...list
            ].sort({
                "ScorecardDashboard.useMemo[orderedMetrics]": (a, b)=>{
                    if (a.category === b.category) {
                        return a.name.localeCompare(b.name);
                    }
                    return a.category.localeCompare(b.category);
                }
            }["ScorecardDashboard.useMemo[orderedMetrics]"]);
        }
    }["ScorecardDashboard.useMemo[orderedMetrics]"], [
        metrics
    ]);
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScorecardDashboard.useMemo[categories]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getMetricCategories"])(orderedMetrics)
    }["ScorecardDashboard.useMemo[categories]"], [
        orderedMetrics
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (!isBrowser()) //TURBOPACK unreachable
            ;
            const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
            if (savedTheme) setTheme(savedTheme);
            const savedSearch = window.localStorage.getItem(STORAGE_KEYS.search);
            if (savedSearch) setSearchTerm(savedSearch);
            const savedStatuses = readStoredArray(STORAGE_KEYS.statuses);
            if (savedStatuses?.length) {
                savedFilters.current.statuses = null;
                setSelectedStatuses(savedStatuses);
            }
            const savedCategories = readStoredArray(STORAGE_KEYS.categories);
            if (savedCategories?.length) {
                savedFilters.current.categories = savedCategories;
            }
        }
    }["ScorecardDashboard.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (!categories.length) return;
            setSelectedCategories({
                "ScorecardDashboard.useEffect": (prev)=>{
                    const pending = savedFilters.current.categories;
                    if (pending) {
                        const valid = pending.filter({
                            "ScorecardDashboard.useEffect.valid": (category)=>categories.includes(category)
                        }["ScorecardDashboard.useEffect.valid"]);
                        savedFilters.current.categories = null;
                        if (valid.length) return valid;
                    }
                    if (!prev || !prev.length) return categories;
                    const filtered = prev.filter({
                        "ScorecardDashboard.useEffect.filtered": (category)=>categories.includes(category)
                    }["ScorecardDashboard.useEffect.filtered"]);
                    return filtered.length ? filtered : categories;
                }
            }["ScorecardDashboard.useEffect"]);
        }
    }["ScorecardDashboard.useEffect"], [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (typeof document === 'undefined') return;
            document.documentElement.dataset.theme = theme;
            return ({
                "ScorecardDashboard.useEffect": ()=>{
                    document.documentElement.dataset.theme = 'light';
                }
            })["ScorecardDashboard.useEffect"];
        }
    }["ScorecardDashboard.useEffect"], [
        theme
    ]);
    const filteredMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScorecardDashboard.useMemo[filteredMetrics]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["filterMetrics"])(orderedMetrics, {
                term: searchTerm,
                categories: selectedCategories,
                statuses: selectedStatuses
            })
    }["ScorecardDashboard.useMemo[filteredMetrics]"], [
        orderedMetrics,
        searchTerm,
        selectedCategories,
        selectedStatuses
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (!filteredMetrics.length) {
                setSelectedMetricId(null);
                return;
            }
            const stillVisible = filteredMetrics.find({
                "ScorecardDashboard.useEffect.stillVisible": (metric)=>metric.id === selectedMetricId
            }["ScorecardDashboard.useEffect.stillVisible"]);
            if (!stillVisible) {
                setSelectedMetricId(filteredMetrics[0].id);
            }
        }
    }["ScorecardDashboard.useEffect"], [
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
                return next.length ? next : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"];
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            writeStoredValue(STORAGE_KEYS.theme, theme);
        }
    }["ScorecardDashboard.useEffect"], [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            writeStoredValue(STORAGE_KEYS.search, searchTerm);
        }
    }["ScorecardDashboard.useEffect"], [
        searchTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (!selectedStatuses?.length) return;
            writeStoredArray(STORAGE_KEYS.statuses, selectedStatuses);
        }
    }["ScorecardDashboard.useEffect"], [
        selectedStatuses
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScorecardDashboard.useEffect": ()=>{
            if (!selectedCategories?.length) return;
            writeStoredArray(STORAGE_KEYS.categories, selectedCategories);
        }
    }["ScorecardDashboard.useEffect"], [
        selectedCategories
    ]);
    if (!hasMetrics) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "error-panel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "No metrics available"
                }, void 0, false, {
                    fileName: "[project]/components/ScorecardDashboard.jsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "dashboard__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "Weekly EOS Scorecard"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "IT Scorecard Overview"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "timestamp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Last refreshed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Data last updated"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: formatTimestamp(lastUpdatedAt || generatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            cacheInfo?.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "dashboard__controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "search-input",
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "control-group__label-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Categories"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pill-group",
                                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "control-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "control-group__label-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "link-button",
                                        onClick: ()=>setSelectedStatuses(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"]),
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pill-group",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$js__$5b$client$5d$__$28$ecmascript$29$__["STATUS_ORDER"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "control-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    refreshError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UploadPanel$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Key Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    !heroMetrics.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: "No metrics match the current filters."
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 363,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-card-grid",
                        children: heroMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricCard$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "metric-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-detail__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Metric Detail"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                        lineNumber: 374,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: activeMetricId,
                                onChange: (event)=>setSelectedMetricId(event.target.value),
                                children: filteredMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                    selectedMetric ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MetricChart$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                metric: selectedMetric
                            }, void 0, false, {
                                fileName: "[project]/components/ScorecardDashboard.jsx",
                                lineNumber: 387,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metric-detail__table-wrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Week"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 392,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: selectedMetric.series.map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: point.week
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ScorecardDashboard.jsx",
                                                            lineNumber: 399,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "All Metrics"
                    }, void 0, false, {
                        fileName: "[project]/components/ScorecardDashboard.jsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-table-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 418,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Metric"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Goal"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Latest Week"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Latest Value"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ScorecardDashboard.jsx",
                                                    lineNumber: 422,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: filteredMetrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: metric.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 429,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: metric.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 430,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: metric.goal.goal || metric.goal.text || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 431,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: metric.latest.week
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 432,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: getLatestValue(metric)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ScorecardDashboard.jsx",
                                                        lineNumber: 433,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                            !filteredMetrics.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(ScorecardDashboard, "to7jHs1/v64kvc/8NWGpQv39uTc=");
_c = ScorecardDashboard;
var _c;
__turbopack_context__.k.register(_c, "ScorecardDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSP",
    ()=>__N_SSP,
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScorecardDashboard.jsx [client] (ecmascript)");
;
;
;
var __N_SSP = true;
function Home({ data, error }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "IT Scorecard Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.jsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "error-panel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Unable to load the workbook"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.jsx",
                            lineNumber: 15,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/pages/index.jsx",
                            lineNumber: 16,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScorecardDashboard$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.jsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c0fba454._.js.map