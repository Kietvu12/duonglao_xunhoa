import express from 'express';
import {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  getLichPhanCa,
  createLichPhanCa,
  updateLichPhanCa,
  deleteLichPhanCa,
  chuyenCa,
  createKPI
} from '../controllers/nhanVienController.js';
import {
  getMediaHoSoNhanVien,
  getMediaHoSoNhanVienById,
  createMediaHoSoNhanVien,
  updateMediaHoSoNhanVien,
  deleteMediaHoSoNhanVien
} from '../controllers/mediaHoSoNhanVienController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadMedia, uploadDocument } from '../middleware/upload.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

router.use(authenticate);

// Nhân viên
router.get('/', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getAllNhanVien);
router.get('/:id', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getNhanVienById);
router.post('/', authorize('super_admin', 'quan_ly_nhan_su'), createNhanVien);
router.put('/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateNhanVien);

// Lịch phân ca
router.get('/lich-phan-ca/all', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getLichPhanCa);
router.post('/lich-phan-ca', authorize('super_admin', 'quan_ly_nhan_su'), createLichPhanCa);
router.put('/lich-phan-ca/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateLichPhanCa);
router.delete('/lich-phan-ca/:id', authorize('super_admin', 'quan_ly_nhan_su'), deleteLichPhanCa);
router.post('/lich-phan-ca/:id/chuyen-ca', authorize('super_admin', 'quan_ly_nhan_su'), chuyenCa);

// KPI
router.post('/kpi', authorize('super_admin', 'quan_ly_nhan_su'), createKPI);

// Media hồ sơ nhân viên
router.get('/media-ho-so', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getMediaHoSoNhanVien);
router.get('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getMediaHoSoNhanVienById);
router.post('/media-ho-so/upload', authorize('super_admin', 'quan_ly_nhan_su'), uploadDocument.single('file'), uploadFile);
router.post('/media-ho-so', authorize('super_admin', 'quan_ly_nhan_su'), createMediaHoSoNhanVien);
router.put('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateMediaHoSoNhanVien);
router.delete('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su'), deleteMediaHoSoNhanVien);

export default router;

