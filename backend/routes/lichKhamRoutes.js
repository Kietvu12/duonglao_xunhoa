import express from 'express';
import {
  getAllLichKham,
  getLichKhamById,
  createLichKham,
  updateLichKham,
  deleteLichKham,
  createLichHenTuVan,
  getAllLichHenTuVan,
  updateLichHenTuVan
} from '../controllers/lichKhamController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Lịch hẹn tư vấn - Public endpoint (không cần auth)
router.post('/tu-van', createLichHenTuVan);

// Tất cả các route khác cần authenticate
router.use(authenticate);

// Lịch khám
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getAllLichKham);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getLichKhamById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createLichKham);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateLichKham);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteLichKham);

// Lịch hẹn tư vấn - Admin endpoints
router.get('/tu-van/all', authorize('super_admin', 'quan_ly_y_te', 'marketing'), getAllLichHenTuVan);
router.put('/tu-van/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), updateLichHenTuVan);

export default router;

