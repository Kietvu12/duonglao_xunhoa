import express from 'express';
import {
  getAllBaiVietSuKien,
  getBaiVietSuKienById,
  createBaiVietSuKien,
  updateBaiVietSuKien,
  deleteBaiVietSuKien,
  addMediaBaiVietSuKien,
  deleteMediaBaiVietSuKien,
  getBinhLuanBaiVietSuKien,
  createBinhLuanBaiVietSuKien,
  duyetBinhLuanBaiVietSuKien,
  deleteBinhLuanBaiVietSuKien
} from '../controllers/baiVietSuKienController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBaiVietSuKien);
router.get('/:id', getBaiVietSuKienById);

// Comments - public create, admin manage
router.get('/binh-luan/all', getBinhLuanBaiVietSuKien);
router.post('/binh-luan', createBinhLuanBaiVietSuKien);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createBaiVietSuKien);
router.put('/:id', authorize('super_admin', 'marketing'), updateBaiVietSuKien);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteBaiVietSuKien);

// Media management
router.post('/media', authorize('super_admin', 'marketing'), addMediaBaiVietSuKien);
router.delete('/media/:id', authorize('super_admin', 'marketing'), deleteMediaBaiVietSuKien);

// Comments management
router.put('/binh-luan/:id/duyet', authorize('super_admin', 'marketing'), duyetBinhLuanBaiVietSuKien);
router.delete('/binh-luan/:id', authorize('super_admin', 'marketing'), deleteBinhLuanBaiVietSuKien);

export default router;

