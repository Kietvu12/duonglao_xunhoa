-- Migration: Thêm các trường mới vào bảng ho_so_nhan_vien và tạo bảng media_ho_so_nhan_vien
-- Date: 2025-12-17

-- 1. Thêm các cột mới vào bảng ho_so_nhan_vien
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'ho_so_nhan_vien' 
               AND COLUMN_NAME = 'cccd');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `ho_so_nhan_vien` ADD COLUMN `cccd` varchar(20) DEFAULT NULL AFTER `lich_lam_viec`', 
  'SELECT ''Column cccd already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'ho_so_nhan_vien' 
               AND COLUMN_NAME = 'so_bhyt');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `ho_so_nhan_vien` ADD COLUMN `so_bhyt` varchar(50) DEFAULT NULL AFTER `cccd`', 
  'SELECT ''Column so_bhyt already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'ho_so_nhan_vien' 
               AND COLUMN_NAME = 'dia_chi');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `ho_so_nhan_vien` ADD COLUMN `dia_chi` text DEFAULT NULL AFTER `so_bhyt`', 
  'SELECT ''Column dia_chi already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Tạo bảng media_ho_so_nhan_vien
CREATE TABLE IF NOT EXISTS `media_ho_so_nhan_vien` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_nhan_vien` bigint(20) DEFAULT NULL,
  `anh_cccd` text DEFAULT NULL,
  `anh_bangdh` text DEFAULT NULL,
  `anh_bhyt` text DEFAULT NULL,
  `anh_cv` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nhan_vien` (`id_nhan_vien`),
  CONSTRAINT `media_ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

