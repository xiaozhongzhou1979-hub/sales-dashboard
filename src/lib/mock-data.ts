import { PRODUCTS, HOSPITALS, ORDER_STATUS } from './product-config';
import type { Order, ProductCategoryId, TrendData, KPIs } from '@/types';

/**
 * Mock 数据生成
 * 根据 product-config.ts 中的配置生成模拟数据
 *
 * 生成逻辑：
 * - 今日：1-2条订单
 * - 近7天：5-8条订单（包括今日的）
 * - 本月：10-15条订单（包括近7天的）
 * - 剩余：均匀分布在过去365天
 *
 * 使用固定种子随机数，保证服务端与客户端渲染结果一致，避免 Hydration 报错。
 */

/** 固定基准日，保证 SSR 与客户端同一份数据（供 mock-generator 时间筛选一致） */
export const DEMO_NOW = new Date('2026-03-01T12:00:00.000Z');

/**
 * 固定种子随机数生成器（mulberry32）
 * 相同种子在服务端与客户端产生相同序列，避免 hydration mismatch
 */
export function createSeededRng(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 生成随机数（接受可选 rng，用于确定性生成）
function randomInt(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// 生成随机浮点数
function randomFloat(min: number, max: number, decimals = 2, rng: () => number = Math.random): number {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

// 格式化日期
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// 生成订单号（使用传入的 rng 保证确定性）
function generateOrderId(date: Date, rng: () => number): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = rng().toString(36).substring(2, 8).toUpperCase();
  return `SO${dateStr}${random}`;
}

// 辅助函数：为指定日期创建订单（使用传入的 rng）
function createOrderForDate(orderDate: Date, rng: () => number): Order {
  const hospital = HOSPITALS[randomInt(0, HOSPITALS.length - 1, rng)];
  const product = PRODUCTS[randomInt(0, PRODUCTS.length - 1, rng)];
  const status = ORDER_STATUS[randomInt(0, ORDER_STATUS.length - 1, rng)].value;

  const basePrice = product.basePrice;
  const priceVariation = randomInt(-30000, 50000, rng);
  let amount = basePrice + priceVariation;
  amount = Math.max(15000, Math.min(280000, amount));

  if (status === 'cancelled' && rng() < 0.7) {
    amount = Math.floor(amount * 0.3);
  }

  return {
    id: generateOrderId(orderDate, rng),
    hospital: hospital.name,
    product: product.name,
    category: product.category as ProductCategoryId,
    amount,
    status,
    orderDate,
  };
}

/**
 * 生成订单数据
 * 使用固定种子与基准日，保证 SSR 与客户端输出一致，避免 hydration 报错
 */
export function generateOrders(count = 100): Order[] {
  const rng = createSeededRng(0x4d2a1f); // 固定种子
  const orders: Order[] = [];
  const now = new Date(DEMO_NOW.getTime());

  const todayOrderCount = randomInt(1, 2, rng);
  for (let i = 0; i < todayOrderCount; i++) {
    orders.push(createOrderForDate(now, rng));
  }

  const weekAdditionalCount = randomInt(4, 6, rng);
  for (let i = 0; i < weekAdditionalCount; i++) {
    const daysAgo = randomInt(1, 6, rng);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randomInt(0, 23, rng), randomInt(0, 59, rng), 0, 0);
    orders.push(createOrderForDate(date, rng));
  }

  const monthAdditionalCount = randomInt(6, 10, rng);
  for (let i = 0; i < monthAdditionalCount; i++) {
    const daysAgo = randomInt(7, 30, rng);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randomInt(0, 23, rng), randomInt(0, 59, rng), 0, 0);
    orders.push(createOrderForDate(date, rng));
  }

  const remainingCount = Math.max(0, count - orders.length);
  for (let i = 0; i < remainingCount; i++) {
    const daysAgo = randomInt(31, 364, rng);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randomInt(0, 23, rng), randomInt(0, 59, rng), 0, 0);
    orders.push(createOrderForDate(date, rng));
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}

// 生成销售趋势数据（固定种子 + 基准日，保证 SSR/客户端一致）
export function generateTrendData(days = 30): TrendData[] {
  const rng = createSeededRng(0x7e3b2c);
  const data: TrendData[] = [];
  const today = new Date(DEMO_NOW.getTime());

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseAmount = 500000;
    const variation = randomInt(-200000, 200000, rng);
    const salesAmount = Math.max(150000, baseAmount + variation);

    const baseOrders = 15;
    const orderVariation = randomInt(-8, 8, rng);
    const orderCount = Math.max(5, baseOrders + orderVariation);

    data.push({
      date: formatDate(date),
      salesAmount,
      orderCount,
      avgOrderValue: Math.floor(salesAmount / orderCount),
    });
  }

  return data;
}

// 生成 KPI 数据（固定种子，保证 SSR/客户端一致）
export function generateKPIData(): KPIs {
  const rng = createSeededRng(0x9f4c3d);
  return {
    totalSales: {
      value: randomInt(5000000, 15000000, rng),
      change: randomFloat(-10, 25, 2, rng),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
    todayOrders: {
      value: randomInt(8, 35, rng),
      change: randomInt(-5, 8, rng),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
    avgOrderValue: {
      value: randomInt(100000, 200000, rng),
      change: randomFloat(-8, 15, 2, rng),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
    growthRate: {
      value: randomFloat(5, 35, 2, rng),
      change: randomFloat(-5, 10, 2, rng),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
    achievementRate: {
      value: randomFloat(60, 95, 2, rng),
      gap: randomFloat(5, 40, 2, rng),
      trend: rng() > 0.5 ? 'up' : 'down',
    },
  };
}

// 生成产品分类数据
