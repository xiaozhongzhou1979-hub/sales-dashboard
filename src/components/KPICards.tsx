'use client';

import { useMemo } from 'react';
import KPICard from './KPICard';
import { generateOrders, DEMO_NOW } from '@/lib/mock-data';
import { calculateKPIs, filterOrdersByTimeRange, filterOrdersByCategory } from '@/lib/mock-generator';
import type { TimeRange, ProductCategoryId, KPIs } from '@/types';

interface KPICardsProps {
  filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  };
}

// 根据 timeRange 获取角标文案（使用与 mock 一致的基准日，保证 SSR/客户端一致）
function getBadgeLabel(timeRange: TimeRange): string {
  const now = DEMO_NOW;

  switch (timeRange) {
    case 'today':
      return '今日';
    case '7days':
      return '近7天';
    case 'month':
      return '本月';
    case 'quarter':
      return `Q${Math.floor(now.getMonth() / 3) + 1}`;
    case 'year':
      return '本年度';
    default:
      return '近7天';
  }
}

// 格式化KPI数值
function formatValue(key: keyof KPIs, value: number): string | number {
  switch (key) {
    case 'totalSales':
    case 'avgOrderValue': {
      // 金额优化显示：≥10,000 显示为万元，<10,000 显示为元
      if (value >= 10000) {
        const wanValue = (value / 10000).toFixed(2);
        return `¥${wanValue}万`;
      } else {
        return `¥${value.toLocaleString()}元`;
      }
    }
    case 'todayOrders':
      return value;
    case 'growthRate':
      return `${value}%`;
    case 'achievementRate':
      return `${value}%`;
    default:
      return value;
  }
}

export default function KPICards({ filters }: KPICardsProps) {
  const badgeLabel = getBadgeLabel(filters.timeRange);

  const kpis = useMemo(() => {
    const allOrders = generateOrders();
    let filteredOrders = filterOrdersByTimeRange(allOrders, filters.timeRange);
    if (filters.productCategory !== 'all') {
      filteredOrders = filterOrdersByCategory(filteredOrders, filters.productCategory);
    }
    return calculateKPIs(filteredOrders);
  }, [filters.timeRange, filters.productCategory]);

  return (
    <>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {/* 总销售额 */}
        <KPICard
          title="总销售额"
          value={formatValue('totalSales', kpis.totalSales.value)}
          badgeLabel={badgeLabel}
          change={kpis.totalSales.change}
          trend={kpis.totalSales.trend}
        />

        {/* 今日订单数：环比为较昨日变化（单数） */}
        <KPICard
          title="今日订单数"
          value={formatValue('todayOrders', kpis.todayOrders.value)}
          badgeLabel={badgeLabel}
          change={kpis.todayOrders.change}
          trend={kpis.todayOrders.trend}
          changeUnit="count"
        />

        {/* 客单价 */}
        <KPICard
          title="客单价"
          value={formatValue('avgOrderValue', kpis.avgOrderValue.value)}
          badgeLabel={badgeLabel}
          change={kpis.avgOrderValue.change}
          trend={kpis.avgOrderValue.trend}
        />

        {/* 环比增长率 */}
        <KPICard
          title="环比增长率"
          value={formatValue('growthRate', kpis.growthRate.value)}
          badgeLabel={badgeLabel}
          change={kpis.growthRate.change}
          trend={kpis.growthRate.trend}
        />

        {/* 达成率：距目标差距为百分比 */}
        <KPICard
          title="达成率"
          value={formatValue('achievementRate', kpis.achievementRate.value)}
          badgeLabel={badgeLabel}
          showProgress={true}
          progressValue={kpis.achievementRate.value}
          progressGapLabel={`距目标还差 ${kpis.achievementRate.gap}%`}
        />
      </div>
    </>
  );
}
