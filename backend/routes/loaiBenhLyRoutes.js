import express from 'express';
import {
  getAllLoaiBenhLy,
  getLoaiBenhLyById,
  createLoaiBenhLy
} from '../controllers/loaiBenhLyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all loai benh ly - available for all authenticated users
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllLoaiBenhLy);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getLoaiBenhLyById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createLoaiBenhLy);

export default router;

