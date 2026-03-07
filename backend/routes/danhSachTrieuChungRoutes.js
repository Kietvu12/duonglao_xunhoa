import express from 'express';
import {
  getAllDanhSachTrieuChung,
  getDanhSachTrieuChungById,
  createDanhSachTrieuChung,
  updateDanhSachTrieuChung,
  deleteDanhSachTrieuChung
} from '../controllers/danhSachTrieuChungController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllDanhSachTrieuChung);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getDanhSachTrieuChungById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), createDanhSachTrieuChung);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), updateDanhSachTrieuChung);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteDanhSachTrieuChung);

export default router;

