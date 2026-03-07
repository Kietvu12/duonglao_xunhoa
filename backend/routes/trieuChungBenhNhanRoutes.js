import express from 'express';
import {
  getAllTrieuChungBenhNhan,
  getTrieuChungBenhNhanById,
  createTrieuChungBenhNhan,
  updateTrieuChungBenhNhan,
  deleteTrieuChungBenhNhan
} from '../controllers/trieuChungBenhNhanController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllTrieuChungBenhNhan);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getTrieuChungBenhNhanById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createTrieuChungBenhNhan);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateTrieuChungBenhNhan);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteTrieuChungBenhNhan);

export default router;

