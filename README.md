# my-mini-vue

一个从零手写的 Vue 3 迷你实现，覆盖**响应式系统**、**虚拟 DOM 运行时**和**模板编译器**三大核心模块。

## Demo

在线体验：[vercel 链接](https://minivue.vercel.app)

项目内置了两个与真实 Vue 3 并排对比的 demo：

| Demo | 说明 |
|---|---|
| **Tree** | 递归树组件，支持展开/折叠、双击添加子节点 |
| **vModel** | 表单双向绑定，涵盖 text / radio / checkbox |

每个 demo 页面左右分栏，左侧跑 MiniVue，右侧跑 Vue 3，同样的模板、同样的逻辑，直观对比效果。

## 快速开始

```bash
pnpm install
pnpm dev      # 启动开发服务器，浏览器自动打开
pnpm build    # 构建 UMD + ES 产物到 dist/
pnpm test     # 运行 Jest 单元测试
```

## 项目结构

```
src/
├── reactivity/      # 响应式系统
│   ├── reactive.js  #   Proxy 驱动的 reactive()
│   ├── ref.js       #   ref() 实现
│   ├── computed.js  #   computed() 惰性计算
│   └── effect.js    #   track / trigger 依赖收集
│
├── runtime/         # 虚拟 DOM & 运行时
│   ├── vnode.js     #   h() 函数 & ShapeFlags
│   ├── render.js    #   patch 算法（含 keyed diff）
│   ├── component.js #   组件挂载 & setup 生命周期
│   ├── createApp.js #   createApp 入口 & resolveComponent
│   ├── patchProps.js #  DOM 属性 / style / 事件 patch
│   ├── scheduler.js #   nextTick 异步队列
│   └── helpers/     #   v-for (renderList) / v-model (withModel)
│
├── compiler/        # 模板编译器
│   ├── parse.js     #   HTML → AST
│   ├── codegen.js   #   AST → 可执行 JS
│   └── compile.js   #   parse + codegen 管线
│
└── utils/           # 工具函数 (camelize, capitalize...)
```

## 已实现特性

### 响应式

- `reactive()` — 基于 Proxy 的深层响应式，支持数组 `length` 追踪
- `ref()` — 基本类型封装，`.value` 读写自动 track/trigger
- `computed()` — 惰性求值 + 缓存，依赖不变不重新计算
- `effect()` — 即 dep.watch，首次自动收集依赖，变化自动重新执行

### 运行时

- `h(type, props, children)` — Virtual DOM 创建，支持 component / element / text / fragment
- **patch 算法** — 同类型复用 DOM，不同类型卸载重建
- **Keyed Diff** — 首尾预比对 → 旧节点映射 → 最长上升子序列 (LIS) 最少移动
- **组件系统** — `setup()` 返回 render 上下文，Props 访问，slot 插槽
- **生命周期** — `onBeforeMount` / `onMounted` / `onBeforeUpdate` / `onUpdated`
- **调度器** — 同一 tick 内多次 trigger 合并为一次 update，`nextTick()` 出队执行
- **Fragment** — 多根节点支持，锚点管理
- **v-model 运行时** — `withModel` 辅助 text / radio / checkbox
- **v-for 运行时** — `renderList` 辅助

### 模板编译器

- `{{ expression }}` 插值表达式
- `v-if` / `v-else-if` / `v-else` 条件渲染
- `v-for="item in list"` 列表渲染
- `v-bind:attr` / `:attr` 属性绑定
- `v-on:event` / `@event` 事件绑定
- `v-model` 双向绑定
- `v-html` HTML 渲染
- 组件标签自动解析 (`resolveComponent`)

## 构建 & 部署

Vite 构建为 UMD (`my-mini-vue.umd.js`) 和 ES (`my-mini-vue.es.js`) 两种格式，全局变量名为 `MiniVue`。

```bash
pnpm build           # Vite library build
pnpm postbuild       # 复制 index.html + examples → dist，适配 Vercel
```

部署到 Vercel 后，所有 example 页面可以直接访问。

## 测试

基于 Jest + jsdom，覆盖 reactivity、runtime、compiler 三个模块，包含关键路径和边界情况。

```bash
pnpm test
```

## License

MIT
