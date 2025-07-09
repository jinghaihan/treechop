import type { Callback, TraversalOptions, TreeNode } from '../types'
import { createTreeUtils } from '../utils'

export function treeFind<T extends TreeNode>(
  tree: T[],
  predicate: Callback<T, boolean>,
  options: TraversalOptions = {},
): T | undefined {
  const { strategy = 'pre' } = options
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): T | undefined => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }
      const result = predicate(node, meta)

      if (result)
        return node

      if (utils.hasChildren(node, meta)) {
        const found = traverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
        if (found)
          return found
      }
    }
    return undefined
  }

  const breadthTraverse = (nodes: T[]): T | undefined => {
    const queue: Array<[T, number, T[], number]> = nodes.map(
      (node, index) => [node, index, [], 0],
    )

    while (queue.length) {
      const [node, index, parents, depth] = queue.shift()!
      const meta = { depth, index, parents }
      const result = predicate(node, meta)

      if (result)
        return node

      if (utils.hasChildren(node, meta)) {
        const children = utils.getChildren(node, meta)
        children.forEach((child, childIndex) => {
          queue.push([child, childIndex, [...parents, node], depth + 1])
        })
      }
    }

    return undefined
  }

  const postOrderTraverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): T | undefined => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }

      if (utils.hasChildren(node, meta)) {
        const found = postOrderTraverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
        if (found)
          return found
      }

      const result = predicate(node, meta)
      if (result)
        return node
    }
    return undefined
  }

  switch (strategy) {
    case 'post':
      return postOrderTraverse(tree)
    case 'breadth':
      return breadthTraverse(tree)
    case 'pre':
    default:
      return traverse(tree)
  }
}
