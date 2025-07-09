import type { CallbackMeta, TraversalOptions, TreeNode, TreeOptions } from '../types'
import { breadthTraverse, postOrderTraverse, preOrderTraverse } from '../traverse'
import { createTreeUtils } from '../utils'

type MapCallback<T extends TreeNode, R> = (
  node: T,
  meta: CallbackMeta<T>,
) => R

export function treeFlatMap<T extends TreeNode, R>(
  tree: T[],
  callback: MapCallback<T, R>,
  options: TraversalOptions = {},
): R[] {
  const { strategy = 'pre' } = options
  const utils = createTreeUtils<T>(options)

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

export function treeMap<T extends TreeNode, R extends TreeNode>(
  tree: T[],
  callback: MapCallback<T, R>,
  options: TreeOptions = {},
): R[] {
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): R[] => {
    return nodes.map((node, index) => {
      const meta = { depth, index, parents }
      const mappedNode = callback(node, meta)

      if (utils.hasChildren(node, meta)) {
        const children = utils.getChildren(node, meta)
        if (children && children.length > 0) {
          const mappedChildren = traverse(
            children,
            [...parents, node],
            depth + 1,
          )
          const childrenKey = utils.getChildrenKey(node, meta)
          return {
            ...mappedNode,
            [childrenKey]: mappedChildren,
          }
        }
      }

      return mappedNode
    })
  }

  return traverse(tree)
}
