import express from 'express';
import {
  getAllPhong,
  getPhongByBenhNhan,
  createPhong,
  updatePhong,
  deletePhong,
  deletePhongByBenhNhan
} from '../controllers/phongController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te'), getAllPhong);
router.get('/benh-nhan/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getPhongByBenhNhan);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createPhong);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updatePhong);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deletePhong);
router.delete('/benh-nhan/:id_benh_nhan', authorize('super_admin', 'quan_ly_y_te'), deletePhongByBenhNhan);

export default router;

