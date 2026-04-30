import express from 'express';
import { autocompleteSearch, searchByISBN } from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/autocomplete', protect, autocompleteSearch);
router.get('/isbn/:isbn', protect, searchByISBN);

export default router;
