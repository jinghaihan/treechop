import type { Callback, TraversalOptions, TreeNode } from '../types'
import { breadthTraverse, postOrderTraverse, preOrderTraverse } from '../traverse'
import { createTreeUtils } from '../utils'

export function treeForeach<T extends TreeNode>(
  tree: T[],
  callback: Callback<T>,
  options: TraversalOptions = {},
): void {
  const { strategy = 'pre' } = options
  const utils = createTreeUtils<T>(options)

  switch (strategy) {
    case 'post':
      postOrderTraverse(tree, callback, utils)
      break
    case 'breadth':
      breadthTraverse(tree, callback, utils)
      break
    case 'pre':
    default:
      preOrderTraverse(tree, callback, utils)
  }
}
