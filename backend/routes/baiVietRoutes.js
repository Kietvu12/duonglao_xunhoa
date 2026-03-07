import express from 'express';
import {
  getAllBaiViet,
  getBaiVietById,
  createBaiViet,
  updateBaiViet,
  deleteBaiViet,
  addMediaToBaiViet,
  updateMediaBaiViet,
  deleteMediaBaiViet,
  getMediaBaiViet
} from '../controllers/baiVietController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBaiViet);
router.get('/:id', getBaiVietById);
router.get('/:id/media', getMediaBaiViet);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'marketing'), createBaiViet);
router.put('/:id', authorize('super_admin', 'marketing'), updateBaiViet);
router.delete('/:id', authorize('super_admin', 'marketing'), deleteBaiViet);

// Media management routes
router.post('/:id/media', authorize('super_admin', 'marketing'), addMediaToBaiViet);
router.put('/:id/media/:mediaId', authorize('super_admin', 'marketing'), updateMediaBaiViet);
router.delete('/:id/media/:mediaId', authorize('super_admin', 'marketing'), deleteMediaBaiViet);

export default router;

