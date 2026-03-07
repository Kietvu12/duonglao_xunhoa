-- Migration: Change phan_cong_cong_viec.id_dieu_duong FK to ho_so_nhan_vien.id

-- 1) Cập nhật dữ liệu cũ: chuyển id_dieu_duong (đang lưu tai_khoan.id) sang ho_so_nhan_vien.id
UPDATE phan_cong_cong_viec pc
JOIN ho_so_nhan_vien hsnv ON pc.id_dieu_duong = hsnv.id_tai_khoan
SET pc.id_dieu_duong = hsnv.id;

-- 2) Xóa FK cũ (tham chiếu tai_khoan.id)
ALTER TABLE phan_cong_cong_viec
  DROP FOREIGN KEY phan_cong_cong_viec_ibfk_2;

-- 3) Tạo FK mới tham chiếu ho_so_nhan_vien.id
ALTER TABLE phan_cong_cong_viec
  ADD CONSTRAINT phan_cong_cong_viec_ibfk_2
    FOREIGN KEY (id_dieu_duong) REFERENCES ho_so_nhan_vien (id) ON DELETE CASCADE;


