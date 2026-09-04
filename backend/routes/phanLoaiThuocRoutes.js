import express from 'express';
import {
  getAllPhanLoaiThuoc,
  getPhanLoaiThuocById,
  createPhanLoaiThuoc,
  updatePhanLoaiThuoc,
  deletePhanLoaiThuoc
} from '../controllers/phanLoaiThuocController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const VIEW_ROLES = ['super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'];
const MANAGE_ROLES = ['super_admin', 'quan_ly_y_te'];

router.use(authenticate);

router.get('/', authorize(...VIEW_ROLES), getAllPhanLoaiThuoc);
router.get('/:id', authorize(...VIEW_ROLES), getPhanLoaiThuocById);
router.post('/', authorize(...MANAGE_ROLES), createPhanLoaiThuoc);
router.put('/:id', authorize(...MANAGE_ROLES), updatePhanLoaiThuoc);
router.delete('/:id', authorize(...MANAGE_ROLES), deletePhanLoaiThuoc);

export default router;
