import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR || './uploads';

/**
 * Xóa các file media cũ hơn 3 ngày
 */
export async function cleanupOldMedia() {
  try {
    // Lấy tất cả media có duong_dan_anh và ngày_gui cũ hơn 3 ngày
    const [oldMedias] = await pool.execute(
      `SELECT id, duong_dan_anh 
       FROM media_ca_nhan_benh_nhan 
       WHERE duong_dan_anh IS NOT NULL 
       AND duong_dan_anh != ''
       AND DATE(ngay_gui) < DATE_SUB(CURDATE(), INTERVAL 3 DAY)`
    );

    let deletedCount = 0;
    let errorCount = 0;

    for (const media of oldMedias) {
      try {
        // Extract filename from URL
        const url = media.duong_dan_anh;
        let filename = '';
        
        if (url.includes('/uploads/')) {
          filename = url.split('/uploads/')[1];
        } else if (url.includes('uploads/')) {
          filename = url.split('uploads/')[1];
        } else {
          // Nếu không có /uploads/, lấy phần cuối của URL
          filename = url.split('/').pop();
        }

        if (filename) {
          const filePath = path.join(__dirname, '..', uploadDir, filename);
          
          // Xóa file nếu tồn tại
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Đã xóa file: ${filename}`);
          }
        }

        // Xóa record trong database
        await pool.execute(
          'DELETE FROM media_ca_nhan_benh_nhan WHERE id = ?',
          [media.id]
        );

        deletedCount++;
      } catch (error) {
        console.error(`Lỗi khi xóa media ID ${media.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Cleanup hoàn tất: Đã xóa ${deletedCount} media, ${errorCount} lỗi`);
    return { deletedCount, errorCount };
  } catch (error) {
    console.error('Lỗi trong cleanupOldMedia:', error);
    throw error;
  }
}

/**
 * Khởi động scheduler để chạy cleanup mỗi ngày lúc 2:00 AM
 */
export function startMediaCleanupScheduler() {
  // Chạy ngay lần đầu
  cleanupOldMedia().catch(console.error);

  // Tính thời gian đến 2:00 AM tiếp theo
  const getNextRunTime = () => {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(2, 0, 0, 0);
    
    // Nếu đã qua 2:00 AM hôm nay, chạy vào 2:00 AM ngày mai
    if (now >= nextRun) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.getTime() - now.getTime();
  };

  // Chạy cleanup vào 2:00 AM mỗi ngày
  const scheduleNextRun = () => {
    const delay = getNextRunTime();
    setTimeout(() => {
      cleanupOldMedia().catch(console.error);
      // Lên lịch cho lần tiếp theo
      scheduleNextRun();
    }, delay);
  };

  scheduleNextRun();

  console.log('Media cleanup scheduler đã khởi động - sẽ chạy mỗi ngày lúc 2:00 AM');
}

