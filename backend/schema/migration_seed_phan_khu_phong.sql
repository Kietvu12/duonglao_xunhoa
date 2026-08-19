-- Seed phân khu + phòng theo sơ đồ tên phòng ở (3 tầng, 12 dãy, 66 phòng ở)
-- Không insert kho / nhà tắm chung / sinh hoạt chung / hội trường
-- Idempotent: bỏ qua nếu ten_khu hoặc (id_phan_khu + so_phong) đã tồn tại (da_xoa = 0)
-- Chạy: mysql -u ... -p quanlyduonglao < migration_seed_phan_khu_phong.sql
-- Khuyến nghị: dùng script Node backend/scripts/seed-phan-khu-phong.js (an toàn hơn với ID)

START TRANSACTION;

-- ========== PHÂN KHU (12 dãy) ==========
INSERT INTO phan_khu (ten_khu, mo_ta, so_tang, so_phong, da_xoa, ngay_tao)
SELECT v.ten_khu, v.mo_ta, v.so_tang, v.so_phong, 0, NOW()
FROM (
  SELECT 'Tùng' AS ten_khu, 'Dãy Tùng · bên lễ tân · bỏ phòng 04 & 07' AS mo_ta, 1 AS so_tang, 4 AS so_phong
  UNION ALL SELECT 'Trúc', 'Dãy Trúc · phục hồi chức năng · 103=Kho (không tạo phòng)', 1, 2
  UNION ALL SELECT 'Cúc', 'Dãy Cúc · khu y tế Trường Thọ · bỏ phòng 04', 1, 4
  UNION ALL SELECT 'Mai', 'Dãy Mai · hướng cổng · bỏ đuôi 04 & 07', 1, 8
  UNION ALL SELECT 'Mẫu Đơn', 'Dãy Mẫu Đơn · tầng 2 phải · hướng ao sen · VIP 201', 2, 8
  UNION ALL SELECT 'Hoa Hồng', 'Dãy Hoa Hồng · tầng 2 phải · song song Mẫu Đơn', 2, 8
  UNION ALL SELECT 'Đào', 'Dãy Đào · tầng 2 trái · hướng vườn rau', 2, 3
  UNION ALL SELECT 'Cát Tường', 'Dãy Cát Tường · tầng 2 trái · song song Đào', 2, 8
  UNION ALL SELECT 'Sen', 'Dãy Sen · tầng 3 · cạnh hội trường', 3, 3
  UNION ALL SELECT 'Tulip', 'Dãy Tulip · VIP · tầng 3 · bỏ đuôi 04 & 07', 3, 8
  UNION ALL SELECT 'Hướng Dương', 'Dãy Hướng Dương · tầng 3', 3, 2
  UNION ALL SELECT 'Lavender', 'Dãy Lavender · Premium · tầng 3 · bỏ đuôi 04 & 07', 3, 8
) AS v
WHERE NOT EXISTS (
  SELECT 1 FROM phan_khu pk
  WHERE pk.ten_khu = v.ten_khu AND pk.da_xoa = 0
);

-- ========== PHÒNG ==========
-- Helper: insert nếu chưa có so_phong trong phân khu

INSERT INTO phong (id_loai_phong, id_phan_khu, ten_phong, so_phong, so_giuong, so_nguoi_toi_da, mo_ta, trang_thai, da_xoa, ngay_tao)
SELECT 1, pk.id, r.ten_phong, r.so_phong, r.so_giuong, r.so_giuong, r.mo_ta, 'trong', 0, NOW()
FROM (
  -- Tầng 1 · Tùng
  SELECT 'Tùng' AS ten_khu, 'Tùng 101' AS ten_phong, '101' AS so_phong, 1 AS so_giuong, NULL AS mo_ta
  UNION ALL SELECT 'Tùng', 'Tùng 102', '102', 3, NULL
  UNION ALL SELECT 'Tùng', 'Tùng 103', '103', 2, NULL
  UNION ALL SELECT 'Tùng', 'Tùng 105', '105', 2, NULL
  -- Tầng 1 · Trúc
  UNION ALL SELECT 'Trúc', 'Trúc 101', '101', 3, NULL
  UNION ALL SELECT 'Trúc', 'Trúc 102', '102', 3, NULL
  -- Tầng 1 · Cúc
  UNION ALL SELECT 'Cúc', 'Cúc 101', '101', 8, 'Giường: 1,2,3,5,6,7,8,9 (bỏ số 4)'
  UNION ALL SELECT 'Cúc', 'Cúc 102', '102', 8, 'Giường: 1,2,3,5,6,7,8,9 (bỏ số 4)'
  UNION ALL SELECT 'Cúc', 'Cúc 103', '103', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'
  UNION ALL SELECT 'Cúc', 'Cúc 105', '105', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'
  -- Tầng 1 · Mai
  UNION ALL SELECT 'Mai', 'Mai 101', '101', 2, NULL
  UNION ALL SELECT 'Mai', 'Mai 102', '102', 2, NULL
  UNION ALL SELECT 'Mai', 'Mai 103', '103', 2, NULL
  UNION ALL SELECT 'Mai', 'Mai 105', '105', 2, NULL
  UNION ALL SELECT 'Mai', 'Mai 106', '106', 3, NULL
  UNION ALL SELECT 'Mai', 'Mai 108', '108', 3, NULL
  UNION ALL SELECT 'Mai', 'Mai 109', '109', 3, NULL
  UNION ALL SELECT 'Mai', 'Mai 110', '110', 3, NULL
  -- Tầng 2 · Mẫu Đơn
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 201', '201', 3, 'VIP · view ao sen'
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 202', '202', 3, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 203', '203', 3, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 205', '205', 3, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 206', '206', 2, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 208', '208', 2, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 209', '209', 2, NULL
  UNION ALL SELECT 'Mẫu Đơn', 'Mẫu Đơn 210', '210', 2, NULL
  -- Tầng 2 · Hoa Hồng
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 201', '201', 2, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 202', '202', 2, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 203', '203', 2, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 205', '205', 2, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 206', '206', 3, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 208', '208', 3, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 209', '209', 3, NULL
  UNION ALL SELECT 'Hoa Hồng', 'Hoa Hồng 210', '210', 3, NULL
  -- Tầng 2 · Đào
  UNION ALL SELECT 'Đào', 'Đào 201', '201', 3, NULL
  UNION ALL SELECT 'Đào', 'Đào 202', '202', 3, 'Cạnh phòng sinh hoạt chung'
  UNION ALL SELECT 'Đào', 'Đào 203', '203', 2, 'Cạnh nhà tắm chung'
  -- Tầng 2 · Cát Tường
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 201', '201', 2, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 202', '202', 2, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 203', '203', 2, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 205', '205', 2, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 206', '206', 3, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 208', '208', 3, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 209', '209', 3, NULL
  UNION ALL SELECT 'Cát Tường', 'Cát Tường 210', '210', 3, NULL
  -- Tầng 3 · Sen
  UNION ALL SELECT 'Sen', 'Sen 301', '301', 2, NULL
  UNION ALL SELECT 'Sen', 'Sen 302', '302', 2, NULL
  UNION ALL SELECT 'Sen', 'Sen 303', '303', 2, NULL
  -- Tầng 3 · Tulip
  UNION ALL SELECT 'Tulip', 'Tulip 301', '301', 2, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 302', '302', 2, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 303', '303', 2, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 305', '305', 2, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 306', '306', 3, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 308', '308', 3, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 309', '309', 3, NULL
  UNION ALL SELECT 'Tulip', 'Tulip 310', '310', 3, NULL
  -- Tầng 3 · Hướng Dương
  UNION ALL SELECT 'Hướng Dương', 'Hướng Dương 301', '301', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'
  UNION ALL SELECT 'Hướng Dương', 'Hướng Dương 302', '302', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'
  -- Tầng 3 · Lavender
  UNION ALL SELECT 'Lavender', 'Lavender 301', '301', 2, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 302', '302', 2, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 303', '303', 2, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 305', '305', 2, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 306', '306', 3, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 308', '308', 3, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 309', '309', 3, NULL
  UNION ALL SELECT 'Lavender', 'Lavender 310', '310', 5, 'Giường: 1,2,3,5,6 (bỏ số 4)'
) AS r
INNER JOIN phan_khu pk ON pk.ten_khu = r.ten_khu AND pk.da_xoa = 0
WHERE NOT EXISTS (
  SELECT 1 FROM phong p
  WHERE p.id_phan_khu = pk.id AND p.so_phong = r.so_phong AND p.da_xoa = 0
);

-- Cập nhật so_phong theo số phòng thực tế
UPDATE phan_khu pk
SET so_phong = (
  SELECT COUNT(*) FROM phong p WHERE p.id_phan_khu = pk.id AND p.da_xoa = 0
)
WHERE pk.da_xoa = 0
  AND pk.ten_khu IN (
    'Tùng','Trúc','Cúc','Mai','Mẫu Đơn','Hoa Hồng','Đào','Cát Tường',
    'Sen','Tulip','Hướng Dương','Lavender'
  );

COMMIT;
