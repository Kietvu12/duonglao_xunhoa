-- Migration: Thêm bảng phan_loai_do_dung và cập nhật bảng do_dung_ca_nhan
-- Date: 2025-12-19
-- Description: Tạo bảng phân loại đồ dùng và liên kết với đồ dùng cá nhân

-- 1. Tạo bảng phan_loai_do_dung
CREATE TABLE IF NOT EXISTS `phan_loai_do_dung` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ten_loai` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Thêm trường id_phan_loai vào bảng do_dung_ca_nhan
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'do_dung_ca_nhan' 
               AND COLUMN_NAME = 'id_phan_loai');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `do_dung_ca_nhan` ADD COLUMN `id_phan_loai` bigint(20) DEFAULT NULL AFTER `id`', 
  'SELECT ''Column id_phan_loai already exists in do_dung_ca_nhan''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Thêm index cho id_phan_loai
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'do_dung_ca_nhan' 
               AND INDEX_NAME = 'idx_id_phan_loai');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `do_dung_ca_nhan` ADD KEY `idx_id_phan_loai` (`id_phan_loai`)', 
  'SELECT ''Index idx_id_phan_loai already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Thêm foreign key cho do_dung_ca_nhan -> phan_loai_do_dung
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'do_dung_ca_nhan' 
               AND CONSTRAINT_NAME = 'fk_do_dung_ca_nhan_phan_loai');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `do_dung_ca_nhan` ADD CONSTRAINT `fk_do_dung_ca_nhan_phan_loai` FOREIGN KEY (`id_phan_loai`) REFERENCES `phan_loai_do_dung` (`id`)', 
  'SELECT ''Constraint fk_do_dung_ca_nhan_phan_loai already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Insert một số phân loại đồ dùng mẫu
INSERT IGNORE INTO `phan_loai_do_dung` (`id`, `ten_loai`, `mo_ta`) VALUES
(1, 'Quần áo', 'Quần áo cá nhân của bệnh nhân'),
(2, 'Giày dép', 'Giày dép, dép đi trong phòng'),
(3, 'Đồ dùng cá nhân', 'Bàn chải, kem đánh răng, xà phòng...'),
(4, 'Thiết bị y tế', 'Thuốc, dụng cụ y tế cá nhân'),
(5, 'Điện tử', 'Điện thoại, máy tính bảng, sạc...'),
(6, 'Giấy tờ', 'CMND, BHYT, giấy tờ quan trọng'),
(7, 'Khác', 'Các đồ dùng khác');

SELECT 'Migration completed successfully!' AS status;

