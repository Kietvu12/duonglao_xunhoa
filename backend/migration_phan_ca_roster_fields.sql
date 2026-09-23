-- Bổ sung mã ca roster và hình thức làm việc cho lich_phan_ca

ALTER TABLE `lich_phan_ca`
  ADD COLUMN `ma_ca` varchar(50) DEFAULT NULL COMMENT 'Ký hiệu trên roster: A, D, N, OH, Remote...' AFTER `ca`,
  ADD COLUMN `hinh_thuc_lam_viec` varchar(50) DEFAULT NULL COMMENT 'remote, onsite, hanh_chinh, tai_co_so...' AFTER `ma_ca`,
  ADD COLUMN `ghi_chu` text DEFAULT NULL AFTER `trang_thai`,
  ADD KEY `idx_lich_phan_ca_ma_ca` (`ma_ca`);
