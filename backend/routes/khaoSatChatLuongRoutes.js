import express from 'express';
import {
  getAllKhaoSatChatLuong,
  getKhaoSatChatLuongById,
  createKhaoSatChatLuong,
  updateKhaoSatChatLuong,
  deleteKhaoSatChatLuong,
} from '../controllers/khaoSatChatLuongController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'marketing'), getAllKhaoSatChatLuong);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), getKhaoSatChatLuongById);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'marketing'), createKhaoSatChatLuong);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), updateKhaoSatChatLuong);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), deleteKhaoSatChatLuong);

export default router;
