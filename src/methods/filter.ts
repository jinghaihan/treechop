import type { Callback, TraversalOptions, TreeNode, TreeOptions } from '../types'
import { breadthTraverse, postOrderTraverse, preOrderTraverse } from '../traverse'
import { createTreeUtils } from '../utils'

export function treeFlatFilter<T extends TreeNode>(
  tree: T[],
  predicate: Callback<T, boolean>,
  options: TraversalOptions = {},
): T[] {
  const { strategy = 'pre' } = options
  const utils = createTreeUtils<T>(options)

  const callback = (node: T, meta: Parameters<Callback<T, boolean>>[1]) => {
    return predicate(node, meta) ? node : null
  }

  switch (strategy) {
    case 'post':
      return postOrderTraverse(tree, callback, utils).filter(Boolean) as T[]
    case 'breadth':
      return breadthTraverse(tree, callback, utils).filter(Boolean) as T[]
    case 'pre':
    default:
      return preOrderTraverse(tree, callback, utils).filter(Boolean) as T[]
  }
}

export function treeFilter<T extends TreeNode>(
  tree: T[],
  predicate: Callback<T, boolean>,
  options: TreeOptions = {},
): T[] {
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): T[] => {
    const result: T[] = []

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }
      const matched = predicate(node, meta)

      if (matched) {
        // Create a new node with the same properties
        const newNode = { ...node } as TreeNode
        if (utils.hasChildren(node, meta)) {
          const children = traverse(
            utils.getChildren(node, meta),
            [...parents, node],
            depth + 1,
          )
          const childrenKey = utils.getChildrenKey(node, meta)
          if (children.length > 0) {
            newNode[childrenKey] = children
          }
          else {
            delete newNode[childrenKey]
          }
        }
        result.push(newNode as T)
      }
    }

    return result
  }

  return traverse(tree)
}
