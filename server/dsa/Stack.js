export class Stack {
  constructor() {
    this.items = [];
  }

  push(action) {
    this.items.push(action);
  }

  pop() {
    return this.items.pop() || null;
  }

  peek() {
    return this.items[this.items.length - 1] || null;
  }
}

export const adminActionStack = new Stack();
