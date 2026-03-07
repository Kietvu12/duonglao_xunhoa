import express from 'express';
import {
  getAllBenhNhan,
  getBenhNhanById,
  createBenhNhan,
  updateBenhNhan,
  deleteBenhNhan,
  getBenhNhanByDieuDuong,
  assignBenhNhanToDieuDuong,
  removeBenhNhanFromDieuDuong,
  getHuyetAp,
  createHuyetAp,
  updateHuyetAp,
  deleteHuyetAp,
  getNhipTim,
  createNhipTim,
  updateNhipTim,
  deleteNhipTim,
  getDuongHuyet,
  createDuongHuyet,
  updateDuongHuyet,
  deleteDuongHuyet,
  getSpO2,
  createSpO2,
  updateSpO2,
  deleteSpO2,
  getNhietDo,
  createNhietDo,
  updateNhietDo,
  deleteNhietDo,
  getQRCodeByBenhNhan,
  createQRCodeForBenhNhanAPI,
  regenerateQRCodeForBenhNhan,
  getMediaBenhNhan,
  addMediaBenhNhan,
  deleteMediaBenhNhan
} from '../controllers/benhNhanController.js';
import {
  getHoSoYTeByBenhNhan,
  createOrUpdateHoSoYTe,
  deleteHoSoYTe
} from '../controllers/hoSoYTeController.js';
import {
  getBenhHienTaiByBenhNhan,
  createBenhHienTai,
  updateBenhHienTai,
  deleteBenhHienTai
} from '../controllers/benhHienTaiController.js';
import {
  getTamLyGiaoTiepByBenhNhan,
  createTamLyGiaoTiep,
  updateTamLyGiaoTiep,
  deleteTamLyGiaoTiep
} from '../controllers/tamLyGiaoTiepController.js';
import {
  getVanDongPhucHoiByBenhNhan,
  createVanDongPhucHoi,
  updateVanDongPhucHoi,
  deleteVanDongPhucHoi
} from '../controllers/vanDongPhucHoiController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadMedia } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations - require medical or admin roles
router.get('/', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getAllBenhNhan);
router.get('/dieu-duong/:id_dieu_duong', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getBenhNhanByDieuDuong);

// QR Code routes - phải đặt trước route /:id để tránh conflict
router.get('/:id/qr-code', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getQRCodeByBenhNhan);
router.post('/:id/qr-code', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createQRCodeForBenhNhanAPI);
router.post('/:id/qr-code/regenerate', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), regenerateQRCodeForBenhNhan);

router.get('/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getBenhNhanById);
router.post('/', authorize('super_admin', 'quan_ly_y_te'), uploadMedia.single('avatar'), createBenhNhan);
router.put('/:id', authorize('super_admin', 'quan_ly_y_te'), uploadMedia.single('avatar'), updateBenhNhan);
router.delete('/:id', authorize('super_admin', 'quan_ly_y_te'), deleteBenhNhan);

// Media routes for benh nhan
router.get('/:id/media', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getMediaBenhNhan);
router.post('/:id/media', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), uploadMedia.array('files', 10), addMediaBenhNhan);
router.delete('/:id/media/:mediaId', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteMediaBenhNhan);

// Quản lý gán bệnh nhân cho điều dưỡng
router.post('/dieu-duong/assign', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), assignBenhNhanToDieuDuong);
router.put('/dieu-duong/remove/:id_quan_ly', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong'), removeBenhNhanFromDieuDuong);


// Ho so y te
router.get('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getHoSoYTeByBenhNhan);
router.post('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createOrUpdateHoSoYTe);
router.put('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createOrUpdateHoSoYTe);
router.delete('/:id_benh_nhan/ho-so-y-te', authorize('super_admin', 'quan_ly_y_te'), deleteHoSoYTe);

// Benh hien tai
router.get('/:id_benh_nhan/benh-hien-tai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getBenhHienTaiByBenhNhan);
router.post('/:id_benh_nhan/benh-hien-tai', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createBenhHienTai);
router.put('/benh-hien-tai/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateBenhHienTai);
router.delete('/benh-hien-tai/:id', authorize('super_admin', 'quan_ly_y_te'), deleteBenhHienTai);

// Tam ly giao tiep
router.get('/:id_benh_nhan/tam-ly-giao-tiep', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getTamLyGiaoTiepByBenhNhan);
router.post('/:id_benh_nhan/tam-ly-giao-tiep', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createTamLyGiaoTiep);
router.put('/tam-ly-giao-tiep/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateTamLyGiaoTiep);
router.delete('/tam-ly-giao-tiep/:id', authorize('super_admin', 'quan_ly_y_te'), deleteTamLyGiaoTiep);

// Van dong phuc hoi
router.get('/:id_benh_nhan/van-dong-phuc-hoi', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getVanDongPhucHoiByBenhNhan);
router.post('/:id_benh_nhan/van-dong-phuc-hoi', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createVanDongPhucHoi);
router.put('/van-dong-phuc-hoi/:id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateVanDongPhucHoi);
router.delete('/van-dong-phuc-hoi/:id', authorize('super_admin', 'quan_ly_y_te'), deleteVanDongPhucHoi);

// Chi so sinh ton - API riêng cho từng loại
// Huyet ap
router.get('/:id/huyet-ap', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getHuyetAp);
router.post('/:id/huyet-ap', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createHuyetAp);
router.put('/:id/huyet-ap/:huyet_ap_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateHuyetAp);
router.delete('/:id/huyet-ap/:huyet_ap_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteHuyetAp);

// Nhip tim
router.get('/:id/nhip-tim', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getNhipTim);
router.post('/:id/nhip-tim', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createNhipTim);
router.put('/:id/nhip-tim/:nhip_tim_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateNhipTim);
router.delete('/:id/nhip-tim/:nhip_tim_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteNhipTim);

// Duong huyet
router.get('/:id/duong-huyet', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getDuongHuyet);
router.post('/:id/duong-huyet', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createDuongHuyet);
router.put('/:id/duong-huyet/:duong_huyet_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateDuongHuyet);
router.delete('/:id/duong-huyet/:duong_huyet_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteDuongHuyet);

// SpO2
router.get('/:id/spo2', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getSpO2);
router.post('/:id/spo2', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createSpO2);
router.put('/:id/spo2/:spo2_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateSpO2);
router.delete('/:id/spo2/:spo2_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteSpO2);

// Nhiet do
router.get('/:id/nhiet-do', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), getNhietDo);
router.post('/:id/nhiet-do', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), createNhietDo);
router.put('/:id/nhiet-do/:nhiet_do_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), updateNhietDo);
router.delete('/:id/nhiet-do/:nhiet_do_id', authorize('super_admin', 'quan_ly_y_te', 'dieu_duong_truong', 'dieu_duong'), deleteNhietDo);

export default router;

