import { describe, expect, it } from 'vitest'
import { treeSome } from '../../src/methods/some'

describe('treeSome', () => {
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

  it('should return true if some node matches the predicate', () => {
    expect(treeSome(tree, node => node.id === 4)).toBe(true)
    expect(treeSome(tree, node => node.name === 'Node 1.1.2')).toBe(true)
    expect(treeSome(tree, node => node.id > 5)).toBe(false)
  })

  it('should work with custom childrenKey as string', () => {
    expect(treeSome(customTree, node => node.id === 4, { childrenKey: 'items' })).toBe(true)
    expect(treeSome(customTree, node => node.id > 5, { childrenKey: 'items' })).toBe(false)
  })

  it('should work with custom childrenKey as function', () => {
    expect(treeSome(customTree, node => node.id === 4, {
      childrenKey: () => 'items',
    })).toBe(true)
    expect(treeSome(customTree, node => node.id > 5, {
      childrenKey: () => 'items',
    })).toBe(false)
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

    expect(treeSome(dynamicTree, node => node.id === 4, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })).toBe(true)

    expect(treeSome(dynamicTree, node => node.id === 6, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })).toBe(false)
  })

  it('should provide correct meta information', () => {
    const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
    treeSome(tree, (node, meta) => {
      matches.push({
        id: node.id,
        meta: {
          depth: meta.depth,
          index: meta.index,
          parentIds: meta.parents.map(p => p.id),
        },
      })
      return node.id === 4
    })

    // Verify that we stop after finding the match
    expect(matches.length).toBeLessThan(5)

    // Verify the path to the matching node
    expect(matches.every((m, i) => {
      if (i === matches.length - 1)
        return m.id === 4 // Last node should be the match
      return m.meta.parentIds.length === i // Each node should have correct number of parents
    })).toBe(true)
  })

  it('should stop traversing after finding a match', () => {
    const visited: number[] = []
    treeSome(tree, (node) => {
      visited.push(node.id)
      return node.id === 4
    })

    expect(visited.length).toBeLessThan(5)
    expect(visited[visited.length - 1]).toBe(4)
  })

  it('should handle empty children array', () => {
    const emptyTree = [
      {
        id: 1,
        name: 'Node 1',
        children: [],
      },
    ]
    expect(treeSome(emptyTree, node => node.id === 1)).toBe(true)
    expect(treeSome(emptyTree, node => node.id === 2)).toBe(false)
  })

  it('should handle undefined children', () => {
    const treeWithUndefined = [
      {
        id: 1,
        name: 'Node 1',
      },
    ]
    expect(treeSome(treeWithUndefined, node => node.id === 1)).toBe(true)
    expect(treeSome(treeWithUndefined, node => node.id === 2)).toBe(false)
  })

  it('should work with complex predicates', () => {
    expect(treeSome(tree, node =>
      node.name.includes('1.1') && node.id % 2 === 0)).toBe(true)

    expect(treeSome(tree, node =>
      node.name.startsWith('Node') && node.id > 5)).toBe(false)
  })
})
