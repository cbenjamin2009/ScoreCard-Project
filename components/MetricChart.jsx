import { useMemo } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatMetricValue } from '@/lib/metrics';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const STATUS_COLORS = {
  'on-track': { stroke: '#0f766e', fill: 'rgba(20, 184, 166, 0.2)' },
  'at-risk': { stroke: '#dc2626', fill: 'rgba(248, 113, 113, 0.2)' },
  unknown: { stroke: '#64748b', fill: 'rgba(148, 163, 184, 0.2)' },
};

const buildDataset = (metric) => {
  const labels = metric.series.map((point) => point.period);
  const data = metric.series.map((point) => point.value);
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
      pointRadius: 3,
    },
  ];

  if (metric.panic?.threshold !== null && metric.panic?.threshold !== undefined) {
    datasets.push({
      label: 'Panic threshold',
      data: labels.map(() => metric.panic.threshold),
      borderColor: '#1f2937',
      borderDash: [4, 4],
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
    });
  }

  return { labels, datasets };
};

export default function MetricChart({ metric }) {
  const chartConfig = useMemo(() => buildDataset(metric), [metric]);

  return (
    <div className="metric-chart">
      <Line
        data={chartConfig}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  if (value === null) return `${label}: —`;
                  const formatted = formatMetricValue(value, { isPercent: metric.panic?.isPercent });
                  return `${label}: ${formatted}`;
                },
              },
            },
          },
          interaction: { intersect: false, mode: 'index' },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: 'rgba(75,85,99,0.15)' },
              ticks: {
                callback: (value) =>
                  formatMetricValue(value, { isPercent: metric.panic?.isPercent }),
              },
            },
            x: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
}
