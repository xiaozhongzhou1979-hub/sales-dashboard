import { PRODUCT_CATEGORIES } from './product-config';
import { DEMO_NOW, createSeededRng } from './mock-data';
import type {
  Order,
  TimeRange,
  OrderStatus,
  TrendData,
  KPIs,
  ProductCategory,
  FilterOptions,
} from '@/types';

/**
 * 数据过滤和计算工具
 * 提供订单过滤、KPI 计算等功能
 * 时间筛选使用与 mock 一致的 DEMO_NOW，保证 SSR/客户端结果一致
 */

// 根据时间范围过滤订单
export function filterOrdersByTimeRange(
  orders: Order[],
  timeRange: TimeRange
): Order[] {
  const now = new Date(DEMO_NOW.getTime());
  let startDate: Date;

  let endDate: Date | null = null;
  switch (timeRange) {
    case 'today': {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case '7days':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      startDate = new Date(now);
      const quarter = Math.floor(startDate.getMonth() / 3);
      startDate.setMonth(quarter * 3, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
  }

  return orders.filter((order) => {
    if (order.orderDate < startDate) return false;
    if (endDate && order.orderDate > endDate) return false;
    return true;
  });
}

// 根据产品分类过滤订单
export function filterOrdersByCategory(
  orders: Order[],
  category: FilterOptions['productCategory']
): Order[] {
  if (category === 'all' || !category) {
    return orders;
  }
  return orders.filter((order) => order.category === category);
}

// 根据状态过滤订单
export function filterOrdersByStatus(
  orders: Order[],
  status: OrderStatus | 'all'
): Order[] {
  if (status === 'all') {
    return orders;
  }
  return orders.filter((order) => order.status === status);
}

// 根据搜索关键词过滤订单
// options.fields 不传时默认搜索 hospital、product、id；表格搜索仅传 ['hospital','id']
export function filterOrdersBySearch(
  orders: Order[],
  search: string,
  options?: { fields?: Array<'hospital' | 'id' | 'product'> }
): Order[] {
  if (!search.trim()) {
    return orders;
  }
  const keyword = search.toLowerCase().trim();
  const fields = options?.fields ?? ['hospital', 'product', 'id'];
  return orders.filter((order) => {
    if (fields.includes('hospital') && order.hospital.toLowerCase().includes(keyword)) return true;
    if (fields.includes('id') && order.id.toLowerCase().includes(keyword)) return true;
    if (fields.includes('product') && order.product.toLowerCase().includes(keyword)) return true;
    return false;
  });
}

// 计算 KPI 指标（使用固定种子 RNG，保证 SSR/客户端一致）
export function calculateKPIs(orders: Order[]): KPIs {
  const rng = createSeededRng(0xb5e6a4);
  const completedOrders = orders.filter(
    (order) => order.status === 'completed'
  );

  const totalSales = orders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const todayOrders = completedOrders.length;
  const avgOrderValue =
    todayOrders > 0 ? totalSales / todayOrders : 0;

  const salesChange = parseFloat((rng() * 30 - 5).toFixed(1));
  const ordersChange = Math.floor(rng() * 10 - 3);
  const avgChange = parseFloat((rng() * 20 - 5).toFixed(1));
  const growthChange = parseFloat((rng() * 10 - 2).toFixed(1));

  return {
    totalSales: {
      value: Math.floor(totalSales),
      change: Math.abs(salesChange),
      trend: salesChange >= 0 ? 'up' : 'down',
    },
    todayOrders: {
      value: todayOrders,
      change: Math.abs(ordersChange),
      trend: ordersChange >= 0 ? 'up' : 'down',
    },
    avgOrderValue: {
      value: Math.floor(avgOrderValue),
      change: Math.abs(avgChange),
      trend: avgChange >= 0 ? 'up' : 'down',
    },
    growthRate: {
      value: parseFloat((rng() * 25 + 10).toFixed(1)),
      change: Math.abs(growthChange),
      trend: growthChange >= 0 ? 'up' : 'down',
    },
    achievementRate: {
      value: parseFloat((rng() * 25 + 70).toFixed(1)),
      gap: parseFloat((rng() * 15 + 5).toFixed(1)),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
  };
}

// 生成产品分类数据
export function generateProductCategoryData(
  orders: Order[]
): { categories: ProductCategory[]; total: number } {
  const categories = PRODUCT_CATEGORIES.map((category) => {
    const categoryOrders = orders.filter(
      (order) => order.category === category.id
    );
    const value = categoryOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const products = [
      ...new Set(categoryOrders.map((order) => order.product)),
    ];

    return {
      name: category.name,
      value,
      color: category.color,
      products,
      key: category.id,
    } as ProductCategory;
  });

  const total = orders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return { categories, total };
}

// 排序订单
export function sortOrders(
  orders: Order[],
  field: 'amount' | 'orderDate',
  direction: 'asc' | 'desc'
): Order[] {
  return [...orders].sort((a, b) => {
    let compareValue: number;

    if (field === 'amount') {
      compareValue = a.amount - b.amount;
    } else {
      compareValue =
        a.orderDate.getTime() - b.orderDate.getTime();
    }

    return direction === 'asc' ? compareValue : -compareValue;
  });
}

// 分页处理
export function paginate(
  orders: Order[],
  page: number,
  pageSize: number
): { orders: Order[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(orders.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    orders: orders.slice(startIndex, endIndex),
    totalPages,
    currentPage: page,
  };
}

/**
 * 从订单列表按时间粒度聚合为趋势数据（与全局时间筛选一致）
 * - 今日：1 个汇总点
 * - 近7天：7 个点（每天一个）
 * - 月度：自然月内按日
 * - 季度：自然季内按月（3 个点）
 * - 年：自然年内按月（12 个点）
 */
export function getTrendDataFromOrders(
  orders: Order[],
  timeRange: TimeRange
): TrendData[] {
  const now = new Date(DEMO_NOW.getTime());
  const toDateStr = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD

  if (timeRange === 'today') {
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    return [
      {
        date: toDateStr(now),
        salesAmount: total,
        orderCount: orders.length,
        avgOrderValue: orders.length > 0 ? Math.floor(total / orders.length) : 0,
      },
    ];
  }

  if (timeRange === '7days') {
    const result: TrendData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter(
        (o) => o.orderDate >= d && o.orderDate < next
      );
      const salesAmount = dayOrders.reduce((s, o) => s + o.amount, 0);
      result.push({
        date: toDateStr(d),
        salesAmount,
        orderCount: dayOrders.length,
        avgOrderValue:
          dayOrders.length > 0 ? Math.floor(salesAmount / dayOrders.length) : 0,
      });
    }
    return result;
  }

  if (timeRange === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const result: TrendData[] = [];
    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(year, month, day, 0, 0, 0, 0);
      const next = new Date(year, month, day + 1, 0, 0, 0, 0);
      const dayOrders = orders.filter(
        (o) => o.orderDate >= d && o.orderDate < next
      );
      const salesAmount = dayOrders.reduce((s, o) => s + o.amount, 0);
      result.push({
        date: toDateStr(d),
        salesAmount,
        orderCount: dayOrders.length,
        avgOrderValue:
          dayOrders.length > 0 ? Math.floor(salesAmount / dayOrders.length) : 0,
      });
    }
    return result;
  }

  if (timeRange === 'quarter') {
    const year = now.getFullYear();
    const startMonth = Math.floor(now.getMonth() / 3) * 3; // 0, 3, 6, 9
    const result: TrendData[] = [];
    for (let m = 0; m < 3; m++) {
      const month = startMonth + m;
      const d = new Date(year, month, 1, 0, 0, 0, 0);
      const next = new Date(year, month + 1, 1, 0, 0, 0, 0);
      const monthOrders = orders.filter(
        (o) => o.orderDate >= d && o.orderDate < next
      );
      const salesAmount = monthOrders.reduce((s, o) => s + o.amount, 0);
      result.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        salesAmount,
        orderCount: monthOrders.length,
        avgOrderValue:
          monthOrders.length > 0
            ? Math.floor(salesAmount / monthOrders.length)
            : 0,
      });
    }
    return result;
  }

  if (timeRange === 'year') {
    const year = now.getFullYear();
    const result: TrendData[] = [];
    for (let month = 0; month < 12; month++) {
      const d = new Date(year, month, 1, 0, 0, 0, 0);
      const next = new Date(year, month + 1, 1, 0, 0, 0, 0);
      const monthOrders = orders.filter(
        (o) => o.orderDate >= d && o.orderDate < next
      );
      const salesAmount = monthOrders.reduce((s, o) => s + o.amount, 0);
      result.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        salesAmount,
        orderCount: monthOrders.length,
        avgOrderValue:
          monthOrders.length > 0
            ? Math.floor(salesAmount / monthOrders.length)
            : 0,
      });
    }
    return result;
  }

  return [];
}

// 应用所有筛选条件
export function applyFilters(
  orders: Order[],
  filters: {
    timeRange?: TimeRange;
    category?: FilterOptions['productCategory'];
    status?: OrderStatus | 'all';
    search?: string;
  }
): Order[] {
  let filtered = [...orders];

  if (filters.timeRange) {
    filtered = filterOrdersByTimeRange(filtered, filters.timeRange);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filterOrdersByCategory(filtered, filters.category);
  }

  if (filters.status) {
    filtered = filterOrdersByStatus(filtered, filters.status);
  }

  if (filters.search) {
    filtered = filterOrdersBySearch(filtered, filters.search);
  }

  return filtered;
}
