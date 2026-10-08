/**
 * Ảnh đội ngũ chuyên gia — portrait AI (3:4), tham chiếu ảnh gốc từng bác sĩ.
 */
import hoangThiPhuongNam from './experts/hoang-thi-phuong-nam-ai.jpg';
import tranHuyHai from './experts/tran-huy-hai-ai.jpg';
import tranNguyenNgoc from './experts/tran-nguyen-ngoc-ai.jpg';
import tranHuuBinh from './experts/tran-huu-binh-ai.jpg';
import phanToanThang from './experts/phan-toan-thang-ai.jpg';

export const expertFeaturedImage = hoangThiPhuongNam;

export const expertImageById = {
  1: hoangThiPhuongNam,
  5: tranHuyHai,
  2: tranNguyenNgoc,
  3: tranHuuBinh,
  4: phanToanThang,
};

export default expertImageById;
