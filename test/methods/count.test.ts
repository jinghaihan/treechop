import { describe, expect, it } from 'vitest'
import { treeCount } from '../../src/methods/count'

describe('treeCount', () => {
  const tree = [
    {
      id: 1,
      name: 'Node 1',
      children: [
        {
          id: 2,
          name: 'Node 1.1',
          children: [
            { id: 4, name: 'Node 1.1.1' },
            { id: 5, name: 'Node 1.1.2' },
          ],
        },
        {
          id: 3,
          name: 'Node 1.2',
        },
      ],
    },
  ]

  const customTree = [
    {
      id: 1,
      name: 'Node 1',
      items: [
        {
          id: 2,
          name: 'Node 1.1',
          items: [
            { id: 4, name: 'Node 1.1.1' },
            { id: 5, name: 'Node 1.1.2' },
          ],
        },
        {
          id: 3,
          name: 'Node 1.2',
        },
      ],
    },
  ]

  it('should count nodes by predicate', () => {
    expect(treeCount(tree, node => node.id % 2 === 0)).toBe(2)
    expect(treeCount(tree, node => node.name.includes('1.1'))).toBe(3)
    expect(treeCount(tree, node => node.id > 5)).toBe(0)
  })

  it('should work with custom childrenKey as string', () => {
    expect(treeCount(customTree, node => node.id % 2 === 0, { childrenKey: 'items' })).toBe(2)
    expect(treeCount(customTree, node => node.id > 5, { childrenKey: 'items' })).toBe(0)
  })

  it('should work with custom childrenKey as function', () => {
    expect(treeCount(customTree, node => node.id % 2 === 0, {
      childrenKey: () => 'items',
    })).toBe(2)
    expect(treeCount(customTree, node => node.id > 5, {
      childrenKey: () => 'items',
    })).toBe(0)
  })

  it('should work with dynamic childrenKey based on depth', () => {
    const dynamicTree = [
      {
        id: 1,
        name: 'Node 1',
        level1Children: [
          {
            id: 2,
            name: 'Node 1.1',
            level2Children: [
              { id: 4, name: 'Node 1.1.1' },
              { id: 5, name: 'Node 1.1.2' },
            ],
          },
          {
            id: 3,
            name: 'Node 1.2',
          },
        ],
      },
    ]

    expect(treeCount(dynamicTree, node => node.id % 2 === 0, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })).toBe(2)

    expect(treeCount(dynamicTree, node => node.id > 5, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })).toBe(0)
  })

  it('should provide correct meta information', () => {
    const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
    treeCount(tree, (node, meta) => {
      matches.push({
        id: node.id,
        meta: {
          depth: meta.depth,
          index: meta.index,
          parentIds: meta.parents.map(p => p.id),
        },
      })
      return true
    })

    expect(matches).toEqual([
      { id: 1, meta: { depth: 0, index: 0, parentIds: [] } },
      { id: 2, meta: { depth: 1, index: 0, parentIds: [1] } },
      { id: 4, meta: { depth: 2, index: 0, parentIds: [1, 2] } },
      { id: 5, meta: { depth: 2, index: 1, parentIds: [1, 2] } },
      { id: 3, meta: { depth: 1, index: 1, parentIds: [1] } },
    ])
  })

  it('should handle empty children array', () => {
    const emptyTree = [
      {
        id: 1,
        name: 'Node 1',
        children: [],
      },
    ]
    expect(treeCount(emptyTree, node => node.id === 1)).toBe(1)
    expect(treeCount(emptyTree, node => node.id === 2)).toBe(0)
  })

  it('should handle undefined children', () => {
    const treeWithUndefined = [
      {
        id: 1,
        name: 'Node 1',
      },
    ]
    expect(treeCount(treeWithUndefined, node => node.id === 1)).toBe(1)
    expect(treeCount(treeWithUndefined, node => node.id === 2)).toBe(0)
  })

  it('should work with complex predicates', () => {
    expect(treeCount(tree, node =>
      node.name.includes('1.1') && node.id % 2 === 0)).toBe(2)

    expect(treeCount(tree, node =>
      node.name.startsWith('Node') && node.id > 5)).toBe(0)
  })
})
