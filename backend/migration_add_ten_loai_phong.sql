-- Migration: Thêm trường ten vào bảng loai_phong
-- Date: 2025-12-19

-- Thêm cột ten vào bảng loai_phong
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'loai_phong' 
               AND COLUMN_NAME = 'ten');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `loai_phong` ADD COLUMN `ten` varchar(255) DEFAULT NULL AFTER `id`', 
  'SELECT ''Column ten already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

