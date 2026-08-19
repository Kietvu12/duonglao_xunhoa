/**
 * Seed 12 phân khu (dãy) + 66 phòng ở theo sơ đồ tên phòng.
 * Idempotent: bỏ qua phân khu / phòng đã tồn tại (da_xoa = 0).
 *
 * Chạy từ thư mục backend:
 *   node scripts/seed-phan-khu-phong.js
 */
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PHAN_KHU = [
  { ten_khu: 'Tùng', mo_ta: 'Dãy Tùng · bên lễ tân · bỏ phòng 04 & 07', so_tang: 1, so_phong: 4 },
  { ten_khu: 'Trúc', mo_ta: 'Dãy Trúc · phục hồi chức năng · 103=Kho (không tạo phòng)', so_tang: 1, so_phong: 2 },
  { ten_khu: 'Cúc', mo_ta: 'Dãy Cúc · khu y tế Trường Thọ · bỏ phòng 04', so_tang: 1, so_phong: 4 },
  { ten_khu: 'Mai', mo_ta: 'Dãy Mai · hướng cổng · bỏ đuôi 04 & 07', so_tang: 1, so_phong: 8 },
  { ten_khu: 'Mẫu Đơn', mo_ta: 'Dãy Mẫu Đơn · tầng 2 phải · hướng ao sen · VIP 201', so_tang: 2, so_phong: 8 },
  { ten_khu: 'Hoa Hồng', mo_ta: 'Dãy Hoa Hồng · tầng 2 phải · song song Mẫu Đơn', so_tang: 2, so_phong: 8 },
  { ten_khu: 'Đào', mo_ta: 'Dãy Đào · tầng 2 trái · hướng vườn rau', so_tang: 2, so_phong: 3 },
  { ten_khu: 'Cát Tường', mo_ta: 'Dãy Cát Tường · tầng 2 trái · song song Đào', so_tang: 2, so_phong: 8 },
  { ten_khu: 'Sen', mo_ta: 'Dãy Sen · tầng 3 · cạnh hội trường', so_tang: 3, so_phong: 3 },
  { ten_khu: 'Tulip', mo_ta: 'Dãy Tulip · VIP · tầng 3 · bỏ đuôi 04 & 07', so_tang: 3, so_phong: 8 },
  { ten_khu: 'Hướng Dương', mo_ta: 'Dãy Hướng Dương · tầng 3', so_tang: 3, so_phong: 2 },
  { ten_khu: 'Lavender', mo_ta: 'Dãy Lavender · Premium · tầng 3 · bỏ đuôi 04 & 07', so_tang: 3, so_phong: 8 },
];

/** [ten_khu, so_phong, so_giuong, mo_ta?] */
const PHONG = [
  // Tầng 1 · Tùng (8G)
  ['Tùng', '101', 1], ['Tùng', '102', 3], ['Tùng', '103', 2], ['Tùng', '105', 2],
  // Tầng 1 · Trúc (6G) — 103 = Kho, không insert
  ['Trúc', '101', 3], ['Trúc', '102', 3],
  // Tầng 1 · Cúc (28G)
  ['Cúc', '101', 8, 'Giường: 1,2,3,5,6,7,8,9 (bỏ số 4)'],
  ['Cúc', '102', 8, 'Giường: 1,2,3,5,6,7,8,9 (bỏ số 4)'],
  ['Cúc', '103', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'],
  ['Cúc', '105', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'],
  // Tầng 1 · Mai (20G)
  ['Mai', '101', 2], ['Mai', '102', 2], ['Mai', '103', 2], ['Mai', '105', 2],
  ['Mai', '106', 3], ['Mai', '108', 3], ['Mai', '109', 3], ['Mai', '110', 3],
  // Tầng 2 · Mẫu Đơn (20G)
  ['Mẫu Đơn', '201', 3, 'VIP · view ao sen'],
  ['Mẫu Đơn', '202', 3], ['Mẫu Đơn', '203', 3], ['Mẫu Đơn', '205', 3],
  ['Mẫu Đơn', '206', 2], ['Mẫu Đơn', '208', 2], ['Mẫu Đơn', '209', 2], ['Mẫu Đơn', '210', 2],
  // Tầng 2 · Hoa Hồng (20G theo nhãn phòng)
  ['Hoa Hồng', '201', 2], ['Hoa Hồng', '202', 2], ['Hoa Hồng', '203', 2], ['Hoa Hồng', '205', 2],
  ['Hoa Hồng', '206', 3], ['Hoa Hồng', '208', 3], ['Hoa Hồng', '209', 3], ['Hoa Hồng', '210', 3],
  // Tầng 2 · Đào (8G)
  ['Đào', '201', 3],
  ['Đào', '202', 3, 'Cạnh phòng sinh hoạt chung'],
  ['Đào', '203', 2, 'Cạnh nhà tắm chung'],
  // Tầng 2 · Cát Tường (20G)
  ['Cát Tường', '201', 2], ['Cát Tường', '202', 2], ['Cát Tường', '203', 2], ['Cát Tường', '205', 2],
  ['Cát Tường', '206', 3], ['Cát Tường', '208', 3], ['Cát Tường', '209', 3], ['Cát Tường', '210', 3],
  // Tầng 3 · Sen (6G)
  ['Sen', '301', 2], ['Sen', '302', 2], ['Sen', '303', 2],
  // Tầng 3 · Tulip (20G theo nhãn phòng)
  ['Tulip', '301', 2], ['Tulip', '302', 2], ['Tulip', '303', 2], ['Tulip', '305', 2],
  ['Tulip', '306', 3], ['Tulip', '308', 3], ['Tulip', '309', 3], ['Tulip', '310', 3],
  // Tầng 3 · Hướng Dương (12G)
  ['Hướng Dương', '301', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'],
  ['Hướng Dương', '302', 6, 'Giường: 1,2,3,5,6,7 (bỏ số 4)'],
  // Tầng 3 · Lavender (22G theo nhãn phòng; badge HTML ghi 20G)
  ['Lavender', '301', 2], ['Lavender', '302', 2], ['Lavender', '303', 2], ['Lavender', '305', 2],
  ['Lavender', '306', 3], ['Lavender', '308', 3], ['Lavender', '309', 3],
  ['Lavender', '310', 5, 'Giường: 1,2,3,5,6 (bỏ số 4)'],
];

const ensurePhanKhu = async (conn, item) => {
  const [rows] = await conn.execute(
    'SELECT id FROM phan_khu WHERE ten_khu = ? AND da_xoa = 0 LIMIT 1',
    [item.ten_khu]
  );
  if (rows.length > 0) return { id: rows[0].id, created: false };

  const [result] = await conn.execute(
    `INSERT INTO phan_khu (ten_khu, mo_ta, so_tang, so_phong, da_xoa, ngay_tao)
     VALUES (?, ?, ?, ?, 0, NOW())`,
    [item.ten_khu, item.mo_ta, item.so_tang, item.so_phong]
  );
  return { id: result.insertId, created: true };
};

const ensurePhong = async (conn, idPhanKhu, tenKhu, soPhong, soGiuong, moTa = null) => {
  const [rows] = await conn.execute(
    'SELECT id FROM phong WHERE id_phan_khu = ? AND so_phong = ? AND da_xoa = 0 LIMIT 1',
    [idPhanKhu, soPhong]
  );
  if (rows.length > 0) return { created: false };

  const tenPhong = `${tenKhu} ${soPhong}`;
  await conn.execute(
    `INSERT INTO phong
      (id_loai_phong, id_phan_khu, ten_phong, so_phong, so_giuong, so_nguoi_toi_da, mo_ta, trang_thai, da_xoa, ngay_tao)
     VALUES (1, ?, ?, ?, ?, ?, ?, 'trong', 0, NOW())`,
    [idPhanKhu, tenPhong, soPhong, soGiuong, soGiuong, moTa]
  );
  return { created: true };
};

const syncSoPhong = async (conn, idPhanKhu) => {
  await conn.execute(
    `UPDATE phan_khu
     SET so_phong = (SELECT COUNT(*) FROM phong WHERE id_phan_khu = ? AND da_xoa = 0)
     WHERE id = ?`,
    [idPhanKhu, idPhanKhu]
  );
};

const main = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const khuIdByName = {};
    let khuCreated = 0;
    let phongCreated = 0;

    for (const khu of PHAN_KHU) {
      const { id, created } = await ensurePhanKhu(conn, khu);
      khuIdByName[khu.ten_khu] = id;
      if (created) khuCreated += 1;
      console.log(`${created ? '➕' : '✓'} Phân khu: ${khu.ten_khu} (id=${id})`);
    }

    for (const row of PHONG) {
      const [tenKhu, soPhong, soGiuong, moTa] = row;
      const idPhanKhu = khuIdByName[tenKhu];
      if (!idPhanKhu) throw new Error(`Thiếu phân khu: ${tenKhu}`);

      const { created } = await ensurePhong(conn, idPhanKhu, tenKhu, soPhong, soGiuong, moTa || null);
      if (created) phongCreated += 1;
    }

    for (const id of Object.values(khuIdByName)) {
      await syncSoPhong(conn, id);
    }

    await conn.commit();

    const totalBeds = PHONG.reduce((sum, [, , beds]) => sum + beds, 0);
    console.log('\n========== TỔNG HỢP ==========');
    console.log(`Phân khu (dãy): ${PHAN_KHU.length} (mới tạo: ${khuCreated})`);
    console.log(`Phòng ở:        ${PHONG.length} (mới tạo: ${phongCreated})`);
    console.log(`Tổng giường:    ${totalBeds} (theo số giường từng phòng)`);
    console.log('Không seed: kho, nhà tắm chung, SH chung, hội trường.');
    console.log('✅ Seed hoàn tất.');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Seed thất bại:', error.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
};

main();
