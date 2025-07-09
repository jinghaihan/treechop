import type { TreeNode, TreeOptions } from '../types'
import { DEFAULT_CHILDREN_KEY, DEFAULT_ID_KEY, DEFAULT_PARENT_KEY } from '../constants'

type KeyGetter<T extends TreeNode = TreeNode> = string | ((node: T) => string)

interface FromArrayOptions<T extends TreeNode = TreeNode> extends TreeOptions<T> {
  childrenKey?: KeyGetter<T>
  idKey?: KeyGetter<T>
  parentKey?: KeyGetter<T>
}

export function treeFromArray<T extends TreeNode<C>, C extends string = 'children'>(
  nodes: T[],
  options: FromArrayOptions<T> = {},
): T[] {
  const utils = createUtils(options)
  const nodeMap = new Map<PropertyKey, T>()
  const rootNodes: T[] = []

  for (const node of nodes) {
    const id = utils.getId(node)
    nodeMap.set(id, node)
  }

  for (const node of nodes) {
    if (!utils.hasParentKey(node)) {
      rootNodes.push(node)
      continue
    }

    const parentKey = utils.getParentKey(node)
    const parentId = utils.getParentId(node)
    const parent = nodeMap.get(parentId!)
    delete node[parentKey as keyof T]

    if (!parent) {
      rootNodes.push(node)
      continue
    }

    const childrenKey = utils.getChildrenKey(parent)
    const children = (parent as TreeNode)[childrenKey] as T[] || []
    ;(parent as TreeNode)[childrenKey] = children
    children.push(node)
  }

  return rootNodes
}

interface FromArrayUtils<T extends TreeNode = TreeNode> {
  childrenKey: KeyGetter<T>
  idKey: KeyGetter<T>
  parentKey: KeyGetter<T>
  getChildrenKey: (node: T) => string
  getIdKey: (node: T) => string
  getId: (node: T) => PropertyKey
  getParentKey: (node: T) => string
  getParentId: (node: T) => PropertyKey | undefined
  hasParentKey: (node: T) => boolean
}

function createUtils<T extends TreeNode>(options: FromArrayOptions<T> = {}): FromArrayUtils<T> {
  const {
    childrenKey = DEFAULT_CHILDREN_KEY,
    idKey = DEFAULT_ID_KEY,
    parentKey = DEFAULT_PARENT_KEY,
  } = options

  return {
    childrenKey,
    idKey,
    parentKey,
    getChildrenKey(node: T) {
      return typeof this.childrenKey === 'function'
        ? this.childrenKey(node)
        : this.childrenKey
    },
    getIdKey(node: T) {
      return typeof this.idKey === 'function'
        ? this.idKey(node)
        : this.idKey
    },
    getId(node: T) {
      const idKey = this.getIdKey(node)
      return node[idKey as keyof T] as PropertyKey
    },
    getParentKey(node: T) {
      return typeof this.parentKey === 'function'
        ? this.parentKey(node)
        : this.parentKey
    },
    getParentId(node: T) {
      const parentKey = this.getParentKey(node)
      return node[parentKey as keyof T] as PropertyKey
    },
    hasParentKey(node: T) {
      const parentKey = this.getParentKey(node)
      return typeof parentKey === 'string' && parentKey in node
    },
  }
}
