class BSTNode {
  constructor(key, book) {
    this.key = key;
    this.book = book;
    this.left = null;
    this.right = null;
  }
}

export class BookBST {
  constructor() {
    this.root = null;
  }

  insert(key, book) {
    if (!key) return;
    this.root = this.#insertNode(this.root, String(key), book);
  }

  #insertNode(node, key, book) {
    if (!node) return new BSTNode(key, book);
    if (key < node.key) node.left = this.#insertNode(node.left, key, book);
    else if (key > node.key) node.right = this.#insertNode(node.right, key, book);
    else node.book = book;
    return node;
  }

  search(key) {
    let current = this.root;
    const lookup = String(key);
    while (current) {
      if (lookup === current.key) return current.book;
      current = lookup < current.key ? current.left : current.right;
    }
    return null;
  }
}
