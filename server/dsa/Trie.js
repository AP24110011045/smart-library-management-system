class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.books = [];
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(title, book) {
    let node = this.root;
    for (const char of title.toLowerCase()) {
      if (!node.children.has(char)) node.children.set(char, new TrieNode());
      node = node.children.get(char);
      node.books.push(book);
    }
    node.isEnd = true;
  }

  autocomplete(prefix, limit = 8) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char);
    }

    const unique = new Map();
    for (const book of node.books) {
      unique.set(String(book._id), book);
      if (unique.size >= limit) break;
    }
    return [...unique.values()];
  }
}
