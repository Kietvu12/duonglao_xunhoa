-- Migration: Thêm các khung giờ mới vào bảng lich_tham_benh
-- Date: 2025-01-XX
-- Description: Mở rộng enum khung_gio để thêm các khung giờ: 6_8, 10_12, 12_14, 16_18, 20_22

-- 1. Thêm các khung giờ mới vào enum khung_gio
-- MySQL/MariaDB không hỗ trợ ALTER ENUM trực tiếp, cần sử dụng MODIFY COLUMN
ALTER TABLE `lich_tham_benh` 
MODIFY COLUMN `khung_gio` ENUM('6_8', '8_10', '10_12', '12_14', '14_16', '16_18', '18_20', '20_22') DEFAULT NULL;

SELECT 'Migration completed successfully! New time slots added to lich_tham_benh table.' AS status;

