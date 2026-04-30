import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

dotenv.config();

const users = [
  { name: 'Admin Librarian', email: 'admin@library.com', password: 'password123', role: 'admin' },
  { name: 'Student Reader', email: 'student@library.com', password: 'password123', role: 'student' }
];

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', description: 'A practical guide to writing readable, maintainable, professional software.', category: 'Programming', ISBN: '9780132350884', totalCopies: 4, availableCopies: 4 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', description: 'Timeless software engineering practices for becoming a thoughtful and effective developer.', category: 'Programming', ISBN: '9780201616224', totalCopies: 3, availableCopies: 3 },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', description: 'A deep look at reliable, scalable, and maintainable data systems.', category: 'Systems', ISBN: '9781449373320', totalCopies: 2, availableCopies: 2 },
  { title: 'Atomic Habits', author: 'James Clear', description: 'A clear framework for building better habits through small consistent improvements.', category: 'Self Improvement', ISBN: '9780735211292', totalCopies: 5, availableCopies: 5 },
  { title: 'Introduction to Algorithms', author: 'CLRS', description: 'A comprehensive textbook covering core algorithms, data structures, and analysis.', category: 'Algorithms', ISBN: '9780262033848', totalCopies: 2, availableCopies: 2 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', description: 'A classic fantasy adventure following Bilbo Baggins on an unexpected journey.', category: 'Fiction', ISBN: '9780547928227', totalCopies: 3, availableCopies: 3 }
];

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Book.deleteMany(), Transaction.deleteMany()]);
  const createdUsers = await User.create(users);
  const createdBooks = await Book.insertMany(books);

  const student = createdUsers.find((user) => user.role === 'student');
  const cleanCode = createdBooks.find((book) => book.ISBN === '9780132350884');
  const algorithms = createdBooks.find((book) => book.ISBN === '9780262033848');
  const systems = createdBooks.find((book) => book.ISBN === '9781449373320');

  const activeTransaction = await Transaction.create({
    userId: student._id,
    bookId: cleanCode._id,
    issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    status: 'issued'
  });

  await Transaction.create({
    userId: student._id,
    bookId: algorithms._id,
    issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    returnDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    fine: 35,
    status: 'returned'
  });

  await Transaction.create({
    userId: student._id,
    bookId: systems._id,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'waiting'
  });

  cleanCode.availableCopies -= 1;
  cleanCode.issuedTo.push(student._id);
  systems.availableCopies = 0;
  systems.waitingList.push({ user: student._id, requestedAt: new Date() });
  student.borrowedBooks.push({ book: cleanCode._id, transaction: activeTransaction._id });

  await Promise.all([cleanCode.save(), systems.save(), student.save()]);

  console.log('Seed data inserted: users, books, and sample transactions');
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
