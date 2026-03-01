# Netlify 部署说明

## 方法一：命令行部署（推荐，支持完整 Next.js）

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录（会打开浏览器）
netlify login

# 3. 在项目目录下初始化并关联站点（首次需要）
netlify init

# 4. 构建并部署到生产环境
netlify deploy --build --prod
```

- 使用 `--build` 让 Netlify 在云端执行 `npm run build`，并用 Next.js 运行时部署，支持服务端渲染等能力。
- 若只执行 `netlify deploy --prod` 而不带 `--build`，需要本地先构建好，且需配置正确的发布目录（Next.js 由 Netlify 插件指定，一般不手填）。

---

## 方法二：拖拽部署（仅限静态导出）

Netlify Drop（netlify.com/drop）**只接受静态文件**，不能直接跑 Node/Next 服务。

- **错误**：把 `.next` 文件夹拖到 Netlify Drop → 无法作为可访问网站运行。
- **正确做法**：先把项目改成静态导出，再拖拽 **`out`** 目录里的内容。

### 若要用拖拽，需先改为静态站并构建：

1. 在 `next.config.ts` 中增加静态导出：

   ```ts
   const nextConfig: NextConfig = {
     output: 'export',
     turbopack: {},
   };
   ```

2. 构建：

   ```bash
   npm run build
   ```

3. 打开 [netlify.com/drop](https://app.netlify.com/drop)，把生成的 **`out`** 文件夹里的全部内容拖进去（不是拖 `.next`）。

注意：开启 `output: 'export'` 后不能使用服务端渲染、API 路由等依赖服务器的功能；当前仪表盘为前端 + Mock 数据，一般可这样用。

---

## 方法三：Git 关联部署（最省心）

**无需安装 netlify-cli**，全程在网页上操作即可。

1. 把代码推到 GitHub。
2. 登录 [Netlify](https://www.netlify.com) → Add new site → Import an existing project → 选择 GitHub 与本仓库。
3. 构建命令填：`npm run build`（或留空用默认）。
4. 发布目录留空，由 Netlify 的 Next.js 支持自动识别。
5. 点击 Deploy，之后每次 push 会自动部署。

---

总结：**完整 Next.js 推荐用「方法一」或「方法三」；只有静态导出时才用「方法二」并拖拽 `out`。**
