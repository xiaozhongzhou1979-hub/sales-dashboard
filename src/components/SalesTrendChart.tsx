'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { generateOrders } from '@/lib/mock-data';
import {
  filterOrdersByTimeRange,
  filterOrdersByCategory,
  getTrendDataFromOrders,
} from '@/lib/mock-generator';
import type { TimeRange, ProductCategoryId, TrendData } from '@/types';

const CHART_COLOR = '#6a9bcc';

type TrendMetric = 'sales' | 'orders' | 'avg';

interface SalesTrendChartProps {
  filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  };
}

// 纵轴：金额 ≥10000 用「万」，否则用「元」
function formatYAxis(value: number, isAmount: boolean): string {
  if (!isAmount) return String(value);
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return `${value}元`;
}

// Tooltip 金额格式：¥68,500
function formatAmount(n: number): string {
  return `¥${n.toLocaleString()}`;
}

// 根据 timeRange 格式化 X 轴显示（季度/年按月显示）
function formatXAxisLabel(dateStr: string, timeRange: TimeRange): string {
  if (timeRange === 'quarter' || timeRange === 'year') {
    const [, m] = dateStr.split('-');
    return `${parseInt(m ?? '0', 10)}月`;
  }
  if (timeRange === 'month' || timeRange === '7days' || timeRange === 'today') {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  return dateStr;
}

export default function SalesTrendChart({ filters }: SalesTrendChartProps) {
  const [metric, setMetric] = useState<TrendMetric>('sales');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 客户端挂载检测，避免 hydration 不一致
    setMounted(true);
  }, []);

  const trendData = useMemo(() => {
    if (!mounted) return [];
    const orders = generateOrders();
    let filtered = filterOrdersByTimeRange(orders, filters.timeRange);
    if (filters.productCategory !== 'all') {
      filtered = filterOrdersByCategory(filtered, filters.productCategory);
    }
    return getTrendDataFromOrders(filtered, filters.timeRange);
  }, [filters, mounted]);

  const isToday = filters.timeRange === 'today';
  const isAmountMetric = metric === 'sales' || metric === 'avg';
  const dataKey =
    metric === 'sales'
      ? 'salesAmount'
      : metric === 'orders'
        ? 'orderCount'
        : 'avgOrderValue';

  const metricLabel =
    metric === 'sales' ? '销售额' : metric === 'orders' ? '订单数' : '客单价';

  const maxValue = useMemo(() => {
    if (trendData.length === 0) return 0;
    const values = trendData.map((d) =>
      metric === 'sales'
        ? d.salesAmount
        : metric === 'orders'
          ? d.orderCount
          : d.avgOrderValue
    );
    return Math.max(...values, 1);
  }, [trendData, metric]);

  const yAxisTickFormatter = (value: number) =>
    formatYAxis(value, isAmountMetric);

  const customTooltip = (props: { active?: boolean; payload?: readonly { payload: TrendData }[] }) => {
    const { active, payload } = props;
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-lg border border-[var(--color-anthropic-border)] bg-[var(--color-background)] px-3 py-2 shadow-md">
        <div className="text-sm font-medium text-foreground">
          {formatXAxisLabel(p.date, filters.timeRange)}
          {filters.timeRange === 'quarter' || filters.timeRange === 'year'
            ? ` (${p.date.slice(0, 7)})`
            : ''}
        </div>
        <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
          <div>销售额：{formatAmount(p.salesAmount)}</div>
          <div>订单数：{p.orderCount}</div>
          <div>客单价：{formatAmount(p.avgOrderValue)}</div>
        </div>
      </div>
    );
  };

  if (!mounted || trendData.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-anthropic-border)] bg-card p-6">
        <div className="h-[320px] flex items-center justify-center text-muted-foreground">
          加载中…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-anthropic-border)] bg-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2
          className="text-lg font-semibold text-foreground"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          销售趋势
        </h2>
        <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
          {(
            [
              { key: 'sales' as const, label: '销售额' },
              { key: 'orders' as const, label: '订单数' },
              { key: 'avg' as const, label: '客单价' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                metric === key
                  ? 'bg-[var(--color-anthropic-accent)] text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {isToday ? (
            <BarChart
              data={trendData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatXAxisLabel(v, 'today')}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis
                tickFormatter={yAxisTickFormatter}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                width={48}
              />
              <Tooltip content={customTooltip} />
              <Bar
                dataKey={dataKey}
                fill={CHART_COLOR}
                radius={[6, 6, 0, 0]}
                name={metricLabel}
              />
            </BarChart>
          ) : (
            <LineChart
              data={trendData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-anthropic-border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatXAxisLabel(v, filters.timeRange)}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis
                tickFormatter={yAxisTickFormatter}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                width={48}
              />
              <Tooltip content={customTooltip} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={CHART_COLOR}
                strokeWidth={2}
                dot={{ fill: CHART_COLOR, r: 4 }}
                activeDot={{ r: 6, fill: CHART_COLOR }}
                name={metricLabel}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {isAmountMetric && (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          纵轴单位：{maxValue >= 10000 ? '万' : '元'}
        </p>
      )}
    </div>
  );
}
