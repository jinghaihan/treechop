import type { CallbackMeta, TreeNode, TreeUtils } from './types'

export function preOrderTraverse<T extends TreeNode, R>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta<T>) => R,
  utils: TreeUtils<T>,
): R[] {
  const result: R[] = []
  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ) => {
    nodes.forEach((node, index) => {
      const meta = { depth, index, parents }
      result.push(callback(node, meta))
      if (utils.hasChildren(node, meta))
        traverse(utils.getChildren(node, meta), [...parents, node], depth + 1)
    })
  }
  traverse(tree)
  return result
}

export function postOrderTraverse<T extends TreeNode, R>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta<T>) => R,
  utils: TreeUtils<T>,
): R[] {
  const result: R[] = []
  const traverse = (
    nodes: T[],
    parents: T[] = [],
    depth = 0,
  ) => {
    nodes.forEach((node, index) => {
      const meta = { depth, index, parents }
      if (utils.hasChildren(node, meta))
        traverse(utils.getChildren(node, meta), [...parents, node], depth + 1)
      result.push(callback(node, meta))
    })
  }
  traverse(tree)
  return result
}

export function breadthTraverse<T extends TreeNode, R>(
  tree: T[],
  callback: (node: T, meta: CallbackMeta<T>) => R,
  utils: TreeUtils<T>,
): R[] {
  const result: R[] = []
  const queue: Array<[T, number, T[], number]> = tree.map(
    (node, index) => [node, index, [], 0],
  )

  while (queue.length) {
    const [node, index, parents, depth] = queue.shift()!
    const meta = { depth, index, parents }
    result.push(callback(node, meta))

    if (utils.hasChildren(node, meta)) {
      const children = utils.getChildren(node, meta)
      children.forEach((child, childIndex) => {
        queue.push([child, childIndex, [...parents, node], depth + 1])
      })
    }
  }

  return result
}
