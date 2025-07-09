import type { Callback, TreeNode, TreeOptions } from '../types'
import { createTreeUtils } from '../utils'

export function treeSearch<T extends TreeNode>(
  tree: T[],
  predicate: Callback<T, boolean>,
  options: TreeOptions = {},
): T[] {
  const utils = createTreeUtils<T>(options)

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): { result: T[], hasMatch: boolean } => {
    const result: T[] = []
    let branchHasMatch = false

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const meta = { depth, index: i, parents }
      const matched = predicate(node, meta)
      let childrenHasMatch = false

      // Create a new node with the same properties
      const newNode = { ...node } as TreeNode

      // Check children first (post-order traversal)
      if (utils.hasChildren(node, meta)) {
        const { result: children, hasMatch } = traverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
        childrenHasMatch = hasMatch
        const childrenKey = utils.getChildrenKey(node, meta)
        if (children.length > 0) {
          newNode[childrenKey] = children
        }
        else {
          delete newNode[childrenKey]
        }
      }

      // If current node matches or some child matches, include this node
      if (matched || childrenHasMatch) {
        branchHasMatch = true
        result.push(newNode as T)
      }
    }

    return { result, hasMatch: branchHasMatch }
  }

  return traverse(tree).result
}
