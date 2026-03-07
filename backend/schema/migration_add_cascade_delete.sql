-- Migration: Thêm ON DELETE CASCADE cho các foreign key liên quan đến bệnh nhân và nhân viên
-- Mục đích: Khi xóa bệnh nhân hoặc nhân viên, tất cả dữ liệu liên quan sẽ tự động bị xóa

-- Tắt foreign key checks tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- CÁC BẢNG LIÊN QUAN ĐẾN BỆNH NHÂN (benh_nhan)
-- ============================================

-- 1. benh_hien_tai
ALTER TABLE `benh_hien_tai`
  DROP FOREIGN KEY `benh_hien_tai_ibfk_1`;
ALTER TABLE `benh_hien_tai`
  ADD CONSTRAINT `benh_hien_tai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 2. diem_rui_ro_ai
ALTER TABLE `diem_rui_ro_ai`
  DROP FOREIGN KEY `diem_rui_ro_ai_ibfk_1`;
ALTER TABLE `diem_rui_ro_ai`
  ADD CONSTRAINT `diem_rui_ro_ai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 3. don_thuoc
ALTER TABLE `don_thuoc`
  DROP FOREIGN KEY `don_thuoc_ibfk_1`;
ALTER TABLE `don_thuoc`
  ADD CONSTRAINT `don_thuoc_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 4. do_dung_ca_nhan
ALTER TABLE `do_dung_ca_nhan`
  DROP FOREIGN KEY `do_dung_ca_nhan_ibfk_1`;
ALTER TABLE `do_dung_ca_nhan`
  ADD CONSTRAINT `do_dung_ca_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 5. hoat_dong_sinh_hoat
ALTER TABLE `hoat_dong_sinh_hoat`
  DROP FOREIGN KEY `hoat_dong_sinh_hoat_ibfk_1`;
ALTER TABLE `hoat_dong_sinh_hoat`
  ADD CONSTRAINT `hoat_dong_sinh_hoat_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 6. ho_so_y_te_benh_nhan
ALTER TABLE `ho_so_y_te_benh_nhan`
  DROP FOREIGN KEY `ho_so_y_te_benh_nhan_ibfk_1`;
ALTER TABLE `ho_so_y_te_benh_nhan`
  ADD CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 7. lich_kham
ALTER TABLE `lich_kham`
  DROP FOREIGN KEY `lich_kham_ibfk_1`;
ALTER TABLE `lich_kham`
  ADD CONSTRAINT `lich_kham_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 8. lich_tham_benh
ALTER TABLE `lich_tham_benh`
  DROP FOREIGN KEY `lich_tham_benh_ibfk_1`;
ALTER TABLE `lich_tham_benh`
  ADD CONSTRAINT `lich_tham_benh_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 9. media_ca_nhan_benh_nhan
ALTER TABLE `media_ca_nhan_benh_nhan`
  DROP FOREIGN KEY `media_ca_nhan_benh_nhan_ibfk_2`;
ALTER TABLE `media_ca_nhan_benh_nhan`
  ADD CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 10. nguoi_tham_gia_su_kien
ALTER TABLE `nguoi_tham_gia_su_kien`
  DROP FOREIGN KEY `nguoi_tham_gia_su_kien_ibfk_2`;
ALTER TABLE `nguoi_tham_gia_su_kien`
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 11. nguoi_than_benh_nhan
ALTER TABLE `nguoi_than_benh_nhan`
  DROP FOREIGN KEY `nguoi_than_benh_nhan_ibfk_1`;
ALTER TABLE `nguoi_than_benh_nhan`
  ADD CONSTRAINT `nguoi_than_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 12. phan_cong_cong_viec
ALTER TABLE `phan_cong_cong_viec`
  DROP FOREIGN KEY `phan_cong_cong_viec_ibfk_3`;
ALTER TABLE `phan_cong_cong_viec`
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_3` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 13. phan_hoi_benh_nhan
ALTER TABLE `phan_hoi_benh_nhan`
  DROP FOREIGN KEY `phan_hoi_benh_nhan_ibfk_1`;
ALTER TABLE `phan_hoi_benh_nhan`
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 14. tam_ly_giao_tiep
ALTER TABLE `tam_ly_giao_tiep`
  DROP FOREIGN KEY `tam_ly_giao_tiep_ibfk_1`;
ALTER TABLE `tam_ly_giao_tiep`
  ADD CONSTRAINT `tam_ly_giao_tiep_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 15. trieu_chung_benh_nhan
ALTER TABLE `trieu_chung_benh_nhan`
  DROP FOREIGN KEY `trieu_chung_benh_nhan_ibfk_2`;
ALTER TABLE `trieu_chung_benh_nhan`
  ADD CONSTRAINT `trieu_chung_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- 16. van_dong_phuc_hoi
ALTER TABLE `van_dong_phuc_hoi`
  DROP FOREIGN KEY `van_dong_phuc_hoi_ibfk_1`;
ALTER TABLE `van_dong_phuc_hoi`
  ADD CONSTRAINT `van_dong_phuc_hoi_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

-- ============================================
-- CÁC BẢNG LIÊN QUAN ĐẾN NHÂN VIÊN (tai_khoan/ho_so_nhan_vien)
-- ============================================

-- 17. ho_so_nhan_vien (khi xóa tai_khoan, xóa ho_so_nhan_vien)
ALTER TABLE `ho_so_nhan_vien`
  DROP FOREIGN KEY `ho_so_nhan_vien_ibfk_1`;
ALTER TABLE `ho_so_nhan_vien`
  ADD CONSTRAINT `ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 18. kpi_nhan_vien
ALTER TABLE `kpi_nhan_vien`
  DROP FOREIGN KEY `kpi_nhan_vien_ibfk_1`;
ALTER TABLE `kpi_nhan_vien`
  ADD CONSTRAINT `kpi_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 19. lich_hen_tu_van
ALTER TABLE `lich_hen_tu_van`
  DROP FOREIGN KEY `lich_hen_tu_van_ibfk_1`;
ALTER TABLE `lich_hen_tu_van`
  ADD CONSTRAINT `lich_hen_tu_van_ibfk_1` FOREIGN KEY (`nguoi_xac_nhan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 20. lich_phan_ca
ALTER TABLE `lich_phan_ca`
  DROP FOREIGN KEY `lich_phan_ca_ibfk_1`;
ALTER TABLE `lich_phan_ca`
  ADD CONSTRAINT `lich_phan_ca_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 21. media_ca_nhan_benh_nhan (id_dieu_duong -> ho_so_nhan_vien)
ALTER TABLE `media_ca_nhan_benh_nhan`
  DROP FOREIGN KEY `media_ca_nhan_benh_nhan_ibfk_1`;
ALTER TABLE `media_ca_nhan_benh_nhan`
  ADD CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_1` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE;

-- 22. otp_xac_thuc
ALTER TABLE `otp_xac_thuc`
  DROP FOREIGN KEY `otp_xac_thuc_ibfk_1`;
ALTER TABLE `otp_xac_thuc`
  ADD CONSTRAINT `otp_xac_thuc_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 23. phan_cong_cong_viec (id_dieu_duong -> tai_khoan)
ALTER TABLE `phan_cong_cong_viec`
  DROP FOREIGN KEY `phan_cong_cong_viec_ibfk_2`;
ALTER TABLE `phan_cong_cong_viec`
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 24. phan_cong_su_kien
ALTER TABLE `phan_cong_su_kien`
  DROP FOREIGN KEY `phan_cong_su_kien_ibfk_2`;
ALTER TABLE `phan_cong_su_kien`
  ADD CONSTRAINT `phan_cong_su_kien_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 25. phan_hoi_benh_nhan (id_dieu_duong -> tai_khoan)
ALTER TABLE `phan_hoi_benh_nhan`
  DROP FOREIGN KEY `phan_hoi_benh_nhan_ibfk_2`;
ALTER TABLE `phan_hoi_benh_nhan`
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 26. thong_bao
ALTER TABLE `thong_bao`
  DROP FOREIGN KEY `thong_bao_ibfk_1`;
ALTER TABLE `thong_bao`
  ADD CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 27. thong_tin_tai_khoan
ALTER TABLE `thong_tin_tai_khoan`
  DROP FOREIGN KEY `thong_tin_tai_khoan_ibfk_1`;
ALTER TABLE `thong_tin_tai_khoan`
  ADD CONSTRAINT `thong_tin_tai_khoan_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- 28. cong_viec (id_nguoi_tao -> tai_khoan)
ALTER TABLE `cong_viec`
  DROP FOREIGN KEY `cong_viec_ibfk_1`;
ALTER TABLE `cong_viec`
  ADD CONSTRAINT `cong_viec_ibfk_1` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

-- Lưu ý: Các bảng bai_viet, bai_viet_dich_vu, bai_viet_phong có id_tac_gia
-- Có thể giữ nguyên hoặc đặt ON DELETE SET NULL tùy theo yêu cầu nghiệp vụ
-- Nếu muốn xóa bài viết khi xóa tác giả, uncomment các dòng dưới:

-- 29. bai_viet (id_tac_gia -> tai_khoan)
-- ALTER TABLE `bai_viet`
--   DROP FOREIGN KEY `bai_viet_ibfk_1`;
-- ALTER TABLE `bai_viet`
--   ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

-- 30. bai_viet_dich_vu (id_tac_gia -> tai_khoan)
-- ALTER TABLE `bai_viet_dich_vu`
--   DROP FOREIGN KEY `bai_viet_dich_vu_ibfk_1`;
-- ALTER TABLE `bai_viet_dich_vu`
--   ADD CONSTRAINT `bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

-- 31. bai_viet_phong (id_tac_gia -> tai_khoan)
-- ALTER TABLE `bai_viet_phong`
--   DROP FOREIGN KEY `bai_viet_phong_ibfk_1`;
-- ALTER TABLE `bai_viet_phong`
--   ADD CONSTRAINT `bai_viet_phong_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- GHI CHÚ:
-- ============================================
-- 1. Khi xóa một bệnh nhân (benh_nhan), tất cả dữ liệu liên quan sẽ tự động bị xóa
-- 2. Khi xóa một tài khoản nhân viên (tai_khoan), ho_so_nhan_vien và các dữ liệu liên quan sẽ tự động bị xóa
-- 3. Khi xóa ho_so_nhan_vien, các dữ liệu liên quan (dieu_duong_benh_nhan, media_ca_nhan_benh_nhan, media_ho_so_nhan_vien) sẽ tự động bị xóa
-- 4. Các bảng bai_viet, bai_viet_dich_vu, bai_viet_phong có thể giữ nguyên hoặc đặt ON DELETE SET NULL
--    tùy theo yêu cầu nghiệp vụ (có thể muốn giữ lại bài viết ngay cả khi tác giả bị xóa)

