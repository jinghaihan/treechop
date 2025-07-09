import type { Callback, TreeNode, TreeOptions } from '../types'
import { createTreeUtils } from '../utils'

export function treeCount<T extends TreeNode>(
  tree: T[],
  predicate?: Callback<T, boolean>,
  options: TreeOptions = {},
): number {
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): number => {
    let count = 0

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }

      if (!predicate || predicate(node, meta)) {
        count++
      }

      if (utils.hasChildren(node, meta)) {
        count += traverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
      }
    }

    return count
  }

  return traverse(tree)
}
