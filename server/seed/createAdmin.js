import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error(
        'Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters)'
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Account already exists. No changes made.');
      return;
    }

    await User.create({
      name: 'Admin Librarian',
      email,
      password,
      role: 'admin'
    });

    console.log('Admin account created successfully!');
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
