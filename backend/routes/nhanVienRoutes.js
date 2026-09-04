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
import { uploadDocument, uploadExcel } from '../middleware/upload.js';
import { uploadFile } from '../controllers/uploadController.js';
import {
  downloadPhanCaTemplate,
  previewPhanCaImport,
  importPhanCa,
  downloadNhanVienDanhMuc,
  downloadPhanCaTemplateForNhanVien,
  downloadBenhNhanPhuTrachForNhanVien,
  previewPhanCaImportForNhanVien,
  importPhanCaForNhanVien,
  downloadCongViecTemplateForNhanVien,
  previewCongViecImportForNhanVien,
  importCongViecForNhanVien,
} from '../controllers/lichThangImportController.js';

const router = express.Router();

router.use(authenticate);

// Nhân viên
router.get('/', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getAllNhanVien);
router.post('/', authorize('super_admin', 'quan_ly_nhan_su'), createNhanVien);
router.put('/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateNhanVien);

// Lịch phân ca
router.get('/lich-phan-ca/all', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getLichPhanCa);
router.post('/lich-phan-ca', authorize('super_admin', 'quan_ly_nhan_su'), createLichPhanCa);
router.put('/lich-phan-ca/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateLichPhanCa);
router.delete('/lich-phan-ca/:id', authorize('super_admin', 'quan_ly_nhan_su'), deleteLichPhanCa);
router.post('/lich-phan-ca/:id/chuyen-ca', authorize('super_admin', 'quan_ly_nhan_su'), chuyenCa);

// Import theo từng nhân viên (đặt trước route /:id)
router.get('/:idHoSo/import/phan-ca/mau', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), downloadPhanCaTemplateForNhanVien);
router.get('/:idHoSo/import/phan-ca/danh-muc-benh-nhan/mau', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), downloadBenhNhanPhuTrachForNhanVien);
router.post('/:idHoSo/import/phan-ca/xem-truoc', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), uploadExcel.single('file'), previewPhanCaImportForNhanVien);
router.post('/:idHoSo/import/phan-ca/import', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), uploadExcel.single('file'), importPhanCaForNhanVien);
router.get('/:idHoSo/import/cong-viec/mau', authorize('super_admin', 'quan_ly_nhan_su', 'quan_ly_y_te', 'dieu_duong_truong'), downloadCongViecTemplateForNhanVien);
router.get('/:idHoSo/import/cong-viec/danh-muc-benh-nhan/mau', authorize('super_admin', 'quan_ly_nhan_su', 'quan_ly_y_te', 'dieu_duong_truong'), downloadBenhNhanPhuTrachForNhanVien);
router.post('/:idHoSo/import/cong-viec/xem-truoc', authorize('super_admin', 'quan_ly_nhan_su', 'quan_ly_y_te', 'dieu_duong_truong'), uploadExcel.single('file'), previewCongViecImportForNhanVien);
router.post('/:idHoSo/import/cong-viec/import', authorize('super_admin', 'quan_ly_nhan_su', 'quan_ly_y_te', 'dieu_duong_truong'), uploadExcel.single('file'), importCongViecForNhanVien);

// Import phân ca theo tháng (toàn hệ thống)
router.get('/phan-ca/mau', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), downloadPhanCaTemplate);
router.get('/danh-muc-nhan-vien/mau', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), downloadNhanVienDanhMuc);
router.post('/phan-ca/xem-truoc', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), uploadExcel.single('file'), previewPhanCaImport);
router.post('/phan-ca/import', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), uploadExcel.single('file'), importPhanCa);

// KPI
router.post('/kpi', authorize('super_admin', 'quan_ly_nhan_su'), createKPI);

// Media hồ sơ nhân viên
router.get('/media-ho-so', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getMediaHoSoNhanVien);
router.get('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getMediaHoSoNhanVienById);
router.post('/media-ho-so/upload', authorize('super_admin', 'quan_ly_nhan_su'), uploadDocument.single('file'), uploadFile);
router.post('/media-ho-so', authorize('super_admin', 'quan_ly_nhan_su'), createMediaHoSoNhanVien);
router.put('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su'), updateMediaHoSoNhanVien);
router.delete('/media-ho-so/:id', authorize('super_admin', 'quan_ly_nhan_su'), deleteMediaHoSoNhanVien);

// Route động đặt sau cùng để tránh bắt nhầm các route tĩnh ở trên
router.get('/:id', authorize('super_admin', 'quan_ly_nhan_su', 'dieu_duong_truong'), getNhanVienById);

export default router;

