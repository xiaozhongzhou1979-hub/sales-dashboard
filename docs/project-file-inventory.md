# 项目文件清单与结构分析

## 一、完整文件清单（按目录）

### 根目录
| 文件 | 说明 |
|------|------|
| `package.json` | 依赖与脚本 |
| `package-lock.json` | 锁文件 |
| `tsconfig.json` | TypeScript 配置 |
| `next.config.ts` | Next.js 配置 |
| `postcss.config.mjs` | PostCSS 配置 |
| `eslint.config.mjs` | ESLint 配置 |
| `components.json` | shadcn/ui 配置 |
| `.gitignore` | Git 忽略规则 |
| `CLAUDE.md` | 项目与产品规范（给 AI 的说明） |
| `README.md` | 项目说明 |
| `DEPLOY-NETLIFY.md` | Netlify 部署说明 |
| `patch.ts` | **空文件，无引用** |
| `sales-dashobard-ui.pen` | Pencil 设计稿（文件名拼写错误：dashobard） |

### docs/
| 文件 | 说明 |
|------|------|
| `plan.md` | 计划文档 |
| `plan-m8-breakdown.md` | M8 任务拆解 |
| `acceptance-m8.md` | M8 验收标准 |

### public/
| 文件 | 说明 |
|------|------|
| `file.svg` | 静态资源 |
| `vercel.svg` | 静态资源 |
| `window.svg` | 静态资源 |

### src/app/
| 文件 | 说明 |
|------|------|
| `layout.tsx` | 根布局 |
| `page.tsx` | 首页 |
| `globals.css` | 全局样式 |

### src/components/
| 文件 | 说明 |
|------|------|
| `GlobalFilters.tsx` | 全局筛选器 |
| `KPICard.tsx` | 单张 KPI 卡片 |
| `KPICards.tsx` | KPI 卡片组 |
| `OrdersTable.tsx` | 订单表格 |
| `ProductPieChart.tsx` | 产品饼图 |
| `SalesTrendChart.tsx` | 销售趋势折线图 |

### src/components/ui/
| 文件 | 说明 |
|------|------|
| `badge.tsx` | shadcn 徽章 |
| `button.tsx` | shadcn 按钮 |
| `card.tsx` | shadcn 卡片 |
| `table.tsx` | shadcn 表格 |
| `tabs.tsx` | shadcn 标签页 |

### src/lib/
| 文件 | 说明 |
|------|------|
| `utils.ts` | 工具函数（如 cn） |
| `product-config.ts` | 产品分类配置 |
| `mock-data.ts` | Mock 数据 |
| `mock-generator.ts` | Mock 数据生成逻辑 |

### src/types/
| 文件 | 说明 |
|------|------|
| `index.ts` | 类型定义 |

---

## 二、为什么看起来「比较乱」——原因分析

### 1. 根目录散落文件（最明显）

- **`patch.ts`**  
  - 空文件，项目内无任何引用，用途不明。  
  - **建议**：删除，或若为将来补丁脚本则移到 `scripts/` 并补全用途说明。

- **`sales-dashobard-ui.pen`**  
  - 设计稿放在仓库根目录，且文件名拼写错误（应为 `dashboard`）。  
  - **建议**：重命名为 `sales-dashboard-ui.pen`；若设计稿较多，可建 `design/` 或 `docs/design/` 统一存放。

- **`DEPLOY-NETLIFY.md`**  
  - 部署文档在根目录，而计划、验收等都在 `docs/`。  
  - **建议**：移至 `docs/DEPLOY-NETLIFY.md`，与 `docs/plan.md`、`docs/acceptance-m8.md` 等保持一致。

### 2. 文档位置不统一

- 根目录：`README.md`、`CLAUDE.md`、`DEPLOY-NETLIFY.md`  
- `docs/`：`plan.md`、`plan-m8-breakdown.md`、`acceptance-m8.md`  

约定不清晰：既有「根目录放说明」又有「docs 放计划/验收」。  
**建议**：部署、迭代计划、验收等全部放进 `docs/`，根目录只保留 `README.md` 和 `CLAUDE.md`。

### 3. CLAUDE.md 与真实结构不完全一致

- `CLAUDE.md` 中的目录结构未列出：  
  - `src/types/`  
  - `src/lib/` 下的 `product-config.ts`、`mock-data.ts`、`mock-generator.ts`  
- 实际结构是合理的，但文档未更新，会让人误以为「多了不该有的东西」或「少了该有的说明」。  
**建议**：按当前真实结构更新 `CLAUDE.md` 的「Directory Structure」小节，避免认知偏差。

### 4. 其他（结构本身没问题）

- **src/**：`app/`、`components/`、`lib/`、`types/` 划分清晰；业务组件与 `ui/` 分离也符合常见做法。  
- **public/**：仅放静态资源，无问题。  

「乱」主要来自根目录和文档分布，而不是 `src` 的层级。

---

## 三、建议的整理动作（按优先级）

| 优先级 | 动作 |
|--------|------|
| 高 | 删除或移走并说明 `patch.ts`（推荐直接删除） |
| 高 | 将 `DEPLOY-NETLIFY.md` 移到 `docs/DEPLOY-NETLIFY.md` |
| 中 | 将 `sales-dashobard-ui.pen` 重命名为 `sales-dashboard-ui.pen`，可选：迁到 `design/` 或 `docs/design/` |
| 中 | 更新 `CLAUDE.md` 的目录结构，使其与当前 `src/`、`docs/` 一致 |
| 低 | 在 `README.md` 中增加「文档在哪」的简短说明（例如：部署与计划见 `docs/`） |

完成上述步骤后，根目录会更干净，文档位置统一，项目会显得更有条理。
