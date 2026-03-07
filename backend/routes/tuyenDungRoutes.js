import express from 'express';
import {
  getAllTinTuyenDung,
  getTinTuyenDungById,
  createTinTuyenDung,
  updateTinTuyenDung,
  deleteTinTuyenDung,
  getAllHoSoUngTuyen,
  createHoSoUngTuyen,
  updateHoSoUngTuyen,
  addMediaTinTuyenDung,
  deleteMediaTinTuyenDung,
  getMediaTinTuyenDung
} from '../controllers/tuyenDungController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadMedia, uploadDocument } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/tin-tuyen-dung', getAllTinTuyenDung);
router.get('/tin-tuyen-dung/:id', getTinTuyenDungById);
router.get('/tin-tuyen-dung/:id/media', getMediaTinTuyenDung);
router.post('/ho-so-ung-tuyen', uploadDocument.single('file_cv'), createHoSoUngTuyen);

// Protected routes
router.use(authenticate);

// Tin tuyen dung
router.post('/tin-tuyen-dung', authorize('super_admin', 'quan_ly_nhan_su'), createTinTuyenDung);
router.put('/tin-tuyen-dung/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateTinTuyenDung);
router.delete('/tin-tuyen-dung/:id', authorize('super_admin', 'quan_ly_nhan_su'), deleteTinTuyenDung);

// Media for tin tuyen dung
router.post('/tin-tuyen-dung/:id/media', authorize('super_admin', 'quan_ly_nhan_su'), uploadMedia.array('files', 10), addMediaTinTuyenDung);
router.delete('/tin-tuyen-dung/:id/media/:mediaId', authorize('super_admin', 'quan_ly_nhan_su'), deleteMediaTinTuyenDung);

// Ho so ung tuyen
router.get('/ho-so-ung-tuyen', authorize('super_admin', 'quan_ly_nhan_su'), getAllHoSoUngTuyen);
router.put('/ho-so-ung-tuyen/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateHoSoUngTuyen);

export default router;

