import type { TreeNode, TreeOptions } from '../types'
import { compareValues, createTreeUtils } from '../utils'

interface SortOptions<T extends TreeNode = TreeNode> extends TreeOptions<T> {
  sortKey: string
  order?: 'asc' | 'desc'
}

export function treeSort<T extends TreeNode>(
  tree: T[],
  options: SortOptions<T>,
): T[] {
  const utils = createTreeUtils<T>(options)
  const order = options.order || 'asc'

  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ): T[] => {
    // Sort nodes at current level
    const sortedNodes = [...nodes].sort((a, b) => {
      const compareResult = compareValues(a[options.sortKey], b[options.sortKey])
      return order === 'asc' ? compareResult : -compareResult
    })

    // Recursively process child nodes
    return sortedNodes.map((node) => {
      const meta = { depth, index: nodes.indexOf(node), parents }
      const newNode = { ...node } as TreeNode

      if (utils.hasChildren(node, meta)) {
        const children = traverse(
          utils.getChildren(node, meta),
          [...parents, node],
          depth + 1,
        )
        const childrenKey = utils.getChildrenKey(node, meta)
        newNode[childrenKey] = children
      }

      return newNode as T
    })
  }

  return traverse(tree)
}
