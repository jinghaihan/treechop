import type { CallbackMeta, KeyGetter, TraversalOptions, TreeNode, TreeUtils } from '../types'
import { DEFAULT_ID_KEY, DEFAULT_PARENT_KEY } from '../constants'
import { breadthTraverse, postOrderTraverse, preOrderTraverse } from '../traverse'
import { createTreeUtils } from '../utils'

interface ToArrayOptions<T extends TreeNode = TreeNode> extends TraversalOptions<T> {
  idKey?: KeyGetter<T>
  parentKey?: KeyGetter<T>
}

export function treeToArray<T extends TreeNode>(
  tree: T[],
  options: ToArrayOptions = {},
): T[] {
  const { strategy = 'pre' } = options
  const utils = createUtils<T>(options)

  const callback = (node: T, meta: CallbackMeta<T>) => {
    // Create a mutable copy of the node
    const result = Object.assign({}, node)
    const parentNode = meta.parents[meta.parents.length - 1]

    // Remove children field
    const childrenKey = utils.getChildrenKey(node, meta)
    delete result[childrenKey]

    // Add parent id
    if (parentNode) {
      const parentKey = utils.getParentKey(node, meta)
      const parentId = utils.getId(parentNode, meta)
      Object.assign(result, { [parentKey]: parentId })
    }

    return result as T
  }

  switch (strategy) {
    case 'post':
      return postOrderTraverse(tree, callback, utils)
    case 'breadth':
      return breadthTraverse(tree, callback, utils)
    case 'pre':
    default:
      return preOrderTraverse(tree, callback, utils)
  }
}

interface ToArrayUtils<T extends TreeNode = TreeNode> extends TreeUtils<T> {
  parentKey: KeyGetter<T>
  idKey: KeyGetter<T>
  getId: (node: T, meta: CallbackMeta<T>) => PropertyKey
  getIdKey: (node: T, meta: CallbackMeta<T>) => string
  getParentKey: (node: T, meta: CallbackMeta<T>) => string
}

function createUtils<T extends TreeNode>(options: ToArrayOptions<T> = {}): ToArrayUtils<T> {
  const baseUtils = createTreeUtils(options)
  const { idKey = DEFAULT_ID_KEY, parentKey = DEFAULT_PARENT_KEY } = options

  return {
    ...baseUtils,
    idKey,
    parentKey,
    getId(node: T, meta: CallbackMeta<T>): PropertyKey {
      const key = this.getIdKey(node, meta)
      return node[key]
    },
    getIdKey(node: T, meta: CallbackMeta<T>) {
      return typeof this.idKey === 'function'
        ? this.idKey(node, meta)
        : this.idKey
    },
    getParentKey(node: T, meta: CallbackMeta<T>) {
      return typeof this.parentKey === 'function'
        ? this.parentKey(node, meta)
        : this.parentKey
    },
  }
}
