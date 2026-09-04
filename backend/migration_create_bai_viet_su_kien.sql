-- Migration: Bài viết sự kiện (mirror bai_viet_dich_vu / bai_viet_phong)

CREATE TABLE IF NOT EXISTS `bai_viet_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_su_kien` bigint DEFAULT NULL,
  `tieu_de` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` longtext COLLATE utf8mb4_general_ci,
  `anh_dai_dien` text COLLATE utf8mb4_general_ci,
  `meta_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_general_ci,
  `mo_ta_ngan` text COLLATE utf8mb4_general_ci,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tags` text COLLATE utf8mb4_general_ci,
  `luot_xem` int DEFAULT '0',
  `trang_thai` enum('nhap','xuat_ban') COLLATE utf8mb4_general_ci DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `id_tac_gia` (`id_tac_gia`),
  KEY `id_su_kien` (`id_su_kien`),
  CONSTRAINT `bai_viet_su_kien_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  CONSTRAINT `bai_viet_su_kien_ibfk_2` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `media_bai_viet_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint NOT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  KEY `idx_media_bai_viet_su_kien_thu_tu` (`thu_tu`),
  CONSTRAINT `media_bai_viet_su_kien_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_su_kien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `binh_luan_bai_viet_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci NOT NULL,
  `duyet` tinyint(1) DEFAULT '0',
  `ngay_binh_luan` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  CONSTRAINT `binh_luan_bai_viet_su_kien_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_su_kien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
