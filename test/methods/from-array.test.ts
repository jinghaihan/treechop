import { describe, expect, it } from 'vitest'
import { treeFromArray } from '../../src/methods/from-array'

describe('treeFromArray', () => {
  it('should convert array to tree with default options', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-1-1', name: 'Node 1-1-1', pid: '1-1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ]

    const result = treeFromArray(data)
    expect(result).toEqual([
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
    ])
  })

  it('should convert array to tree with custom parent key', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', parentId: '1' },
      { id: '1-2', name: 'Node 1-2', parentId: '1' },
    ]

    const result = treeFromArray(data, { parentKey: 'parentId' })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Node 1',
        children: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should convert array to tree with custom parent key as function', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', parentId: '1' },
      { id: '1-2', name: 'Node 1-2', parentId: '1' },
    ]

    const result = treeFromArray(data, { parentKey: () => 'parentId' })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Node 1',
        children: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should convert array to tree with custom children key', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ]

    const result = treeFromArray(data, { childrenKey: 'items' })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Node 1',
        items: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should convert array to tree with custom children key as function', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1' },
      { id: '1-2', name: 'Node 1-2', pid: '1' },
    ]

    const result = treeFromArray(data, { childrenKey: () => 'items' })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Node 1',
        items: [
          { id: '1-1', name: 'Node 1-1' },
          { id: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should convert array to tree with custom id key', () => {
    const data = [
      { nodeId: '1', name: 'Node 1' },
      { nodeId: '1-1', name: 'Node 1-1', pid: '1' },
      { nodeId: '1-2', name: 'Node 1-2', pid: '1' },
    ]

    const result = treeFromArray(data, { idKey: 'nodeId' })

    expect(result).toEqual([
      {
        nodeId: '1',
        name: 'Node 1',
        children: [
          { nodeId: '1-1', name: 'Node 1-1' },
          { nodeId: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should support function-based id key', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { key: '1-1', name: 'Node 1-1', pid: '1' },
      { key: '1-2', name: 'Node 1-2', pid: '1' },
    ]

    const result = treeFromArray(data, {
      idKey: node => node.id ? 'id' : 'key',
    })

    expect(result).toEqual([
      {
        id: '1',
        name: 'Node 1',
        children: [
          { key: '1-1', name: 'Node 1-1' },
          { key: '1-2', name: 'Node 1-2' },
        ],
      },
    ])
  })

  it('should be root node if parent key is not found', () => {
    const data = [
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1', pid: '1-2' },
    ]

    const result = treeFromArray(data)

    expect(result).toEqual([
      { id: '1', name: 'Node 1' },
      { id: '1-1', name: 'Node 1-1' },
    ])
  })
})
