const normalizeTerm = (value) => value.trim().toLowerCase();

export const formatMetricValue = (value, { isPercent } = {}) => {
  if (value === null || value === undefined || value === '') return '—';
  if (!Number.isFinite(value)) return value;
  if (isPercent) {
    return `${(value * 100).toFixed(1)}%`;
  }
  const fractionDigits = Number.isInteger(value) ? 0 : 2;
  return value.toLocaleString(undefined, { maximumFractionDigits: fractionDigits });
};

export const getMetricCategories = (metrics = []) => {
  const set = new Set();
  metrics.forEach((metric) => {
    if (metric?.category) set.add(metric.category);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};

export const filterMetrics = (
  metrics = [],
  { term = '', categories = null, statuses = null } = {},
) => {
  const activeCategories = categories && categories.length ? new Set(categories) : null;
  const activeStatuses = statuses && statuses.length ? new Set(statuses) : null;
  const normalizedTerm = term ? normalizeTerm(term) : null;

  return metrics.filter((metric) => {
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

export const STATUS_ORDER = ['on-track', 'at-risk', 'unknown'];
