-- Migration: Thêm bảng media_tin_tuyen_dung
-- Date: 2025-12-18

-- Tạo bảng media_tin_tuyen_dung
CREATE TABLE IF NOT EXISTS `media_tin_tuyen_dung` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_tin_tuyen_dung` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`),
  KEY `idx_media_tin_tuyen_dung_thu_tu` (`thu_tu`),
  CONSTRAINT `media_tin_tuyen_dung_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

