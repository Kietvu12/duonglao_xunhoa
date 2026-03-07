import express from 'express';
import {
  getAllPhanLoaiDoDung,
  getPhanLoaiDoDungById,
  createPhanLoaiDoDung,
  updatePhanLoaiDoDung,
  deletePhanLoaiDoDung
} from '../controllers/phanLoaiDoDungController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllPhanLoaiDoDung);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getPhanLoaiDoDungById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createPhanLoaiDoDung);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updatePhanLoaiDoDung);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deletePhanLoaiDoDung);

export default router;

