import pool from '../config/database.js';
import { getSocketIO } from '../config/socket.js';

/**
 * Tạo thông báo và lưu vào database
 * @param {Object} notificationData - Dữ liệu thông báo
 * @param {number|null} notificationData.id_nguoi_nhan - ID người nhận (null = tất cả)
 * @param {number|null} notificationData.id_benh_nhan - ID bệnh nhân liên quan (null = không liên quan)
 * @param {string} notificationData.loai - Loại thông báo: 'cong_viec', 'canh_bao', 'tin_nhan', 'su_kien', 'he_thong'
 * @param {string} notificationData.tieu_de - Tiêu đề
 * @param {string|null} notificationData.noi_dung - Nội dung
 * @param {string|null} notificationData.link - Link liên kết
 * @returns {Promise<Object>} - Thông báo đã tạo
 */
export async function createNotification(notificationData) {
  try {
    const { id_nguoi_nhan, id_benh_nhan, loai, tieu_de, noi_dung, link } = notificationData;

    console.log('📬 Creating notification:', { id_nguoi_nhan, id_benh_nhan, loai, tieu_de, noi_dung: noi_dung?.substring(0, 50) + '...' });

    // Validate dữ liệu
    if (!loai || !tieu_de) {
      throw new Error('Missing required fields: loai and tieu_de are required');
    }

    // Lưu vào database
    const [result] = await pool.execute(
      `INSERT INTO thong_bao (id_nguoi_nhan, id_benh_nhan, loai, tieu_de, noi_dung, link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_nguoi_nhan || null, id_benh_nhan || null, loai, tieu_de, noi_dung || null, link || null]
    );

    if (!result || !result.insertId) {
      throw new Error('Failed to insert notification into database');
    }

    const notification = {
      id: result.insertId,
      id_nguoi_nhan: id_nguoi_nhan || null,
      id_benh_nhan: id_benh_nhan || null,
      loai,
      tieu_de,
      noi_dung: noi_dung || null,
      link: link || null,
      da_doc: false,
      ngay_tao: new Date()
    };

    console.log('✅ Notification saved to DB with ID:', notification.id);

    // Gửi thông báo real-time qua WebSocket
    const io = getSocketIO();
    if (io) {
      if (id_nguoi_nhan) {
        // Gửi cho người nhận cụ thể
        io.to(`user_${id_nguoi_nhan}`).emit('notification', notification);
        console.log(`📤 Sent notification to user_${id_nguoi_nhan}`);
      } else {
        // Gửi cho tất cả người dùng
        io.emit('notification', notification);
        console.log('📤 Sent notification to all users');
      }
    } else {
      console.warn('⚠️ Socket.IO not initialized, notification not sent via WebSocket');
    }

    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

/**
 * Gửi thông báo cho nhiều người nhận
 * @param {Array<number>} userIds - Danh sách ID người nhận
 * @param {Object} notificationData - Dữ liệu thông báo
 */
export async function createNotificationsForUsers(userIds, notificationData) {
  try {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await createNotification({
        ...notificationData,
        id_nguoi_nhan: userId
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error creating notifications for users:', error);
    throw error;
  }
}

/**
 * Gửi thông báo cho tất cả admin/quản lý
 */
export async function createNotificationForAdmins(notificationData) {
  try {
    console.log('🔔 Creating notification for admins:', notificationData.tieu_de);
    
    // Lấy danh sách admin và quản lý - bao gồm cả super_admin
    const [admins] = await pool.execute(
      `SELECT id, vai_tro, ho_ten FROM tai_khoan 
       WHERE vai_tro IN ('super_admin', 'admin', 'quan_ly_y_te', 'quan_ly_nhan_su') 
       AND da_xoa = 0 AND trang_thai = 'active'`
    );

    console.log(`👥 Found ${admins.length} admins:`, admins.map(a => ({ id: a.id, vai_tro: a.vai_tro, ho_ten: a.ho_ten })));
    
    if (admins.length === 0) {
      console.warn('⚠️ No active admins found, notification not sent');
      console.warn('⚠️ Check database: SELECT * FROM tai_khoan WHERE vai_tro IN (\'super_admin\', \'admin\', \'quan_ly_y_te\', \'quan_ly_nhan_su\') AND da_xoa = 0 AND trang_thai = \'active\'');
      return [];
    }

    const userIds = admins.map(admin => admin.id);
    console.log(`📝 Creating notifications for user IDs:`, userIds);
    
    const result = await createNotificationsForUsers(userIds, notificationData);
    console.log(`✅ Sent ${result.length} notifications to admins`);
    return result;
  } catch (error) {
    console.error('❌ Error creating notification for admins:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
}

/**
 * Gửi thông báo cho tất cả điều dưỡng
 */
export async function createNotificationForDieuDuong(notificationData) {
  try {
    console.log('🔔 Creating notification for dieu duong:', notificationData.tieu_de);
    
    const [dieuDuongs] = await pool.execute(
      `SELECT id, vai_tro, ho_ten FROM tai_khoan 
       WHERE vai_tro IN ('dieu_duong', 'dieu_duong_truong') 
       AND da_xoa = 0 AND trang_thai = 'active'`
    );

    console.log(`👥 Found ${dieuDuongs.length} dieu duong:`, dieuDuongs.map(dd => ({ id: dd.id, vai_tro: dd.vai_tro, ho_ten: dd.ho_ten })));
    
    if (dieuDuongs.length === 0) {
      console.warn('⚠️ No active dieu duong found, notification not sent');
      console.warn('⚠️ Check database: SELECT * FROM tai_khoan WHERE vai_tro IN (\'dieu_duong\', \'dieu_duong_truong\') AND da_xoa = 0 AND trang_thai = \'active\'');
      return [];
    }

    const userIds = dieuDuongs.map(dd => dd.id);
    console.log(`📝 Creating notifications for user IDs:`, userIds);
    
    const result = await createNotificationsForUsers(userIds, notificationData);
    console.log(`✅ Sent ${result.length} notifications to dieu duong`);
    return result;
  } catch (error) {
    console.error('❌ Error creating notification for dieu duong:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
}

/**
 * Gửi thông báo cho admin, quản lý và marketing
 */
export async function createNotificationForAdminsAndMarketing(notificationData) {
  try {
    console.log('🔔 Creating notification for admins and marketing:', notificationData.tieu_de);
    
    // Lấy danh sách admin, quản lý và marketing
    const [users] = await pool.execute(
      `SELECT id FROM tai_khoan 
       WHERE vai_tro IN ('super_admin', 'admin', 'quan_ly_y_te', 'quan_ly_nhan_su', 'marketing') 
       AND da_xoa = 0 AND trang_thai = 'active'`
    );

    console.log(`👥 Found ${users.length} admins and marketing users`);
    
    if (users.length === 0) {
      console.warn('⚠️ No active admins/marketing found, notification not sent');
      return [];
    }

    const userIds = users.map(user => user.id);
    const result = await createNotificationsForUsers(userIds, notificationData);
    console.log(`✅ Sent ${result.length} notifications to admins and marketing`);
    return result;
  } catch (error) {
    console.error('❌ Error creating notification for admins and marketing:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

