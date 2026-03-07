-- Migration: Đổi id_phong thành id_loai_phong trong bảng bai_viet_phong
-- Date: 2025-12-19

-- 1. Xóa foreign key constraint cũ
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bai_viet_phong' 
               AND CONSTRAINT_NAME = 'bai_viet_phong_ibfk_2');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `bai_viet_phong` DROP FOREIGN KEY `bai_viet_phong_ibfk_2`', 
  'SELECT ''Constraint bai_viet_phong_ibfk_2 does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Xóa index cũ cho id_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bai_viet_phong' 
               AND INDEX_NAME = 'id_phong');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `bai_viet_phong` DROP KEY `id_phong`', 
  'SELECT ''Index id_phong does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Đổi tên cột id_phong thành id_loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bai_viet_phong' 
               AND COLUMN_NAME = 'id_phong');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `bai_viet_phong` CHANGE COLUMN `id_phong` `id_loai_phong` bigint(20) DEFAULT NULL', 
  'SELECT ''Column id_phong does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Thêm index mới cho id_loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bai_viet_phong' 
               AND INDEX_NAME = 'id_loai_phong');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `bai_viet_phong` ADD KEY `id_loai_phong` (`id_loai_phong`)', 
  'SELECT ''Index id_loai_phong already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Thêm foreign key constraint mới cho id_loai_phong -> loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bai_viet_phong' 
               AND CONSTRAINT_NAME = 'bai_viet_phong_ibfk_2');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `bai_viet_phong` ADD CONSTRAINT `bai_viet_phong_ibfk_2` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`)', 
  'SELECT ''Constraint bai_viet_phong_ibfk_2 already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

