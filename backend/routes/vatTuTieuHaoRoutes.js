import express from 'express';
import {
  getDanhMucNgoaiKho,
  getVatTuTieuHaoHomNay,
  getAllVatTuTieuHao,
  getVatTuTieuHaoById,
  createVatTuTieuHao,
  updateVatTuTieuHaoTrangThai,
  deleteVatTuTieuHao
} from '../controllers/vatTuTieuHaoController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const VIEW_ROLES = ['super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'];
const WRITE_ROLES = ['super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'];
const MANAGE_ROLES = ['super_admin', 'quan_ly_y_te', 'dieu_duong_truong'];

router.use(authenticate);

router.get('/danh-muc-ngoai-kho', authorize(...VIEW_ROLES), getDanhMucNgoaiKho);
router.get('/hom-nay', authorize(...VIEW_ROLES), getVatTuTieuHaoHomNay);
router.get('/', authorize(...VIEW_ROLES), getAllVatTuTieuHao);
router.get('/:id', authorize(...VIEW_ROLES), getVatTuTieuHaoById);
router.post('/', authorize(...WRITE_ROLES), createVatTuTieuHao);
router.patch('/:id/trang-thai', authorize(...MANAGE_ROLES), updateVatTuTieuHaoTrangThai);
router.delete('/:id', authorize(...MANAGE_ROLES), deleteVatTuTieuHao);

export default router;
