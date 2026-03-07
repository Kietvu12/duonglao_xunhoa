-- Migration: Insert default diem_muc_uu_tien
-- Điểm số mặc định cho mỗi mức độ ưu tiên

INSERT INTO `diem_muc_uu_tien` (`muc_uu_tien`, `diem_so`, `ngay_tao`, `ngay_cap_nhat`) 
VALUES 
  ('thap', 1, NOW(), NOW()),
  ('trung_binh', 2, NOW(), NOW()),
  ('cao', 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  `ngay_cap_nhat` = NOW();

