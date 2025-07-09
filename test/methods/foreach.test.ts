import { describe, expect, it } from 'vitest'
import { treeForeach } from '../../src/methods/foreach'

describe('treeForeach', () => {
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

  it('should traverse nodes in (pre-order)', () => {
    const visited: number[] = []
    treeForeach(tree, (node) => {
      visited.push(node.id)
    })
    expect(visited).toEqual([1, 2, 4, 5, 3])
  })

  it('should traverse nodes in (post-order)', () => {
    const visited: number[] = []
    treeForeach(tree, (node) => {
      visited.push(node.id)
    }, { strategy: 'post' })
    expect(visited).toEqual([4, 5, 2, 3, 1])
  })

  it('should traverse nodes in (breadth-first)', () => {
    const visited: number[] = []
    treeForeach(tree, (node) => {
      visited.push(node.id)
    }, { strategy: 'breadth' })
    expect(visited).toEqual([1, 2, 3, 4, 5])
  })

  it('should work with custom childrenKey as string', () => {
    const visited: number[] = []
    treeForeach(customTree, (node) => {
      visited.push(node.id)
    }, { childrenKey: 'items' })
    expect(visited).toEqual([1, 2, 4, 5, 3])
  })

  it('should work with custom childrenKey as function', () => {
    const visited: number[] = []
    treeForeach(customTree, (node) => {
      visited.push(node.id)
    }, {
      childrenKey: () => 'items',
    })
    expect(visited).toEqual([1, 2, 4, 5, 3])
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

    const visited: number[] = []
    treeForeach(dynamicTree, (node) => {
      visited.push(node.id)
    }, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })
    expect(visited).toEqual([1, 2, 4, 5, 3])
  })

  it('should provide correct meta information', () => {
    const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
    treeForeach(tree, (node, meta) => {
      matches.push({
        id: node.id,
        meta: {
          depth: meta.depth,
          index: meta.index,
          parentIds: meta.parents.map(p => p.id),
        },
      })
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
    const visited: number[] = []
    treeForeach(emptyTree, (node) => {
      visited.push(node.id)
    })
    expect(visited).toEqual([1])
  })

  it('should handle undefined children', () => {
    const treeWithUndefined = [
      {
        id: 1,
        name: 'Node 1',
      },
    ]
    const visited: number[] = []
    treeForeach(treeWithUndefined, (node) => {
      visited.push(node.id)
    })
    expect(visited).toEqual([1])
  })

  it('should handle side effects in callback', () => {
    const sum = { value: 0 }
    treeForeach(tree, (node) => {
      sum.value += node.id
    })
    expect(sum.value).toBe(15) // 1 + 2 + 3 + 4 + 5

    const names: string[] = []
    treeForeach(tree, (node) => {
      names.push(node.name)
    })
    expect(names).toEqual(['Node 1', 'Node 1.1', 'Node 1.1.1', 'Node 1.1.2', 'Node 1.2'])
  })
})
