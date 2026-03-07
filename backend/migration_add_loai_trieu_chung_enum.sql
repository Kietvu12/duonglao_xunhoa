ALTER TABLE danh_sach_trieu_chung
ADD COLUMN loai ENUM('khan_cap','ho_hap','tim_mach','tieu_hoa','tiet_nieu','than_kinh','da_lieu','co_xuong','toan_than','khac') 
NOT NULL DEFAULT 'khac'
AFTER ten_trieu_chung;