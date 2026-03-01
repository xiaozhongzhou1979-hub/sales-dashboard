'use client';

import { useState, useEffect } from 'react';
import GlobalFilters from '@/components/GlobalFilters';
import KPICards from '@/components/KPICards';
import SalesTrendChart from '@/components/SalesTrendChart';
import OrdersTable from '@/components/OrdersTable';
import ProductPieChart from '@/components/ProductPieChart';
import type { TimeRange, ProductCategoryId } from '@/types';

export default function Home() {
  // 筛选器状态管理
  const [filters, setFilters] = useState<{ timeRange: TimeRange; productCategory: ProductCategoryId | 'all' }>({
    timeRange: '7days',
    productCategory: 'all',
  });
  // 筛选切换时的加载状态，避免切换瞬间无反馈
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const handleFilterChange = (newFilters: { timeRange: TimeRange; productCategory: ProductCategoryId | 'all' }) => {
    setFilters(newFilters);
    setIsFilterLoading(true);
  };

  useEffect(() => {
    if (!isFilterLoading) return;
    const t = setTimeout(() => setIsFilterLoading(false), 400);
    return () => clearTimeout(t);
  }, [isFilterLoading]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
              骨科销售仪表盘
            </h1>
            <p className="text-lg text-muted-foreground">
              Stryker 模拟数据
            </p>
          </div>
        </div>

        {/* 全局筛选器 */}
        <div className="mb-8">
          <GlobalFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* 数据区域：筛选切换时显示 loading 遮罩 */}
        <div className="relative">
          {isFilterLoading && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-[2px]"
              aria-busy="true"
              aria-label="正在更新数据"
            >
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-anthropic-accent)] border-t-transparent" />
            </div>
          )}
          {/* KPI 卡片区域 */}
          <div className="mb-8">
            <KPICards filters={filters} />
          </div>

          {/* 销售趋势图 */}
          <div className="mb-8">
            <SalesTrendChart filters={filters} />
          </div>

          {/* 产品分类饼图 */}
          <div className="mb-8">
            <ProductPieChart filters={filters} />
          </div>

          {/* 订单明细表格 */}
          <div className="mb-8">
            <OrdersTable filters={filters} />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          视觉优化已完成：页面居中 + 筛选器样式优化
        </div>
      </div>
    </div>
  );
}
