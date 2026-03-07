-- Migration: Cập nhật cấu trúc bảng cấu hình chỉ số và loại bỏ trường danh_gia
-- Date: 2025-01-XX

-- 1. Thêm các cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet vào các bảng chỉ số
-- (Chạy từng câu lệnh riêng, bỏ qua lỗi nếu cột đã tồn tại)

-- Bảng huyet_ap
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'huyet_ap' 
               AND COLUMN_NAME = 'id_cau_hinh_chi_so_canh_bao');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `huyet_ap` ADD COLUMN `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT ''ID cấu hình chỉ số cảnh báo'' AFTER `noi_dung_canh_bao`', 
  'SELECT ''Column id_cau_hinh_chi_so_canh_bao already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'huyet_ap' 
               AND COLUMN_NAME = 'danh_gia_chi_tiet');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `huyet_ap` ADD COLUMN `danh_gia_chi_tiet` text DEFAULT NULL COMMENT ''Đánh giá chi tiết (tự động tính)'' AFTER `id_cau_hinh_chi_so_canh_bao`', 
  'SELECT ''Column danh_gia_chi_tiet already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhip_tim
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhip_tim' 
               AND COLUMN_NAME = 'id_cau_hinh_chi_so_canh_bao');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhip_tim` ADD COLUMN `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT ''ID cấu hình chỉ số cảnh báo'' AFTER `noi_dung_canh_bao`', 
  'SELECT ''Column id_cau_hinh_chi_so_canh_bao already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhip_tim' 
               AND COLUMN_NAME = 'danh_gia_chi_tiet');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhip_tim` ADD COLUMN `danh_gia_chi_tiet` text DEFAULT NULL COMMENT ''Đánh giá chi tiết (tự động tính)'' AFTER `id_cau_hinh_chi_so_canh_bao`', 
  'SELECT ''Column danh_gia_chi_tiet already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng duong_huyet
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'duong_huyet' 
               AND COLUMN_NAME = 'id_cau_hinh_chi_so_canh_bao');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `duong_huyet` ADD COLUMN `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT ''ID cấu hình chỉ số cảnh báo'' AFTER `noi_dung_canh_bao`', 
  'SELECT ''Column id_cau_hinh_chi_so_canh_bao already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'duong_huyet' 
               AND COLUMN_NAME = 'danh_gia_chi_tiet');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `duong_huyet` ADD COLUMN `danh_gia_chi_tiet` text DEFAULT NULL COMMENT ''Đánh giá chi tiết (tự động tính)'' AFTER `id_cau_hinh_chi_so_canh_bao`', 
  'SELECT ''Column danh_gia_chi_tiet already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng spo2
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'spo2' 
               AND COLUMN_NAME = 'id_cau_hinh_chi_so_canh_bao');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `spo2` ADD COLUMN `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT ''ID cấu hình chỉ số cảnh báo'' AFTER `noi_dung_canh_bao`', 
  'SELECT ''Column id_cau_hinh_chi_so_canh_bao already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'spo2' 
               AND COLUMN_NAME = 'danh_gia_chi_tiet');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `spo2` ADD COLUMN `danh_gia_chi_tiet` text DEFAULT NULL COMMENT ''Đánh giá chi tiết (tự động tính)'' AFTER `id_cau_hinh_chi_so_canh_bao`', 
  'SELECT ''Column danh_gia_chi_tiet already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhiet_do
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhiet_do' 
               AND COLUMN_NAME = 'id_cau_hinh_chi_so_canh_bao');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhiet_do` ADD COLUMN `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT ''ID cấu hình chỉ số cảnh báo'' AFTER `noi_dung_canh_bao`', 
  'SELECT ''Column id_cau_hinh_chi_so_canh_bao already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhiet_do' 
               AND COLUMN_NAME = 'danh_gia_chi_tiet');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhiet_do` ADD COLUMN `danh_gia_chi_tiet` text DEFAULT NULL COMMENT ''Đánh giá chi tiết (tự động tính)'' AFTER `id_cau_hinh_chi_so_canh_bao`', 
  'SELECT ''Column danh_gia_chi_tiet already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Thêm foreign key constraints cho id_cau_hinh_chi_so_canh_bao (bỏ qua nếu đã tồn tại)
-- Bảng huyet_ap
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'huyet_ap' 
               AND CONSTRAINT_NAME = 'fk_huyet_ap_cau_hinh');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `huyet_ap` ADD CONSTRAINT `fk_huyet_ap_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint fk_huyet_ap_cau_hinh already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhip_tim
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhip_tim' 
               AND CONSTRAINT_NAME = 'fk_nhip_tim_cau_hinh');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhip_tim` ADD CONSTRAINT `fk_nhip_tim_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint fk_nhip_tim_cau_hinh already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng duong_huyet
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'duong_huyet' 
               AND CONSTRAINT_NAME = 'fk_duong_huyet_cau_hinh');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `duong_huyet` ADD CONSTRAINT `fk_duong_huyet_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint fk_duong_huyet_cau_hinh already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng spo2
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'spo2' 
               AND CONSTRAINT_NAME = 'fk_spo2_cau_hinh');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `spo2` ADD CONSTRAINT `fk_spo2_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint fk_spo2_cau_hinh already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhiet_do
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhiet_do' 
               AND CONSTRAINT_NAME = 'fk_nhiet_do_cau_hinh');
SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE `nhiet_do` ADD CONSTRAINT `fk_nhiet_do_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL', 
  'SELECT ''Constraint fk_nhiet_do_cau_hinh already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Xóa cột danh_gia từ các bảng chỉ số (bỏ qua nếu không tồn tại)
-- Bảng huyet_ap
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'huyet_ap' 
               AND COLUMN_NAME = 'danh_gia');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `huyet_ap` DROP COLUMN `danh_gia`', 
  'SELECT ''Column danh_gia does not exist in huyet_ap''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhip_tim
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhip_tim' 
               AND COLUMN_NAME = 'danh_gia');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `nhip_tim` DROP COLUMN `danh_gia`', 
  'SELECT ''Column danh_gia does not exist in nhip_tim''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng duong_huyet
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'duong_huyet' 
               AND COLUMN_NAME = 'danh_gia');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `duong_huyet` DROP COLUMN `danh_gia`', 
  'SELECT ''Column danh_gia does not exist in duong_huyet''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bảng nhiet_do
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'nhiet_do' 
               AND COLUMN_NAME = 'danh_gia');
SET @sqlstmt := IF(@exist > 0, 
  'ALTER TABLE `nhiet_do` DROP COLUMN `danh_gia`', 
  'SELECT ''Column danh_gia does not exist in nhiet_do''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Lưu ý: Bảng spo2 không có cột danh_gia nên không cần xóa

