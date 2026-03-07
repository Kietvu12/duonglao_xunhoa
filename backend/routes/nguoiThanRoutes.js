import express from 'express';
import {
  getAllNguoiThan,
  getNguoiThanById,
  createNguoiThan,
  updateNguoiThan,
  deleteNguoiThan
} from '../controllers/nguoiThanController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllNguoiThan);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getNguoiThanById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createNguoiThan);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateNguoiThan);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteNguoiThan);

export default router;

