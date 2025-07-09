export type TreeNode<T extends string = 'children'> = {
  [k: string]: any
} & {
  [P in T]?: TreeNode<P>[]
}

export type KeyGetter<T extends TreeNode = TreeNode> = string | ((node: T, meta: CallbackMeta<T>) => string)

export interface TreeOptions<T extends TreeNode = TreeNode> {
  childrenKey?: KeyGetter<T>
}

export interface TraversalOptions<T extends TreeNode = TreeNode> extends TreeOptions<T> {
  strategy?: 'pre' | 'post' | 'breadth'
}

export interface CallbackMeta<T extends TreeNode = TreeNode> {
  depth: number
  index: number
  parents: T[]
}

export type Callback<T extends TreeNode, R = void | boolean> = (
  node: T,
  meta: CallbackMeta<T>,
) => R

export interface TreeUtils<T extends TreeNode = TreeNode> {
  childrenKey: KeyGetter<T>
  getChildrenKey: (node: T, meta: CallbackMeta<T>) => string
  getChildren: (node: T, meta: CallbackMeta<T>) => T[]
  hasChildren: (node: T, meta: CallbackMeta<T>) => boolean
}
