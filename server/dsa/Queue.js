export class Queue {
  constructor(items = []) {
    this.items = [...items];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift() || null;
  }

  peek() {
    return this.items[0] || null;
  }

  toArray() {
    return [...this.items];
  }
}
