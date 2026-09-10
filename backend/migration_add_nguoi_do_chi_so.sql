-- Ghi nhận điều dưỡng / nhân viên thực hiện đo chỉ số sức khỏe

ALTER TABLE `huyet_ap`
  ADD COLUMN `id_nguoi_do` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - người thực hiện đo' AFTER `id_benh_nhan`,
  ADD KEY `idx_huyet_ap_nguoi_do` (`id_nguoi_do`),
  ADD CONSTRAINT `fk_huyet_ap_nguoi_do` FOREIGN KEY (`id_nguoi_do`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `nhip_tim`
  ADD COLUMN `id_nguoi_do` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - người thực hiện đo' AFTER `id_benh_nhan`,
  ADD KEY `idx_nhip_tim_nguoi_do` (`id_nguoi_do`),
  ADD CONSTRAINT `fk_nhip_tim_nguoi_do` FOREIGN KEY (`id_nguoi_do`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `duong_huyet`
  ADD COLUMN `id_nguoi_do` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - người thực hiện đo' AFTER `id_benh_nhan`,
  ADD KEY `idx_duong_huyet_nguoi_do` (`id_nguoi_do`),
  ADD CONSTRAINT `fk_duong_huyet_nguoi_do` FOREIGN KEY (`id_nguoi_do`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `spo2`
  ADD COLUMN `id_nguoi_do` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - người thực hiện đo' AFTER `id_benh_nhan`,
  ADD KEY `idx_spo2_nguoi_do` (`id_nguoi_do`),
  ADD CONSTRAINT `fk_spo2_nguoi_do` FOREIGN KEY (`id_nguoi_do`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;

ALTER TABLE `nhiet_do`
  ADD COLUMN `id_nguoi_do` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - người thực hiện đo' AFTER `id_benh_nhan`,
  ADD KEY `idx_nhiet_do_nguoi_do` (`id_nguoi_do`),
  ADD CONSTRAINT `fk_nhiet_do_nguoi_do` FOREIGN KEY (`id_nguoi_do`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;
