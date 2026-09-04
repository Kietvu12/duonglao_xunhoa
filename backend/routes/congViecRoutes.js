import express from 'express';
import {
  getAllCongViec,
  createCongViec,
  updateCongViec,
  deleteCongViec,
  phanCongCongViec,
  updateTrangThaiCongViec
} from '../controllers/congViecController.js';
import {
  downloadCongViecTemplate,
  previewCongViecImport,
  importCongViec,
  downloadNhanVienDanhMuc,
  downloadBenhNhanDanhMuc
} from '../controllers/lichThangImportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadExcel } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllCongViec);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), createCongViec);

// Import công việc theo tháng
router.get('/import/mau', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), downloadCongViecTemplate);
router.get('/import/danh-muc-nhan-vien', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), downloadNhanVienDanhMuc);
router.get('/import/danh-muc-benh-nhan', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), downloadBenhNhanDanhMuc);
router.post('/import/xem-truoc', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), uploadExcel.single('file'), previewCongViecImport);
router.post('/import', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), uploadExcel.single('file'), importCongViec);

router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), updateCongViec);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteCongViec);
router.post('/phan-cong', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), phanCongCongViec);
router.put('/:id/trang-thai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateTrangThaiCongViec);

export default router;

