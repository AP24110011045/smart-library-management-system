import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { calculateFine } from '../utils/dates.js';

export const adminSummary = async (req, res, next) => {
  try {
    const [totalBooks, totalUsers, issuedBooks, overdueBooks] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Transaction.countDocuments({ status: 'issued' }),
      Transaction.countDocuments({ status: 'issued', dueDate: { $lt: new Date() } })
    ]);

    res.json({ totalBooks, totalUsers, issuedBooks, overdueBooks });
  } catch (error) {
    next(error);
  }
};

export const getOverdueBooks = async (req, res, next) => {
  try {
    const overdue = await Transaction.find({ status: 'issued', dueDate: { $lt: new Date() } })
      .populate('bookId', 'title author ISBN category')
      .populate('userId', 'name email')
      .sort({ dueDate: 1 });

    res.json(
      overdue.map((item) => ({
        ...item.toObject(),
        currentFine: calculateFine(item.dueDate, new Date())
      }))
    );
  } catch (error) {
    next(error);
  }
};
