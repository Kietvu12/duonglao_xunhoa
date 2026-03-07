import express from 'express';
import { getDashboard, getBaoCao } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su', 'dieu_duong_truong'), getDashboard);
router.get('/bao-cao', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), getBaoCao);

export default router;

