-- SQL script để UPDATE lại cấu hình chỉ số cảnh báo
-- Logic mới: 3 mốc (Thấp, Bình thường, Cao) - mỗi mốc là khoảng min-max
-- Ngoài khoảng Thấp hoặc Cao thì nguy hiểm

-- Xóa dữ liệu cũ
DELETE FROM cau_hinh_chi_so_canh_bao;

-- Insert cấu hình Huyết áp
INSERT INTO `cau_hinh_chi_so_canh_bao` (`ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
('Huyết áp', '{"thap":{"tam_thu_min":0,"tam_thu_max":85,"tam_truong_min":0,"tam_truong_max":55,"message":"Huyết áp thấp (<90/60 mmHg). Đánh giá triệu chứng: chóng mặt, ngất, mệt mỏi. Có thể cần bù dịch, điều chỉnh thuốc, hoặc điều trị nguyên nhân."},"binh_thuong":{"tam_thu_min":90,"tam_thu_max":119,"tam_truong_min":60,"tam_truong_max":79,"message":"Huyết áp trong giới hạn bình thường (90-119/60-79 mmHg)."},"cao":{"tam_thu_min":120,"tam_thu_max":179,"tam_truong_min":80,"tam_truong_max":119,"message":"Huyết áp cao (120-179/80-119 mmHg). Theo dõi, thay đổi lối sống, có thể cần điều trị."},"nguy_hiem":{"message":"Huyết áp nguy hiểm! Tăng huyết áp khủng hoảng (≥180/120 mmHg) hoặc huyết áp rất thấp (<90/60 mmHg). Nguy cơ tổn thương cơ quan đích hoặc sốc. Cần can thiệp ngay lập tức."}}', NOW(), NOW());

-- Insert cấu hình Nhịp tim
INSERT INTO `cau_hinh_chi_so_canh_bao` (`ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
('Nhịp tim', '{"thap":{"min":0,"max":59,"message":"Nhịp tim chậm (<60 bpm). Đánh giá: thuốc (chẹn beta, digoxin), bệnh tim, rối loạn điện giải, suy nút xoang. Có thể cần điều chỉnh thuốc hoặc đặt máy tạo nhịp."},"binh_thuong":{"min":60,"max":100,"message":"Nhịp tim trong giới hạn bình thường (60-100 bpm)."},"cao":{"min":101,"max":149,"message":"Nhịp tim nhanh (101-149 bpm). Đánh giá: tình trạng lâm sàng, nguyên nhân (sốt, đau, lo âu, mất nước, thiếu máu). Theo dõi và điều trị phù hợp."},"nguy_hiem":{"message":"Nhịp tim rất nhanh (≥150 bpm) hoặc rất chậm (<60 bpm)! Nguy cơ rối loạn nhịp tim nghiêm trọng, suy tim, sốc. Cần đánh giá ngay: ECG, điện giải, có thể cần can thiệp cấp cứu."}}', NOW(), NOW());

-- Insert cấu hình Đường huyết
INSERT INTO `cau_hinh_chi_so_canh_bao` (`ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
('Đường huyết', '{"thap":{"min":0,"max":3.9,"message":"Hạ đường huyết (<4.0 mmol/L). Kiểm tra triệu chứng: run, vã mồ hôi, lú lẫn, hôn mê. Xử trí ngay: uống/bơm glucose, kiểm tra lại sau 15 phút. Điều chỉnh thuốc nếu tái phát."},"binh_thuong":{"min":4.0,"max":7.0,"message":"Đường huyết trong giới hạn bình thường (4.0-7.0 mmol/L)."},"cao":{"min":7.1,"max":11.0,"message":"Tăng đường huyết (7.1-11.0 mmol/L). Đánh giá lại chế độ ăn, thuốc điều trị đái tháo đường, hoạt động thể chất. Điều chỉnh điều trị nếu cần."},"nguy_hiem":{"message":"Đường huyết rất cao (>11.0 mmol/L) hoặc rất thấp (<4.0 mmol/L)! Nguy cơ hôn mê tăng đường huyết (DKA, HHS) hoặc hôn mê hạ đường huyết. Cần can thiệp ngay: kiểm tra ketone, điện giải, có thể cần insulin hoặc glucose tĩnh mạch."}}', NOW(), NOW());

-- Insert cấu hình SpO2
INSERT INTO `cau_hinh_chi_so_canh_bao` (`ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
('SpO2', '{"thap":{"min":0,"max":89,"message":"SpO2 rất thấp (≤89%)! Thiếu oxy máu nghiêm trọng. Cần can thiệp ngay: thở oxy lưu lượng cao, đánh giá đường thở, tư thế, có thể cần hỗ trợ hô hấp (CPAP, BIPAP, hoặc đặt nội khí quản)."},"binh_thuong":{"min":90,"max":94,"message":"SpO2 giảm vừa (90-94%). Thiếu oxy máu. Cần theo dõi sát, thở oxy bổ sung, đánh giá nguyên nhân (viêm phổi, suy tim, bệnh phổi tắc nghẽn), điều chỉnh tư thế."},"cao":{"min":95,"max":100,"message":"SpO2 trong giới hạn bình thường (95-100%)."},"nguy_hiem":{"message":"SpO2 rất thấp (<90%)! Thiếu oxy máu nghiêm trọng. Cần can thiệp ngay: thở oxy lưu lượng cao, đánh giá đường thở, tư thế, có thể cần hỗ trợ hô hấp (CPAP, BIPAP, hoặc đặt nội khí quản)."}}', NOW(), NOW());

-- Insert cấu hình Nhiệt độ
INSERT INTO `cau_hinh_chi_so_canh_bao` (`ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
('Nhiệt độ', '{"thap":{"min":0,"max":36.4,"message":"Hạ thân nhiệt (<36.5°C). Giữ ấm, theo dõi, đánh giá nguyên nhân (nhiễm trùng nặng ở người già, suy giáp, thuốc)."},"binh_thuong":{"min":36.5,"max":37.5,"message":"Nhiệt độ trong giới hạn bình thường (36.5-37.5°C)."},"cao":{"min":37.6,"max":38.5,"message":"Sốt nhẹ (37.6-38.5°C). Theo dõi, đánh giá nguyên nhân, có thể cần hạ sốt nếu bệnh nhân khó chịu."},"nguy_hiem":{"message":"Sốt cao (>38.5°C) hoặc hạ thân nhiệt nghiêm trọng (<36.5°C)! Nguy cơ co giật, tổn thương não, nhiễm trùng huyết. Cần hạ sốt ngay (paracetamol, lau mát), đánh giá nguyên nhân, có thể cần kháng sinh hoặc điều trị hỗ trợ."}}', NOW(), NOW());

