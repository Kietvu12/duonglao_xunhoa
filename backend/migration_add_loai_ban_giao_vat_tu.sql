-- Thêm loại bàn giao vật tư tiêu hao: người nhà → điều dưỡng | điều dưỡng → bệnh nhân

ALTER TABLE `vat_tu_tieu_hao`
  ADD COLUMN `loai_ban_giao` enum('nguoi_nha_to_dieu_duong','dieu_duong_to_benh_nhan') NOT NULL DEFAULT 'dieu_duong_to_benh_nhan' COMMENT 'Hướng bàn giao vật tư' AFTER `id_benh_nhan`,
  ADD COLUMN `id_nguoi_gui_nguoi_than` bigint DEFAULT NULL COMMENT 'nguoi_than_benh_nhan.id - người nhà gửi (loại 1)' AFTER `id_nguoi_gui`,
  ADD COLUMN `id_nguoi_nhan` bigint DEFAULT NULL COMMENT 'ho_so_nhan_vien.id - điều dưỡng nhận (loại 1)' AFTER `id_nguoi_gui_nguoi_than`,
  ADD KEY `idx_vat_tu_loai_ban_giao` (`loai_ban_giao`),
  ADD KEY `idx_vat_tu_nguoi_gui_nguoi_than` (`id_nguoi_gui_nguoi_than`),
  ADD KEY `idx_vat_tu_nguoi_nhan` (`id_nguoi_nhan`),
  ADD CONSTRAINT `fk_vat_tu_nguoi_gui_nguoi_than` FOREIGN KEY (`id_nguoi_gui_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_vat_tu_nguoi_nhan` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE SET NULL;
