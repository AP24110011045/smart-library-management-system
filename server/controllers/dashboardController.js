import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const dashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const transactionFilter = isAdmin ? {} : { userId: req.user._id };

    const [books, users, activeUsers, issued, returned, waiting, availableInventory, overdue, recentTransactions] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ borrowedBooks: { $ne: [] } }),
      Transaction.countDocuments({ ...transactionFilter, status: 'issued' }),
      Transaction.countDocuments({ ...transactionFilter, status: 'returned' }),
      Transaction.countDocuments({ ...transactionFilter, status: 'waiting' }),
      Book.aggregate([{ $group: { _id: null, total: { $sum: '$availableCopies' } } }]),
      Transaction.countDocuments({ ...transactionFilter, status: 'issued', dueDate: { $lt: new Date() } }),
      Transaction.find(transactionFilter).populate('bookId', 'title').populate('userId', 'name').sort({ createdAt: -1 }).limit(6)
    ]);

    const categories = await Book.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    const lowStock = await Book.find({ availableCopies: { $lte: 1 } }).select('title availableCopies totalCopies').limit(6);

    res.json({
      books,
      users,
      activeUsers,
      issued,
      returned,
      waiting,
      availableBooks: availableInventory[0]?.total || 0,
      overdue,
      categories,
      lowStock,
      recentTransactions
    });
  } catch (error) {
    next(error);
  }
};
