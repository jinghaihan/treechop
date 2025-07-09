import type { Callback, TreeNode, TreeOptions } from '../types'
import { createTreeUtils } from '../utils'

export function treeDelete<T extends TreeNode>(
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
      const shouldDelete = predicate(node, meta)

      if (!shouldDelete) {
        // Create a new node with the same properties
        const newNode = { ...node } as TreeNode
        if (utils.hasChildren(node, meta)) {
          const children = traverse(
            utils.getChildren(node, meta),
            [...parents, node],
            depth + 1,
          )
          const childrenKey = utils.getChildrenKey(node, meta)
          if (children.length > 0)
            newNode[childrenKey] = children
          else
            delete newNode[childrenKey]
        }
        result.push(newNode as T)
      }
    }

    return result
  }

  return traverse(tree)
}
