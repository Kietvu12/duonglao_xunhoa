import express from 'express';
import {
  getAllLichThamBenh,
  getLichThamBenhById,
  createLichThamBenh,
  updateLichThamBenh,
  deleteLichThamBenh,
} from '../controllers/lichThamBenhController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Lịch thăm bệnh
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getAllLichThamBenh);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getLichThamBenhById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createLichThamBenh);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateLichThamBenh);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteLichThamBenh);

export default router;

