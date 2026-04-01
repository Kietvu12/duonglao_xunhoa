import express from 'express';
import {
  tinhVaTaoKPI,
  tinhVaTaoKPITatCa,
  getAllKPI,
  getMyKPI,
  updateDiemMucUuTien,
  getDiemMucUuTien
} from '../controllers/kpiController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Lấy danh sách điểm số mức độ ưu tiên (tất cả đều có thể xem)
router.get('/diem-muc-uu-tien', getDiemMucUuTien);

// Cập nhật điểm số mức độ ưu tiên (chỉ admin)
router.put('/diem-muc-uu-tien', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), updateDiemMucUuTien);

// Tính và tạo KPI (chỉ admin)
router.post('/tinh-kpi', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), tinhVaTaoKPI);
router.post('/tinh-kpi-tat-ca', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su'), tinhVaTaoKPITatCa);

// Lấy danh sách KPI (admin có thể xem tất cả, nhân viên chỉ xem của mình)
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'quan_ly_nhan_su', 'dieu_duong_truong', 'dieu_duong'), getAllKPI);

// Lấy KPI của nhân viên hiện tại
router.get('/my-kpi', authorize('dieu_duong', 'dieu_duong_truong'), getMyKPI);

export default router;

