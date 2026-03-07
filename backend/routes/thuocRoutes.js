import express from 'express';
import {
  getDonThuoc,
  createDonThuoc,
  updateDonThuoc,
  deleteDonThuoc
} from '../controllers/thuocController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getDonThuoc);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createDonThuoc);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateDonThuoc);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteDonThuoc);

export default router;

