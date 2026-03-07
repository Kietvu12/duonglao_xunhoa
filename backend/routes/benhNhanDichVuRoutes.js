import express from 'express';
import {
  getAllBenhNhanDichVu,
  getBenhNhanDichVuById,
  createBenhNhanDichVu,
  updateBenhNhanDichVu,
  deleteBenhNhanDichVu,
  thanhToanDichVu
} from '../controllers/benhNhanDichVuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), getAllBenhNhanDichVu);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), getBenhNhanDichVuById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createBenhNhanDichVu);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateBenhNhanDichVu);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteBenhNhanDichVu);
router.post('/:id/thanh-toan', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), thanhToanDichVu);

export default router;

