'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  badgeLabel?: string;
  change?: number;
  trend?: 'up' | 'down';
  /** 环比单位：'percent' 显示百分比，'count' 显示单数（如今日订单数） */
  changeUnit?: 'percent' | 'count';
  showProgress?: boolean;
  progressValue?: number;
  /** 达成率时：距目标差距的文案（如 "距目标还差 21.5%"） */
  progressGapLabel?: string;
}

export default function KPICard({
  title,
  value,
  badgeLabel = '',
  change,
  trend = 'up',
  changeUnit = 'percent',
  showProgress = false,
  progressValue = 0,
  progressGapLabel,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* 卡片头部 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {badgeLabel && (
          <span
            className="text-xs font-medium px-2.5 py-1 rounded"
            style={{ backgroundColor: 'rgba(217,119,87,0.15)', color: 'var(--color-anthropic-accent, #d97757)' }}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      {/* 主数值 */}
      <div className="text-3xl font-bold text-gray-900 mb-4">{value}</div>

      {/* 环比变化或进度条 */}
      {showProgress ? (
        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progressValue}%`, backgroundColor: 'var(--color-anthropic-accent, #d97757)' }}
            />
          </div>
          {progressGapLabel && (
            <span className="text-xs text-muted-foreground">{progressGapLabel}</span>
          )}
        </div>
      ) : (
        typeof change === 'number' && (
          <div className="flex items-center gap-2">
            {trend === 'up' ? (
              <>
                <TrendingUp className="w-4 h-4 shrink-0" style={{ color: '#788c5d' }} />
                <span className="text-sm font-medium" style={{ color: '#788c5d' }}>
                  {changeUnit === 'count' ? `+${change} 单` : `+${change}%`}
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 shrink-0" style={{ color: '#c0392b' }} />
                <span className="text-sm font-medium" style={{ color: '#c0392b' }}>
                  {changeUnit === 'count' ? `-${change} 单` : `${change}%`}
                </span>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}
