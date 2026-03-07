-- Migration: Thêm trường id_tai_khoan vào bảng nguoi_than_benh_nhan
-- Date: 2025-12-18

-- 1. Thêm cột id_tai_khoan vào bảng nguoi_than_benh_nhan
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nguoi_than_benh_nhan' 
               AND COLUMN_NAME = 'id_tai_khoan');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nguoi_than_benh_nhan` ADD COLUMN `id_tai_khoan` bigint(20) DEFAULT NULL AFTER `id_benh_nhan`', 
  'SELECT ''Column id_tai_khoan already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Thêm index cho id_tai_khoan
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nguoi_than_benh_nhan' 
               AND INDEX_NAME = 'id_tai_khoan');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nguoi_than_benh_nhan` ADD KEY `id_tai_khoan` (`id_tai_khoan`)', 
  'SELECT ''Index id_tai_khoan already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Thêm foreign key constraint
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nguoi_than_benh_nhan' 
               AND CONSTRAINT_NAME = 'nguoi_than_benh_nhan_ibfk_2');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nguoi_than_benh_nhan` ADD CONSTRAINT `nguoi_than_benh_nhan_ibfk_2` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint nguoi_than_benh_nhan_ibfk_2 already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

