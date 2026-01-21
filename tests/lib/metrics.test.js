import { describe, expect, it } from 'vitest';
import { STATUS_ORDER, filterMetrics, getMetricCategories } from '../../lib/metrics.js';

const sampleMetrics = [
  { id: 'tickets-opened', category: 'Tickets', name: 'Opened', status: 'on-track' },
  { id: 'tickets-closed', category: 'Tickets', name: 'Closed', status: 'at-risk' },
  { id: 'sla-initial', category: 'SLA', name: 'Initial Response', status: 'unknown' },
];

describe('getMetricCategories', () => {
  it('returns sorted, unique categories', () => {
    const categories = getMetricCategories(sampleMetrics);
    expect(categories).toEqual(['SLA', 'Tickets']);
  });
});

describe('filterMetrics', () => {
  it('filters by category', () => {
    const results = filterMetrics(sampleMetrics, { categories: ['Tickets'] });
    expect(results).toHaveLength(2);
    expect(results.every((metric) => metric.category === 'Tickets')).toBe(true);
  });

  it('filters by status', () => {
    const results = filterMetrics(sampleMetrics, { statuses: ['at-risk'] });
    expect(results).toEqual([sampleMetrics[1]]);
  });

  it('filters by search term', () => {
    const results = filterMetrics(sampleMetrics, { term: 'response' });
    expect(results).toEqual([sampleMetrics[2]]);
  });

  it('returns all when filters empty', () => {
    const results = filterMetrics(sampleMetrics, {});
    expect(results).toHaveLength(3);
  });
});

describe('STATUS_ORDER', () => {
  it('lists statuses in expected order', () => {
    expect(STATUS_ORDER).toEqual(['on-track', 'at-risk', 'unknown']);
  });
});
