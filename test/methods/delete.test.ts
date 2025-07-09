import { describe, expect, it } from 'vitest'
import { treeDelete } from '../../src/methods/delete'

describe('treeDelete', () => {
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

  it('should delete nodes by predicate', () => {
    const result = treeDelete(tree, node => node.id === 4)
    expect(result[0].children?.[0].children?.length).toBe(1)
    expect(result[0].children?.[0].children?.[0].id).toBe(5)

    const resultMultiple = treeDelete(tree, node => node.name.includes('1.1'))
    expect(resultMultiple[0].children?.length).toBe(1)
    expect(resultMultiple[0].children?.[0].id).toBe(3)

    const resultNone = treeDelete(tree, node => node.id > 5)
    expect(resultNone).toEqual(tree)
  })

  it('should work with custom childrenKey as string', () => {
    const result = treeDelete(customTree, node => node.id === 4, { childrenKey: 'items' })
    expect(result[0].items?.[0].items?.length).toBe(1)
    expect(result[0].items?.[0].items?.[0].id).toBe(5)

    const resultNone = treeDelete(customTree, node => node.id > 5, { childrenKey: 'items' })
    expect(resultNone).toEqual(customTree)
  })

  it('should work with custom childrenKey as function', () => {
    const result = treeDelete(customTree, node => node.id === 4, {
      childrenKey: () => 'items',
    })
    expect(result[0].items?.[0].items?.length).toBe(1)
    expect(result[0].items?.[0].items?.[0].id).toBe(5)

    const resultNone = treeDelete(customTree, node => node.id > 5, {
      childrenKey: () => 'items',
    })
    expect(resultNone).toEqual(customTree)
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

    const result = treeDelete(dynamicTree, node => node.id === 4, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })
    expect(result[0].level1Children?.[0].level2Children?.length).toBe(1)
    expect(result[0].level1Children?.[0].level2Children?.[0].id).toBe(5)

    const resultNone = treeDelete(dynamicTree, node => node.id > 5, {
      childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
    })
    expect(resultNone).toEqual(dynamicTree)
  })

  it('should provide correct meta information', () => {
    const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
    treeDelete(tree, (node, meta) => {
      matches.push({
        id: node.id,
        meta: {
          depth: meta.depth,
          index: meta.index,
          parentIds: meta.parents.map(p => p.id),
        },
      })
      return false
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
    const result = treeDelete(emptyTree, node => node.id === 1)
    expect(result).toEqual([])

    const resultNone = treeDelete(emptyTree, node => node.id === 2)
    expect(resultNone).toEqual(emptyTree)
  })

  it('should handle undefined children', () => {
    const treeWithUndefined = [
      {
        id: 1,
        name: 'Node 1',
      },
    ]
    const result = treeDelete(treeWithUndefined, node => node.id === 1)
    expect(result).toEqual([])

    const resultNone = treeDelete(treeWithUndefined, node => node.id === 2)
    expect(resultNone).toEqual(treeWithUndefined)
  })

  it('should preserve the tree structure for non-deleted nodes', () => {
    const result = treeDelete(tree, node => node.id === 4)
    expect(result).toEqual([
      {
        id: 1,
        name: 'Node 1',
        children: [
          {
            id: 2,
            name: 'Node 1.1',
            children: [
              { id: 5, name: 'Node 1.1.2' },
            ],
          },
          {
            id: 3,
            name: 'Node 1.2',
          },
        ],
      },
    ])
  })

  it('should handle deletion of root nodes', () => {
    const result = treeDelete(tree, node => node.id === 1)
    expect(result).toEqual([])
  })

  it('should handle deletion of multiple nodes', () => {
    const result = treeDelete(tree, node => node.id % 2 === 0)
    expect(result).toEqual([
      {
        id: 1,
        name: 'Node 1',
        children: [
          {
            id: 3,
            name: 'Node 1.2',
          },
        ],
      },
    ])
  })

  it('should handle clean children if all children are deleted', () => {
    const result = treeDelete(tree, node => node.id === 2 || node.id === 3)
    expect(result).toEqual([
      {
        id: 1,
        name: 'Node 1',
      },
    ])
  })
})
