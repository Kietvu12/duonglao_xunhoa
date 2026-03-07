import { useEffect, useState } from 'react';
import { suKienAPI, uploadAPI, benhNhanAPI, nhanVienAPI, nguoiThanAPI } from '../../services/api';

export default function SuKienPage() {
  const [suKiens, setSuKiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTab, setDetailTab] = useState('info'); // 'info', 'participants', 'assignments'
  const [editing, setEditing] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    ngay: '',
    dia_diem: '',
    loai: 'sinh_hoat',
    ngan_sach: '',
    anh_dai_dien: '',
    video: '',
    trang_thai: 'sap_dien_ra',
  });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Quản lý người tham gia
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participantForm, setParticipantForm] = useState({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
  const [benhNhans, setBenhNhans] = useState([]);
  const [nguoiThans, setNguoiThans] = useState([]);
  
  // Quản lý phân công
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ id_nhan_vien: '', vai_tro: '' });
  const [nhanViens, setNhanViens] = useState([]);

  useEffect(() => {
    loadSuKiens();
  }, []);

  const loadSuKiens = async () => {
    try {
      setLoading(true);
      const response = await suKienAPI.getAll();
      setSuKiens(response.data || []);
    } catch (error) {
      console.error('Error loading su kiens:', error);
      alert('Lỗi khi tải danh sách sự kiện: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        // Ensure loai is always set
        loai: (formData && formData.loai) || 'sinh_hoat',
        // Ensure anh_dai_dien and video are sent (even if empty string, convert to null)
        anh_dai_dien: (formData && formData.anh_dai_dien) || null,
        video: (formData && formData.video) || null,
      };

      if (editing) {
        await suKienAPI.update(editing.id, submitData);
        alert('Cập nhật sự kiện thành công');
      } else {
        await suKienAPI.create(submitData);
        alert('Tạo sự kiện thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadSuKiens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (sk) => {
    try {
      // Load full event data
      const fullEvent = await suKienAPI.getById(sk.id);
      const eventData = fullEvent.data;
      
      setEditing(eventData);
      setFormData({
        tieu_de: eventData.tieu_de || '',
        mo_ta: eventData.mo_ta || '',
        ngay: formatDateTimeForInput(eventData.ngay),
        dia_diem: eventData.dia_diem || '',
        loai: eventData.loai || 'sinh_hoat',
        ngan_sach: eventData.ngan_sach || '',
        anh_dai_dien: eventData.anh_dai_dien || '',
        video: eventData.video || '',
        trang_thai: eventData.trang_thai || 'sap_dien_ra',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error loading event:', error);
      alert('Lỗi khi tải dữ liệu sự kiện: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
    try {
      await suKienAPI.delete(id);
      alert('Xóa sự kiện thành công');
      loadSuKiens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      tieu_de: '',
      mo_ta: '',
      ngay: '',
      dia_diem: '',
      loai: 'sinh_hoat',
      ngan_sach: '',
      anh_dai_dien: '',
      video: '',
      trang_thai: 'sap_dien_ra',
    });
  };

  // Xem chi tiết sự kiện
  const handleViewDetail = async (sk) => {
    try {
      const fullEvent = await suKienAPI.getById(sk.id);
      setCurrentEvent(fullEvent.data);
      setShowDetailModal(true);
      setDetailTab('info');
      await loadParticipants(sk.id);
      await loadAssignments(sk.id);
    } catch (error) {
      console.error('Error loading event detail:', error);
      alert('Lỗi khi tải chi tiết sự kiện: ' + error.message);
    }
  };

  // Load danh sách người tham gia
  const loadParticipants = async (eventId) => {
    try {
      setLoadingParticipants(true);
      const response = await suKienAPI.getNguoiThamGia(eventId);
      setParticipants(response.data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
      alert('Lỗi khi tải danh sách người tham gia: ' + error.message);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Load danh sách phân công
  const loadAssignments = async (eventId) => {
    try {
      setLoadingAssignments(true);
      const response = await suKienAPI.getPhanCong(eventId);
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      alert('Lỗi khi tải danh sách phân công: ' + error.message);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Load danh sách bệnh nhân và người thân
  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll({ limit: -1 });
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const loadNguoiThans = async (benhNhanId) => {
    try {
      if (benhNhanId) {
        const response = await nguoiThanAPI.getAll({ id_benh_nhan: benhNhanId, limit: 1000 });
        setNguoiThans(response.data || []);
      } else {
        setNguoiThans([]);
      }
    } catch (error) {
      console.error('Error loading nguoi thans:', error);
    }
  };

  // Load danh sách nhân viên
  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll({ limit: -1 });
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
    }
  };

  // Thêm người tham gia
  const handleAddParticipant = async () => {
    if (!currentEvent) return;
    
    try {
      const data = {
        id_benh_nhan: participantForm.loai === 'benh_nhan' ? participantForm.id_benh_nhan : null,
        id_nguoi_than: participantForm.loai === 'nguoi_than' ? participantForm.id_nguoi_than : null,
      };
      
      await suKienAPI.addNguoiThamGia(currentEvent.id, data);
      alert('Thêm người tham gia thành công');
      setShowAddParticipant(false);
      setParticipantForm({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xóa người tham gia
  const handleRemoveParticipant = async (participantId) => {
    if (!currentEvent) return;
    if (!confirm('Bạn có chắc muốn xóa người tham gia này?')) return;
    
    try {
      await suKienAPI.removeNguoiThamGia(currentEvent.id, participantId);
      alert('Xóa người tham gia thành công');
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xác nhận tham gia
  const handleXacNhanThamGia = async (participantId, xacNhan) => {
    if (!currentEvent) return;
    
    try {
      await suKienAPI.xacNhanThamGia(currentEvent.id, participantId, xacNhan);
      await loadParticipants(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Thêm phân công
  const handleAddAssignment = async () => {
    if (!currentEvent) return;
    
    try {
      await suKienAPI.phanCongNhanVien(currentEvent.id, assignmentForm);
      alert('Phân công nhân viên thành công');
      setShowAddAssignment(false);
      setAssignmentForm({ id_nhan_vien: '', vai_tro: '' });
      await loadAssignments(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Xóa phân công
  const handleRemoveAssignment = async (assignmentId) => {
    if (!currentEvent) return;
    if (!confirm('Bạn có chắc muốn xóa phân công này?')) return;
    
    try {
      await suKienAPI.removePhanCong(currentEvent.id, assignmentId);
      alert('Xóa phân công thành công');
      await loadAssignments(currentEvent.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Load data khi mở modal thêm người tham gia
  useEffect(() => {
    if (showAddParticipant) {
      loadBenhNhans();
    }
  }, [showAddParticipant]);

  useEffect(() => {
    if (participantForm.loai === 'nguoi_than' && participantForm.id_benh_nhan) {
      loadNguoiThans(participantForm.id_benh_nhan);
    } else {
      setNguoiThans([]);
    }
  }, [participantForm.loai, participantForm.id_benh_nhan]);

  useEffect(() => {
    if (showAddAssignment) {
      loadNhanViens();
    }
  }, [showAddAssignment]);

  // Hàm parse datetime string - lấy date và time trực tiếp, không convert timezone
  const parseDateTime = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Parse trực tiếp từ string, không qua Date object để tránh timezone conversion
      // Format có thể là: "2024-01-15T14:47:00" hoặc "2024-01-15T14:47:00.000Z" hoặc "2024-01-15 14:47:00"
      
      // Loại bỏ timezone nếu có (Z, +07:00, -05:00, etc.)
      let cleanString = dateString.trim();
      
      // Loại bỏ phần timezone (Z hoặc +HH:MM hoặc -HH:MM ở cuối)
      cleanString = cleanString.replace(/[Zz]$/, ''); // Loại bỏ Z
      cleanString = cleanString.replace(/[+-]\d{2}:\d{2}$/, ''); // Loại bỏ +07:00 hoặc -05:00
      
      // Tách phần date và time (có thể dùng T hoặc space)
      let datePart = '';
      let timePart = '';
      
      if (cleanString.includes('T')) {
        const parts = cleanString.split('T');
        datePart = parts[0];
        timePart = parts[1] || '';
      } else if (cleanString.includes(' ')) {
        const parts = cleanString.split(' ');
        datePart = parts[0];
        timePart = parts[1] || '';
      } else {
        // Chỉ có date, không có time
        datePart = cleanString;
      }
      
      // Parse date (format: YYYY-MM-DD)
      const dateParts = datePart.split('-');
      if (dateParts.length !== 3) return null;
      
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      // Parse time nếu có (format: HH:mm:ss hoặc HH:mm:ss.mmm)
      let hours = '00';
      let minutes = '00';
      
      if (timePart) {
        // Loại bỏ phần milliseconds nếu có
        const timeOnly = timePart.split('.')[0];
        const timeParts = timeOnly.split(':');
        
        if (timeParts.length >= 2) {
          hours = timeParts[0].padStart(2, '0');
          minutes = timeParts[1].padStart(2, '0');
        }
      }
      
      return { year, month, day, hours, minutes };
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  // Hàm format ngày giờ để hiển thị - parse trực tiếp từ string, không convert timezone
  const formatDateTime = (dateString) => {
    const parsed = parseDateTime(dateString);
    if (!parsed) return '-';
    
    // Format: DD/MM/YYYY HH:mm
    return `${parsed.day}/${parsed.month}/${parsed.year} ${parsed.hours}:${parsed.minutes}`;
  };

  // Hàm format datetime cho input datetime-local (YYYY-MM-DDTHH:mm)
  const formatDateTimeForInput = (dateString) => {
    const parsed = parseDateTime(dateString);
    if (!parsed) return '';
    
    // Format: YYYY-MM-DDTHH:mm
    return `${parsed.year}-${parsed.month}-${parsed.day}T${parsed.hours}:${parsed.minutes}`;
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Sự kiện</h1>
          <p className="text-gray-600 mt-2">Danh sách sự kiện và hoạt động</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span>Tạo sự kiện</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">Đang tải...</div>
        ) : suKiens.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>event</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có sự kiện nào</p>
            <p className="text-gray-400 text-sm">Bấm "Tạo sự kiện" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Địa điểm</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngân sách</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suKiens.map((sk) => (
                  <tr key={sk.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-900">{sk.tieu_de}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        sk.loai === 'y_te' ? 'bg-blue-100 text-blue-800' :
                        sk.loai === 'giai_tri' ? 'bg-purple-100 text-purple-800' :
                        sk.loai === 'sinh_hoat' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sk.loai === 'y_te' ? 'Y tế' :
                         sk.loai === 'giai_tri' ? 'Giải trí' :
                         sk.loai === 'sinh_hoat' ? 'Sinh hoạt' :
                         'Khác'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(sk.ngay)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-900">{sk.dia_diem || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {sk.ngan_sach ? parseInt(sk.ngan_sach).toLocaleString('vi-VN') + ' đ' : '-'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        sk.trang_thai === 'ket_thuc' ? 'bg-gray-100 text-gray-800' :
                        sk.trang_thai === 'dang_dien_ra' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sk.trang_thai?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(sk)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                          <span>Chi tiết</span>
                        </button>
                        <button
                          onClick={() => handleEdit(sk)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(sk.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa sự kiện' : 'Tạo sự kiện mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  resetForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tieu_de}
                  onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="4"
                  placeholder="Mô tả chi tiết về sự kiện..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày giờ *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.ngay}
                    onChange={(e) => setFormData({ ...formData, ngay: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại sự kiện
                  </label>
                  <select
                    value={formData.loai}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="y_te">Y tế</option>
                    <option value="giai_tri">Giải trí</option>
                    <option value="sinh_hoat">Sinh hoạt</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="sap_dien_ra">Sắp diễn ra</option>
                    <option value="dang_dien_ra">Đang diễn ra</option>
                    <option value="ket_thuc">Kết thúc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={formData.dia_diem}
                    onChange={(e) => setFormData({ ...formData, dia_diem: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập địa điểm..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngân sách (đ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ngan_sach}
                    onChange={(e) => setFormData({ ...formData, ngan_sach: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="0"
                  />
                </div>
              </div>
              
              {/* Ảnh đại diện */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="space-y-3">
                  {/* Upload ảnh */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                        if (!imageTypes.includes(file.type)) {
                          alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
                          return;
                        }

                        if (file.size > 20 * 1024 * 1024) {
                          alert('Kích thước file không được vượt quá 20MB');
                          return;
                        }

                        try {
                          setUploadingThumbnail(true);
                          const response = await uploadAPI.uploadMedia(file);
                          setFormData({ ...formData, anh_dai_dien: response.data.url });
                          e.target.value = ''; // Reset input
                        } catch (error) {
                          alert('Lỗi khi upload ảnh: ' + error.message);
                        } finally {
                          setUploadingThumbnail(false);
                        }
                      }}
                      disabled={uploadingThumbnail}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A90E2]/10 file:text-[#4A90E2] hover:file:bg-[#4A90E2]/20 disabled:opacity-50"
                    />
                    {uploadingThumbnail && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sync</span>
                        Đang tải ảnh lên...
                      </p>
                    )}
                  </div>
                  
                  {/* Preview ảnh đại diện */}
                  {formData.anh_dai_dien && (
                    <div className="mt-2">
                      <img
                        src={formData.anh_dai_dien}
                        alt="Ảnh đại diện"
                        className="max-w-xs h-auto rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, anh_dai_dien: '' })}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                        <span>Xóa ảnh đại diện</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Hoặc nhập URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc nhập URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.anh_dai_dien}
                    onChange={(e) => setFormData({ ...formData, anh_dai_dien: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Video */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video
                </label>
                <div className="space-y-3">
                  {/* Upload video */}
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm'];
                        if (!videoTypes.includes(file.type)) {
                          alert('Chỉ cho phép upload file video (mp4, mov, avi, wmv, flv, webm)');
                          return;
                        }

                        if (file.size > 50 * 1024 * 1024) {
                          alert('Kích thước file không được vượt quá 50MB');
                          return;
                        }

                        try {
                          setUploadingVideo(true);
                          const response = await uploadAPI.uploadMedia(file);
                          setFormData({ ...formData, video: response.data.url });
                          e.target.value = ''; // Reset input
                        } catch (error) {
                          alert('Lỗi khi upload video: ' + error.message);
                        } finally {
                          setUploadingVideo(false);
                        }
                      }}
                      disabled={uploadingVideo}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A90E2]/10 file:text-[#4A90E2] hover:file:bg-[#4A90E2]/20 disabled:opacity-50"
                    />
                    {uploadingVideo && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sync</span>
                        Đang tải video lên...
                      </p>
                    )}
                  </div>
                  
                  {/* Preview video */}
                  {formData.video && (
                    <div className="mt-2">
                      <video
                        src={formData.video}
                        controls
                        className="max-w-xs h-auto rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video: '' })}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                        <span>Xóa video</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Hoặc nhập URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc nhập URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>{editing ? 'Cập nhật' : 'Tạo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chi tiết sự kiện */}
      {showDetailModal && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">{currentEvent.tieu_de}</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setCurrentEvent(null);
                  setDetailTab('info');
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 bg-gray-50">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setDetailTab('info')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                    detailTab === 'info'
                      ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                      : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Thông tin
                </button>
                <button
                  onClick={() => setDetailTab('participants')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                    detailTab === 'participants'
                      ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                      : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Người tham gia ({participants.length})
                </button>
                <button
                  onClick={() => setDetailTab('assignments')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                    detailTab === 'assignments'
                      ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                      : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Phân công ({assignments.length})
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {detailTab === 'info' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Mô tả</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{currentEvent.mo_ta || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Ngày giờ</label>
                    <p className="text-gray-900 font-medium">
                      {formatDateTime(currentEvent.ngay)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Loại sự kiện</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        currentEvent.loai === 'y_te' ? 'bg-blue-100 text-blue-800' :
                        currentEvent.loai === 'giai_tri' ? 'bg-purple-100 text-purple-800' :
                        currentEvent.loai === 'sinh_hoat' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {currentEvent.loai === 'y_te' ? 'Y tế' :
                         currentEvent.loai === 'giai_tri' ? 'Giải trí' :
                         currentEvent.loai === 'sinh_hoat' ? 'Sinh hoạt' :
                         'Khác'}
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Địa điểm</label>
                    <p className="text-gray-900 font-medium">{currentEvent.dia_diem || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Ngân sách</label>
                    <p className="text-gray-900 font-bold text-[#4A90E2]">
                      {currentEvent.ngan_sach ? parseInt(currentEvent.ngan_sach).toLocaleString('vi-VN') + ' đ' : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Trạng thái</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        currentEvent.trang_thai === 'ket_thuc' ? 'bg-gray-100 text-gray-800' :
                        currentEvent.trang_thai === 'dang_dien_ra' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {currentEvent.trang_thai?.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </div>
                {currentEvent.anh_dai_dien && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện</label>
                    <img src={currentEvent.anh_dai_dien} alt="Ảnh đại diện" className="max-w-md rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
                {currentEvent.video && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Video</label>
                    <video src={currentEvent.video} controls className="max-w-md rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {detailTab === 'participants' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Danh sách người tham gia</h3>
                  <button
                    onClick={() => {
                      setShowAddParticipant(true);
                      loadBenhNhans();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                    <span>Thêm người tham gia</span>
                  </button>
                </div>

                {loadingParticipants ? (
                  <div className="p-12 text-center text-gray-500">Đang tải...</div>
                ) : participants.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
                    <p className="text-gray-500 text-lg mb-2">Chưa có người tham gia</p>
                    <p className="text-gray-400 text-sm">Bấm "Thêm người tham gia" để bắt đầu</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Loại</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Xác nhận</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {participants.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5 font-semibold text-gray-900">{p.ten_nguoi_tham_gia || '-'}</td>
                              <td className="px-6 py-5">
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#4A90E2]/20 text-[#4A90E2]">
                                  {p.loai === 'benh_nhan' ? 'Bệnh nhân' : 'Người thân'}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-sm text-gray-900">{p.so_dien_thoai || '-'}</td>
                              <td className="px-6 py-5">
                                <button
                                  onClick={() => handleXacNhanThamGia(p.id, !p.xac_nhan)}
                                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                    p.xac_nhan
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  {p.xac_nhan ? 'Đã xác nhận' : 'Chưa xác nhận'}
                                </button>
                              </td>
                              <td className="px-6 py-5">
                                <button
                                  onClick={() => handleRemoveParticipant(p.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                  <span>Xóa</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'assignments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Danh sách phân công</h3>
                  <button
                    onClick={() => {
                      setShowAddAssignment(true);
                      loadNhanViens();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                    <span>Phân công nhân viên</span>
                  </button>
                </div>

                {loadingAssignments ? (
                  <div className="p-12 text-center text-gray-500">Đang tải...</div>
                ) : assignments.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>assignment</span>
                    <p className="text-gray-500 text-lg mb-2">Chưa có phân công</p>
                    <p className="text-gray-400 text-sm">Bấm "Phân công nhân viên" để bắt đầu</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhân viên</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assignments.map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5 font-semibold text-gray-900">{a.ho_ten || '-'}</td>
                              <td className="px-6 py-5 text-sm text-gray-900">{a.vai_tro || '-'}</td>
                              <td className="px-6 py-5 text-sm text-gray-900">{a.email || '-'}</td>
                              <td className="px-6 py-5 text-sm text-gray-900">{a.so_dien_thoai || '-'}</td>
                              <td className="px-6 py-5">
                                <button
                                  onClick={() => handleRemoveAssignment(a.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                  <span>Xóa</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal thêm người tham gia */}
      {showAddParticipant && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-black text-gray-800">Thêm người tham gia</h3>
              <button
                onClick={() => {
                  setShowAddParticipant(false);
                  setParticipantForm({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại</label>
                <select
                  value={participantForm.loai}
                  onChange={(e) => setParticipantForm({ ...participantForm, loai: e.target.value, id_benh_nhan: '', id_nguoi_than: '' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="benh_nhan">Bệnh nhân</option>
                  <option value="nguoi_than">Người thân</option>
                </select>
              </div>
              
              {participantForm.loai === 'benh_nhan' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bệnh nhân *</label>
                  <select
                    value={participantForm.id_benh_nhan}
                    onChange={(e) => setParticipantForm({ ...participantForm, id_benh_nhan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    required
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map((bn) => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bệnh nhân (để lọc người thân)</label>
                    <select
                      value={participantForm.id_benh_nhan}
                      onChange={(e) => setParticipantForm({ ...participantForm, id_benh_nhan: e.target.value, id_nguoi_than: '' })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    >
                      <option value="">Chọn bệnh nhân</option>
                      {benhNhans.map((bn) => (
                        <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Người thân *</label>
                    <select
                      value={participantForm.id_nguoi_than}
                      onChange={(e) => setParticipantForm({ ...participantForm, id_nguoi_than: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
                      required
                      disabled={!participantForm.id_benh_nhan}
                    >
                      <option value="">Chọn người thân</option>
                      {nguoiThans.map((nt) => (
                        <option key={nt.id} value={nt.id}>{nt.ho_ten}</option>
                      ))}
                    </select>
                    {!participantForm.id_benh_nhan && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>info</span>
                        Vui lòng chọn bệnh nhân trước
                      </p>
                    )}
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddParticipant(false);
                    setParticipantForm({ loai: 'benh_nhan', id_benh_nhan: '', id_nguoi_than: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddParticipant}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!participantForm.id_benh_nhan && !participantForm.id_nguoi_than}
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm phân công */}
      {showAddAssignment && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-black text-gray-800">Phân công nhân viên</h3>
              <button
                onClick={() => {
                  setShowAddAssignment(false);
                  setAssignmentForm({ id_nhan_vien: '', vai_tro: '' });
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nhân viên *</label>
                <select
                  value={assignmentForm.id_nhan_vien}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, id_nhan_vien: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  required
                >
                  <option value="">Chọn nhân viên</option>
                  {nhanViens.map((nv) => (
                    <option key={nv.id} value={nv.id}>{nv.ho_ten}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vai trò</label>
                <input
                  type="text"
                  value={assignmentForm.vai_tro}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, vai_tro: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Ví dụ: MC, Quản lý, Hỗ trợ..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddAssignment(false);
                    setAssignmentForm({ id_nhan_vien: '', vai_tro: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddAssignment}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!assignmentForm.id_nhan_vien}
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>assignment</span>
                  <span>Phân công</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

