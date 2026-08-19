-- Migration: Tạo bảng khảo sát chất lượng
CREATE TABLE IF NOT EXISTS `khao_sat_chat_luong` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ten_file` VARCHAR(255) NOT NULL,
  `ngay_tao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chat_luong` JSON NULL,
  `media` JSON NULL,
  PRIMARY KEY (`id`),
  KEY `idx_khao_sat_chat_luong_ngay_tao` (`ngay_tao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
