import { describe, expect, it } from 'vitest'
import { treeFilter, treeFlatFilter } from '../../src/methods/filter'

describe('filter', () => {
  const tree = [
    {
      value: 1,
      children: [
        {
          value: 2,
          children: [
            { value: 4 },
            { value: 6 },
          ],
        },
        { value: 3 },
      ],
    },
    { value: 5 },
    {
      value: 7,
      children: [
        { value: 8 },
      ],
    },
  ]

  describe('treeFilter', () => {
    it('should filter nodes and maintain tree structure', () => {
      const tree = [
        {
          value: 1,
          children: [
            { value: 5 },
            { value: 6 },
          ],
        },
        {
          value: 2,
          children: [
            { value: 1 },
            { value: 3 },
          ],
        },
        {
          value: 6,
          children: [
            { value: 7 },
            { value: 8 },
          ],
        },
      ]
      const result = treeFilter(tree, node => node.value >= 2)
      expect(result).toEqual([
        {
          value: 2,
          children: [
            { value: 3 },
          ],
        },
        {
          value: 6,
          children: [
            { value: 7 },
            { value: 8 },
          ],
        },
      ])
    })

    it('should handle custom children key and maintain nested structure', () => {
      const tree = [
        {
          value: 1,
          items: [
            { value: 5 },
            { value: 6 },
          ],
        },
        {
          value: 2,
          items: [
            { value: 1 },
            { value: 3 },
          ],
        },
        {
          value: 6,
          items: [
            { value: 7 },
            { value: 8 },
          ],
        },
      ]
      const result = treeFilter(tree, node => node.value >= 2, { childrenKey: 'items' })
      expect(result).toEqual([
        {
          value: 2,
          items: [
            { value: 3 },
          ],
        },
        {
          value: 6,
          items: [
            { value: 7 },
            { value: 8 },
          ],
        },
      ])
    })

    it('should handle tree without children', () => {
      const tree = [{ value: 1 }, { value: 2 }]
      const result = treeFilter(tree, node => node.value % 2 === 0)
      expect(result).toEqual([{ value: 2 }])
    })

    it('should remove empty children arrays', () => {
      const tree = [
        {
          value: 2,
          children: [
            { value: 3 },
            { value: 5 },
          ],
        },
      ]
      const result = treeFilter(tree, node => node.value % 2 === 0)
      expect(result).toEqual([{ value: 2 }])
    })
  })

  describe('treeFlatFilter', () => {
    it('should filter nodes with (pre-order) traversal by default', () => {
      const result = treeFlatFilter(tree, node => node.value % 2 === 0)
      expect(result).toEqual([
        { value: 2, children: [{ value: 4 }, { value: 6 }] },
        { value: 4 },
        { value: 6 },
        { value: 8 },
      ])
    })

    it('should filter nodes with (post-order) traversal', () => {
      const result = treeFlatFilter(tree, node => node.value % 2 === 0, { strategy: 'post' })
      expect(result).toEqual([
        { value: 4 },
        { value: 6 },
        { value: 2, children: [{ value: 4 }, { value: 6 }] },
        { value: 8 },
      ])
    })

    it('should filter nodes with (breadth-first) traversal', () => {
      const result = treeFlatFilter(tree, node => node.value % 2 === 0, { strategy: 'breadth' })
      expect(result).toEqual([
        { value: 2, children: [{ value: 4 }, { value: 6 }] },
        { value: 8 },
        { value: 4 },
        { value: 6 },
      ])
    })

    it('should handle custom children key', () => {
      const tree = [
        {
          value: 1,
          items: [
            { value: 2 },
            { value: 3 },
          ],
        },
      ]
      const result = treeFlatFilter(tree, node => node.value % 2 === 0, { childrenKey: 'items' })
      expect(result).toEqual([{ value: 2 }])
    })

    it('should handle tree without children', () => {
      const tree = [{ value: 1 }, { value: 2 }]
      const result = treeFlatFilter(tree, node => node.value % 2 === 0)
      expect(result).toEqual([{ value: 2 }])
    })
  })
})
