# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding shadcn/ui Components
- `npx shadcn@latest add <component-name>` - Add a new shadcn/ui component

## Project Architecture

### Tech Stack
- **Next.js 16.1.6** with App Router and TypeScript
- **React 19** with TypeScript support
- **Tailwind CSS 4** for styling
- **shadcn/ui** for pre-built components (style: new-york, base color: neutral)
- **Recharts** for charts and data visualization

### Directory Structure
```
src/
  app/              # Next.js App Router pages and layouts
    globals.css     # Global styles with CSS variables
    layout.tsx      # Root layout with Geist fonts
    page.tsx        # Home page
  components/       # React components
    ui/            # shadcn/ui components (card, table, tabs, badge, button)
  lib/             # Utility functions
    utils.ts       # shadcn/ui helper functions (cn)
```

### Path Aliases
- `@/*` maps to `./src/*`
- `@/components` maps to `./src/components`
- `@/components/ui` maps to `./src/components/ui`
- `@/lib` maps to `./src/lib`

### Key Dependencies
- **class-variance-authority + clsx + tailwind-merge**: For component styling variants
- **lucide-react**: Icon library (used by shadcn/ui components)
- **radix-ui**: Headless UI components (foundation for shadcn/ui)

### Important Notes
- This is a fresh Next.js project with shadcn/ui initialized
- Uses CSS variables for theming (see src/app/globals.css)
- App Router is enabled - all routes go in src/app/
- TypeScript with strict mode enabled
- ESLint configured for Next.js

## Project Context
这是一个医疗器械销售数据仪表盘，模拟 Stryker 骨科产品销售场景。
目标用户：销售经理、区域销售代表，用于每日快速了解业务健康度。
当前阶段：Mock 数据驱动，前端功能完整，可做 Demo 演示。

## Product Specification

### KPI 卡片（5张）
- 总销售额：显示总金额 + 较上周环比变化
- 今日订单数：显示单数 + 较昨日变化
- 客单价：显示平均客单价 + 较上周变化
- 环比增长率：显示增长百分比 + 较上月变化
- 达成率：显示目标完成百分比 + 距目标差距

### 折线图
- 近7天销售趋势
- 支持切换显示：销售额 / 订单数 / 客单价

### 饼图（Stryker 骨科分类）
- 类别：全部 / 膝关节 / 髋关节 / 创伤与四肢 / 脊柱 / 运动医学（类别由 src/lib/product-config.ts 维护，当前 Mock 数据包含5类，实际以配置文件为准。）

### 订单明细表格
- 字段：订单号、客户名（医院）、产品名称、金额、状态、下单时间
- 状态筛选：全部 / 已完成 / 待处理 / 已取消
- 排序：金额、下单时间支持升降序
- 搜索：按客户名或订单号
- 分页：每页10条

### 全局筛选器（页面顶部）
- 时间维度：今日 / 近7天 / 月度（自然月）/ 季度（自然季）/ 年（自然年）
- 产品维度：全部 / 膝关节 / 髋关节 / 创伤与四肢 / 脊柱 / 运动医学（类别由 src/lib/product-config.ts 维护，当前 Mock 数据包含5类，实际以配置文件为准。）
- 联动范围：KPI + 折线图 + 饼图 + 表格全部同步更新

### Mock 数据规范
- 客户名使用真实医院名称（北京协和医院、上海瑞金医院等三甲医院）
- 产品名称参照 Stryker 真实产品线（Triathlon膝关节、Accolade髋关节、T2髓内钉等）
- 金额范围：单笔订单 ¥15,000 - ¥280,000（符合骨科器械真实价格区间）

### 交互与数据联动规则

1. KPI 角标与时间筛选联动
- 顶部全局时间筛选（今日 / 近7天 / 月度（自然月）/ 季度（自然季）/ 年（自然年））改变时：
  - KPI 卡片的角标文案必须同步更新，例如：
    - 选择「今日」时，角标显示「今日」
    - 选择「近7天」时，角标显示「近7天」
    - 选择「月度」时，角标显示「本月」（如：2月）
    - 选择「季度」时，角标显示「本季度」（如：Q1）
    - 选择「年」时，角标显示「本年度」（如：2026）
- 每张 KPI 卡片至少包含：标题（如「总销售额」）+ 动态角标（时间范围）+ 主数值 + 环比信息。

2. 折线图展示规范
- 折线图在「近7天」模式下，横轴必须显示 7 个日期刻度，对应最近 7 天。
- 纵轴是销售额，必须明确标注金额单位（例如在图表标题或右上角注明「单位：元」或使用「¥」符号）。
- 鼠标悬停时，tooltip 至少显示：日期、销售额、订单数，数值格式要友好（如：¥68,500 而不是 68500）。

3. 饼图与图例规范
- 右侧空白区域用于显示图例和分类说明，不允许出现 "undefined" 这类占位文案。
- 每个分类需在图例中显示：饼图分类数据来自 src/lib/product-config.ts，
图例根据配置文件动态渲染，有多少分类显示多少条图例，
不得在组件中写死分类数量或分类名称。
每条图例显示：颜色标识 + 分类名称 + 占比 + 金额。
- 鼠标悬停饼图某一部分时，该部分高亮，同时图例中对应项需要有突出效果（加粗/背景高亮等）。

4. 订单表格展示规范
- 表格必须支持分页：每页默认显示 10 条数据，提供上一页/下一页按钮。
- 表格区域高度固定，出现滚动条时，表头行需要固定在顶部不随内容滚动。
- 列宽和对齐方式要保证金额和日期易读：
  - 金额右对齐，日期居中或右对齐。
- 状态列使用颜色标签（例如已完成为绿色，待处理为橙色，已取消为红色）。

5. 产品线配置规则
- 所有产品分类和具体产品名称，未来都应来自后端或集中配置文件维护。
- 当前阶段的 Mock 数据可以在前端硬编码，但必须集中放在单独的配置文件（如 `src/lib/product-config.ts`），组件中禁止直接写死分类和产品名称。

### Planning 约定
- 在为本项目创建或更新计划文档之前，必须先完整阅读 CLAUDE.md，并严格以其中的 Product Specification 和交互规则为约束。
- 计划与验收文档位于 `docs/`（如 docs/plan.md、docs/plan-m8-breakdown.md、docs/acceptance-m8.md），只负责拆解和编排本轮要做的任务，不重复、改写或发明新的产品规则。如发现 CLAUDE.md 里没有覆盖的产品规则，先提示我补充到 CLAUDE.md。

## Design System
### 配色规范（Anthropic 暖系）
- 背景色：#faf9f5（奶油白）
- 主文字：#141413（暖炭黑）
- 强调色：#d97757（砖橙）—— 重要数据、按钮、高亮
- 辅助色：#6a9bcc（雾蓝）—— 图表、次要强调
- 第三色：#788c5d（橄榄绿）—— 正向指标
- 危险色：#c0392b（暗红）—— 负向指标、取消状态
- 描边/次要信息：#b0aea5（中灰）

### 字体规范
- 标题：Poppins（需从 Google Fonts 引入）
- 正文：系统默认字体栈

### 设计原则
- 高级感优先，避免模板风
- 卡片圆角统一用 rounded-2xl
- 间距统一用 gap-4 / p-6
- 正向数据显示橄榄绿 + 上箭头，负向显示暗红 + 下箭头

## Interface Language
- 默认中文界面
- 所有字段标签存放在独立的 i18n 配置文件中，支持中英切换
- 数据内容（医院名、产品名）不受语言切换影响

## My Builder Level
初学者，完全依赖 Claude Code 生成代码。
- 永远用结果导向的自然语言解释方案
- 遇到多个选项，默认推荐最简单的
- 解释技术概念时必须附带生活化比喻
- 每次只做一件事，完成后等待确认再继续

## Rules
- 每次只做一件事，完成后汇报结果再继续
- 不要自作主张修改配色和设计规范
- 所有密钥和环境变量必须写在 .env 文件，绝不提交到 GitHub
- Recharts 组件必须加 "use client" 指令
- 优先修改现有文件，不要随意新建文件
- 全局筛选器状态用 React useState 管理，所有子组件通过 props 接收筛选值
- 重构或移动函数时，必须同步检查并更新所有引用该函数的文件，禁止只改一处
