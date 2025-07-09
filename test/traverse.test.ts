import type { CallbackMeta, TreeNode } from '../src/types'
import { describe, expect, it } from 'vitest'
import { breadthTraverse, postOrderTraverse, preOrderTraverse } from '../src/traverse'
import { createTreeUtils } from '../src/utils'

interface CustomNode extends TreeNode {
  id: number
  level1Children?: CustomNode[]
  level2Children?: CustomNode[]
}

describe('traverse with dynamic childrenKey', () => {
  const tree: CustomNode[] = [
    {
      id: 1,
      level1Children: [
        {
          id: 2,
          level2Children: [
            { id: 4 },
            { id: 5 },
          ],
        },
        {
          id: 3,
          level2Children: [
            { id: 6 },
          ],
        },
      ],
    },
  ]

  const dynamicChildrenKey = (node: CustomNode, meta: CallbackMeta<CustomNode>) => {
    return meta.depth === 0 ? 'level1Children' : 'level2Children'
  }

  const utils = createTreeUtils<CustomNode>({ childrenKey: dynamicChildrenKey })

  it('should traverse (pre-order) with dynamic childrenKey', () => {
    const result = preOrderTraverse(tree, node => node.id, utils)
    expect(result).toEqual([1, 2, 4, 5, 3, 6])
  })

  it('should traverse (post-order) with dynamic childrenKey', () => {
    const result = postOrderTraverse(tree, node => node.id, utils)
    expect(result).toEqual([4, 5, 2, 6, 3, 1])
  })

  it('should traverse (breadth-first) with dynamic childrenKey', () => {
    const result = breadthTraverse(tree, node => node.id, utils)
    expect(result).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('should handle missing children correctly', () => {
    const treeWithMissing: CustomNode[] = [
      {
        id: 1,
        level1Children: [
          { id: 2 },
          {
            id: 3,
            level2Children: [
              { id: 4 },
            ],
          },
        ],
      },
    ]

    const result = preOrderTraverse(treeWithMissing, node => node.id, utils)
    expect(result).toEqual([1, 2, 3, 4])
  })
})
