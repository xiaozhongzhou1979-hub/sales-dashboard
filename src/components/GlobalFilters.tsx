'use client';

import { PRODUCT_CATEGORIES, TIME_RANGES } from '@/lib/product-config';
import type { TimeRange, ProductCategoryId } from '@/types';

interface GlobalFiltersProps {
  filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  };
  onFilterChange: (filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  }) => void;
}

export default function GlobalFilters({ filters, onFilterChange }: GlobalFiltersProps) {
  const { timeRange, productCategory } = filters;

  const handleTimeRangeChange = (value: TimeRange) => {
    onFilterChange({ timeRange: value, productCategory });
  };

  const handleProductCategoryChange = (value: ProductCategoryId | 'all') => {
    onFilterChange({ timeRange, productCategory: value });
  };

  const productCategoryValue = productCategory === 'all' ? 'all' : productCategory;

  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      {/* 手机 <768px：两个 select 各占 50%，一行 */}
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label htmlFor="filter-time-mobile" className="text-sm font-medium text-foreground">
            时间范围
          </label>
          <select
            id="filter-time-mobile"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label htmlFor="filter-product-mobile" className="text-sm font-medium text-foreground">
            产品分类
          </label>
          <select
            id="filter-product-mobile"
            value={productCategoryValue}
            onChange={(e) =>
              handleProductCategoryChange(
                e.target.value === 'all' ? 'all' : (e.target.value as ProductCategoryId)
              )
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">全部</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 平板 768px–1279px：时间 pill 按钮 + 产品 select */}
      <div className="hidden md:flex xl:hidden items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">时间范围</span>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${timeRange === range.value
                    ? 'bg-[var(--color-anthropic-accent)] text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-border shrink-0" aria-hidden />
        <div className="flex items-center gap-2">
          <label htmlFor="filter-product-tablet" className="text-sm font-medium text-foreground">
            产品分类
          </label>
          <select
            id="filter-product-tablet"
            value={productCategoryValue}
            onChange={(e) =>
              handleProductCategoryChange(
                e.target.value === 'all' ? 'all' : (e.target.value as ProductCategoryId)
              )
            }
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground min-w-[140px]"
          >
            <option value="all">全部</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 桌面 ≥1280px：保持现有两组 pill 按钮 */}
      <div className="hidden xl:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">时间范围</span>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${timeRange === range.value
                    ? 'bg-[var(--color-anthropic-accent)] text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-border" aria-hidden />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">产品分类</span>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => handleProductCategoryChange('all')}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${productCategory === 'all'
                  ? 'bg-[var(--color-anthropic-accent)] text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
                }
              `}
            >
              全部
            </button>
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleProductCategoryChange(category.id as ProductCategoryId)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${productCategory === category.id
                    ? 'bg-[var(--color-anthropic-accent)] text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
