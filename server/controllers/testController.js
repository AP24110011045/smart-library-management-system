import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const testDatabase = async (req, res, next) => {
  try {
    const [books, users, transactions, sampleBook] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Transaction.countDocuments(),
      Book.findOne().select('title author category ISBN availableCopies').lean()
    ]);

    res.json({
      success: true,
      message: 'Database connection is working',
      counts: { books, users, transactions },
      sampleBook
    });
  } catch (error) {
    next(error);
  }
};
