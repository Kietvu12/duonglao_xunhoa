import express from 'express';
import {
  getAllThongTinBenh,
  getThongTinBenhById,
  createThongTinBenh
} from '../controllers/thongTinBenhController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all thong tin benh - available for all authenticated users
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllThongTinBenh);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getThongTinBenhById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createThongTinBenh);

export default router;

