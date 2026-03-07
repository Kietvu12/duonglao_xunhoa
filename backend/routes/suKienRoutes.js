import express from 'express';
import {
  getAllSuKien,
  getSuKienById,
  createSuKien,
  updateSuKien,
  deleteSuKien,
  // Người tham gia
  addNguoiThamGia,
  removeNguoiThamGia,
  xacNhanThamGia,
  getNguoiThamGia,
  // Phân công
  phanCongNhanVien,
  removePhanCong,
  updatePhanCong,
  getPhanCong
} from '../controllers/suKienController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSuKien);
router.get('/:id', getSuKienById);

// Protected routes
router.use(authenticate);

// CRUD sự kiện
router.post('/', authorize('super_admin', 'marketing'), createSuKien);
router.put('/:id', authorize('super_admin', 'marketing'), updateSuKien);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteSuKien);

// Quản lý người tham gia sự kiện
router.get('/:id/nguoi-tham-gia', authorize('super_admin', 'marketing', 'quan_ly_y_te'), getNguoiThamGia);
router.post('/:id/nguoi-tham-gia', authorize('super_admin', 'marketing', 'quan_ly_y_te'), addNguoiThamGia);
router.delete('/:id/nguoi-tham-gia/:participantId', authorize('super_admin', 'marketing', 'quan_ly_y_te'), removeNguoiThamGia);
router.put('/:id/nguoi-tham-gia/:participantId/xac-nhan', authorize('super_admin', 'marketing', 'quan_ly_y_te'), xacNhanThamGia);

// Quản lý phân công sự kiện
router.get('/:id/phan-cong', authorize('super_admin', 'marketing', 'quan_ly_nhan_su'), getPhanCong);
router.post('/:id/phan-cong', authorize('super_admin', 'marketing', 'quan_ly_nhan_su'), phanCongNhanVien);
router.put('/:id/phan-cong/:assignmentId', authorize('super_admin', 'marketing', 'quan_ly_nhan_su'), updatePhanCong);
router.delete('/:id/phan-cong/:assignmentId', authorize('super_admin', 'marketing', 'quan_ly_nhan_su'), removePhanCong);

export default router;

