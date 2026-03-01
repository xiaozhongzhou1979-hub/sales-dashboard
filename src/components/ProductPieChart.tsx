'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateOrders } from '@/lib/mock-data';
import {
  filterOrdersByTimeRange,
  generateProductCategoryData,
} from '@/lib/mock-generator';
import type { TimeRange, ProductCategoryId, ProductCategory } from '@/types';

interface ProductPieChartProps {
  filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  };
}

// 金额格式：¥68,500
function formatAmount(n: number): string {
  return `¥${n.toLocaleString()}`;
}

export default function ProductPieChart({ filters }: ProductPieChartProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 客户端挂载检测，避免 hydration 不一致
    setMounted(true);
  }, []);

  // 饼图仅按时间筛选，不按产品分类筛选（始终展示全部分类占比）
  const { categories, total } = useMemo(() => {
    if (!mounted) return { categories: [] as ProductCategory[], total: 0 };
    const orders = generateOrders();
    const filtered = filterOrdersByTimeRange(orders, filters.timeRange);
    return generateProductCategoryData(filtered);
  }, [filters.timeRange, mounted]);

  // 过滤掉 value <= 0，避免 Recharts 异常或 0% 扇区
  const pieData = useMemo(
    () => categories.filter((c) => c.value > 0),
    [categories]
  );

  const isEmpty = pieData.length === 0;

  const handleSectorClick = useCallback((_: unknown, index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-[var(--color-anthropic-border)] bg-card p-6">
        <div className="h-[320px] flex items-center justify-center text-muted-foreground">
          加载中…
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-[var(--color-anthropic-border)] bg-card p-6">
        <h2
          className="mb-4 text-lg font-semibold text-foreground"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          产品分类占比
        </h2>
        <div className="flex h-[280px] items-center justify-center text-muted-foreground">
          当前筛选下暂无数据
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-anthropic-border)] bg-card p-6">
      <h2
        className="mb-4 text-lg font-semibold text-foreground"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        产品分类占比
      </h2>

      <div className="flex flex-wrap items-stretch gap-4">
        <div className="h-[280px] min-w-[240px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                onClick={handleSectorClick}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={entry.color}
                    stroke={selectedIndex === index ? entry.color : undefined}
                    strokeWidth={selectedIndex === index ? 3 : 1}
                    opacity={selectedIndex === null || selectedIndex === index ? 1 : 0.65}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 动态图例：颜色 + 分类名称 + 占比 + 金额；点击可选中，与扇区联动高亮 */}
        <div className="flex min-w-[200px] flex-col justify-center gap-2">
          {pieData.map((item, index) => {
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
            const isHighlight = selectedIndex === index;
            return (
              <div
                key={item.key}
                role="button"
                tabIndex={0}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  isHighlight ? 'bg-muted font-semibold' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedIndex((prev) => (prev === index ? null : index))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev === index ? null : index));
                  }
                }}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 truncate text-foreground">{item.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  {percent}% · {formatAmount(item.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
