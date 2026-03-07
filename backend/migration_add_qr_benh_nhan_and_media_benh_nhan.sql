-- Migration: Thêm bảng qr_benh_nhan và media_benh_nhan
-- Date: 2025-01-12

-- Tạo bảng qr_benh_nhan để lưu mã QR của bệnh nhân
CREATE TABLE IF NOT EXISTS `qr_benh_nhan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint(20) NOT NULL,
  `ma_qr` varchar(255) NOT NULL,
  `url_qr` text DEFAULT NULL,
  `duong_dan_qr` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ma_qr` (`ma_qr`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `qr_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tạo bảng media_benh_nhan để lưu hình ảnh, video của bệnh nhân
CREATE TABLE IF NOT EXISTS `media_benh_nhan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint(20) NOT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_media_benh_nhan_thu_tu` (`thu_tu`),
  CONSTRAINT `media_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

