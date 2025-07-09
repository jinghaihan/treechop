import { describe, expect, it } from 'vitest'
import { treeSort } from '../../src/methods/sort'

describe('treeSort', () => {
  it('should sort nodes by number value in ascending order', () => {
    const tree = [
      {
        id: '1',
        value: 3,
        children: [
          { id: '1-2', value: 5 },
          { id: '1-1', value: 2 },
          { id: '1-3', value: 4 },
        ],
      },
      {
        id: '2',
        value: 1,
        children: [
          { id: '2-2', value: 8 },
          { id: '2-1', value: 6 },
          { id: '2-3', value: 7 },
        ],
      },
    ]

    const result = treeSort(tree, { sortKey: 'value' })

    expect(result).toEqual([
      {
        id: '2',
        value: 1,
        children: [
          { id: '2-1', value: 6 },
          { id: '2-3', value: 7 },
          { id: '2-2', value: 8 },
        ],
      },
      {
        id: '1',
        value: 3,
        children: [
          { id: '1-1', value: 2 },
          { id: '1-3', value: 4 },
          { id: '1-2', value: 5 },
        ],
      },
    ])
  })

  it('should sort nodes by number value in descending order', () => {
    const tree = [
      {
        id: '1',
        value: 3,
        children: [
          { id: '1-2', value: 5 },
          { id: '1-1', value: 2 },
          { id: '1-3', value: 4 },
        ],
      },
      {
        id: '2',
        value: 1,
        children: [
          { id: '2-2', value: 8 },
          { id: '2-1', value: 6 },
          { id: '2-3', value: 7 },
        ],
      },
    ]

    const result = treeSort(tree, { sortKey: 'value', order: 'desc' })

    expect(result).toEqual([
      {
        id: '1',
        value: 3,
        children: [
          { id: '1-2', value: 5 },
          { id: '1-3', value: 4 },
          { id: '1-1', value: 2 },
        ],
      },
      {
        id: '2',
        value: 1,
        children: [
          { id: '2-2', value: 8 },
          { id: '2-3', value: 7 },
          { id: '2-1', value: 6 },
        ],
      },
    ])
  })

  it('should sort nodes by string value in ascending order', () => {
    const tree = [
      {
        id: '1',
        name: 'Charlie',
        children: [
          { id: '1-1', name: 'Echo' },
          { id: '1-2', name: 'Delta' },
          { id: '1-3', name: 'Foxtrot' },
        ],
      },
      {
        id: '2',
        name: 'Bravo',
        children: [
          { id: '2-1', name: 'Hotel' },
          { id: '2-2', name: 'Golf' },
          { id: '2-3', name: 'India' },
        ],
      },
      {
        id: '3',
        name: 'Alpha',
      },
    ]

    const result = treeSort(tree, { sortKey: 'name' })

    expect(result).toEqual([
      {
        id: '3',
        name: 'Alpha',
      },
      {
        id: '2',
        name: 'Bravo',
        children: [
          { id: '2-2', name: 'Golf' },
          { id: '2-1', name: 'Hotel' },
          { id: '2-3', name: 'India' },
        ],
      },
      {
        id: '1',
        name: 'Charlie',
        children: [
          { id: '1-2', name: 'Delta' },
          { id: '1-1', name: 'Echo' },
          { id: '1-3', name: 'Foxtrot' },
        ],
      },
    ])
  })

  it('should sort nodes by string value in descending order', () => {
    const tree = [
      {
        id: '1',
        name: 'Charlie',
        children: [
          { id: '1-1', name: 'Echo' },
          { id: '1-2', name: 'Delta' },
          { id: '1-3', name: 'Foxtrot' },
        ],
      },
      {
        id: '2',
        name: 'Bravo',
        children: [
          { id: '2-1', name: 'Hotel' },
          { id: '2-2', name: 'Golf' },
          { id: '2-3', name: 'India' },
        ],
      },
      {
        id: '3',
        name: 'Alpha',
      },
    ]

    const result = treeSort(tree, { sortKey: 'name', order: 'desc' })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Charlie',
        children: [
          { id: '1-3', name: 'Foxtrot' },
          { id: '1-1', name: 'Echo' },
          { id: '1-2', name: 'Delta' },
        ],
      },
      {
        id: '2',
        name: 'Bravo',
        children: [
          { id: '2-3', name: 'India' },
          { id: '2-1', name: 'Hotel' },
          { id: '2-2', name: 'Golf' },
        ],
      },
      {
        id: '3',
        name: 'Alpha',
      },
    ])
  })

  it('should handle custom children key', () => {
    const tree = [
      {
        id: '1',
        value: 3,
        items: [
          { id: '1-2', value: 2 },
          { id: '1-1', value: 1 },
        ],
      },
    ]

    const result = treeSort(tree, { sortKey: 'value', childrenKey: 'items' })

    expect(result).toEqual([
      {
        id: '1',
        value: 3,
        items: [
          { id: '1-1', value: 1 },
          { id: '1-2', value: 2 },
        ],
      },
    ])
  })

  it('should handle null/undefined values', () => {
    const tree = [
      { id: '1', value: 1 },
      { id: '2', value: undefined },
      { id: '3', value: null },
      { id: '4', value: 2 },
    ]

    const result = treeSort(tree, { sortKey: 'value' })

    expect(result).toEqual([
      { id: '1', value: 1 },
      { id: '4', value: 2 },
      { id: '2', value: undefined },
      { id: '3', value: null },
    ])
  })
})
