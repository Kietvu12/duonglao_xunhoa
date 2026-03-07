import express from 'express';
import {
  getAllDichVu,
  getDichVuById,
  createDichVu,
  updateDichVu,
  deleteDichVu
} from '../controllers/dichVuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - no auth required for viewing
router.get('/', getAllDichVu);
router.get('/:id', getDichVuById);

// Protected routes
router.use(authenticate);
router.post('/', authorize('super_admin', 'quan_ly_y_te', 'marketing'), createDichVu);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), updateDichVu);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te', 'marketing'), deleteDichVu);

export default router;

