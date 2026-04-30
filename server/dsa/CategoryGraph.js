export class CategoryGraph {
  constructor() {
    this.adjacency = new Map();
  }

  addBook(book) {
    const category = book.category.toLowerCase();
    if (!this.adjacency.has(category)) this.adjacency.set(category, []);
    this.adjacency.get(category).push(book);
  }

  recommend(book, limit = 5) {
    const category = book.category.toLowerCase();
    return (this.adjacency.get(category) || [])
      .filter((candidate) => String(candidate._id) !== String(book._id))
      .slice(0, limit);
  }
}
