import express from 'express';
import {
  getAllPhanKhu,
  getPhanKhuById,
  createPhanKhu,
  updatePhanKhu,
  deletePhanKhu
} from '../controllers/phanKhuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('super_admin', 'quan_ly_y_te'), getAllPhanKhu);
router.get('/:id', authorize('super_admin', 'quan_ly_y_te'), getPhanKhuById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), createPhanKhu);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), updatePhanKhu);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deletePhanKhu);

export default router;

