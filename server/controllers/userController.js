import User from '../models/User.js';
import { indexes } from '../dsa/libraryIndex.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author ISBN category');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const lookupUser = (req, res) => {
  const user = indexes.findUser(req.params.key);
  if (!user) return res.status(404).json({ message: 'User not found in HashMap index' });
  const { password, ...publicUser } = user;
  res.json(publicUser);
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('borrowedBooks.book', 'title author ISBN category')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
