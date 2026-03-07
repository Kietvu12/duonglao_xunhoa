import pool from '../config/database.js';
import { createNotificationForAdmins, createNotificationForDieuDuong } from '../services/notificationService.js';
import { evaluateChiSo } from '../utils/chiSoEvaluator.js';

/**
 * Helper function để xác định mức độ của tâm thu hoặc tâm trương
 * @param {number} giaTri - Giá trị tâm thu hoặc tâm trương
 * @param {object} gioiHan - Cấu hình giới hạn từ database
 * @param {string} loai - 'tam_thu' hoặc 'tam_truong'
 * @returns {string} - 'binh_thuong', 'canh_bao', hoặc 'nguy_hiem'
 */
function xacDinhMucDoHuyetAp(giaTri, gioiHan, loai) {
  const minKey = loai === 'tam_thu' ? 'tam_thu_min' : 'tam_truong_min';
  const maxKey = loai === 'tam_thu' ? 'tam_thu_max' : 'tam_truong_max';
  
  // Kiểm tra Thấp
  if (gioiHan.thap && 
      gioiHan.thap[minKey] !== undefined && gioiHan.thap[maxKey] !== undefined) {
    if (giaTri >= gioiHan.thap[minKey] && giaTri <= gioiHan.thap[maxKey]) {
      return 'canh_bao'; // Thấp = cảnh báo
    }
  }
  
  // Kiểm tra Bình thường
  if (gioiHan.binh_thuong && 
      gioiHan.binh_thuong[minKey] !== undefined && gioiHan.binh_thuong[maxKey] !== undefined) {
    if (giaTri >= gioiHan.binh_thuong[minKey] && giaTri <= gioiHan.binh_thuong[maxKey]) {
      return 'binh_thuong';
    }
  }
  
  // Kiểm tra Cao
  if (gioiHan.cao && 
      gioiHan.cao[minKey] !== undefined && gioiHan.cao[maxKey] !== undefined) {
    if (giaTri >= gioiHan.cao[minKey] && giaTri <= gioiHan.cao[maxKey]) {
      return 'canh_bao'; // Cao = cảnh báo
    }
  }
  
  // Nếu không thuộc bất kỳ khoảng nào → Nguy hiểm
  return 'nguy_hiem';
}

/**
 * API endpoint để app khác trigger notification khi có chỉ số sức khỏe cảnh báo
 * Endpoint này có thể được gọi từ app khác khi họ insert/update chỉ số vào database
 */
export const notifyHealthIndicator = async (req, res, next) => {
  try {
    console.log('📥 [ExternalNotification] Received health indicator notification:', JSON.stringify(req.body, null, 2));
    
    const { 
      loai_chi_so, // 'huyet_ap', 'nhip_tim', 'duong_huyet', 'spo2', 'nhiet_do'
      id_benh_nhan,
      gia_tri, // Giá trị chỉ số (object cho huyết áp {tam_thu, tam_truong}, number cho các loại khác)
      id_cau_hinh_chi_so_canh_bao, // Optional
      muc_do, // Optional, nếu không có sẽ tự đánh giá
      noi_dung_canh_bao, // Optional
      record_id // ID của record vừa được tạo trong database
    } = req.body;

    // Validate
    if (!loai_chi_so || !id_benh_nhan) {
      console.error('❌ [ExternalNotification] Missing required fields:', { loai_chi_so, id_benh_nhan });
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: loai_chi_so, id_benh_nhan'
      });
    }

    // Lấy thông tin bệnh nhân
    const [benhNhans] = await pool.execute(
      'SELECT ho_ten FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id_benh_nhan]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    const tenBenhNhan = benhNhans[0].ho_ten;

    // Map loại chỉ số sang tên hiển thị
    const tenChiSoMap = {
      'huyet_ap': 'Huyết áp',
      'nhip_tim': 'Nhịp tim',
      'duong_huyet': 'Đường huyết',
      'spo2': 'SpO2',
      'nhiet_do': 'Nhiệt độ'
    };

    const tenChiSo = tenChiSoMap[loai_chi_so] || loai_chi_so;

    // Đánh giá chỉ số nếu chưa có mức độ
    let finalMucDo = muc_do;
    let finalNoiDungCanhBao = noi_dung_canh_bao;
    let chiTietTamThu = null;
    let chiTietTamTruong = null;

    // Xử lý đặc biệt cho huyết áp: đánh giá tâm thu và tâm trương riêng biệt
    // LUÔN đánh giá chi tiết cho huyết áp, kể cả khi đã có muc_do từ request
    if (loai_chi_so === 'huyet_ap' && typeof gia_tri === 'object' && gia_tri.tam_thu && gia_tri.tam_truong) {
      try {
        // Đánh giá tổng thể (nếu chưa có)
        if (!finalMucDo) {
          const evaluation = await evaluateChiSo(
            tenChiSo, 
            gia_tri, 
            id_cau_hinh_chi_so_canh_bao || null
          );
          
          if (evaluation) {
            finalMucDo = evaluation.muc_do;
            finalNoiDungCanhBao = evaluation.noi_dung_canh_bao || finalNoiDungCanhBao;
          }
        }
        
        // LUÔN đánh giá riêng tâm thu và tâm trương để có thông tin chi tiết
        // Lấy cấu hình huyết áp
        const [configs] = await pool.execute(
          'SELECT * FROM cau_hinh_chi_so_canh_bao WHERE ten_chi_so = ? ORDER BY ngay_tao DESC LIMIT 1',
          ['Huyết áp']
        );
        
        if (configs.length > 0) {
          const cauHinh = configs[0];
          let gioiHan;
          try {
            gioiHan = typeof cauHinh.gioi_han_canh_bao === 'string' 
              ? JSON.parse(cauHinh.gioi_han_canh_bao) 
              : cauHinh.gioi_han_canh_bao;
            
            // Đánh giá tâm thu riêng
            chiTietTamThu = xacDinhMucDoHuyetAp(gia_tri.tam_thu, gioiHan, 'tam_thu');
            // Đánh giá tâm trương riêng
            chiTietTamTruong = xacDinhMucDoHuyetAp(gia_tri.tam_truong, gioiHan, 'tam_truong');
            
            console.log('🔍 [ExternalNotification] Huyet Ap details:', {
              tam_thu: { gia_tri: gia_tri.tam_thu, muc_do: chiTietTamThu },
              tam_truong: { gia_tri: gia_tri.tam_truong, muc_do: chiTietTamTruong },
              final_muc_do: finalMucDo
            });
          } catch (parseErr) {
            console.error('❌ [ExternalNotification] Error parsing gioi_han_canh_bao:', parseErr);
          }
        }
      } catch (err) {
        console.error('❌ [ExternalNotification] Error evaluating huyet ap:', err);
      }
    } else if (!finalMucDo && gia_tri !== undefined && gia_tri !== null) {
      // Đánh giá cho các chỉ số khác
      try {
        const evaluation = await evaluateChiSo(
          tenChiSo, 
          gia_tri, 
          id_cau_hinh_chi_so_canh_bao || null
        );
        
        if (evaluation) {
          finalMucDo = evaluation.muc_do;
          finalNoiDungCanhBao = evaluation.noi_dung_canh_bao || finalNoiDungCanhBao;
        }
      } catch (err) {
        console.error('❌ [ExternalNotification] Error evaluating chi so:', err);
      }
    }

    // Chỉ gửi thông báo nếu mức độ là cảnh báo hoặc nguy hiểm
    console.log('🔍 [ExternalNotification] Final evaluation:', { finalMucDo, finalNoiDungCanhBao });
    
    if (finalMucDo === 'canh_bao' || finalMucDo === 'nguy_hiem') {
      console.log('📢 [ExternalNotification] Sending notification for warning/danger level');
      
      // Format giá trị để hiển thị
      let giaTriHienThi = '';
      if (loai_chi_so === 'huyet_ap' && typeof gia_tri === 'object') {
        giaTriHienThi = `${gia_tri.tam_thu}/${gia_tri.tam_truong} mmHg`;
      } else if (typeof gia_tri === 'number') {
        giaTriHienThi = gia_tri.toString();
        // Thêm đơn vị
        if (loai_chi_so === 'nhip_tim') giaTriHienThi += ' bpm';
        else if (loai_chi_so === 'duong_huyet') giaTriHienThi += ' mmol/L';
        else if (loai_chi_so === 'spo2') giaTriHienThi += ' %';
        else if (loai_chi_so === 'nhiet_do') giaTriHienThi += ' °C';
      } else {
        giaTriHienThi = JSON.stringify(gia_tri);
      }

      const loaiThongBao = finalMucDo === 'nguy_hiem' ? 'canh_bao' : 'canh_bao';
      
      // Tiêu đề có tên bệnh nhân để dễ nhận biết
      const tieuDe = finalMucDo === 'nguy_hiem' 
        ? `🚨 Cảnh báo nguy hiểm: ${tenChiSo} - ${tenBenhNhan}`
        : `⚠️ Cảnh báo: ${tenChiSo} - ${tenBenhNhan}`;

      // Đảm bảo tên bệnh nhân luôn có trong nội dung
      let noiDung = '';
      
      // Xử lý đặc biệt cho huyết áp: luôn hiển thị chi tiết tâm thu và tâm trương
      if (loai_chi_so === 'huyet_ap' && typeof gia_tri === 'object' && gia_tri.tam_thu && gia_tri.tam_truong) {
        const getMucDoText = (mucDo) => {
          switch(mucDo) {
            case 'nguy_hiem': return 'nguy hiểm';
            case 'canh_bao': return 'cảnh báo';
            case 'binh_thuong': return 'bình thường';
            default: return mucDo || 'chưa đánh giá';
          }
        };
        
        // Nếu có đánh giá chi tiết từng phần, sử dụng nó
        // Nếu không, đánh giá đơn giản dựa trên giá trị
        let tamThuMucDo = chiTietTamThu;
        let tamTruongMucDo = chiTietTamTruong;
        
        // Nếu không có đánh giá chi tiết, đánh giá đơn giản dựa trên giá trị
        if (!tamThuMucDo || !tamTruongMucDo) {
          // Đánh giá đơn giản: tâm thu
          if (gia_tri.tam_thu >= 180 || gia_tri.tam_thu < 90) {
            tamThuMucDo = 'nguy_hiem';
          } else if (gia_tri.tam_thu >= 140 || gia_tri.tam_thu < 100) {
            tamThuMucDo = 'canh_bao';
          } else {
            tamThuMucDo = 'binh_thuong';
          }
          
          // Đánh giá đơn giản: tâm trương
          if (gia_tri.tam_truong >= 120 || gia_tri.tam_truong < 60) {
            tamTruongMucDo = 'nguy_hiem';
          } else if (gia_tri.tam_truong >= 90 || gia_tri.tam_truong < 70) {
            tamTruongMucDo = 'canh_bao';
          } else {
            tamTruongMucDo = 'binh_thuong';
          }
        }
        
        const tamThuText = getMucDoText(tamThuMucDo);
        const tamTruongText = getMucDoText(tamTruongMucDo);
        
        // Kiểm tra xem có khác mức độ không
        const khacMucDo = tamThuMucDo !== tamTruongMucDo;
        
        // Luôn hiển thị chi tiết tâm thu và tâm trương
        if (khacMucDo) {
          // Tạo thông báo chi tiết khi tâm thu và tâm trương khác mức độ
          noiDung = `Bệnh nhân "${tenBenhNhan}" có huyết áp bất thường (${giaTriHienThi}): `;
          noiDung += `Tâm thu ${gia_tri.tam_thu} mmHg (${tamThuText}), `;
          noiDung += `Tâm trương ${gia_tri.tam_truong} mmHg (${tamTruongText}). `;
          
          // Thêm cảnh báo chi tiết nếu có
          if (finalNoiDungCanhBao && !finalNoiDungCanhBao.includes('Tâm thu') && !finalNoiDungCanhBao.includes('Tâm trương')) {
            noiDung += finalNoiDungCanhBao;
          } else if (!finalNoiDungCanhBao) {
            noiDung += finalMucDo === 'nguy_hiem' ? 'Cần can thiệp ngay!' : 'Cần theo dõi chặt chẽ.';
          }
        } else {
          // Cùng mức độ, nhưng vẫn hiển thị chi tiết để rõ ràng
          noiDung = `Bệnh nhân "${tenBenhNhan}" có huyết áp bất thường (${giaTriHienThi}): `;
          noiDung += `Tâm thu ${gia_tri.tam_thu} mmHg và Tâm trương ${gia_tri.tam_truong} mmHg đều ở mức ${tamThuText}. `;
          if (finalNoiDungCanhBao) {
            noiDung += finalNoiDungCanhBao;
          } else {
            noiDung += finalMucDo === 'nguy_hiem' ? 'Cần can thiệp ngay!' : 'Cần theo dõi.';
          }
        }
      } else if (finalNoiDungCanhBao) {
        // Nếu có nội dung cảnh báo từ evaluation, thêm tên bệnh nhân vào đầu
        noiDung = `Bệnh nhân "${tenBenhNhan}": ${finalNoiDungCanhBao}`;
        // Nếu chưa có giá trị trong nội dung, thêm vào
        if (!finalNoiDungCanhBao.includes(giaTriHienThi)) {
          noiDung += ` (${giaTriHienThi})`;
        }
      } else {
        // Nếu không có nội dung từ evaluation, tạo nội dung mới
        noiDung = `Bệnh nhân "${tenBenhNhan}" có chỉ số ${tenChiSo} bất thường (${giaTriHienThi}). ${finalMucDo === 'nguy_hiem' ? 'Cần can thiệp ngay!' : 'Cần theo dõi.'}`;
      }

      console.log('📤 [ExternalNotification] Creating notifications:', { tieuDe, noiDung, link: `/admin/benh-nhan/${id_benh_nhan}` });

      // Gửi thông báo cho admin và điều dưỡng - ĐỢI hoàn thành để đảm bảo lưu vào DB
      try {
        const adminNotifications = await createNotificationForAdmins({
          loai: loaiThongBao,
          tieu_de: tieuDe,
          noi_dung: noiDung,
          link: `/admin/benh-nhan/${id_benh_nhan}`
        });
        console.log('✅ [ExternalNotification] Admin notifications created:', adminNotifications.length);

        const dieuDuongNotifications = await createNotificationForDieuDuong({
          loai: loaiThongBao,
          tieu_de: tieuDe,
          noi_dung: noiDung,
          link: `/admin/benh-nhan/${id_benh_nhan}`
        });
        console.log('✅ [ExternalNotification] Dieu duong notifications created:', dieuDuongNotifications.length);

        const totalNotifications = adminNotifications.length + dieuDuongNotifications.length;
        console.log(`✅ [ExternalNotification] Total notifications created: ${totalNotifications}`);

        if (totalNotifications === 0) {
          console.warn('⚠️ [ExternalNotification] No notifications were created. Check if there are active admins/dieu duong in database.');
        }

        return res.json({
          success: true,
          message: 'Đã gửi thông báo cảnh báo',
          data: {
            muc_do: finalMucDo,
            noi_dung_canh_bao: finalNoiDungCanhBao,
            notifications_created: totalNotifications
          }
        });
      } catch (notificationError) {
        console.error('❌ [ExternalNotification] Error creating notifications:', notificationError);
        console.error('❌ [ExternalNotification] Error stack:', notificationError.stack);
        // Vẫn trả về success nhưng log lỗi để debug
        return res.json({
          success: true,
          message: 'Đã nhận yêu cầu nhưng có lỗi khi tạo thông báo',
          data: {
            muc_do: finalMucDo,
            noi_dung_canh_bao: finalNoiDungCanhBao,
            error: process.env.NODE_ENV === 'development' ? notificationError.message : undefined
          }
        });
      }
    } else {
      // Không gửi thông báo nếu mức độ bình thường
      console.log('ℹ️ [ExternalNotification] Normal level, no notification needed. muc_do:', finalMucDo);
      return res.json({
        success: true,
        message: 'Chỉ số bình thường, không cần gửi thông báo',
        data: {
          muc_do: finalMucDo || 'binh_thuong'
        }
      });
    }
  } catch (error) {
    console.error('Error in notifyHealthIndicator:', error);
    next(error);
  }
};

/**
 * API endpoint để app khác trigger notification khi có triệu chứng mới
 */
export const notifySymptom = async (req, res, next) => {
  try {
    console.log('📥 [ExternalNotification] Received symptom notification:', JSON.stringify(req.body, null, 2));
    
    const { 
      id_benh_nhan,
      id_trieu_chung,
      ten_trieu_chung, // Optional, nếu không có sẽ query từ database
      ngay_gio_xay_ra,
      record_id // ID của record vừa được tạo
    } = req.body;

    // Validate
    if (!id_benh_nhan || !id_trieu_chung) {
      console.error('❌ [ExternalNotification] Missing required fields:', { id_benh_nhan, id_trieu_chung });
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: id_benh_nhan, id_trieu_chung'
      });
    }

    // Lấy thông tin bệnh nhân
    const [benhNhans] = await pool.execute(
      'SELECT ho_ten FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id_benh_nhan]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    const tenBenhNhan = benhNhans[0].ho_ten;

    // Lấy tên triệu chứng nếu chưa có
    let tenTrieuChung = ten_trieu_chung;
    if (!tenTrieuChung) {
      const [trieuChungs] = await pool.execute(
        'SELECT ten_trieu_chung FROM danh_sach_trieu_chung WHERE id = ?',
        [id_trieu_chung]
      );
      if (trieuChungs.length > 0) {
        tenTrieuChung = trieuChungs[0].ten_trieu_chung;
      } else {
        tenTrieuChung = 'Triệu chứng';
      }
    }

    // Format ngày giờ
    let ngayGioHienThi = '';
    if (ngay_gio_xay_ra) {
      try {
        const date = new Date(ngay_gio_xay_ra);
        ngayGioHienThi = date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (err) {
        ngayGioHienThi = ngay_gio_xay_ra;
      }
    }

    // Gửi thông báo cho admin và điều dưỡng
    const noiDung = `Bệnh nhân "${tenBenhNhan}" có triệu chứng "${tenTrieuChung}"${ngayGioHienThi ? ` vào ${ngayGioHienThi}` : ''}. Cần theo dõi.`;

    console.log('📤 [ExternalNotification] Creating symptom notifications:', { noiDung, link: `/admin/benh-nhan/${id_benh_nhan}` });

    // ĐỢI hoàn thành để đảm bảo lưu vào DB
    try {
      const adminNotifications = await createNotificationForAdmins({
        loai: 'canh_bao',
        tieu_de: 'Triệu chứng mới',
        noi_dung: noiDung,
        link: `/admin/benh-nhan/${id_benh_nhan}`
      });
      console.log('✅ [ExternalNotification] Admin notifications created:', adminNotifications.length);

      const dieuDuongNotifications = await createNotificationForDieuDuong({
        loai: 'canh_bao',
        tieu_de: 'Triệu chứng mới',
        noi_dung: noiDung,
        link: `/admin/benh-nhan/${id_benh_nhan}`
      });
      console.log('✅ [ExternalNotification] Dieu duong notifications created:', dieuDuongNotifications.length);

      const totalNotifications = adminNotifications.length + dieuDuongNotifications.length;
      console.log(`✅ [ExternalNotification] Total symptom notifications created: ${totalNotifications}`);

      if (totalNotifications === 0) {
        console.warn('⚠️ [ExternalNotification] No symptom notifications were created. Check if there are active admins/dieu duong in database.');
      }

      return res.json({
        success: true,
        message: 'Đã gửi thông báo triệu chứng',
        data: {
          notifications_created: totalNotifications
        }
      });
    } catch (notificationError) {
      console.error('❌ [ExternalNotification] Error creating symptom notifications:', notificationError);
      console.error('❌ [ExternalNotification] Error stack:', notificationError.stack);
      // Vẫn trả về success nhưng log lỗi để debug
      return res.json({
        success: true,
        message: 'Đã nhận yêu cầu nhưng có lỗi khi tạo thông báo triệu chứng',
        error: process.env.NODE_ENV === 'development' ? notificationError.message : undefined
      });
    }
  } catch (error) {
    console.error('Error in notifySymptom:', error);
    next(error);
  }
};

