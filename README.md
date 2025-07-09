# treechop

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

This library provides a set of utility functions for manipulating tree-structured data in JavaScript/TypeScript. Below are the available methods, their signatures, and usage examples.

![Image](/assets/coverage.png)

**Options and Meta Information:**
Most methods accept an `options` parameter to customize keys (e.g., `childrenKey`, `idKey`, `parentKey`) and traversal strategy (`pre`, `post`, `breadth`). The callback meta argument provides information like `depth`, `index`, and `parents`.

## `treeCount`

**Description:**
Counts the number of nodes in a tree that match a given predicate.

**Signature:**
```ts
treeCount<T extends TreeNode>(
  tree: T[],
  predicate?: (node: T, meta: CallbackMeta) => boolean,
  options?: TreeOptions
): number
```

**Example:**
```ts
const count = treeCount(tree, node => node.id % 2 === 0)
```

## `treeDelete`

**Description:**
Deletes nodes from a tree that match a given predicate, returning a new tree.

**Signature:**
```ts
treeDelete<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TreeOptions
): T[]
```

**Example:**
```ts
const newTree = treeDelete(tree, node => node.id === 4)
```

## `treeFlatFilter` & `treeFilter`

**Description:**
- `treeFlatFilter`: Returns a flat array of nodes matching the predicate.
- `treeFilter`: Returns a tree structure containing only nodes matching the predicate.

**Signature:**
```ts
treeFlatFilter<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TraversalOptions
): T[]

treeFilter<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TreeOptions
): T[]
```

**Example:**
```ts
const flat = treeFlatFilter(tree, node => node.value % 2 === 0)
const filteredTree = treeFilter(tree, node => node.value >= 2)
```

## `treeFind`

**Description:**
Finds the first node in the tree that matches the predicate.

**Signature:**
```ts
treeFind<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TraversalOptions
): T | undefined
```

**Example:**
```ts
const found = treeFind(tree, node => node.id === 4)
```

## `treeForeach`

**Description:**
Traverses every node in the tree and applies a callback.

**Signature:**
```ts
treeForeach<T extends TreeNode>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta) => void,
  options?: TraversalOptions
): void
```

**Example:**
```ts
treeForeach(tree, node => console.log(node.id))
```

## `treeFromArray`

**Description:**
Converts a flat array of nodes (with parent references) into a tree structure.

**Signature:**
```ts
treeFromArray<T extends TreeNode>(
  nodes: T[],
  options?: FromArrayOptions<T>
): T[]
```

**Example:**
```ts
const tree = treeFromArray([
  { id: '1', name: 'Node 1' },
  { id: '1-1', name: 'Node 1-1', pid: '1' }
])
```

## `treeFlatMap` & `treeMap`

**Description:**
- `treeFlatMap`: Maps each node to a value and returns a flat array.
- `treeMap`: Maps each node to a new node, preserving the tree structure.

**Signature:**
```ts
treeFlatMap<T extends TreeNode, R>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta) => R,
  options?: TraversalOptions
): R[]

treeMap<T extends TreeNode, R extends TreeNode>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta) => R,
  options?: TreeOptions
): R[]
```

**Example:**
```ts
const names = treeFlatMap(tree, node => node.name)
const upperTree = treeMap(tree, node => ({ ...node, name: node.name.toUpperCase() }))
```

## `treeSearch`

**Description:**
Returns a tree containing only the branches where at least one node matches the predicate.

**Signature:**
```ts
treeSearch<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TreeOptions
): T[]
```

**Example:**
```ts
const result = treeSearch(tree, node => node.value === 2)
```

## `treeSome`

**Description:**
Returns `true` if at least one node in the tree matches the predicate.

**Signature:**
```ts
treeSome<T extends TreeNode>(
  tree: T[],
  predicate: (node: T, meta: CallbackMeta) => boolean,
  options?: TreeOptions
): boolean
```

**Example:**
```ts
const hasEven = treeSome(tree, node => node.id % 2 === 0)
```

## `treeSort`

**Description:**
Sorts the tree nodes at each level by a specified key.

**Signature:**
```ts
treeSort<T extends TreeNode>(
  tree: T[],
  options: { sortKey: string, order?: 'asc' | 'desc' }
): T[]
```

**Example:**
```ts
const sorted = treeSort(tree, { sortKey: 'value', order: 'asc' })
```

## `treeToArray`

**Description:**
Converts a tree structure into a flat array, adding parent references.

**Signature:**
```ts
treeToArray<T extends TreeNode>(
  tree: T[],
  options?: ToArrayOptions<T>
): T[]
```

**Example:**
```ts
const arr = treeToArray(tree)
```

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/treechop?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/treechop
[npm-downloads-src]: https://img.shields.io/npm/dm/treechop?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/treechop
[bundle-src]: https://img.shields.io/bundlephobia/minzip/treechop?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=treechop
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/treechop/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/treechop
