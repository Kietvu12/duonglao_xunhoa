import express from 'express';
import {
  getAllBaiVietDichVu,
  getBaiVietDichVuById,
  createBaiVietDichVu,
  updateBaiVietDichVu,
  deleteBaiVietDichVu,
  addMediaBaiVietDichVu,
  deleteMediaBaiVietDichVu,
  getBinhLuanBaiVietDichVu,
  createBinhLuanBaiVietDichVu,
  duyetBinhLuanBaiVietDichVu,
  deleteBinhLuanBaiVietDichVu
} from '../controllers/baiVietDichVuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBaiVietDichVu);
router.get('/:id', getBaiVietDichVuById);

// Comments - public create, admin manage
router.get('/binh-luan/all', getBinhLuanBaiVietDichVu);
router.post('/binh-luan', createBinhLuanBaiVietDichVu);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createBaiVietDichVu);
router.put('/:id', authorize('super_admin', 'marketing'), updateBaiVietDichVu);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteBaiVietDichVu);

// Media management
router.post('/media', authorize('super_admin', 'marketing'), addMediaBaiVietDichVu);
router.delete('/media/:id', authorize('super_admin', 'marketing'), deleteMediaBaiVietDichVu);

// Comments management
router.put('/binh-luan/:id/duyet', authorize('super_admin', 'marketing'), duyetBinhLuanBaiVietDichVu);
router.delete('/binh-luan/:id', authorize('super_admin', 'marketing'), deleteBinhLuanBaiVietDichVu);

export default router;

