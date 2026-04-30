import express from 'express';
import { adminSummary, getOverdueBooks } from '../controllers/adminController.js';
import { allTransactions } from '../controllers/transactionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/summary', adminSummary);
router.get('/transactions', allTransactions);
router.get('/overdue', getOverdueBooks);

export default router;
