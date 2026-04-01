-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: quanlyduonglao
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bai_viet`
--

DROP TABLE IF EXISTS `bai_viet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bai_viet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `id_tac_gia` (`id_tac_gia`),
  CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bai_viet_dich_vu`
--

DROP TABLE IF EXISTS `bai_viet_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bai_viet_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_dich_vu` bigint DEFAULT NULL,
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
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `id_tac_gia` (`id_tac_gia`),
  KEY `id_dich_vu` (`id_dich_vu`),
  CONSTRAINT `bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  CONSTRAINT `bai_viet_dich_vu_ibfk_2` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bai_viet_phong`
--

DROP TABLE IF EXISTS `bai_viet_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bai_viet_phong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_loai_phong` bigint DEFAULT NULL,
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
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `id_tac_gia` (`id_tac_gia`),
  KEY `id_loai_phong` (`id_loai_phong`),
  CONSTRAINT `bai_viet_phong_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  CONSTRAINT `bai_viet_phong_ibfk_2` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bang_gia_dich_vu`
--

DROP TABLE IF EXISTS `bang_gia_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bang_gia_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_dich_vu` bigint DEFAULT NULL,
  `gia_thang` int DEFAULT NULL,
  `gia_quy` int DEFAULT NULL,
  `gia_nam` int DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_dich_vu` (`id_dich_vu`),
  CONSTRAINT `bang_gia_dich_vu_ibfk_1` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `benh_hien_tai`
--

DROP TABLE IF EXISTS `benh_hien_tai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benh_hien_tai` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_thong_tin_benh` bigint DEFAULT NULL,
  `ngay_phat_hien` date DEFAULT NULL,
  `tinh_trang` enum('dang_dieu_tri','on_dinh','khoi','tai_phat') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_thong_tin_benh` (`id_thong_tin_benh`),
  CONSTRAINT `benh_hien_tai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `benh_hien_tai_ibfk_2` FOREIGN KEY (`id_thong_tin_benh`) REFERENCES `thong_tin_benh` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `benh_nhan`
--

DROP TABLE IF EXISTS `benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('nam','nu','khac') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cccd` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dia_chi` text COLLATE utf8mb4_general_ci,
  `nhom_mau` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bhyt` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phong` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `anh_dai_dien` text COLLATE utf8mb4_general_ci,
  `ngay_nhap_vien` date DEFAULT NULL,
  `tinh_trang_hien_tai` text COLLATE utf8mb4_general_ci,
  `kha_nang_sinh_hoat` enum('doc_lap','ho_tro','phu_thuoc') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_benh_nhan_ngay_nhap_vien` (`ngay_nhap_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `benh_nhan_dich_vu`
--

DROP TABLE IF EXISTS `benh_nhan_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benh_nhan_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint NOT NULL,
  `id_dich_vu` bigint NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `hinh_thuc_thanh_toan` enum('thang','quy','nam') COLLATE utf8mb4_general_ci DEFAULT 'thang',
  `thanh_tien` int DEFAULT '0',
  `da_thanh_toan` int DEFAULT '0',
  `cong_no_con_lai` int DEFAULT '0',
  `ngay_thanh_toan_lan_cuoi` date DEFAULT NULL,
  `trang_thai` enum('dang_su_dung','tam_dung','ket_thuc') COLLATE utf8mb4_general_ci DEFAULT 'dang_su_dung',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_id_dich_vu` (`id_dich_vu`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_bat_dau` (`ngay_bat_dau`),
  CONSTRAINT `fk_benh_nhan_dich_vu_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_benh_nhan_dich_vu_dich_vu` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `binh_luan_bai_viet`
--

DROP TABLE IF EXISTS `binh_luan_bai_viet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binh_luan_bai_viet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci NOT NULL,
  `ngay_binh_luan` datetime DEFAULT CURRENT_TIMESTAMP,
  `duyet` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  CONSTRAINT `binh_luan_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `binh_luan_bai_viet_dich_vu`
--

DROP TABLE IF EXISTS `binh_luan_bai_viet_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binh_luan_bai_viet_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci NOT NULL,
  `ngay_binh_luan` datetime DEFAULT CURRENT_TIMESTAMP,
  `duyet` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  CONSTRAINT `binh_luan_bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_dich_vu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `binh_luan_bai_viet_phong`
--

DROP TABLE IF EXISTS `binh_luan_bai_viet_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binh_luan_bai_viet_phong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci NOT NULL,
  `ngay_binh_luan` datetime DEFAULT CURRENT_TIMESTAMP,
  `duyet` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  CONSTRAINT `binh_luan_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cau_hinh_chi_so_canh_bao`
--

DROP TABLE IF EXISTS `cau_hinh_chi_so_canh_bao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cau_hinh_chi_so_canh_bao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_chi_so` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gioi_han_canh_bao` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cong_viec`
--

DROP TABLE IF EXISTS `cong_viec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cong_viec` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_cong_viec` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `muc_uu_tien` enum('thap','trung_binh','cao') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thoi_gian_du_kien` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `id_nguoi_tao` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nguoi_tao` (`id_nguoi_tao`),
  KEY `idx_cong_viec_trang_thai` (`muc_uu_tien`),
  CONSTRAINT `cong_viec_ibfk_1` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `danh_sach_trieu_chung`
--

DROP TABLE IF EXISTS `danh_sach_trieu_chung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_sach_trieu_chung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_trieu_chung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `loai` enum('khan_cap','ho_hap','tim_mach','tieu_hoa','tiet_nieu','than_kinh','da_lieu','co_xuong','toan_than','khac') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'khac',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_loai_dich_vu` bigint DEFAULT NULL,
  `ten_dich_vu` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mo_ta_ngan` text COLLATE utf8mb4_general_ci,
  `mo_ta_day_du` text COLLATE utf8mb4_general_ci,
  `anh_dai_dien` text COLLATE utf8mb4_general_ci,
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_loai_dich_vu` (`id_loai_dich_vu`),
  CONSTRAINT `dich_vu_ibfk_1` FOREIGN KEY (`id_loai_dich_vu`) REFERENCES `loai_dich_vu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `diem_rui_ro_ai`
--

DROP TABLE IF EXISTS `diem_rui_ro_ai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diem_rui_ro_ai` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `loai_rui_ro` enum('nga','dot_quy','suy_tim','nhiem_trung') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diem` int DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `diem_rui_ro_ai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dieu_duong_benh_nhan`
--

DROP TABLE IF EXISTS `dieu_duong_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dieu_duong_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_dieu_duong` bigint NOT NULL,
  `id_benh_nhan` bigint NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `trang_thai` enum('dang_quan_ly','ket_thuc') COLLATE utf8mb4_general_ci DEFAULT 'dang_quan_ly',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_dieu_duong` (`id_dieu_duong`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_bat_dau` (`ngay_bat_dau`),
  CONSTRAINT `fk_dieu_duong_benh_nhan_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dieu_duong_benh_nhan_dieu_duong` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `do_dung_ca_nhan`
--

DROP TABLE IF EXISTS `do_dung_ca_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `do_dung_ca_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_phan_loai` bigint DEFAULT NULL,
  `nguon_cung_cap` enum('ca_nhan','benh_vien') COLLATE utf8mb4_general_ci DEFAULT 'ca_nhan',
  `id_benh_nhan` bigint DEFAULT NULL,
  `ten_vat_dung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `so_luong` int DEFAULT '1',
  `tinh_trang` enum('tot','hu_hong','mat') COLLATE utf8mb4_general_ci DEFAULT 'tot',
  `media` text COLLATE utf8mb4_general_ci,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_them` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_id_phan_loai` (`id_phan_loai`),
  KEY `idx_nguon_cung_cap` (`nguon_cung_cap`),
  CONSTRAINT `do_dung_ca_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_do_dung_ca_nhan_phan_loai` FOREIGN KEY (`id_phan_loai`) REFERENCES `phan_loai_do_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `don_thuoc`
--

DROP TABLE IF EXISTS `don_thuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_thuoc` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_ke` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `don_thuoc_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `duong_huyet`
--

DROP TABLE IF EXISTS `duong_huyet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duong_huyet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `gia_tri_duong_huyet` decimal(5,2) DEFAULT NULL COMMENT 'Giá trị đường huyết (mmol/L)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo đường huyết',
  `thoi_diem_do` enum('sang','trua','toi','truoc_an','sau_an','truoc_ngu','khac') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Thời điểm đo đường huyết',
  `vi_tri_lay_mau` enum('ngon_tay','canh_tay','dui') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vị trí lấy mẫu',
  `trieu_chung_kem_theo` text COLLATE utf8mb4_general_ci COMMENT 'Triệu chứng kèm theo (nếu có)',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text COLLATE utf8mb4_general_ci COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text COLLATE utf8mb4_general_ci COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_duong_huyet_thoi_gian_do` (`thoi_gian_do`),
  KEY `fk_duong_huyet_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`),
  CONSTRAINT `duong_huyet_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_duong_huyet_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ho_so_nhan_vien`
--

DROP TABLE IF EXISTS `ho_so_nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ho_so_nhan_vien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` bigint DEFAULT NULL,
  `chuc_vu` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bang_cap` text COLLATE utf8mb4_general_ci,
  `ngay_bat_dau` date DEFAULT NULL,
  `luong_co_ban` int DEFAULT NULL,
  `gioi_thieu` text COLLATE utf8mb4_general_ci,
  `chuyen_mon` text COLLATE utf8mb4_general_ci,
  `so_nam_kinh_nghiem` int DEFAULT NULL,
  `danh_gia` text COLLATE utf8mb4_general_ci,
  `so_benh_nhan_da_dieu_tri` int DEFAULT '0',
  `noi_cong_tac` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lich_lam_viec` text COLLATE utf8mb4_general_ci,
  `cccd` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_bhyt` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dia_chi` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ho_so_ung_tuyen`
--

DROP TABLE IF EXISTS `ho_so_ung_tuyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ho_so_ung_tuyen` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tin_tuyen_dung` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `file_cv` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('moi_nop','da_xem','phong_van','trung_tuyen','tu_choi') COLLATE utf8mb4_general_ci DEFAULT 'moi_nop',
  `ngay_nop` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `diem_ai` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`),
  CONSTRAINT `ho_so_ung_tuyen_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ho_so_y_te_benh_nhan`
--

DROP TABLE IF EXISTS `ho_so_y_te_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ho_so_y_te_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_loai_benh_ly` bigint DEFAULT NULL,
  `tien_su_benh` text COLLATE utf8mb4_general_ci,
  `di_ung_thuoc` text COLLATE utf8mb4_general_ci,
  `lich_su_phau_thuat` text COLLATE utf8mb4_general_ci,
  `benh_ly_hien_tai` text COLLATE utf8mb4_general_ci,
  `ghi_chu_dac_biet` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `CCCD` varchar(225) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MST` varchar(225) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_loai_benh_ly` (`id_loai_benh_ly`),
  CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_2` FOREIGN KEY (`id_loai_benh_ly`) REFERENCES `loai_benh_ly` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hoat_dong_sinh_hoat`
--

DROP TABLE IF EXISTS `hoat_dong_sinh_hoat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoat_dong_sinh_hoat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `gio_di_ngu` time DEFAULT NULL,
  `gio_thuc_day` time DEFAULT NULL,
  `so_lan_thuc_giac` int DEFAULT NULL,
  `chat_luong_giac_ngu` enum('tot','trung_binh','kem') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tam` tinyint(1) DEFAULT NULL,
  `danh_rang` tinyint(1) DEFAULT NULL,
  `thay_quan_ao` tinyint(1) DEFAULT NULL,
  `dai_tien_so_lan` int DEFAULT NULL,
  `dai_tien_tinh_chat` enum('binh_thuong','tao_bon','tieu_chay') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tieu_tien_so_lan` int DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `hoat_dong_sinh_hoat_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `huyet_ap`
--

DROP TABLE IF EXISTS `huyet_ap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `huyet_ap` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `tam_thu` int DEFAULT NULL COMMENT 'Huyết áp tâm thu (mmHg)',
  `tam_truong` int DEFAULT NULL COMMENT 'Huyết áp tâm trương (mmHg)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo huyết áp',
  `vi_tri_do` enum('tay_trai','tay_phai','dau_goi','co_chan') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vị trí đo',
  `tu_the_khi_do` enum('nam','ngoi','dung') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tư thế khi đo',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text COLLATE utf8mb4_general_ci COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text COLLATE utf8mb4_general_ci COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_huyet_ap_thoi_gian_do` (`thoi_gian_do`),
  KEY `fk_huyet_ap_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`),
  CONSTRAINT `fk_huyet_ap_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `huyet_ap_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=600 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kpi_nhan_vien`
--

DROP TABLE IF EXISTS `kpi_nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpi_nhan_vien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` bigint DEFAULT NULL,
  `thang` int NOT NULL,
  `nam` int NOT NULL,
  `ty_le_hoan_thanh_cong_viec` float DEFAULT NULL,
  `so_loi_ghi_chep` int DEFAULT '0',
  `so_lan_tre_ca` int DEFAULT '0',
  `diem_danh_gia_quan_ly` float DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `kpi_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lich_hen_tu_van`
--

DROP TABLE IF EXISTS `lich_hen_tu_van`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_hen_tu_van` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `loai_dich_vu_quan_tam` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_mong_muon` date NOT NULL,
  `gio_mong_muon` time NOT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('cho_xac_nhan','da_xac_nhan','da_den','huy') COLLATE utf8mb4_general_ci DEFAULT 'cho_xac_nhan',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `nguoi_xac_nhan` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nguoi_xac_nhan` (`nguoi_xac_nhan`),
  CONSTRAINT `lich_hen_tu_van_ibfk_1` FOREIGN KEY (`nguoi_xac_nhan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lich_kham`
--

DROP TABLE IF EXISTS `lich_kham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_kham` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `loai_kham` enum('tong_quat','chuyen_khoa','xet_nghiem','phuc_hoi') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bac_si` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ket_qua` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('cho_kham','dang_kham','da_kham') COLLATE utf8mb4_general_ci DEFAULT 'cho_kham',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `lich_kham_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lich_phan_ca`
--

DROP TABLE IF EXISTS `lich_phan_ca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_phan_ca` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ca` enum('sang','chieu','dem') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `trang_thai` enum('du_kien','dang_truc','hoan_thanh','vang') COLLATE utf8mb4_general_ci DEFAULT 'du_kien',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `lich_phan_ca_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lich_phong_van`
--

DROP TABLE IF EXISTS `lich_phong_van`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_phong_van` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_ho_so` bigint DEFAULT NULL,
  `ngay_gio` datetime NOT NULL,
  `dia_diem` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nguoi_phong_van` text COLLATE utf8mb4_general_ci,
  `ket_qua` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('chua_phong_van','da_phong_van') COLLATE utf8mb4_general_ci DEFAULT 'chua_phong_van',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_ho_so` (`id_ho_so`),
  CONSTRAINT `lich_phong_van_ibfk_1` FOREIGN KEY (`id_ho_so`) REFERENCES `ho_so_ung_tuyen` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lich_tham_benh`
--

DROP TABLE IF EXISTS `lich_tham_benh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_tham_benh` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_nguoi_than` bigint DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `khung_gio` enum('6_8','8_10','10_12','12_14','14_16','16_18','18_20','20_22') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loai` enum('gap_mat','goi_dien') COLLATE utf8mb4_general_ci DEFAULT 'gap_mat',
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_nguoi_di_cung` int DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('cho_duyet','da_duyet','tu_choi') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_nguoi_than` (`id_nguoi_than`),
  CONSTRAINT `lich_tham_benh_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_tham_benh_ibfk_2` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lien_he`
--

DROP TABLE IF EXISTS `lien_he`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lien_he` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `chu_de` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci,
  `ngay_gui` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loai_benh_ly`
--

DROP TABLE IF EXISTS `loai_benh_ly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_benh_ly` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_loai_benh_ly` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loai_dich_vu`
--

DROP TABLE IF EXISTS `loai_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `anh_mau` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_bai_viet`
--

DROP TABLE IF EXISTS `media_bai_viet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_bai_viet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  KEY `idx_media_bai_viet_thu_tu` (`thu_tu`),
  CONSTRAINT `media_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_bai_viet_dich_vu`
--

DROP TABLE IF EXISTS `media_bai_viet_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_bai_viet_dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  KEY `idx_media_bai_viet_dich_vu_thu_tu` (`thu_tu`),
  CONSTRAINT `media_bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_dich_vu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_bai_viet_phong`
--

DROP TABLE IF EXISTS `media_bai_viet_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_bai_viet_phong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_bai_viet` bigint DEFAULT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bai_viet` (`id_bai_viet`),
  KEY `idx_media_bai_viet_phong_thu_tu` (`thu_tu`),
  CONSTRAINT `media_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_benh_nhan`
--

DROP TABLE IF EXISTS `media_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint NOT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_media_benh_nhan_thu_tu` (`thu_tu`),
  CONSTRAINT `media_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_ca_nhan_benh_nhan`
--

DROP TABLE IF EXISTS `media_ca_nhan_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_ca_nhan_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_dieu_duong` bigint DEFAULT NULL,
  `id_benh_nhan` bigint NOT NULL,
  `id_nguoi_nha` bigint DEFAULT NULL,
  `duong_dan_anh` text COLLATE utf8mb4_general_ci,
  `loi_nhan` text COLLATE utf8mb4_general_ci,
  `ngay_gui` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_dieu_duong` (`id_dieu_duong`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_nguoi_nha` (`id_nguoi_nha`),
  CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_1` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_3` FOREIGN KEY (`id_nguoi_nha`) REFERENCES `nguoi_than_benh_nhan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_ho_so_nhan_vien`
--

DROP TABLE IF EXISTS `media_ho_so_nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_ho_so_nhan_vien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_nhan_vien` bigint DEFAULT NULL,
  `anh_cccd` text COLLATE utf8mb4_general_ci,
  `anh_bangdh` text COLLATE utf8mb4_general_ci,
  `anh_bhyt` text COLLATE utf8mb4_general_ci,
  `anh_cv` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nhan_vien` (`id_nhan_vien`),
  CONSTRAINT `media_ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_su_kien`
--

DROP TABLE IF EXISTS `media_su_kien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_su_kien` bigint DEFAULT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL,
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_su_kien` (`id_su_kien`),
  CONSTRAINT `media_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_tin_tuyen_dung`
--

DROP TABLE IF EXISTS `media_tin_tuyen_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_tin_tuyen_dung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tin_tuyen_dung` bigint DEFAULT NULL,
  `loai` enum('anh','video') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'anh',
  `url` text COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `thu_tu` int DEFAULT '0',
  `ngay_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`),
  KEY `idx_media_tin_tuyen_dung_thu_tu` (`thu_tu`),
  CONSTRAINT `media_tin_tuyen_dung_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nguoi_tham_gia_su_kien`
--

DROP TABLE IF EXISTS `nguoi_tham_gia_su_kien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_tham_gia_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_su_kien` bigint DEFAULT NULL,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_nguoi_than` bigint DEFAULT NULL,
  `xac_nhan` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_su_kien` (`id_su_kien`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_nguoi_than` (`id_nguoi_than`),
  CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_3` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nguoi_than_benh_nhan`
--

DROP TABLE IF EXISTS `nguoi_than_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_than_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `moi_quan_he` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `la_nguoi_lien_he_chinh` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_general_ci,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `nguoi_than_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `nguoi_than_benh_nhan_ibfk_2` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nhiet_do`
--

DROP TABLE IF EXISTS `nhiet_do`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhiet_do` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `gia_tri_nhiet_do` decimal(4,2) DEFAULT NULL COMMENT 'Giá trị nhiệt độ (°C)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo nhiệt độ',
  `vi_tri_do` enum('tran','tai','mieng','nach','truc_trang') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vị trí đo',
  `tinh_trang_luc_do` enum('nghi_ngoi','van_dong','sau_an','sau_ngu') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tình trạng lúc đo',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text COLLATE utf8mb4_general_ci COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text COLLATE utf8mb4_general_ci COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_nhiet_do_thoi_gian_do` (`thoi_gian_do`),
  KEY `fk_nhiet_do_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`),
  CONSTRAINT `fk_nhiet_do_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `nhiet_do_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nhip_tim`
--

DROP TABLE IF EXISTS `nhip_tim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhip_tim` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `gia_tri_nhip_tim` int DEFAULT NULL COMMENT 'Giá trị nhịp tim (bpm)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo nhịp tim',
  `tinh_trang_benh_nhan_khi_do` enum('nghi_ngoi','van_dong','ngu','an') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tình trạng bệnh nhân khi đo',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text COLLATE utf8mb4_general_ci COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text COLLATE utf8mb4_general_ci COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_nhip_tim_thoi_gian_do` (`thoi_gian_do`),
  KEY `fk_nhip_tim_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`),
  CONSTRAINT `fk_nhip_tim_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `nhip_tim_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otp_xac_thuc`
--

DROP TABLE IF EXISTS `otp_xac_thuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_xac_thuc` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ma_otp` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loai_otp` enum('dang_ky','quen_mat_khau') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `het_han` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `otp_xac_thuc_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_cong_cong_viec`
--

DROP TABLE IF EXISTS `phan_cong_cong_viec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_cong_viec` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_cong_viec` bigint DEFAULT NULL,
  `id_dieu_duong` bigint DEFAULT NULL,
  `id_benh_nhan` bigint DEFAULT NULL,
  `trang_thai` enum('chua_lam','dang_lam','hoan_thanh') COLLATE utf8mb4_general_ci DEFAULT 'chua_lam',
  `thoi_gian_hoan_thanh` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cong_viec` (`id_cong_viec`),
  KEY `id_dieu_duong` (`id_dieu_duong`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_phan_cong_cong_viec_trang_thai` (`trang_thai`),
  CONSTRAINT `phan_cong_cong_viec_ibfk_1` FOREIGN KEY (`id_cong_viec`) REFERENCES `cong_viec` (`id`),
  CONSTRAINT `phan_cong_cong_viec_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `phan_cong_cong_viec_ibfk_3` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_cong_su_kien`
--

DROP TABLE IF EXISTS `phan_cong_su_kien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_su_kien` bigint DEFAULT NULL,
  `id_nhan_vien` bigint DEFAULT NULL,
  `vai_tro` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_su_kien` (`id_su_kien`),
  KEY `id_nhan_vien` (`id_nhan_vien`),
  CONSTRAINT `phan_cong_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  CONSTRAINT `phan_cong_su_kien_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_hoi_benh_nhan`
--

DROP TABLE IF EXISTS `phan_hoi_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_hoi_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_dieu_duong` bigint DEFAULT NULL,
  `diem_danh_gia` int DEFAULT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci,
  `ngay_danh_gia` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `id_dieu_duong` (`id_dieu_duong`),
  CONSTRAINT `phan_hoi_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `phan_hoi_benh_nhan_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_khu`
--

DROP TABLE IF EXISTS `phan_khu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_khu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_khu` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `so_tang` int DEFAULT NULL,
  `so_phong` int DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ten_khu` (`ten_khu`),
  KEY `idx_da_xoa` (`da_xoa`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_loai_do_dung`
--

DROP TABLE IF EXISTS `phan_loai_do_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_loai_do_dung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_loai` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_loai_phong` bigint DEFAULT NULL,
  `id_phan_khu` bigint NOT NULL,
  `ten_phong` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `so_phong` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_giuong` int DEFAULT NULL,
  `so_nguoi_toi_da` int DEFAULT '1',
  `dien_tich` decimal(10,2) DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('trong','co_nguoi','bao_tri') COLLATE utf8mb4_general_ci DEFAULT 'trong',
  `anh_1` text COLLATE utf8mb4_general_ci,
  `anh_2` text COLLATE utf8mb4_general_ci,
  `anh_3` text COLLATE utf8mb4_general_ci,
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_phan_khu` (`id_phan_khu`),
  KEY `idx_ten_phong` (`ten_phong`),
  KEY `idx_so_phong` (`so_phong`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_da_xoa` (`da_xoa`),
  KEY `id_loai_phong` (`id_loai_phong`),
  CONSTRAINT `fk_phong_loai_phong` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`),
  CONSTRAINT `fk_phong_phan_khu` FOREIGN KEY (`id_phan_khu`) REFERENCES `phan_khu` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phong_o_benh_nhan`
--

DROP TABLE IF EXISTS `phong_o_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong_o_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `id_phong` bigint DEFAULT NULL,
  `ngay_bat_dau_o` date DEFAULT NULL,
  `ngay_ket_thuc_o` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_phong_o_benh_nhan_benh_nhan` (`id_benh_nhan`),
  KEY `idx_id_phong` (`id_phong`),
  KEY `idx_ngay_bat_dau_o` (`ngay_bat_dau_o`),
  KEY `idx_ngay_ket_thuc_o` (`ngay_ket_thuc_o`),
  CONSTRAINT `fk_phong_o_benh_nhan_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_phong_o_benh_nhan_phong` FOREIGN KEY (`id_phong`) REFERENCES `phong` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phong_o_benh_nhan_backup`
--

DROP TABLE IF EXISTS `phong_o_benh_nhan_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong_o_benh_nhan_backup` (
  `id` bigint NOT NULL DEFAULT '0',
  `id_benh_nhan` bigint DEFAULT NULL,
  `khu` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phong` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `giuong` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `qr_benh_nhan`
--

DROP TABLE IF EXISTS `qr_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qr_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint NOT NULL,
  `ma_qr` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url_qr` text COLLATE utf8mb4_general_ci,
  `duong_dan_qr` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ma_qr` (`ma_qr`),
  KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `qr_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spo2`
--

DROP TABLE IF EXISTS `spo2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spo2` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `gia_tri_spo2` int DEFAULT NULL COMMENT 'Giá trị SpO2 (%)',
  `pi` decimal(5,2) DEFAULT NULL COMMENT 'Perfusion Index (chỉ số tưới máu)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo SpO2',
  `vi_tri_do` enum('ngon_tay_cai','ngon_tay_tro','ngon_tay_giua','ngon_tay_ut','ngon_chan') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vị trí đo',
  `tinh_trang_ho_hap` enum('binh_thuong','kho_tho','tho_nhanh','tho_cham','ngung_tho') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tình trạng hô hấp',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text COLLATE utf8mb4_general_ci COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text COLLATE utf8mb4_general_ci COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  KEY `idx_spo2_thoi_gian_do` (`thoi_gian_do`),
  KEY `fk_spo2_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`),
  CONSTRAINT `fk_spo2_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `spo2_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `su_kien`
--

DROP TABLE IF EXISTS `su_kien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `su_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay` datetime DEFAULT NULL,
  `dia_diem` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loai` enum('y_te','giai_tri','sinh_hoat','khac') COLLATE utf8mb4_general_ci DEFAULT 'sinh_hoat',
  `ngan_sach` int DEFAULT NULL,
  `anh_dai_dien` text COLLATE utf8mb4_general_ci,
  `video` text COLLATE utf8mb4_general_ci,
  `trang_thai` enum('sap_dien_ra','dang_dien_ra','ket_thuc') COLLATE utf8mb4_general_ci DEFAULT 'sap_dien_ra',
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tai_khoan`
--

DROP TABLE IF EXISTS `tai_khoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tai_khoan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_general_ci,
  `mat_khau` text COLLATE utf8mb4_general_ci,
  `vai_tro` enum('super_admin','quan_ly_y_te','quan_ly_nhan_su','dieu_duong','dieu_duong_truong','nguoi_nha','marketing') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trang_thai` enum('active','inactive','locked') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tai_khoan_vai_tro` (`vai_tro`),
  KEY `idx_so_dien_thoai` (`so_dien_thoai`),
  KEY `idx_email` (`email`),
  KEY `idx_so_dien_thoai_vai_tro_da_xoa` (`so_dien_thoai`,`vai_tro`,`da_xoa`),
  KEY `idx_email_vai_tro_da_xoa` (`email`,`vai_tro`,`da_xoa`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tam_ly_giao_tiep`
--

DROP TABLE IF EXISTS `tam_ly_giao_tiep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tam_ly_giao_tiep` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `trang_thai_tinh_than` enum('vui_ve','binh_thuong','buon_ba','lo_lang','cau_gat') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nhan_thuc_nguoi_than` tinyint(1) DEFAULT NULL,
  `nhan_thuc_dieu_duong` tinyint(1) DEFAULT NULL,
  `biet_thoi_gian` tinyint(1) DEFAULT NULL,
  `muc_do_tuong_tac` enum('chu_dong','phan_hoi','it_phan_hoi','khong_giao_tiep') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `tam_ly_giao_tiep_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thong_bao`
--

DROP TABLE IF EXISTS `thong_bao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_bao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_nguoi_nhan` bigint DEFAULT NULL,
  `loai` enum('cong_viec','canh_bao','tin_nhan','su_kien','he_thong') COLLATE utf8mb4_general_ci NOT NULL,
  `tieu_de` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_general_ci,
  `link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nguoi_nhan` (`id_nguoi_nhan`),
  KEY `idx_thong_bao_da_doc` (`da_doc`),
  CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thong_tin_benh`
--

DROP TABLE IF EXISTS `thong_tin_benh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_tin_benh` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_benh` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thong_tin_tai_khoan`
--

DROP TABLE IF EXISTS `thong_tin_tai_khoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_tin_tai_khoan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` bigint DEFAULT NULL,
  `ten_thuoc_tinh` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gia_tri` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  CONSTRAINT `thong_tin_tai_khoan_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thuoc_trong_don`
--

DROP TABLE IF EXISTS `thuoc_trong_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thuoc_trong_don` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_don_thuoc` bigint DEFAULT NULL,
  `ten_thuoc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lieu_luong` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thoi_diem_uong` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thoi_gian_uong` datetime DEFAULT NULL COMMENT 'Thời gian cụ thể uống thuốc',
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_don_thuoc` (`id_don_thuoc`),
  CONSTRAINT `thuoc_trong_don_ibfk_1` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tin_tuyen_dung`
--

DROP TABLE IF EXISTS `tin_tuyen_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_tuyen_dung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `vi_tri` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `yeu_cau` text COLLATE utf8mb4_general_ci,
  `so_luong` int DEFAULT '1',
  `ngay_dang` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_het_han` datetime DEFAULT NULL,
  `trang_thai` enum('dang_tuyen','tam_dung','da_dong') COLLATE utf8mb4_general_ci DEFAULT 'dang_tuyen',
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trieu_chung_benh_nhan`
--

DROP TABLE IF EXISTS `trieu_chung_benh_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trieu_chung_benh_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_trieu_chung` bigint NOT NULL,
  `id_benh_nhan` bigint NOT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_trieu_chung` (`id_trieu_chung`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `trieu_chung_benh_nhan_ibfk_1` FOREIGN KEY (`id_trieu_chung`) REFERENCES `danh_sach_trieu_chung` (`id`),
  CONSTRAINT `trieu_chung_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `van_dong_phuc_hoi`
--

DROP TABLE IF EXISTS `van_dong_phuc_hoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `van_dong_phuc_hoi` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_benh_nhan` bigint DEFAULT NULL,
  `kha_nang_van_dong` enum('doc_lap','tro_giup','nam_lien') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loai_bai_tap` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thoi_gian_bat_dau` datetime DEFAULT NULL,
  `thoi_luong_phut` int DEFAULT NULL,
  `cuong_do` enum('nhe','trung_binh','manh') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `calo_tieu_hao` int DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_cap_nhat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_benh_nhan` (`id_benh_nhan`),
  CONSTRAINT `van_dong_phuc_hoi_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21  2:07:11
