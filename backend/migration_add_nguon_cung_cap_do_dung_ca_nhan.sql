-- Migration: Thêm trường nguon_cung_cap vào bảng do_dung_ca_nhan
-- Date: 2025-01-XX
-- Description: Thêm trường nguon_cung_cap với enum (ca_nhan, benh_vien) để phân biệt nguồn cung cấp đồ dùng

-- 1. Thêm trường nguon_cung_cap vào bảng do_dung_ca_nhan
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'do_dung_ca_nhan' 
               AND COLUMN_NAME = 'nguon_cung_cap');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `do_dung_ca_nhan` ADD COLUMN `nguon_cung_cap` ENUM(''ca_nhan'', ''benh_vien'') DEFAULT ''ca_nhan'' AFTER `id_phan_loai`', 
  'SELECT ''Column nguon_cung_cap already exists in do_dung_ca_nhan''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Thêm index cho nguon_cung_cap (tùy chọn, có thể bỏ qua nếu không cần)
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'do_dung_ca_nhan' 
               AND INDEX_NAME = 'idx_nguon_cung_cap');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `do_dung_ca_nhan` ADD KEY `idx_nguon_cung_cap` (`nguon_cung_cap`)', 
  'SELECT ''Index idx_nguon_cung_cap already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migration completed successfully! Column nguon_cung_cap added to do_dung_ca_nhan table.' AS status;

