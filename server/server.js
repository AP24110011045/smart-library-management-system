import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { rebuildIndexes } from './dsa/libraryIndex.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import testRoutes from './routes/testRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedLocalOrigins = [
  clientUrl,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
];

const isLocalOrigin = (origin) => {
  if (!origin) return true;
  return allowedLocalOrigins.includes(origin) || /^(https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+):\d+)$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isLocalOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS origin denied: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'Smart Library API is running' }));
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(async () => {
  await rebuildIndexes();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
