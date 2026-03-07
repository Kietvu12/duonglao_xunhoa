-- Script để cập nhật tất cả URL ảnh từ localhost sang production
-- Base URL mới: https://duonglaoxuanhoa.net/api_quanlyduonglao

-- Cập nhật media_bai_viet
UPDATE media_bai_viet 
SET url = REPLACE(url, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE url LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_bai_viet_dich_vu
UPDATE media_bai_viet_dich_vu 
SET url = REPLACE(url, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE url LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_bai_viet_phong
UPDATE media_bai_viet_phong 
SET url = REPLACE(url, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE url LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_ca_nhan_benh_nhan
UPDATE media_ca_nhan_benh_nhan 
SET duong_dan_anh = REPLACE(duong_dan_anh, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE duong_dan_anh LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_ho_so_nhan_vien
UPDATE media_ho_so_nhan_vien 
SET anh_cccd = REPLACE(anh_cccd, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_cccd LIKE 'http://localhost:4545/uploads/%';

UPDATE media_ho_so_nhan_vien 
SET anh_bangdh = REPLACE(anh_bangdh, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_bangdh LIKE 'http://localhost:4545/uploads/%';

UPDATE media_ho_so_nhan_vien 
SET anh_bhyt = REPLACE(anh_bhyt, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_bhyt LIKE 'http://localhost:4545/uploads/%';

UPDATE media_ho_so_nhan_vien 
SET anh_cv = REPLACE(anh_cv, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_cv LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_tin_tuyen_dung
UPDATE media_tin_tuyen_dung 
SET url = REPLACE(url, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE url LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật bai_viet - anh_dai_dien
UPDATE bai_viet 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật bai_viet - noi_dung (HTML content có thể chứa img tags)
UPDATE bai_viet 
SET noi_dung = REPLACE(noi_dung, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE noi_dung LIKE '%http://localhost:4545/uploads/%';

-- Cập nhật bai_viet_dich_vu - anh_dai_dien
UPDATE bai_viet_dich_vu 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật bai_viet_dich_vu - noi_dung
UPDATE bai_viet_dich_vu 
SET noi_dung = REPLACE(noi_dung, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE noi_dung LIKE '%http://localhost:4545/uploads/%';

-- Cập nhật bai_viet_phong - anh_dai_dien
UPDATE bai_viet_phong 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật bai_viet_phong - noi_dung
UPDATE bai_viet_phong 
SET noi_dung = REPLACE(noi_dung, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE noi_dung LIKE '%http://localhost:4545/uploads/%';

-- Cập nhật benh_nhan - anh_dai_dien
UPDATE benh_nhan 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật dich_vu - anh_dai_dien
UPDATE dich_vu 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật su_kien - anh_dai_dien và video
UPDATE su_kien 
SET anh_dai_dien = REPLACE(anh_dai_dien, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE anh_dai_dien LIKE 'http://localhost:4545/uploads/%';

UPDATE su_kien 
SET video = REPLACE(video, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE video LIKE 'http://localhost:4545/uploads/%';

-- Cập nhật media_su_kien
UPDATE media_su_kien 
SET url = REPLACE(url, 'http://localhost:4545/uploads/', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/')
WHERE url LIKE 'http://localhost:4545/uploads/%';

