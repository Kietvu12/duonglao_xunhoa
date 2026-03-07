import express from 'express';
import {
  getAllCauHinhChiSoCanhBao,
  getCauHinhChiSoCanhBaoById,
  createCauHinhChiSoCanhBao,
  updateCauHinhChiSoCanhBao,
  deleteCauHinhChiSoCanhBao
} from '../controllers/cauHinhChiSoCanhBaoController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getAllCauHinhChiSoCanhBao);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), getCauHinhChiSoCanhBaoById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createCauHinhChiSoCanhBao);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updateCauHinhChiSoCanhBao);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteCauHinhChiSoCanhBao);

export default router;

