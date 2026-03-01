'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateOrders } from '@/lib/mock-data';
import { applyFilters, filterOrdersBySearch, sortOrders, paginate } from '@/lib/mock-generator';
import { cn } from '@/lib/utils';
import type { TimeRange, ProductCategoryId, Order, OrderStatus } from '@/types';

interface OrdersTableProps {
  filters: {
    timeRange: TimeRange;
    productCategory: ProductCategoryId | 'all';
  };
}

function formatAmount(amount: number): string {
  return '¥' + amount.toLocaleString('zh-CN');
}

function formatOrderDate(date: Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_LABEL: Record<Order['status'], string> = {
  completed: '已完成',
  pending: '待处理',
  cancelled: '已取消',
};

function StatusBadge({ status }: { status: Order['status'] }) {
  const style =
    status === 'completed'
      ? 'bg-[#788c5d] text-white border-transparent'
      : status === 'pending'
        ? 'bg-amber-500/90 text-white border-transparent'
        : 'bg-gray-400 text-white border-transparent';
  return (
    <Badge variant="secondary" className={cn('font-medium', style)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const STATUS_FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'completed', label: '已完成' },
  { value: 'pending', label: '待处理' },
  { value: 'cancelled', label: '已取消' },
];

const PAGE_SIZE = 10;

export default function OrdersTable({ filters }: OrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState<'amount' | 'orderDate'>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const orders = generateOrders();
    let list = applyFilters(orders, {
      timeRange: filters.timeRange,
      category: filters.productCategory,
      status: statusFilter,
    });
    if (searchKeyword.trim()) {
      list = filterOrdersBySearch(list, searchKeyword.trim(), {
        fields: ['hospital', 'id'],
      });
    }
    return list;
  }, [filters.timeRange, filters.productCategory, statusFilter, searchKeyword]);

  // 筛选条件变化时重置到第一页，避免停留在空页
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 筛选变化时重置分页是预期行为
    setPage(1);
  }, [filters.timeRange, filters.productCategory, statusFilter, searchKeyword]);

  const { orders: pageOrders, totalPages, currentPage } = useMemo(() => {
    const sorted = sortOrders(filteredOrders, sortField, sortDirection);
    return paginate(sorted, page, PAGE_SIZE);
  }, [filteredOrders, sortField, sortDirection, page]);

  const handleSort = (field: 'amount' | 'orderDate') => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setPage(1);
  };

  const toolbar = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">状态：</span>
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={statusFilter === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(opt.value)}
            className={cn(statusFilter === opt.value && 'ring-2 ring-primary/30')}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="orders-search" className="text-sm text-muted-foreground whitespace-nowrap">
          搜索：
        </label>
        <input
          id="orders-search"
          type="text"
          placeholder="医院名称或订单号"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </>
  );

  const paginationUI = filteredOrders.length > 0 && (
    <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
      <span className="text-sm text-muted-foreground">
        第 {currentPage} / 共 {Math.max(1, totalPages)} 页
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          下一页
        </Button>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
      <h2 className="mb-2 md:mb-4 text-lg font-semibold text-foreground">订单明细</h2>

      {/* 手机/平板 <1280px：卡片列表 */}
      <div className="xl:hidden space-y-2 md:space-y-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {toolbar}
        </div>
        {pageOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <ul className="space-y-2 md:space-y-4">
            {pageOrders.map((order) => (
              <li key={order.id}>
                <article className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground">{order.hospital}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{order.product}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium text-foreground">
                        {formatAmount(order.amount)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
        {paginationUI}
      </div>

      {/* 桌面 ≥1280px：表格 */}
      <div className="hidden xl:block">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {toolbar}
        </div>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>医院名称</TableHead>
                <TableHead>产品名称</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('amount')}
                    className="inline-flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    金额
                    {sortField === 'amount' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('orderDate')}
                    className="inline-flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    下单时间
                    {sortField === 'orderDate' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                pageOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.hospital}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="text-right">{formatAmount(order.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">{formatOrderDate(order.orderDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {paginationUI}
      </div>
    </div>
  );
}
