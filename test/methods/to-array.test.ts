import { describe, expect, it } from 'vitest'
import { treeToArray } from '../../src/methods/to-array'

describe('toArray', () => {
  it('should convert tree to array with default options', () => {
    const tree = [
      {
        id: '1',
        name: 'Node 1',
        children: [
          {
            id: '1-1',
            name: 'Node 1-1',
            children: [
              { id: '1-1-1', name: 'Node 1-1-1' },
            ],
          },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree)

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-1-1', name: 'Node 1-1-1', pid: '1-1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ])
  })

  it('should convert tree to array with custom parent key', () => {
    const tree = [
      {
        id: '1',
        name: 'Node 1',
        children: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree, { parentKey: 'parentId' })

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', parentId: '1' },
      { id: '1-2', name: 'Node 1-2', parentId: '1' },
    ])
  })

  it('should convert tree to array with custom parent key as function', () => {
    const tree = [
      {
        id: '1',
        name: 'Node 1',
        children: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree, { parentKey: () => 'pid' })

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ])
  })

  it('should convert tree to array with custom children key', () => {
    const tree = [
      {
        id: '1',
        name: 'Node 1',
        items: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree, { childrenKey: 'items' })

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ])
  })

  it('should convert tree to array with different traverse types', () => {
    const tree = [
      {
        id: '1',
        children: [
          { id: '1-1' },
          { id: '1-2' },
        ],
      },
    ]

    const preOrder = treeToArray(tree, { strategy: 'pre' })
    const postOrder = treeToArray(tree, { strategy: 'post' })
    const breadthOrder = treeToArray(tree, { strategy: 'breadth' })

    expect(preOrder.map(node => node.id)).toEqual(['1', '1-1', '1-2'])
    expect(postOrder.map(node => node.id)).toEqual(['1-1', '1-2', '1'])
    expect(breadthOrder.map(node => node.id)).toEqual(['1', '1-1', '1-2'])
  })

  it('should handle tree without children', () => {
    const tree = [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
    ]

    const result = treeToArray(tree)

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
    ])
  })

  it('should convert tree to array with custom id key', () => {
    const tree = [
      {
        nodeId: '1',
        name: 'Node 1',
        children: [
          { nodeId: '1-1', name: 'Node 1-1' },
          { nodeId: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree, { idKey: 'nodeId' })

    expect(result).toEqual([
      { nodeId: '1', name: 'Node 1' },
      { nodeId: '1-1', name: 'Node 1-1', pid: '1' },
      { nodeId: '1-2', name: 'Node 1-2', pid: '1' },
    ])
  })

  it('should support function-based id key', () => {
    const tree = [
      {
        id: '1',
        name: 'Node 1',
        children: [
          { key: '1-1', name: 'Node 1-1' },
          { key: '1-2', name: 'Node 1-2' },
        ],
      },
    ]

    const result = treeToArray(tree, {
      idKey: node => node.id ? 'id' : 'key',
    })

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { key: '1-1', name: 'Node 1-1', pid: '1' },
      { key: '1-2', name: 'Node 1-2', pid: '1' },
    ])
  })
})
