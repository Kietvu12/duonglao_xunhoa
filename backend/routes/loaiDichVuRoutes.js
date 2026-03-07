import express from 'express';
import {
  getAllLoaiDichVu,
  getLoaiDichVuById,
  createLoaiDichVu,
  updateLoaiDichVu,
  deleteLoaiDichVu
} from '../controllers/loaiDichVuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllLoaiDichVu);
router.get('/:id', getLoaiDichVuById);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createLoaiDichVu);
router.put('/:id', authorize('super_admin', 'marketing'), updateLoaiDichVu);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteLoaiDichVu);

export default router;

