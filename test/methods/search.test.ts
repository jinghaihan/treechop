import type { TreeNode } from '../../src/types'
import { describe, expect, it } from 'vitest'
import { treeSearch } from '../../src/methods/search'

describe('treeSearch', () => {
  it('should keep parent nodes when child matches', () => {
    const tree: TreeNode[] = [
      {
        id: '1',
        children: [
          {
            id: '1-1',
            children: [
              { id: '1-1-1', value: 1 },
              { id: '1-1-2', value: 2 },
            ],
          },
          {
            id: '1-2',
            children: [
              { id: '1-2-1', value: 3 },
              { id: '1-2-2', value: 4 },
            ],
          },
        ],
      },
    ]

    const result = treeSearch(tree, (node) => {
      return node.value === 2
    })

    expect(result).toEqual([
      {
        id: '1',
        children: [
          {
            id: '1-1',
            children: [
              { id: '1-1-2', value: 2 },
            ],
          },
        ],
      },
    ])
  })

  it('should keep all matching nodes in a branch', () => {
    const tree = [
      {
        id: '1',
        value: 1,
        children: [
          {
            id: '1-1',
            value: 2,
            children: [
              { id: '1-1-1', value: 2 },
            ],
          },
        ],
      },
    ]

    const result = treeSearch(tree, (node) => {
      return node.value === 2
    })

    expect(result).toEqual([
      {
        id: '1',
        value: 1,
        children: [
          {
            id: '1-1',
            value: 2,
            children: [
              { id: '1-1-1', value: 2 },
            ],
          },
        ],
      },
    ])
  })

  it('should handle custom children key', () => {
    const tree: TreeNode[] = [
      {
        id: '1',
        items: [
          {
            id: '1-1',
            value: 1,
            items: [
              { id: '1-1-1', value: 2 },
            ],
          },
        ],
      },
    ]

    const result = treeSearch(tree, (node) => {
      return node.value === 2
    }, { childrenKey: 'items' })

    expect(result).toEqual([
      {
        id: '1',
        items: [
          {
            id: '1-1',
            value: 1,
            items: [
              { id: '1-1-1', value: 2 },
            ],
          },
        ],
      },
    ])
  })

  it('should return empty array when no matches', () => {
    const tree: TreeNode[] = [
      {
        id: '1',
        children: [
          { id: '1-1', value: 1 },
          { id: '1-2', value: 2 },
        ],
      },
    ]

    const result = treeSearch(tree, (node) => {
      return node.value === 3
    })

    expect(result).toEqual([])
  })
})
