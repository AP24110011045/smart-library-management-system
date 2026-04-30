import { indexes } from '../dsa/libraryIndex.js';

export const autocompleteSearch = (req, res) => {
  const results = indexes.autocompleteTitles(req.query.q || '', 10);
  res.json(results);
};

export const searchByISBN = (req, res) => {
  const book = indexes.findBookByISBN(req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found in ISBN BST index' });
  res.json(book);
};
