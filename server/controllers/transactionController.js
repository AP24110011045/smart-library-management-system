import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { Queue } from '../dsa/Queue.js';
import { addDays, calculateFine } from '../utils/dates.js';
import { rebuildIndexes } from '../dsa/libraryIndex.js';

export const issueBook = async (req, res, next) => {
  try {
    const { bookId, userId, days = 14 } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId is required' });
    const targetUserId = req.user.role === 'admin' && userId ? userId : req.user._id;

    const [book, user] = await Promise.all([Book.findById(bookId), User.findById(targetUserId)]);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyBorrowed = user.borrowedBooks.some((item) => String(item.book) === String(book._id));
    if (alreadyBorrowed) return res.status(400).json({ message: 'This user already borrowed this book' });

    if (book.availableCopies <= 0) {
      const queue = new Queue(book.waitingList);
      const alreadyWaiting = queue.toArray().some((entry) => String(entry.user) === String(user._id));
      if (!alreadyWaiting) queue.enqueue({ user: user._id, requestedAt: new Date() });
      book.waitingList = queue.toArray();
      await book.save();
      await Transaction.create({ userId: user._id, bookId: book._id, dueDate: addDays(new Date(), days), status: 'waiting' });
      return res.status(202).json({ message: 'No copies available. User added to waiting list.', waitingList: book.waitingList });
    }

    const transaction = await Transaction.create({
      userId: user._id,
      bookId: book._id,
      issueDate: new Date(),
      dueDate: addDays(new Date(), Number(days))
    });

    book.availableCopies -= 1;
    book.issuedTo.push(user._id);
    user.borrowedBooks.push({ book: book._id, transaction: transaction._id });

    await Promise.all([book.save(), user.save()]);
    await rebuildIndexes();
    res.status(201).json({ message: 'Book issued successfully', transaction });
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) return res.status(400).json({ message: 'transactionId is required' });
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'issued') {
      return res.status(404).json({ message: 'Active issue transaction not found' });
    }

    if (req.user.role !== 'admin' && String(transaction.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only return your own borrowed books' });
    }

    const [book, user] = await Promise.all([Book.findById(transaction.bookId), User.findById(transaction.userId)]);
    const returnDate = new Date();
    const fine = calculateFine(transaction.dueDate, returnDate);

    transaction.returnDate = returnDate;
    transaction.fine = fine;
    transaction.status = 'returned';

    book.availableCopies += 1;
    book.issuedTo = book.issuedTo.filter((id) => String(id) !== String(user._id));
    user.borrowedBooks = user.borrowedBooks.filter((item) => String(item.transaction) !== String(transaction._id));

    const queue = new Queue(book.waitingList);
    const nextReader = queue.dequeue();
    book.waitingList = queue.toArray();

    await Promise.all([transaction.save(), book.save(), user.save()]);
    await rebuildIndexes();

    res.json({
      message: nextReader ? 'Book returned. A waiting student can now issue it.' : 'Book returned successfully',
      fine,
      nextReader
    });
  } catch (error) {
    next(error);
  }
};

export const myHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('bookId', 'title author category ISBN')
      .sort({ createdAt: -1 });
    res.json(
      transactions.map((transaction) => ({
        ...transaction.toObject(),
        currentFine: transaction.status === 'issued' ? calculateFine(transaction.dueDate, new Date()) : transaction.fine
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const allTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('bookId', 'title author category ISBN')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const overdueTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ status: 'issued', dueDate: { $lt: new Date() } })
      .populate('bookId', 'title author category ISBN')
      .populate('userId', 'name email')
      .sort({ dueDate: 1 });

    res.json(
      transactions.map((transaction) => ({
        ...transaction.toObject(),
        currentFine: calculateFine(transaction.dueDate, new Date())
      }))
    );
  } catch (error) {
    next(error);
  }
};
