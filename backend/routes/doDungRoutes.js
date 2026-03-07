import express from 'express';
import {
  getAllDoDung,
  getDoDungById,
  createDoDung,
  updateDoDung,
  deleteDoDung
} from '../controllers/doDungController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllDoDung);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getDoDungById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), createDoDung);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), updateDoDung);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), deleteDoDung);

export default router;

