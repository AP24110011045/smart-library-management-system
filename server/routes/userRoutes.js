import express from 'express';
import { getProfile, listUsers, lookupUser } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/', protect, authorize('admin'), listUsers);
router.get('/lookup/:key', protect, authorize('admin'), lookupUser);

export default router;
