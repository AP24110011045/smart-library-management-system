import express from 'express';
import { allTransactions, issueBook, myHistory, overdueTransactions, returnBook } from '../controllers/transactionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);
router.get('/my-history', protect, myHistory);
router.get('/overdue', protect, authorize('admin'), overdueTransactions);
router.get('/', protect, authorize('admin'), allTransactions);

export default router;
