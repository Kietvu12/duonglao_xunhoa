-- Migration: Thêm bảng loai_phong và bai_viet_phong
-- Date: 2025-12-18

-- 1. Tạo bảng loai_phong
CREATE TABLE IF NOT EXISTS `loai_phong` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mo_ta` text DEFAULT NULL,
  `anh_mau` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Thêm trường id_loai_phong vào bảng phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'phong' 
               AND COLUMN_NAME = 'id_loai_phong');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `phong` ADD COLUMN `id_loai_phong` bigint(20) DEFAULT NULL AFTER `id`', 
  'SELECT ''Column id_loai_phong already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm index cho id_loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'phong' 
               AND INDEX_NAME = 'id_loai_phong');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `phong` ADD KEY `id_loai_phong` (`id_loai_phong`)', 
  'SELECT ''Index id_loai_phong already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm foreign key cho phong -> loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'phong' 
               AND CONSTRAINT_NAME = 'fk_phong_loai_phong');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `phong` ADD CONSTRAINT `fk_phong_loai_phong` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`)', 
  'SELECT ''Constraint fk_phong_loai_phong already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Tạo bảng bai_viet_phong (giống bai_viet)
CREATE TABLE IF NOT EXISTS `bai_viet_phong` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_phong` bigint(20) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `trang_thai` enum('nhap','xuat_ban') DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `id_tac_gia` (`id_tac_gia`),
  KEY `id_phong` (`id_phong`),
  CONSTRAINT `bai_viet_phong_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  CONSTRAINT `bai_viet_phong_ibfk_2` FOREIGN KEY (`id_phong`) REFERENCES `phong` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Tạo bảng media_bai_viet_phong (giống media_bai_viet)
CREATE TABLE IF NOT EXISTS `media_bai_viet_phong` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  KEY `idx_media_bai_viet_phong_thu_tu` (`thu_tu`),
  CONSTRAINT `media_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Tạo bảng binh_luan_bai_viet_phong (giống binh_luan_bai_viet)
CREATE TABLE IF NOT EXISTS `binh_luan_bai_viet_phong` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `ngay_binh_luan` datetime DEFAULT current_timestamp(),
  `duyet` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  CONSTRAINT `binh_luan_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

