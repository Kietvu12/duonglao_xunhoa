-- Thêm cột giá ngày vào bảng giá dịch vụ
ALTER TABLE `bang_gia_dich_vu`
  ADD COLUMN `gia_ngay` int DEFAULT NULL AFTER `id_dich_vu`;

-- Cho phép hình thức thanh toán theo ngày khi gán dịch vụ cho bệnh nhân
ALTER TABLE `benh_nhan_dich_vu`
  MODIFY COLUMN `hinh_thuc_thanh_toan` enum('ngay','thang','quy','nam') DEFAULT 'thang';
