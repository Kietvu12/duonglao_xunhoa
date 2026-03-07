import express from 'express';
import {
  getThongBaos,
  getThongBaoChuaDoc,
  markAsRead,
  markAllAsRead,
  deleteThongBao
} from '../controllers/thongBaoController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getThongBaos);
router.get('/chua-doc', authenticate, getThongBaoChuaDoc);
router.put('/:id/danh-dau-doc', authenticate, markAsRead);
router.put('/danh-dau-tat-ca-doc', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteThongBao);

export default router;

