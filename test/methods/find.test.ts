import { describe, expect, it } from 'vitest'
import { treeFind } from '../../src/methods/find'

describe('treeFind', () => {
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

  it('should find node by predicate (pre-order)', () => {
    const node4 = treeFind(tree, node => node.id === 4)
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nodeByName = treeFind(tree, node => node.name === 'Node 1.1.2')
    expect(nodeByName?.id).toBe(5)
    expect(nodeByName?.name).toBe('Node 1.1.2')

    const nonExistent = treeFind(tree, node => node.id === 6)
    expect(nonExistent).toBe(undefined)
  })

  it('should find node by predicate (post-order)', () => {
    const node4 = treeFind(tree, node => node.id === 4, { strategy: 'post' })
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nodeByName = treeFind(tree, node => node.name === 'Node 1.1.2', { strategy: 'post' })
    expect(nodeByName?.id).toBe(5)
    expect(nodeByName?.name).toBe('Node 1.1.2')

    const nonExistent = treeFind(tree, node => node.id === 6, { strategy: 'post' })
    expect(nonExistent).toBe(undefined)
  })

  it('should find node by predicate (breadth-first)', () => {
    const node4 = treeFind(tree, node => node.id === 4, { strategy: 'breadth' })
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nodeByName = treeFind(tree, node => node.name === 'Node 1.1.2', { strategy: 'breadth' })
    expect(nodeByName?.id).toBe(5)
    expect(nodeByName?.name).toBe('Node 1.1.2')

    const nonExistent = treeFind(tree, node => node.id === 6, { strategy: 'breadth' })
    expect(nonExistent).toBe(undefined)
  })

  it('should work with custom childrenKey as string', () => {
    const node4 = treeFind(customTree, node => node.id === 4, { childrenKey: 'items' })
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nonExistent = treeFind(customTree, node => node.id === 6, { childrenKey: 'items' })
    expect(nonExistent).toBe(undefined)
  })

  it('should work with custom childrenKey as function', () => {
    const node4 = treeFind(customTree, node => node.id === 4, {
      childrenKey: () => 'items',
    })
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nonExistent = treeFind(customTree, node => node.id === 6, {
      childrenKey: () => 'items',
    })
    expect(nonExistent).toBe(undefined)
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

    const node4 = treeFind(dynamicTree, node => node.id === 4, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })
    expect(node4?.id).toBe(4)
    expect(node4?.name).toBe('Node 1.1.1')

    const nonExistent = treeFind(dynamicTree, node => node.id === 6, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })
    expect(nonExistent).toBe(undefined)
  })

  it('should provide correct meta information', () => {
    const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
    treeFind(tree, (node, meta) => {
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

    expect(matches).toEqual([
      { id: 1, meta: { depth: 0, index: 0, parentIds: [] } },
      { id: 2, meta: { depth: 1, index: 0, parentIds: [1] } },
      { id: 4, meta: { depth: 2, index: 0, parentIds: [1, 2] } },
    ])
  })

  it('should stop traversing after finding a match', () => {
    const visited: number[] = []
    treeFind(tree, (node) => {
      visited.push(node.id)
      return node.id === 4
    })

    expect(visited).toEqual([1, 2, 4])
  })

  it('should handle empty children array', () => {
    const emptyTree = [
      {
        id: 1,
        name: 'Node 1',
        children: [],
      },
    ]
    const node1 = treeFind(emptyTree, node => node.id === 1)
    expect(node1?.id).toBe(1)

    const nonExistent = treeFind(emptyTree, node => node.id === 2)
    expect(nonExistent).toBe(undefined)
  })

  it('should handle undefined children', () => {
    const treeWithUndefined = [
      {
        id: 1,
        name: 'Node 1',
      },
    ]
    const node1 = treeFind(treeWithUndefined, node => node.id === 1)
    expect(node1?.id).toBe(1)

    const nonExistent = treeFind(treeWithUndefined, node => node.id === 2)
    expect(nonExistent).toBe(undefined)
  })
})
