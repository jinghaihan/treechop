import type { TreeNode } from '../../src/types'
import { describe, expect, it } from 'vitest'
import { treeFlatMap, treeMap } from '../../src/methods/map'

describe('map', () => {
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

  describe('treeMap', () => {
    it('should map nodes by transform function', () => {
      const result = treeMap(tree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }))

      expect(result[0].name).toBe('NODE 1')
      expect(result[0].children?.[0].name).toBe('NODE 1.1')
      expect(result[0].children?.[0].children?.[0].name).toBe('NODE 1.1.1')
    })

    it('should work with custom childrenKey as string', () => {
      const result = treeMap(customTree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }), { childrenKey: 'items' })

      expect(result[0].name).toBe('NODE 1')
      expect(result[0].items?.[0].name).toBe('NODE 1.1')
      expect(result[0].items?.[0].items?.[0].name).toBe('NODE 1.1.1')
    })

    it('should work with custom childrenKey as function', () => {
      const result = treeMap(customTree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }), {
        childrenKey: () => 'items',
      })

      expect(result[0].name).toBe('NODE 1')
      expect(result[0].items?.[0].name).toBe('NODE 1.1')
      expect(result[0].items?.[0].items?.[0].name).toBe('NODE 1.1.1')
    })

    it('should work with dynamic childrenKey based on depth', () => {
      const result = treeMap(dynamicTree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }), {
        childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
      })

      expect(result[0].name).toBe('NODE 1')
      expect(result[0].level1Children?.[0].name).toBe('NODE 1.1')
      expect(result[0].level1Children?.[0].level2Children?.[0].name).toBe('NODE 1.1.1')
    })

    it('should provide correct meta information', () => {
      const matches: Array<{ id: number, meta: { depth: number, index: number, parentIds: number[] } }> = []
      treeMap(tree, (node, meta) => {
        matches.push({
          id: node.id,
          meta: {
            depth: meta.depth,
            index: meta.index,
            parentIds: meta.parents.map(p => p.id),
          },
        })
        return node
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
      const result = treeMap(emptyTree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }))

      expect(result[0].name).toBe('NODE 1')
      expect(result[0].children).toEqual([])
    })

    it('should handle undefined children', () => {
      const treeWithUndefined = [
        {
          id: 1,
          name: 'Node 1',
        },
      ]
      const result = treeMap(treeWithUndefined, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }))

      expect(result[0].name).toBe('NODE 1')
    })

    it('should work with complex transformations', () => {
      const result = treeMap<TreeNode, TreeNode>(tree, node => ({
        ...node,
        name: node.name.toUpperCase(),
        depth: node.name.split('.').length,
      }))

      expect(result[0].depth).toBe(1)
      expect(result[0].children?.[0].depth).toBe(2)
      expect(result[0].children?.[0].children?.[0].depth).toBe(3)
    })

    it('should preserve the tree structure', () => {
      const result = treeMap(tree, node => ({
        ...node,
        name: node.name.toUpperCase(),
      }))

      expect(result).toEqual([
        {
          id: 1,
          name: 'NODE 1',
          children: [
            {
              id: 2,
              name: 'NODE 1.1',
              children: [
                { id: 4, name: 'NODE 1.1.1' },
                { id: 5, name: 'NODE 1.1.2' },
              ],
            },
            {
              id: 3,
              name: 'NODE 1.2',
            },
          ],
        },
      ])
    })
  })

  describe('treeFlatMap', () => {
    it('should map nodes by transform function (pre-order)', () => {
      const result = treeFlatMap(tree, node => node.name.toUpperCase())

      expect(result).toEqual([
        'NODE 1',
        'NODE 1.1',
        'NODE 1.1.1',
        'NODE 1.1.2',
        'NODE 1.2',
      ])
    })

    it('should map nodes by transform function (post-order)', () => {
      const result = treeFlatMap(tree, node => node.name.toUpperCase(), { strategy: 'post' })

      expect(result).toEqual([
        'NODE 1.1.1',
        'NODE 1.1.2',
        'NODE 1.1',
        'NODE 1.2',
        'NODE 1',
      ])
    })

    it('should map nodes by transform function (breadth-first)', () => {
      const result = treeFlatMap(tree, node => node.name.toUpperCase(), { strategy: 'breadth' })

      expect(result).toEqual([
        'NODE 1',
        'NODE 1.1',
        'NODE 1.2',
        'NODE 1.1.1',
        'NODE 1.1.2',
      ])
    })

    it('should work with custom childrenKey as string', () => {
      const result = treeFlatMap(customTree, node => node.name.toUpperCase(), { childrenKey: 'items' })

      expect(result).toEqual([
        'NODE 1',
        'NODE 1.1',
        'NODE 1.1.1',
        'NODE 1.1.2',
        'NODE 1.2',
      ])
    })

    it('should work with custom childrenKey as function', () => {
      const result = treeFlatMap(customTree, node => node.name.toUpperCase(), {
        childrenKey: () => 'items',
      })

      expect(result).toEqual([
        'NODE 1',
        'NODE 1.1',
        'NODE 1.1.1',
        'NODE 1.1.2',
        'NODE 1.2',
      ])
    })

    it('should work with dynamic childrenKey based on depth', () => {
      const result = treeFlatMap(dynamicTree, node => node.name.toUpperCase(), {
        childrenKey: (_, meta) => meta.depth === 0 ? 'level1Children' : 'level2Children',
      })

      expect(result).toEqual([
        'NODE 1',
        'NODE 1.1',
        'NODE 1.1.1',
        'NODE 1.1.2',
        'NODE 1.2',
      ])
    })
  })
})
