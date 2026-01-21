import { useEffect, useMemo, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import MetricChart from '@/components/MetricChart';
import UploadPanel from '@/components/UploadPanel';
import { formatMetricValue, getMetricCategories } from '@/lib/metrics';

const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
};

const timeAgoLabel = (timestamp) => {
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
    helper: 'Rolling 4 weeks',
  },
  monthly: {
    label: 'Monthly',
    helper: 'Year-to-date view',
  },
};

const getLetterGrade = (percent) => {
  if (percent >= 90) return 'A';
  if (percent >= 80) return 'B';
  if (percent >= 70) return 'C';
  if (percent >= 60) return 'D';
  return 'F';
};

const ScoreGauge = ({ percent }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const grade = getLetterGrade(clamped);
  const radius = 80;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * Math.PI;
  const dashOffset = circumference * (1 - clamped / 100);
  const angle = -90 + (clamped / 100) * 180;

  return (
    <div className="score-gauge">
      <svg viewBox="0 0 200 120" role="img" aria-label={`Overall score ${clamped}%`}>
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(15, 23, 42, 0.1)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <line
          x1="100"
          y1="100"
          x2={100 + Math.cos((angle * Math.PI) / 180) * 62}
          y2={100 + Math.sin((angle * Math.PI) / 180) * 62}
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="5" fill="#0f172a" />
      </svg>
      <div className="score-gauge__value">
        <span className="score-gauge__grade">{grade}</span>
        <span className="score-gauge__percent">{clamped.toFixed(0)}%</span>
      </div>
    </div>
  );
};

const getThresholdIndicator = (metric) => {
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

export default function ScorecardDashboard({ initialData }) {
  const [payload, setPayload] = useState(initialData);
  const [cadence, setCadence] = useState(initialData?.cadence || 'weekly');
  const [selectedMetricId, setSelectedMetricId] = useState(
    initialData?.metrics?.[0]?.id || null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState('');

  const metrics = useMemo(
    () => (Array.isArray(payload?.metrics) ? payload.metrics : []),
    [payload],
  );
  const generatedAt = payload?.generatedAt;
  const lastUpdatedAt = payload?.lastUpdatedAt;
  const cacheInfo = payload?.cacheInfo;

  const categories = useMemo(() => getMetricCategories(metrics), [metrics]);

  const metricsByCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        metrics: metrics.filter((metric) => metric.category === category),
      })),
    [categories, metrics],
  );

  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) || metrics[0] || null;

  const statusSummary = useMemo(() => {
    const summary = { 'on-track': 0, 'at-risk': 0, unknown: 0 };
    metrics.forEach((metric) => {
      const key = summary[metric.status] !== undefined ? metric.status : 'unknown';
      summary[key] += 1;
    });
    return summary;
  }, [metrics]);

  const overallPercent = useMemo(() => {
    if (!metrics.length) return 0;
    return (statusSummary['on-track'] / metrics.length) * 100;
  }, [metrics.length, statusSummary]);

  const handleCadenceChange = async (nextCadence) => {
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
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
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
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  const handleUploadSuccess = (data) => {
    if (!data) return;
    setPayload(data);
    setCadence(data.cadence || cadence);
    setSelectedMetricId(data.metrics?.[0]?.id || null);
    setRefreshError('');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let raf = null;

    const measureHeights = () => {
      const cards = document.querySelectorAll('.metric-card');
      let maxHeight = 0;
      cards.forEach((card) => {
        card.style.height = 'auto';
        const height = card.getBoundingClientRect().height;
        if (height > maxHeight) maxHeight = height;
      });
      if (maxHeight > 0) {
        document.documentElement.style.setProperty('--card-min-height', `${Math.ceil(maxHeight)}px`);
      }
    };

    const scheduleMeasure = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        measureHeights();
      });
    };

    scheduleMeasure();
    window.addEventListener('resize', scheduleMeasure);

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleMeasure).catch(() => {});
    }

    const resizeObserver = new ResizeObserver(() => scheduleMeasure());
    document.querySelectorAll('.metric-card').forEach((card) => resizeObserver.observe(card));

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', scheduleMeasure);
      resizeObserver.disconnect();
    };
  }, [metricsByCategory, cadence]);

  if (!metrics.length) {
    return (
      <div className="error-panel">
        <h1>No metrics available</h1>
        <p>Verify that the worksheet contains the IT scorecard metrics.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="eyebrow">IT Scorecard Report</p>
          <h1>Operational Health Snapshot</h1>
          <p className="muted">
            {CADENCE_COPY[cadence]?.helper || 'Leadership-ready trend report'}
          </p>
        </div>
        <div className="timestamp">
          <div>
            <p>Last refreshed</p>
            <strong>{formatTimestamp(generatedAt)}</strong>
            <span className="freshness-label">{timeAgoLabel(generatedAt)}</span>
          </div>
          <div>
            <p>Data last updated</p>
            <strong>{formatTimestamp(lastUpdatedAt || generatedAt)}</strong>
            <span className="freshness-label">{timeAgoLabel(lastUpdatedAt || generatedAt)}</span>
          </div>
          {cacheInfo?.status && (
            <span className="cache-indicator">
              Cache&nbsp;{cacheInfo.status}
              {cacheInfo.mode ? ` (${cacheInfo.mode})` : ''}
            </span>
          )}
        </div>
      </header>

      <section className="dashboard__summary">
        <div className="summary-card">
          <p className="summary-label">Cadence</p>
          <h2>{CADENCE_COPY[cadence]?.label || cadence}</h2>
          <p className="summary-foot">{payload?.sheetName}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">On track</p>
          <h2>{statusSummary['on-track']}</h2>
          <p className="summary-foot">Healthy metrics</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">At risk</p>
          <h2>{statusSummary['at-risk']}</h2>
          <p className="summary-foot">Needs attention</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Total metrics</p>
          <h2>{metrics.length}</h2>
          <p className="summary-foot">Across 4 categories</p>
        </div>
      </section>

      <section className="dashboard__controls">
        <div className="control-group">
          <label>Cadence</label>
          <div className="segmented-control">
            {Object.keys(CADENCE_COPY).map((key) => (
              <button
                key={key}
                type="button"
                className={`segment ${cadence === key ? 'segment--active' : ''}`}
                onClick={() => handleCadenceChange(key)}
                disabled={isRefreshing}
              >
                {CADENCE_COPY[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className="score-summary">
          <p className="score-summary__label">Overall Score</p>
          <ScoreGauge percent={overallPercent} />
          <p className="score-summary__detail">
            {statusSummary['on-track']} on track of {metrics.length} total
          </p>
        </div>
        <div className="control-actions">
          <button type="button" className="primary-button" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing…' : 'Refresh data'}
          </button>
          <button type="button" className="ghost-button" onClick={handleExport}>
            Export PDF
          </button>
        </div>
        {refreshError && <p className="error-text">{refreshError}</p>}
      </section>

      <section className="dashboard__upload">
        <UploadPanel cadence={cadence} onSuccess={handleUploadSuccess} />
      </section>

      <section className="executive-summary">
        <div className="executive-summary__header">
          <h2>Executive Summary</h2>
          <p className="muted">Quick glance view of every metric.</p>
        </div>
        <div className="executive-summary__table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Panic</th>
                <th>Latest</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {metricsByCategory.map(({ category, metrics: categoryMetrics }) =>
                [
                  <tr className="executive-summary__category" key={`summary-${category}-header`}>
                    <td colSpan={4}>{category}</td>
                  </tr>,
                  ...categoryMetrics.map((metric) => {
                    const trend = getThresholdIndicator(metric);
                    const panicLabel = metric.panic?.text
                      ? metric.panic.text.replace(/^p:\s*/i, '')
                      : '—';
                    return (
                      <tr key={`summary-${metric.id}`}>
                        <td>{metric.name}</td>
                        <td>{panicLabel}</td>
                        <td>{formatMetricValue(metric.latest?.value, { isPercent: metric.panic?.isPercent })}</td>
                        <td>
                          <span className={`trend trend--${trend}`} aria-label={`Threshold indicator ${trend}`}>
                            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'}
                          </span>
                        </td>
                      </tr>
                    );
                  }),
                ],
              )}
            </tbody>
          </table>
        </div>
      </section>

      {metricsByCategory.map(({ category, metrics: categoryMetrics }, categoryIndex) => (
        <section className="category-section" key={category}>
          <div className="category-header">
            <h2>{category}</h2>
            <p className="muted">{categoryMetrics.length} metrics</p>
          </div>
          <div className="metric-card-grid">
            {categoryMetrics.map((metric, index) => (
              <button
                key={metric.id}
                type="button"
                className={`metric-card-wrapper ${metric.id === selectedMetric?.id ? 'metric-card-wrapper--active' : ''}`}
                onClick={() => setSelectedMetricId(metric.id)}
              >
                <MetricCard metric={metric} index={index + categoryIndex * 4} />
              </button>
            ))}
          </div>
        </section>
      ))}

      <section className="metric-detail">
        <div className="metric-detail__header">
          <div>
            <h2>Trend Focus</h2>
            <p className="muted">Latest view for the selected metric.</p>
          </div>
          <select value={selectedMetric?.id || ''} onChange={(event) => setSelectedMetricId(event.target.value)}>
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.category} — {metric.name}
              </option>
            ))}
          </select>
        </div>
        {selectedMetric ? (
          <>
            <div className="metric-detail__body">
              <div className="metric-detail__summary">
                <h3>{selectedMetric.name}</h3>
                <p className="muted">{selectedMetric.description || 'No description provided.'}</p>
                <p className="metric-detail__panic">{selectedMetric.panic?.text || 'Panic threshold not set.'}</p>
              </div>
              <MetricChart metric={selectedMetric} />
            </div>
            <div className="metric-detail__table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{cadence === 'monthly' ? 'Month' : 'Week'}</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMetric.series.map((point) => (
                    <tr key={`${selectedMetric.id}-${point.period}`}>
                      <td>{point.period}</td>
                      <td>{formatMetricValue(point.value, { isPercent: selectedMetric.panic?.isPercent })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="muted">No metric selected.</p>
        )}
      </section>
    </div>
  );
}
