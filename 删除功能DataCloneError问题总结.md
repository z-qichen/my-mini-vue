# 删除功能 DataCloneError 问题排查总结

## 问题现象

在问卷编辑器中点击删除组件按钮，弹出确认对话框后：
- 点击"确定"删除，却同时打印了"取消删除"和"删除"日志
- 控制台报错：`DataCloneError: Failed to execute 'structuredClone' on 'Window'`

## 问题定位过程

### 第一步：排除事件重复触发

在 `removeCom` 函数开头添加日志，确认函数只被调用一次，排除按钮点击事件重复触发的问题。

### 第二步：分析 Promise 链

发现 `ElMessageBox.confirm` 的 `.catch()` 捕获了异常。正常情况下点击"确定"只进入 `.then()`，但这里错误进入了 `.catch()`。

### 第三步：捕获具体错误

在 `.catch()` 中打印 `error` 对象，发现是 `DataCloneError`：

```
DataCloneError: Failed to execute 'structuredClone' on 'Window': function Object() { [native code] } could not be cloned.
    at createRemoveCommand (commands.ts:36:22)
```

### 第四步：定位错误源头

错误发生在 `commands.ts` 的 `createRemoveCommand` 函数中：

```typescript
const removedCom = structuredClone(coms[index])
```

## 根本原因

### 1. Vue 响应式对象无法直接克隆

`coms` 是 Pinia store 中的响应式数组，`coms[index]` 是 Vue 的 Proxy 代理对象。`structuredClone` 无法直接克隆 Proxy 对象。

### 2. Status 类型包含不可克隆的字段

```typescript
export interface Status {
  type: VueComType  // Vue 组件类型，是函数/对象，无法克隆
  name: Material
  id: string
  status: {
    [key: string]: TextProps | OptionsProps
  }
}
```

`type` 字段是 `VueComType`（即 `ReturnType<typeof defineComponent>`），本质上是一个 Vue 组件定义（函数+对象），无法被 `structuredClone` 克隆。

### 3. 错误被 Promise catch 捕获

`store.removeCom(index)` 在 `.then()` 中执行，内部调用 `createRemoveCommand` 时抛出 `DataCloneError`，导致 Promise 链进入 `.catch()`，打印"取消删除"。

## 解决方案

### 方案：自定义深克隆函数

使用 `toRaw()` 将 Vue 响应式对象转为原始对象，然后对纯数据部分使用 `JSON.parse(JSON.stringify())` 深克隆，保持 Vue 组件引用不变。

```typescript
import { toRaw } from 'vue'

// 自定义深克隆函数，处理 Vue 组件等不可克隆的数据
function deepCloneStatus(status: Status): Status {
  const raw = toRaw(status)
  return {
    ...raw,  // 展开复制，type 字段保持原引用
    status: JSON.parse(JSON.stringify(raw.status))  // 纯数据深克隆
  }
}

// 克隆 Status 数组
function deepCloneStatusArray(coms: Status[]): Status[] {
  return coms.map(deepCloneStatus)
}
```

### 修改点

1. **`createRemoveCommand`**：保存被删除组件用于 undo
   ```typescript
   // 修改前
   const removedCom = structuredClone(coms[index])
   
   // 修改后
   const removedCom = deepCloneStatus(coms[index])
   ```

2. **`createResetCommand`**：保存旧组件列表用于 undo
   ```typescript
   // 修改前
   coms.push(...structuredClone(oldComs))
   
   // 修改后
   coms.push(...deepCloneStatusArray(oldComs))
   ```

## 关键技术点

### 1. Vue 3 的 toRaw

`toRaw()` 是 Vue 3 提供的 API，用于获取响应式对象的原始对象：

```typescript
import { toRaw } from 'vue'

const original = toRaw(reactiveObj)  // 去除 Proxy 包装
```

适用场景：
- 需要操作原始对象避免响应式开销
- 需要序列化或克隆响应式数据
- 与不支持 Proxy 的第三方库交互

### 2. structuredClone 的局限性

`structuredClone` 是浏览器原生深克隆 API，但无法克隆：

- **函数**（包括类构造函数）
- **DOM 节点**
- **Error 对象**
- **属性描述符、Getter/Setter**
- **原型链**
- **循环引用**（部分浏览器支持）
- **特殊对象**：Map、Set、Date、RegExp、ArrayBuffer、TypedArray、DataView、ImageData、Blob、File、FileList、ImageBitmap、OffscreenCanvas

### 3. JSON.parse(JSON.stringify()) 的适用场景

适用于纯 JSON 数据（对象、数组、字符串、数字、布尔、null）：

```typescript
const clone = JSON.parse(JSON.stringify(obj))
```

**优点**：
- 简单高效
- 处理嵌套对象
- 自动去除 undefined、函数等

**缺点**：
- 丢失 undefined、函数、Symbol、Date、RegExp、Map、Set、循环引用
- 只能克隆可序列化的数据

### 4. Vue 组件类型的特殊性

Vue 组件（`defineComponent` 的返回值）是一个复合对象：
- 包含渲染函数
- 包含生命周期钩子
- 包含组件选项
- 可能包含闭包引用

这类对象不应该被深克隆，应该保持引用：

```typescript
// 正确：保持组件引用
const cloned = {
  ...raw,  // type 字段保持原引用
  status: deepClone(raw.status)  // 只克隆纯数据
}
```

## 经验总结

### 调试技巧

1. **Promise 错误捕获**：`.catch()` 不仅捕获用户取消操作，还会捕获 `.then()` 中的任何错误。调试时应该打印具体的 error 对象：
   ```typescript
   .catch((err) => {
     console.log('操作失败:', err)  // 打印具体错误，不要只打印固定文本
   })
   ```

2. **逐步定位**：从用户交互层（UI）→ 业务逻辑层（Store）→ 工具函数层（Commands）逐步定位问题根源。

3. **理解数据流**：理解 Vue 响应式系统、Pinia Store、历史记录管理之间的数据流转关系。

### 架构设计建议

1. **数据分层**：将可序列化的纯数据与不可序列化的运行时对象（如组件定义）分离存储。

2. **克隆策略**：根据数据类型选择合适的克隆策略：
   - 纯数据：`JSON.parse(JSON.stringify())` 或 `structuredClone`
   - 响应式数据：先 `toRaw()` 再克隆
   - 包含函数/组件的对象：自定义克隆，保持引用

3. **错误处理**：在 Promise 链中区分用户取消和系统错误：
   ```typescript
   ElMessageBox.confirm(...)
     .then(() => {
       // 用户确认
     })
     .catch((err) => {
       if (err === 'cancel') {
         // 用户取消，无需处理
       } else {
         // 系统错误，需要处理
         console.error('删除失败:', err)
         ElMessage.error('删除失败，请重试')
       }
     })
   ```
