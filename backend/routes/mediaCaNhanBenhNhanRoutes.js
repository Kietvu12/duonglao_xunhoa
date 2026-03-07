import express from 'express';
import {
  getAllMediaCaNhanBenhNhan,
  getMediaCaNhanBenhNhanById,
  createMediaCaNhanBenhNhan,
  updateMediaCaNhanBenhNhan,
  deleteMediaCaNhanBenhNhan
} from '../controllers/mediaCaNhanBenhNhanController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadMedia } from '../middleware/upload.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong', 'nguoi_nha'), getAllMediaCaNhanBenhNhan);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong', 'nguoi_nha'), getMediaCaNhanBenhNhanById);
// Route upload file trước route create
router.post('/upload', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), uploadMedia.single('file'), uploadFile);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong', 'nguoi_nha'), createMediaCaNhanBenhNhan);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong', 'nguoi_nha'), updateMediaCaNhanBenhNhan);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteMediaCaNhanBenhNhan);

export default router;

