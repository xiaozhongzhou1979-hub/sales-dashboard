/**
 * 数据类型定义
 * 所有接口类型集中在此文件维护
 */

// 订单状态类型
export type OrderStatus = 'completed' | 'pending' | 'cancelled';

// 时间范围类型
export type TimeRange = 'today' | '7days' | 'month' | 'quarter' | 'year';

// 产品分类类型
export type ProductCategoryId = 'knee' | 'hip' | 'trauma' | 'spine' | 'sports';

// 订单数据接口
export interface Order {
  id: string;                        // 订单号（格式：SO + 时间戳）
  hospital: string;                  // 客户名（医院名称）
  product: string;                   // 产品名称
  category: ProductCategoryId;       // 产品分类
  amount: number;                    // 金额（¥15,000 - ¥280,000）
  status: OrderStatus;               // 订单状态
  orderDate: Date;                   // 下单时间
}

// 销售趋势数据接口
export interface TrendData {
  date: string;                      // 日期（YYYY-MM-DD）
  salesAmount: number;               // 日销售额
  orderCount: number;                // 日订单数
  avgOrderValue: number;             // 平均客单价
}

// KPI 指标数据接口
export interface KPIs {
  totalSales: {                      // 总销售额
    value: number;                   // 金额
    change: number;                  // 环比变化（百分比）
    trend?: 'up' | 'down';           // 趋势
  };
  todayOrders: {                     // 今日订单数
    value: number;                   // 单数
    change: number;                  // 较昨日变化（单数）
    trend?: 'up' | 'down';           // 趋势
  };
  avgOrderValue: {                   // 客单价
    value: number;                   // 平均金额
    change: number;                  // 环比变化（百分比）
    trend?: 'up' | 'down';           // 趋势
  };
  growthRate: {                      // 环比增长率
    value: number;                   // 百分比
    change: number;                  // 较上月变化（百分比）
    trend?: 'up' | 'down';           // 趋势
  };
  achievementRate: {                 // 达成率
    value: number;                   // 百分比
    gap: number;                     // 距目标差距（百分比）
    trend?: 'up' | 'down';           // 趋势
  };
}

// 产品分类数据接口
export interface ProductCategory {
  name: string;                      // 分类名称
  value: number;                     // 销售额/占比
  color: string;                     // 图表颜色
  products: string[];                // 该分类包含的产品列表
  key: ProductCategoryId;            // 分类ID
}

// 医院信息接口
export interface Hospital {
  name: string;                      // 医院名称
  city: string;                      // 所在城市
  level: string;                     // 医院等级（三甲/三乙等）
}

// 产品信息接口
export interface Product {
  name: string;                      // 产品名称
  category: ProductCategoryId;       // 产品分类
  basePrice: number;                 // 基础价格
}

// 产品配置接口
export interface ProductConfig {
  name: string;                      // 分类名称
  color: string;                     // 分类颜色
  id: ProductCategoryId;             // 分类ID
}

// 订单状态配置接口
export interface OrderStatusConfig {
  value: OrderStatus;                // 状态值
  label: string;                     // 状态显示文本
  color: string;                     // 状态颜色
}

// 时间范围配置接口
export interface TimeRangeConfig {
  value: TimeRange;                  // 时间范围值
  label: string;                     // 时间范围显示文本
  days: number;                      // 对应天数
}

// 筛选条件接口
export interface FilterOptions {
  timeRange: TimeRange;              // 时间范围
  productCategory?: ProductCategoryId | 'all'; // 产品分类
}

// 分页接口
export interface PaginationData {
  currentPage: number;               // 当前页码
  pageSize: number;                  // 每页条数
  totalCount: number;                // 总条数
  totalPages: number;                // 总页数
}

// 表格排序接口
export interface SortOptions {
  field: 'amount' | 'orderDate';     // 排序字段
  direction: 'asc' | 'desc';         // 排序方向
}

// 订单列表响应接口
export interface OrdersResponse {
  orders: Order[];                   // 订单列表
  pagination: PaginationData;        // 分页信息
}

// Mock 数据生成器接口
export interface MockDataGenerator {
  generateOrders: (count: number) => Order[];
  generateTrendData: (days: number) => TrendData[];
  generateKPIData: () => KPIs;
  filterOrdersByTimeRange: (orders: Order[], timeRange: TimeRange) => Order[];
  filterOrdersByCategory: (orders: Order[], category?: ProductCategoryId | 'all') => Order[];
}
