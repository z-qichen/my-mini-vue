import { toRaw } from 'vue'
import type { Status } from '@/types'
import type { Command } from './history'

// 自定义深克隆函数，处理 Vue 组件等不可克隆的数据
function deepCloneStatus(status: Status): Status {
  const raw = toRaw(status)
  return {
    ...raw,
    status: JSON.parse(JSON.stringify(raw.status))
  }
}

// 克隆 Status 数组
function deepCloneStatusArray(coms: Status[]): Status[] {
  return coms.map(deepCloneStatus)
}

// Add Command - 添加组件
export function createAddCommand(
  coms: Status[],
  newCom: Status,
  addFn: (coms: Status[], newCom: Status) => void,
  removeFn: (index: number) => void,
): Command {
  // 保存 newCom 的 id，避免 undo 时 newCom 可能变为 undefined
  const newComId = newCom?.id
  return {
    type: 'add',
    execute: () => {
      addFn(coms, newCom)
    },
    undo: () => {
      if (!newComId) return
      const index = coms.findIndex((c) => c.id === newComId)
      if (index !== -1) {
        removeFn(index)
      }
    },
  }
}

// Remove Command - 删除组件
export function createRemoveCommand(
  coms: Status[],
  index: number,
  removeFn: (index: number) => void,
  addFn: (coms: Status[], newCom: Status) => void,
): Command {
  const removedCom = deepCloneStatus(coms[index])
  return {
    type: 'remove',
    execute: () => {
      removeFn(index)
    },
    undo: () => {
      // 在原来的位置插入
      const insertIndex = Math.min(index, coms.length)
      coms.splice(insertIndex, 0, removedCom)
    },
  }
}

// Update Command - 更新属性（支持防抖合并）
export function createUpdateCommand(
  coms: Status[],
  comIndex: number,
  configKey: string,
  oldValue: unknown,
  newValue: unknown,
  setValueFn: (coms: Status[], comIndex: number, configKey: string, value: unknown) => void,
): Command {
  return {
    type: 'update',
    mergeKey: `update-${comIndex}-${configKey}`,
    execute: () => {
      setValueFn(coms, comIndex, configKey, newValue)
    },
    undo: () => {
      setValueFn(coms, comIndex, configKey, oldValue)
    },
  }
}

// Move Command - 移动组件（拖拽排序）
export function createMoveCommand(
  coms: Status[],
  oldIndex: number,
  newIndex: number,
): Command {
  return {
    type: 'move',
    execute: () => {
      const item = coms.splice(oldIndex, 1)[0]
      coms.splice(newIndex, 0, item)
    },
    undo: () => {
      const item = coms.splice(newIndex, 1)[0]
      coms.splice(oldIndex, 0, item)
    },
  }
}

// Reset Command - 重置所有组件
export function createResetCommand(
  coms: Status[],
  oldComs: Status[],
  newComs: Status[],
  resetFn: () => void,
): Command {
  return {
    type: 'update',
    execute: () => {
      resetFn()
    },
    undo: () => {
      coms.length = 0
      coms.push(...deepCloneStatusArray(oldComs))
    },
  }
}
