import express from 'express';
import {
  getAllBaiVietPhong,
  getBaiVietPhongById,
  createBaiVietPhong,
  updateBaiVietPhong,
  deleteBaiVietPhong,
  addMediaBaiVietPhong,
  deleteMediaBaiVietPhong,
  getBinhLuanBaiVietPhong,
  createBinhLuanBaiVietPhong,
  duyetBinhLuanBaiVietPhong,
  deleteBinhLuanBaiVietPhong
} from '../controllers/baiVietPhongController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBaiVietPhong);
router.get('/:id', getBaiVietPhongById);

// Comments - public create, admin manage
router.get('/binh-luan/all', getBinhLuanBaiVietPhong);
router.post('/binh-luan', createBinhLuanBaiVietPhong);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createBaiVietPhong);
router.put('/:id', authorize('super_admin', 'marketing'), updateBaiVietPhong);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteBaiVietPhong);

// Media management
router.post('/media', authorize('super_admin', 'marketing'), addMediaBaiVietPhong);
router.delete('/media/:id', authorize('super_admin', 'marketing'), deleteMediaBaiVietPhong);

// Comments management
router.put('/binh-luan/:id/duyet', authorize('super_admin', 'marketing'), duyetBinhLuanBaiVietPhong);
router.delete('/binh-luan/:id', authorize('super_admin', 'marketing'), deleteBinhLuanBaiVietPhong);

export default router;

