import express from 'express';
import {
  autocompleteBooks,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  searchByIndex,
  undoAdminAction,
  updateBook
} from '../controllers/bookController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBooks);
router.get('/autocomplete', protect, autocompleteBooks);
router.get('/index/:key', protect, searchByIndex);
router.get('/:id', protect, getBook);
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);
router.post('/admin/undo', protect, authorize('admin'), undoAdminAction);

export default router;
