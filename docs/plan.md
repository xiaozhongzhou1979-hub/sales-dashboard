# 项目开发计划 - 医疗器械销售仪表盘

## 项目目标
打造一个面向销售经理和区域代表的 Stryker 骨科产品销售数据仪表盘，通过可视化数据帮助用户快速了解业务健康度，提高决策效率。

---

## 里程碑规划

### 里程碑 1：项目基础搭建（最小可见成果）
**目标**：在浏览器中能看到带有 Anthropic 配色方案的基础页面

**任务清单**：
- 从 Google Fonts 引入 Poppins 字体，在 layout.tsx 中配置字体栈
- 更新 globals.css，定义 Anthropic 暖色系的 CSS 变量
- 修改 tailwind.config.js，添加自定义颜色配置
- 简化 page.tsx，创建一个欢迎页面测试配色方案

**完成标准**：
- 运行 `npm run dev` 后能在浏览器访问 http://localhost:3000
- 页面应用了 Anthropic 配色方案（奶油白背景 #faf9f5，砖橙强调色 #d97757）
- 标题使用 Poppins 字体，正文使用系统字体栈

---

### 里程碑 2：Mock 数据结构设计
**目标**：创建完整的 Mock 数据结构和数据生成函数

**任务清单**：
- 定义 TypeScript 接口：Order（订单）、Product（产品）、Hospital（医院）、KPI（关键指标）
- 创建产品分类枚举（膝关节、髋关节、创伤与四肢、脊柱、运动医学）
- 编写医院信息数组（包含 20+ 三甲医院）
- 编写产品信息数组（Stryker 真实产品：Triathlon、Accolade、T2 髓内钉等）
- 实现 Mock 数据生成函数：
  - 生成 100 条订单数据（金额 15,000-280,000 元）
  - 生成 7 天销售趋势数据
  - 生成 5 个 KPI 指标数据

**完成标准**：
- 所有接口定义完成，TypeScript 不报错
- 数据生成函数能正确产出符合规范的 Mock 数据
- 在浏览器控制台通过 console.log 验证数据结构正确性
- 医院名称使用真实三甲医院名，产品名符合 Stryker 真实产品线

---

### 里程碑 3：全局筛选器（完整 UI + 状态管理）
**目标**：在页面顶部实现完整功能的全局筛选器

**任务清单**：
- 创建 GlobalFilters.tsx 组件
- 实现时间维度选择：今日 / 近7天 / 近30天 / 近90天
- 实现产品维度选择：全部 / 膝关节 / 髋关节 / 创伤与四肢 / 脊柱 / 运动医学
- 用 React useState 管理两个筛选状态
- 放置在页面顶部 Header 右侧
- 应用 Anthropic 配色规范

**完成标准**：
- 筛选器显示在页面顶部
- 点击可以切换时间和产品维度
- 状态正确更新（console.log 可验证）
- 样式符合设计规范

---

### 里程碑 4：KPI 卡片组件（接入筛选器状态）
**目标**：实现 5 张 KPI 卡片，接入全局筛选状态

**任务清单**：
- 创建 KPI 卡片 UI 组件（src/components/KPICard.tsx）
- 创建 KPI 卡片容器组件（src/components/KPICards.tsx）
- 在 page.tsx 中集成 KPICards 组件
- 将 Mock 数据传入 KPI 卡片
- 实现环比变化指示器（正向：橄榄绿 + 上箭头，负向：暗红 + 下箭头）
- 应用设计系统样式：卡片圆角 rounded-2xl，间距 p-6
- 接入筛选器状态，响应筛选变化重新计算 KPI 数据

**完成标准**：
- 页面顶部显示 5 张横向排列的 KPI 卡片
- 每个卡片显示：标题、数值、环比变化
- 正向指标显示为 #788c5d（橄榄绿）+ 上箭头
- 负向指标显示为 #c0392b（暗红）+ 下箭头
- 卡片样式符合高级设计感，避免模板风
- 改变筛选条件后，KPI 数据同步更新

---

### 里程碑 5：销售趋势折线图（接入筛选器状态）
**目标**：实现可切换的销售趋势图表，接入全局筛选状态

**任务清单**：
- 按时间范围 + 产品分类筛选订单，聚合生成趋势数据（见下方「时间粒度」）
- 创建趋势图表组件（src/components/SalesTrendChart.tsx）
- 使用 Recharts 实现折线图
- 添加图表切换功能：销售额 / 订单数 / 客单价
- 使用雾蓝色 #6a9bcc 作为折线颜色
- 在组件顶部添加 "use client" 指令
- 将图表组件集成到 page.tsx
- 接入筛选器状态，响应筛选变化重新获取数据

**时间粒度（与全局时间筛选一致）**：
- 今日：1 个汇总点，**用柱状图 BarChart** 展示（近7天/月度/季度/年用折线图）
- 近7天：7 个点，每天一个（折线图）
- 月度：自然月内按日（当月每日一个点）（折线图）
- 季度：自然季内按月（如 Q1：1月、2月、3月）（折线图）
- 年：自然年内按月（1月～12月）（折线图）

**纵轴单位（金额时）**：
- 数值 ≥ 10000：单位用「万」（如 6.85万）
- 数值 < 10000：单位用「元」

**Tooltip（悬停）**：
- 至少显示：日期、销售额、订单数（切换为客单价时显示对应数值）
- 金额格式友好：如 ¥68,500（千分位）

**完成标准**：
- 页面上显示销售趋势图：**今日**用柱状图 BarChart；**近7天/月度/季度/年**用折线图；横轴与数据随「时间范围 + 产品分类」筛选变化
- 可通过按钮切换显示销售额、订单数、客单价三种数据
- 折线图使用雾蓝色 #6a9bcc，符合设计规范
- 图表有平滑的曲线和适当的网格线；纵轴单位按上述规则（万/元）
- 悬停 Tooltip 显示日期、销售额、订单数，金额格式为 ¥68,500 形式
- 切换时有明显的交互反馈
- 改变筛选条件后，图表数据同步更新

---

### 里程碑 6：产品分类饼图（接入筛选器状态）
**目标**：实现 Stryker 骨科产品分类的饼图，接入全局筛选状态

**任务清单**：
- 生成产品分类数据的 Mock 数据
- 创建饼图组件（src/components/ProductPieChart.tsx）
- 使用 Recharts 实现饼图
- 为不同分类分配颜色（砖橙 #d97757、雾蓝 #6a9bcc、橄榄绿 #788c5d 等）
- 在饼图中显示数值和百分比
- 添加图例说明每个分类对应的骨科产品
- 在组件顶部添加 "use client" 指令
- 将饼图组件集成到页面布局中
- 接入筛选器状态，响应筛选变化重新计算分类数据

**完成标准**：
- 页面上显示产品分类饼图
- 包含 5 个分类：膝关节、髋关节、创伤与四肢、脊柱、运动医学
- 每个分类有不同颜色且易于区分
- 鼠标悬停显示具体数值和百分比
- 添加图例说明骨科产品的真实名称
- 改变筛选条件后，饼图数据同步更新

---

### 里程碑 7：订单明细表格（接入筛选器状态）
**目标**：实现带搜索、筛选、排序、分页功能的表格，接入全局筛选状态

**任务清单**：
- 创建表格组件（src/components/OrdersTable.tsx）
- 集成 Mock 订单数据
- 实现列：订单号、客户名（医院）、产品名称、金额、状态、下单时间
- 实现状态筛选（全部 / 已完成 / 待处理 / 已取消）
- 实现字段搜索（客户名、订单号）
- 实现排序功能（金额、下单时间支持升降序）
- 实现分页功能（每页 10 条，支持上一页/下一页）
- 在组件顶部添加 "use client" 指令
- 接入筛选器状态，响应筛选变化重新获取数据

**完成标准**：
- 表格正确显示订单数据
- 状态筛选能正确过滤数据
- 搜索功能能按客户名、订单号查找
- 点击表头可对金额、下单时间进行排序（升序/降序切换）
- 分页功能正常，每页显示 10 条数据
- 表格样式清晰、易读，符合 Anthropic 配色方案
- 改变筛选条件后，表格数据同步更新

---

### 里程碑 8：所有组件联动集成与测试
**目标**：将全局筛选器与所有表格联动，验证完整功能

**任务清单**：
- 在 page.tsx 中导入 GlobalFilters 组件
- 将筛选器状态（timeRange、productCategory）作为 props 传递给所有子组件
- 更新 KPI 卡片组件，响应筛选变化重新计算数据
- 更新销售趋势折线图，响应筛选变化重新渲染
- 更新产品分类饼图，响应筛选变化重新计算分类占比
- 更新订单明细表格，响应筛选条件过滤数据
- 全面测试：改变筛选条件，验证所有组件数据同步更新
- 优化联动体验，添加适当的过渡动画或加载状态

**完成标准**：
- 页面顶部显示全局筛选器（已在里程碑3完成）
- 筛选器状态正确传递给 KPI 卡片、折线图、饼图、表格
- 改变任一时间维度（今日/近7天/月度/季度/年），所有组件数据同步更新
- 改变任一产品维度（全部/膝关节/髋关节/创伤与四肢/脊柱/运动医学），所有组件数据同步更新
- 联动体验流畅，有适当的视觉反馈（如加载状态、过渡动画）
- 整个仪表盘功能完整，可作为 Demo 演示

---

### 后续扩展：i18n 国际化支持（未来阶段）
**目标**：实现界面语言切换功能（不在当前 Demo 范围内）

**任务清单**：
- 创建 i18n 配置文件（src/lib/i18n.ts）
- 定义所有界面字段标签的翻译（中文、英文）
- 在页面中添加语言切换按钮
- 更新所有组件，从配置文件读取标签文本
- 确保数据内容（医院名、产品名）不受语言切换影响

**完成标准**：
- 页面默认显示中文界面
- 点击切换按钮可切换为英文界面
- 所有界面标签翻译准确
- 医院名称、产品名称保持原文不变

---

## 文件结构规划

```
src/
├── app/
│   ├── globals.css          # 全局样式，定义 CSS 变量（Anthropic 配色）
│   ├── layout.tsx           # 根布局，引入 Poppins 字体
│   └── page.tsx             # 首页，集成所有组件
│
├── components/
│   ├── ui/                  # shadcn/ui 组件（自动生成）
│   │   ├── button.tsx       # 按钮组件
│   │   ├── card.tsx         # 卡片组件
│   │   ├── table.tsx        # 表格组件
│   │   ├── badge.tsx        # 标签组件
│   │   └── tabs.tsx         # 标签页组件
│   ├── GlobalFilters.tsx    # 全局筛选器组件
│   ├── KPICard.tsx          # 单张 KPI 卡片组件
│   ├── KPICards.tsx         # KPI 卡片容器
│   ├── SalesTrendChart.tsx  # 销售趋势折线图（Recharts）
│   ├── ProductPieChart.tsx  # 产品分类饼图（Recharts）
│   └── OrdersTable.tsx      # 订单明细表格
│
├── lib/
│   ├── utils.ts             # shadcn/ui 工具函数
│   ├── i18n.ts              # 国际化配置文件
│   ├── mock-data.ts         # Mock 数据结构和类型定义
│   └── mock-generator.ts    # Mock 数据生成函数
│
└── types/
    └── index.ts             # TypeScript 类型定义
```

---

## Mock 数据结构设计

### 1. 订单数据（Order）
```typescript
interface Order {
  id: string;                // 订单号（格式：SO + 时间戳）
  hospital: string;          // 客户名（医院名称，如：北京协和医院）
  product: string;           // 产品名称（如：Triathlon膝关节）
  category: string;          // 产品分类（膝关节/髋关节/创伤与四肢/脊柱/运动医学）
  amount: number;            // 金额（¥15,000 - ¥280,000）
  status: 'completed' | 'pending' | 'cancelled'; // 状态
  orderDate: Date;           // 下单时间
}
```

**示例数据**：
```typescript
{
  id: 'SO202412150001',
  hospital: '北京协和医院',
  product: 'Triathlon膝关节系统',
  category: '膝关节',
  amount: 185000,
  status: 'completed',
  orderDate: new Date('2024-12-15T09:30:00')
}
```

---

### 2. 销售趋势数据（TrendData）
```typescript
interface TrendData {
  date: string;              // 日期（YYYY-MM-DD）
  salesAmount: number;       // 日销售额
  orderCount: number;        // 日订单数
  avgOrderValue: number;     // 平均客单价（销售额/订单数）
}
```

**示例数据**：
```typescript
{
  date: '2024-12-15',
  salesAmount: 850000,
  orderCount: 12,
  avgOrderValue: 70833
}
```

---

### 3. KPI 指标数据（KPIs）
```typescript
interface KPIs {
  totalSales: {              // 总销售额
    value: number;           // 金额
    change: number;          // 环比变化（百分比）
  };
  todayOrders: {             // 今日订单数
    value: number;           // 单数
    change: number;          // 较昨日变化（单数）
  };
  avgOrderValue: {           // 客单价
    value: number;           // 平均金额
    change: number;          // 环比变化（百分比）
  };
  growthRate: {              // 环比增长率
    value: number;           // 百分比
    change: number;          // 较上月变化（百分比）
  };
  achievementRate: {         // 达成率
    value: number;           // 百分比
    gap: number;             // 距目标差距（百分比）
  };
}
```

**示例数据**：
```typescript
{
  totalSales: { value: 8500000, change: 12.5 },
  todayOrders: { value: 15, change: 3 },
  avgOrderValue: { value: 158000, change: -5.2 },
  growthRate: { value: 18.3, change: 2.1 },
  achievementRate: { value: 78.5, gap: 21.5 }
}
```

---

### 4. 产品分类数据（ProductCategory）
```typescript
interface ProductCategory {
  name: string;              // 分类名称
  value: number;             // 销售额/占比
  color: string;             // 图表颜色
  products: string[];        // 该分类包含的产品列表
}
```

**示例数据**：
```typescript
{
  name: '膝关节',
  value: 2800000,
  color: '#d97757',
  products: [
    'Triathlon膝关节系统',
    'GetAround膝关节系统',
    'Mako机器人辅助膝关节置换系统'
  ]
}
```

---

### 5. 医院信息数据（Hospital）
```typescript
interface Hospital {
  name: string;              // 医院名称
  city: string;              // 所在城市
  level: string;             // 医院等级（三甲/三乙等）
}
```

**示例数据**：
```typescript
{
  name: '北京协和医院',
  city: '北京',
  level: '三甲'
}
```

---

### 6. 产品信息数据（Product）
```typescript
interface Product {
  name: string;              // 产品名称
  category: string;          // 产品分类
  basePrice: number;        // 基础价格
}
```

**示例数据**：
```typescript
{
  name: 'Triathlon膝关节系统',
  category: '膝关节',
  basePrice: 165000
}
```

---

## 备注
- 所有 Mock 数据生成函数放在 `src/lib/mock-generator.ts`
- 数据类型定义放在 `src/lib/mock-data.ts` 和 `src/types/index.ts`
- 金额单位为人民币（¥）
- 订单覆盖近 365 天的时间范围，确保「年度」筛选有足够数据展示
- 数据要有合理的分布和随机性
