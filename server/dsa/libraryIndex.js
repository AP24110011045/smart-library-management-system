import Book from '../models/Book.js';
import User from '../models/User.js';
import { Trie } from './Trie.js';
import { BookBST } from './BookBST.js';
import { CategoryGraph } from './CategoryGraph.js';

let titleTrie = new Trie();
let bookIdBST = new BookBST();
let isbnBST = new BookBST();
let userHashMap = new Map();
let categoryGraph = new CategoryGraph();

export const rebuildIndexes = async () => {
  const [books, users] = await Promise.all([Book.find().lean(), User.find().lean()]);

  titleTrie = new Trie();
  bookIdBST = new BookBST();
  isbnBST = new BookBST();
  userHashMap = new Map();
  categoryGraph = new CategoryGraph();

  books.forEach((book) => {
    titleTrie.insert(book.title, book);
    bookIdBST.insert(book._id, book);
    isbnBST.insert(book.ISBN, book);
    categoryGraph.addBook(book);
  });

  users.forEach((user) => {
    userHashMap.set(String(user._id), user);
    userHashMap.set(user.email, user);
  });
};

export const indexes = {
  autocompleteTitles: (prefix, limit) => titleTrie.autocomplete(prefix, limit),
  findBookById: (id) => bookIdBST.search(id),
  findBookByISBN: (isbn) => isbnBST.search(isbn),
  findUser: (key) => userHashMap.get(String(key)) || null,
  recommendSimilar: (book, limit) => categoryGraph.recommend(book, limit)
};
