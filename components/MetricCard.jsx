import { formatMetricValue } from '@/lib/metrics';

const SPARKLINE_WIDTH = 140;
const SPARKLINE_HEIGHT = 36;
const STATUS_COLORS = {
  'on-track': '#22c55e',
  'at-risk': '#dc2626',
  unknown: '#94a3b8',
};

const buildSparklinePath = (series = []) => {
  if (!series.length) return '';
  const values = series.map((point) => (Number.isFinite(point?.value) ? Number(point.value) : null));
  const validValues = values.filter((value) => value !== null);
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

  values.forEach((value, idx) => {
    const x = idx * step;
    const y =
      value === null
        ? prevY
        : SPARKLINE_HEIGHT - ((value - min) / range) * SPARKLINE_HEIGHT || SPARKLINE_HEIGHT / 2;
    if (idx === 0) {
      path = `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
    prevY = y;
  });

  return path;
};

const MetricSparkline = ({ series, status }) => {
  if (!series?.length) return null;
  const path = buildSparklinePath(series);
  const stroke = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  return (
    <svg
      className="metric-card__sparkline-chart"
      width={SPARKLINE_WIDTH}
      height={SPARKLINE_HEIGHT}
      viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Recent trend sparkline"
    >
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function MetricCard({ metric, index = 0 }) {
  if (!metric) return null;

  const statusClass = metric.status === 'on-track' ? 'status-on-track' : metric.status === 'at-risk' ? 'status-at-risk' : 'status-unknown';
  const latestPeriod = metric.latest?.period || '—';
  const latestValue =
    metric.latest?.value !== null && metric.latest?.value !== undefined
      ? formatMetricValue(metric.latest?.value, { isPercent: metric.panic?.isPercent })
      : metric.latest?.raw || '—';
  const sparklineSeries = metric.series?.slice(-12);
  const panicText = metric.panic?.text ? metric.panic.text.replace(/^p:\s*/i, '') : '—';

  return (
    <article className={`metric-card ${statusClass}`} style={{ '--card-index': index }}>
      <p className="metric-card__category">{metric.category}</p>
      <h3 className="metric-card__title">{metric.name}</h3>
      {metric.description && <p className="metric-card__description">{metric.description}</p>}
      <div className="metric-card__values">
        <div>
          <p className="label">Latest ({latestPeriod})</p>
          <p className="value">{latestValue}</p>
        </div>
        <div>
          <p className="label">Panic</p>
          <p className="value">{panicText}</p>
        </div>
      </div>
      {sparklineSeries?.length > 1 && (
        <div className="metric-card__sparkline" aria-hidden="true">
          <MetricSparkline series={sparklineSeries} status={metric.status || 'unknown'} />
        </div>
      )}
      <footer className="metric-card__footer">
        <span className="status-pill">{(metric.status || 'unknown').replace('-', ' ')}</span>
        <span className="metric-card__meta">{metric.panic?.isPercent ? 'Percent-based' : 'Absolute value'}</span>
      </footer>
    </article>
  );
}
