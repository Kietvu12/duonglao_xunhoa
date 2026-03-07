import express from 'express';
import {
  getAllTaiKhoan,
  getTaiKhoanById,
  createTaiKhoan,
  updateTaiKhoan,
  resetPassword,
  viewPassword,
  deleteTaiKhoan
} from '../controllers/taiKhoanController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication và chỉ super_admin mới được truy cập
router.use(authenticate);

router.get('/', authorize('super_admin'), getAllTaiKhoan);
router.post('/', authorize('super_admin'), createTaiKhoan);
// Route cụ thể phải đặt trước route có parameter
router.put('/:id/reset-password', authorize('super_admin'), resetPassword);
router.get('/:id/view-password', authorize('super_admin'), viewPassword);
router.get('/:id', authorize('super_admin'), getTaiKhoanById);
router.put('/:id', authorize('super_admin'), updateTaiKhoan);
router.delete('/:id', authorize('super_admin'), deleteTaiKhoan);

export default router;

