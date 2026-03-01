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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-6">
        {/* 时间维度筛选器 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">时间范围</span>
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${timeRange === range.value
                    ? 'bg-anthropic-accent text-white shadow-sm'
                    : 'text-gray-500 hover:bg-white hover:text-gray-700'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* 产品维度筛选器 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">产品分类</span>
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
            {/* 全部选项 */}
            <button
              onClick={() => handleProductCategoryChange('all')}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${productCategory === 'all'
                  ? 'bg-anthropic-accent text-white shadow-sm'
                  : 'text-gray-500 hover:bg-white hover:text-gray-700'
                }
              `}
            >
              全部
            </button>

            {/* 动态产品分类选项 */}
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleProductCategoryChange(category.id as ProductCategoryId)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${productCategory === category.id
                    ? 'bg-anthropic-accent text-white shadow-sm'
                    : 'text-gray-500 hover:bg-white hover:text-gray-700'
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
