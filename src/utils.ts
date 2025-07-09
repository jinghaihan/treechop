import type { CallbackMeta, TreeNode, TreeOptions, TreeUtils } from './types'
import { DEFAULT_CHILDREN_KEY } from './constants'

export function createTreeUtils<T extends TreeNode>(options: TreeOptions<T> = {}): TreeUtils<T> {
  const { childrenKey = DEFAULT_CHILDREN_KEY } = options

  return {
    childrenKey,
    getChildrenKey(node: T, meta: CallbackMeta<T>) {
      return typeof this.childrenKey === 'function'
        ? this.childrenKey(node, meta)
        : this.childrenKey
    },
    getChildren(node: T, meta: CallbackMeta<T>): T[] {
      const key = this.getChildrenKey(node, meta)
      return (node[key] || []) as T[]
    },
    hasChildren(node: T, meta: CallbackMeta<T>): boolean {
      const children = this.getChildren(node, meta)
      return Array.isArray(children) && children.length > 0
    },
  }
}

export function compareValues(a: any, b: any): number {
  // Move null/undefined values to the end
  if (a == null && b == null)
    return 0
  if (a == null)
    return 1
  if (b == null)
    return -1

  // Use different comparison logic based on value type
  if (typeof a === 'number' && typeof b === 'number')
    return a - b

  // Convert to string for comparison
  const strA = String(a).toLowerCase()
  const strB = String(b).toLowerCase()
  return strA.localeCompare(strB)
}
