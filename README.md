# 医疗器械销售数据仪表盘

面向销售经理与区域代表的 Stryker 骨科产品销售数据仪表盘，用于每日快速了解业务健康度。当前为 Mock 数据驱动，前端功能完整，可作 Demo 演示。

## 技术栈

- **Next.js 16**（App Router）+ TypeScript
- **React 19** + Tailwind CSS 4 + shadcn/ui
- **Recharts** 图表

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（http://localhost:3000）
npm run dev

# 生产构建
npm run build

# 生产运行
npm run start
```

## 项目结构

- `src/app/` — 页面与布局
- `src/components/` — 业务组件与 shadcn/ui
- `src/lib/` — Mock 数据、产品配置、工具函数
- `src/types/` — TypeScript 类型
- `docs/` — 开发计划与验收文档（[plan.md](docs/plan.md)、[acceptance-m8.md](docs/acceptance-m8.md) 等）

## 部署

- **Netlify（推荐）**：见 [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md)，支持 Git 关联一键部署。
- **Vercel**：连接仓库后使用默认 Next.js 配置即可。

## 更多说明

- 产品规格与设计规范见 [CLAUDE.md](CLAUDE.md)。
- 里程碑与任务拆解见 `docs/` 目录下的计划与验收文档。
