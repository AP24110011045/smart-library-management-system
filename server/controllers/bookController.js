import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import { adminActionStack } from '../dsa/Stack.js';
import { indexes, rebuildIndexes } from '../dsa/libraryIndex.js';

export const getBooks = async (req, res, next) => {
  try {
    const { search = '', category = '' } = req.query;
    const query = {};
    if (category) query.category = new RegExp(category, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { ISBN: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }
    const books = await Book.find(query).sort({ createdAt: -1 }).populate('issuedTo', 'name email');
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('issuedTo', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const recommendations = indexes.recommendSimilar(book.toObject(), 5);
    res.json({ book, recommendations });
  } catch (error) {
    next(error);
  }
};

export const autocompleteBooks = async (req, res) => {
  const results = indexes.autocompleteTitles(req.query.q || '', 8);
  res.json(results);
};

export const searchByIndex = async (req, res) => {
  const { key } = req.params;
  const book = indexes.findBookById(key) || indexes.findBookByISBN(key);
  if (!book) return res.status(404).json({ message: 'Book not found in BST index' });
  res.json(book);
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author, description, category, ISBN, totalCopies } = req.body;
    if (!title || !author || !description || !category || !ISBN || totalCopies === undefined) {
      return res.status(400).json({ message: 'Title, author, description, category, ISBN, and totalCopies are required' });
    }
    const payload = { ...req.body, availableCopies: req.body.availableCopies ?? req.body.totalCopies };
    const book = await Book.create(payload);
    await rebuildIndexes();
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const previous = await Book.findById(req.params.id).lean();
    if (!previous) return res.status(404).json({ message: 'Book not found' });

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    adminActionStack.push({ type: 'edit', before: previous, after: book.toObject(), at: new Date() });
    await rebuildIndexes();
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const activeTransactions = await Transaction.countDocuments({ bookId: book._id, status: 'issued' });
    if (activeTransactions > 0) {
      return res.status(400).json({ message: 'Cannot delete a book that is currently issued' });
    }

    await Book.findByIdAndDelete(req.params.id);
    adminActionStack.push({ type: 'delete', before: book, at: new Date() });
    await rebuildIndexes();
    res.json({ message: 'Book deleted', undoAvailable: true });
  } catch (error) {
    next(error);
  }
};

export const undoAdminAction = async (req, res, next) => {
  try {
    const action = adminActionStack.pop();
    if (!action) return res.status(404).json({ message: 'No recent admin edit or delete actions to undo' });

    if (action.type === 'delete') {
      await Book.create(action.before);
    }

    if (action.type === 'edit') {
      await Book.findByIdAndUpdate(action.before._id, action.before, { runValidators: true });
    }

    await rebuildIndexes();
    res.json({ message: `Undid last ${action.type} action`, action });
  } catch (error) {
    next(error);
  }
};
