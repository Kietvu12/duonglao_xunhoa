import express from 'express';
import {
  getAllCongViec,
  createCongViec,
  updateCongViec,
  deleteCongViec,
  phanCongCongViec,
  updateTrangThaiCongViec
} from '../controllers/congViecController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllCongViec);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), createCongViec);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), updateCongViec);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteCongViec);
router.post('/phan-cong', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), phanCongCongViec);
router.put('/:id/trang-thai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateTrangThaiCongViec);

export default router;

