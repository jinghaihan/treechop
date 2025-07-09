import type { Callback, TreeNode, TreeOptions } from '../types'
import { createTreeUtils } from '../utils'

export function treeSome<T extends TreeNode>(
  tree: T[],
  predicate: Callback<T>,
  options: TreeOptions = {},
): boolean {
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }
      const result = predicate(node, meta)

      if (result)
        return true

      if (utils.hasChildren(node, meta)) {
        const hasMatch = traverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
        if (hasMatch)
          return true
      }
    }
    return false
  }

  return traverse(tree)
}
