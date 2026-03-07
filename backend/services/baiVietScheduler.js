import pool from '../config/database.js';
import { getVNNow } from '../utils/dateUtils.js';

/**
 * Tự động cập nhật trạng thái bài viết từ 'nhap' sang 'xuat_ban'
 * khi đến giờ hẹn xuất bản (ngay_dang)
 * Quét tất cả bài viết đã qua giờ hẹn để đảm bảo không bỏ sót bài viết cũ
 */
export const updateBaiVietStatus = async () => {
  try {
    const now = getVNNow();

    // Bước 1: Kiểm tra và đếm số bài viết cần cập nhật (để log)
    const [checkResult] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM bai_viet 
       WHERE ngay_dang IS NOT NULL 
         AND ngay_dang <= ?
         AND trang_thai = 'nhap'
         AND da_xoa = 0`,
      [now]
    );
    
    const pendingCount = checkResult[0]?.count || 0;
    
    // Bước 2: Cập nhật tất cả bài viết đã đến giờ hẹn nhưng vẫn còn trạng thái 'nhap'
    // Điều này đảm bảo cả bài viết cũ và mới đều được cập nhật
    const [result] = await pool.execute(
      `UPDATE bai_viet 
       SET trang_thai = 'xuat_ban'
       WHERE ngay_dang IS NOT NULL 
         AND ngay_dang <= ?
         AND trang_thai = 'nhap'
         AND da_xoa = 0`,
      [now]
    );

    if (result.affectedRows > 0) {
      console.log(`[${new Date().toISOString()}] ✅ Đã tự động xuất bản ${result.affectedRows} bài viết (${pendingCount} bài viết đã được quét và cập nhật)`);
    } else if (pendingCount > 0) {
      // Trường hợp có bài viết cần cập nhật nhưng update không thành công
      console.warn(`[${new Date().toISOString()}] ⚠️ Phát hiện ${pendingCount} bài viết cần cập nhật nhưng không thể cập nhật`);
    }
    
    // Bước 3: Kiểm tra và log các bài viết có vấn đề (ngay_dang đã qua nhưng vẫn nhap)
    // Để debug và đảm bảo không có bài viết nào bị bỏ sót
    const [problematicArticles] = await pool.execute(
      `SELECT id, tieu_de, ngay_dang, trang_thai, TIMESTAMPDIFF(MINUTE, ngay_dang, NOW()) as minutes_overdue
       FROM bai_viet 
       WHERE ngay_dang IS NOT NULL 
         AND ngay_dang <= ?
         AND trang_thai = 'nhap'
         AND da_xoa = 0
       ORDER BY ngay_dang ASC
       LIMIT 10`,
      [now]
    );
    
    if (problematicArticles.length > 0 && result.affectedRows === 0) {
      // Nếu có bài viết cần cập nhật nhưng không update được, log chi tiết
      console.warn(`[${new Date().toISOString()}] ⚠️ Phát hiện ${problematicArticles.length} bài viết đã qua giờ hẹn nhưng chưa được cập nhật:`);
      problematicArticles.forEach(article => {
        console.warn(`  - ID: ${article.id}, Tiêu đề: ${article.tieu_de}, Quá hạn: ${article.minutes_overdue} phút`);
      });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái bài viết:', error);
  }
};

/**
 * Khởi động scheduler để tự động cập nhật trạng thái bài viết
 * Chạy mỗi phút để kiểm tra và cập nhật bài viết đến giờ hẹn
 */
export const startBaiVietScheduler = () => {
  // Chạy ngay lập tức khi khởi động
  updateBaiVietStatus();
  
  // Sau đó chạy mỗi phút
  setInterval(() => {
    updateBaiVietStatus();
  }, 60000); // 60000ms = 1 phút

  console.log('✅ Bài viết scheduler đã khởi động (chạy mỗi phút)');
};

