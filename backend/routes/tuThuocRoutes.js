import express from 'express';
import {
  getThongKeTuThuoc,
  getAllTuThuoc,
  getTuThuocById,
  createTuThuoc,
  updateTuThuoc,
  deleteTuThuoc
} from '../controllers/tuThuocController.js';
import {
  downloadTuThuocTemplate,
  downloadPhanLoaiDanhMuc,
  previewTuThuocImport,
  importTuThuoc
} from '../controllers/tuThuocImportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadExcel } from '../middleware/upload.js';

const router = express.Router();

const VIEW_ROLES = ['super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'];
const MANAGE_ROLES = ['super_admin', 'quan_ly_y_te'];

router.use(authenticate);

router.get('/thong-ke', authorize(...VIEW_ROLES), getThongKeTuThuoc);
router.get('/import/mau', authorize(...MANAGE_ROLES), downloadTuThuocTemplate);
router.get('/import/danh-muc-phan-loai', authorize(...MANAGE_ROLES), downloadPhanLoaiDanhMuc);
router.post('/import/xem-truoc', authorize(...MANAGE_ROLES), uploadExcel.single('file'), previewTuThuocImport);
router.post('/import', authorize(...MANAGE_ROLES), uploadExcel.single('file'), importTuThuoc);
router.get('/', authorize(...VIEW_ROLES), getAllTuThuoc);
router.get('/:id', authorize(...VIEW_ROLES), getTuThuocById);
router.post('/', authorize(...MANAGE_ROLES), createTuThuoc);
router.put('/:id', authorize(...MANAGE_ROLES), updateTuThuoc);
router.delete('/:id', authorize(...MANAGE_ROLES), deleteTuThuoc);

export default router;
