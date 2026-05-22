# Vue Dima 问卷低代码编辑器

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2-409eff)
![Pinia](https://img.shields.io/badge/Pinia-3-f7d336)

一个基于 Vue 3 + Vite + TypeScript 的问卷低代码编辑器。项目围绕“组件市场 + 可视化画布 + 属性面板”的编辑体验构建，支持通过拖拽快速搭建问卷、保存草稿、预览问卷、生成可分享的在线答题链接，并可通过浏览器打印导出 PDF。

## 功能亮点

- 可视化问卷编辑：左侧组件/大纲、中间画布、右侧属性编辑面板。
- 组件市场：内置选择题、输入题、高级题型、备注说明、个人信息、联系方式等组件。
- 拖拽排序：基于 `vuedraggable` 实现题目排序和大纲联动。
- 属性配置：支持标题、描述、选项、图片选项、字号、字重、斜体、颜色、对齐方式等配置。
- 撤销/重做：使用命令模式维护编辑历史，支持 `Ctrl + Z`、`Ctrl + Y` / `Ctrl + Shift + Z`。
- 本地草稿：基于 Dexie 封装 IndexedDB，实现问卷保存、编辑、删除和列表展示。
- 预览与导出：支持问卷预览、浏览器打印生成 PDF。
- 在线问卷：通过 Vercel Serverless API 保存问卷数据、生成分享链接并提交答卷。
- 图片上传：提供本地 Express + Multer 上传服务，也包含适配 Vercel 的上传接口。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Vue 3、Vue Router、Pinia |
| 构建工具 | Vite、TypeScript |
| UI 与交互 | Element Plus、Font Awesome、vuedraggable |
| 本地存储 | Dexie、IndexedDB |
| 后端接口 | Vercel Serverless Functions、Express、Multer |
| 工程化 | ESLint、Oxlint、Prettier、vue-tsc |

## 目录结构

```text
.
├── api/                         # Vercel Serverless API
│   ├── saveQuiz.js              # 保存在线问卷
│   ├── submitAnswers.js         # 提交答卷
│   ├── upload.js                # Serverless 图片上传
│   └── getQuiz/[id].js          # 获取在线问卷
├── server/                      # 本地 Express 图片上传服务
├── src/
│   ├── components/
│   │   └── SurveyComs/          # 问卷题型组件与属性编辑组件
│   ├── configs/                 # 组件映射、默认状态、组件分组配置
│   ├── db/                      # Dexie / IndexedDB 数据访问
│   ├── router/                  # 页面路由
│   ├── stores/                  # Pinia 状态、命令栈、历史记录
│   ├── types/                   # TypeScript 类型定义
│   ├── utils/                   # 通用工具与保存逻辑
│   └── views/                   # 首页、组件市场、编辑器、预览、答题页
├── vite.config.ts               # Vite 配置与本地代理
└── vercel.json                  # Vercel 部署配置
```

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 推荐使用 `pnpm`

### 安装依赖

```bash
pnpm install
```

### 启动前端

```bash
pnpm dev
```

默认访问地址：

```text
http://localhost:5173
```

### 启动本地上传服务

如果需要在本地调试图片上传功能，可以单独启动 `server` 目录下的 Express 服务：

```bash
cd server
npm install
npm run start
```

服务默认运行在：

```text
http://localhost:3001
```

Vite 已在 `vite.config.ts` 中配置 `/api` 与 `/uploads` 代理到 `http://localhost:3001`。

> 说明：本地 `server/` 主要用于图片上传调试；在线问卷保存、获取和提交接口位于 `api/`，推荐在 Vercel 部署环境或 Vercel CLI 中调试完整链路。

## 常用脚本

```bash
pnpm dev          # 启动开发服务
pnpm build        # 类型检查并打包
pnpm build-only   # 仅打包
pnpm preview      # 预览生产构建
pnpm lint         # 运行 lint 并自动修复
pnpm format       # 格式化 src 目录
```

## 使用流程

1. 在首页点击“新建”进入问卷编辑器。
2. 从左侧题型区域选择或添加题目组件。
3. 在中间画布中点击题目，使用右侧面板调整标题、描述、选项、样式等属性。
4. 通过拖拽调整题目顺序，或使用大纲快速定位题目。
5. 点击保存，将问卷写入浏览器 IndexedDB。
6. 点击预览，查看最终问卷效果。
7. 在预览页可以生成本地 PDF，也可以生成在线问卷链接。

## 内置题型

- 单选题
- 多选题
- 下拉选择题
- 图片单选题
- 图片多选题
- 文本输入题
- 评分题
- 日期/时间题
- 备注说明
- 个人信息类题目：姓名、身份证、出生日期、性别、年龄、学历、学校、专业、行业、职业、公司、职位
- 联系方式类题目：手机、微信、QQ、邮箱、地址

## 核心设计

### 组件状态模型

每个问卷组件都包含组件名称、渲染组件引用和一组可编辑状态。保存到 IndexedDB 前会序列化组件状态；再次读取时通过 `componentMap` 恢复 Vue 组件引用，从而让保存后的问卷可以继续编辑和渲染。

### 命令式历史记录

编辑器将新增、删除、更新、移动封装为 command，通过 `HistoryManager` 统一执行、撤销和重做。连续文本输入会通过 `DebounceMerger` 合并历史记录，避免每输入一个字符都产生一次撤销步骤。

### 本地与在线数据

- 本地问卷草稿存储在浏览器 IndexedDB 中，适合离线编辑和快速演示。
- 在线问卷接口位于 `api/`，适配 Vercel Serverless Functions。
- 当前 `api/_store.js` 使用内存 Map/数组保存在线问卷和答卷，适合演示；生产环境建议替换为数据库。

## 部署

项目已包含 `vercel.json`，可以直接部署到 Vercel：

```bash
pnpm install
pnpm build-only
```

Vercel 配置中已处理：

- Vite 静态产物输出目录 `dist`
- `/api/*` Serverless Function 路由
- 前端 SPA 路由回退到 `index.html`
- 静态资源缓存与基础安全响应头

## 后续优化方向

- 接入真实数据库，持久化在线问卷和答卷。
- 增加问卷发布状态、答卷统计和可视化分析。
- 增加表单校验、必填规则和题目逻辑跳转。
- 补充端到端测试，覆盖编辑、保存、预览、答题链路。
- 增加 README 截图或在线演示地址，提升 GitHub 展示效果。
