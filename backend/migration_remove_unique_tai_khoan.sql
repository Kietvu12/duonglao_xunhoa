-- Migration: Loại bỏ ràng buộc UNIQUE cho so_dien_thoai và email trong bảng tai_khoan
-- Date: 2025-12-19
-- Mục đích: Cho phép cùng số điện thoại/email với vai trò khác nhau

-- Kiểm tra và loại bỏ UNIQUE constraint cho so_dien_thoai
SET @exist_phone := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'tai_khoan' 
                     AND INDEX_NAME = 'so_dien_thoai' 
                     AND NON_UNIQUE = 0);

SET @sqlstmt_phone := IF(@exist_phone > 0, 
  'ALTER TABLE `tai_khoan` DROP INDEX `so_dien_thoai`', 
  'SELECT ''Index so_dien_thoai does not exist or is not unique''');

PREPARE stmt_phone FROM @sqlstmt_phone;
EXECUTE stmt_phone;
DEALLOCATE PREPARE stmt_phone;

-- Kiểm tra và loại bỏ UNIQUE constraint cho email
SET @exist_email := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'tai_khoan' 
                     AND INDEX_NAME = 'email' 
                     AND NON_UNIQUE = 0);

SET @sqlstmt_email := IF(@exist_email > 0, 
  'ALTER TABLE `tai_khoan` DROP INDEX `email`', 
  'SELECT ''Index email does not exist or is not unique''');

PREPARE stmt_email FROM @sqlstmt_email;
EXECUTE stmt_email;
DEALLOCATE PREPARE stmt_email;

-- Tạo index thường (non-unique) cho so_dien_thoai và email để tối ưu truy vấn
-- Index này sẽ giúp tăng tốc độ tìm kiếm nhưng không ràng buộc unique
SET @exist_phone_idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                          WHERE TABLE_SCHEMA = DATABASE() 
                          AND TABLE_NAME = 'tai_khoan' 
                          AND INDEX_NAME = 'idx_so_dien_thoai');

SET @sqlstmt_phone_idx := IF(@exist_phone_idx = 0, 
  'ALTER TABLE `tai_khoan` ADD INDEX `idx_so_dien_thoai` (`so_dien_thoai`)', 
  'SELECT ''Index idx_so_dien_thoai already exists''');

PREPARE stmt_phone_idx FROM @sqlstmt_phone_idx;
EXECUTE stmt_phone_idx;
DEALLOCATE PREPARE stmt_phone_idx;

SET @exist_email_idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                          WHERE TABLE_SCHEMA = DATABASE() 
                          AND TABLE_NAME = 'tai_khoan' 
                          AND INDEX_NAME = 'idx_email');

SET @sqlstmt_email_idx := IF(@exist_email_idx = 0, 
  'ALTER TABLE `tai_khoan` ADD INDEX `idx_email` (`email`)', 
  'SELECT ''Index idx_email already exists''');

PREPARE stmt_email_idx FROM @sqlstmt_email_idx;
EXECUTE stmt_email_idx;
DEALLOCATE PREPARE stmt_email_idx;

-- Tạo composite index để tối ưu truy vấn kiểm tra duplicate với vai_tro và da_xoa
SET @exist_composite_idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                              WHERE TABLE_SCHEMA = DATABASE() 
                              AND TABLE_NAME = 'tai_khoan' 
                              AND INDEX_NAME = 'idx_so_dien_thoai_vai_tro_da_xoa');

SET @sqlstmt_composite_phone := IF(@exist_composite_idx = 0, 
  'ALTER TABLE `tai_khoan` ADD INDEX `idx_so_dien_thoai_vai_tro_da_xoa` (`so_dien_thoai`, `vai_tro`, `da_xoa`)', 
  'SELECT ''Index idx_so_dien_thoai_vai_tro_da_xoa already exists''');

PREPARE stmt_composite_phone FROM @sqlstmt_composite_phone;
EXECUTE stmt_composite_phone;
DEALLOCATE PREPARE stmt_composite_phone;

SET @exist_composite_email_idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                                    WHERE TABLE_SCHEMA = DATABASE() 
                                    AND TABLE_NAME = 'tai_khoan' 
                                    AND INDEX_NAME = 'idx_email_vai_tro_da_xoa');

SET @sqlstmt_composite_email := IF(@exist_composite_email_idx = 0, 
  'ALTER TABLE `tai_khoan` ADD INDEX `idx_email_vai_tro_da_xoa` (`email`, `vai_tro`, `da_xoa`)', 
  'SELECT ''Index idx_email_vai_tro_da_xoa already exists''');

PREPARE stmt_composite_email FROM @sqlstmt_composite_email;
EXECUTE stmt_composite_email;
DEALLOCATE PREPARE stmt_composite_email;

