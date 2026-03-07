import express from 'express';
import {
  getAllLoaiPhong,
  getLoaiPhongById,
  createLoaiPhong,
  updateLoaiPhong,
  deleteLoaiPhong
} from '../controllers/loaiPhongController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllLoaiPhong);
router.get('/:id', getLoaiPhongById);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createLoaiPhong);
router.put('/:id', authorize('super_admin', 'marketing'), updateLoaiPhong);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteLoaiPhong);

export default router;

