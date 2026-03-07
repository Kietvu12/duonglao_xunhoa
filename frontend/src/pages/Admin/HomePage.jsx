import { useEffect, useState } from 'react';
import { dashboardAPI, lichThamBenhAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission, getFirstAllowedRoute } from '../../utils/permissions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [lichThamHomNay, setLichThamHomNay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLichTham, setLoadingLichTham] = useState(true);

  // Kiểm tra quyền truy cập dashboard và redirect nếu không có quyền
  useEffect(() => {
    if (user?.vai_tro) {
      const userRole = user.vai_tro;
      if (!hasPermission('/admin', userRole)) {
        // Không có quyền dashboard, redirect đến route đầu tiên có quyền
        const firstRoute = getFirstAllowedRoute(userRole);
        if (firstRoute) {
          navigate(firstRoute, { replace: true });
        }
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    // Chỉ load dashboard nếu có quyền
    if (user?.vai_tro && hasPermission('/admin', user.vai_tro)) {
      loadDashboard();
      loadLichThamHomNay();
      
      // Reload lịch thăm mỗi 30 giây để cập nhật real-time
      const interval = setInterval(() => {
        loadLichThamHomNay();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLichThamHomNay = async () => {
    try {
      setLoadingLichTham(true);
      // Lấy ngày hôm nay (YYYY-MM-DD format)
      const today = new Date().toISOString().split('T')[0];
      
      console.log('[Dashboard] Loading lich tham for today:', today);
      
      // Thử load tất cả trước để debug
      const allResponse = await lichThamBenhAPI.getAll({ limit: 100 });
      console.log('[Dashboard] All lich tham response:', allResponse);
      console.log('[Dashboard] All lich tham data:', allResponse?.data);
      
      if (allResponse?.data && Array.isArray(allResponse.data)) {
        console.log('[Dashboard] Total lich tham records:', allResponse.data.length);
        allResponse.data.forEach((item, idx) => {
          console.log(`[Dashboard] Record ${idx}:`, {
            id: item.id,
            ngay: item.ngay,
            ten_benh_nhan: item.ten_benh_nhan,
            ten_nguoi_than: item.ten_nguoi_than,
            trang_thai: item.trang_thai
          });
        });
      }
      
      // Load với filter ngày
      const response = await lichThamBenhAPI.getAll({ 
        start_date: today,
        end_date: today,
        limit: 100
      });
      
      console.log('[Dashboard] Filtered response:', response);
      console.log('[Dashboard] Response structure:', {
        hasResponse: !!response,
        hasData: !!(response && response.data),
        isArray: Array.isArray(response?.data),
        dataLength: response?.data?.length
      });
      
      // API trả về { success: true, data: [...] }
      let lichThamData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          lichThamData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          lichThamData = response.data.data;
        }
      }
      
      // Fallback: Nếu không có dữ liệu với filter, thử load tất cả và filter ở frontend
      if (lichThamData.length === 0 && allResponse?.data && Array.isArray(allResponse.data)) {
        console.log('[Dashboard] No data with date filter, trying to filter all data');
        lichThamData = allResponse.data.filter(item => {
          if (!item.ngay) return false;
          const itemDate = new Date(item.ngay).toISOString().split('T')[0];
          console.log('[Dashboard] Comparing dates:', { itemDate, today, match: itemDate === today });
          return itemDate === today;
        });
        console.log('[Dashboard] After frontend filter:', lichThamData.length, 'records');
      }
      
      console.log('[Dashboard] Final lich tham data to set:', lichThamData);
      console.log('[Dashboard] Count:', lichThamData.length);
      
      setLichThamHomNay(lichThamData);
    } catch (error) {
      console.error('[Dashboard] Error loading lich tham hom nay:', error);
      console.error('[Dashboard] Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setLichThamHomNay([]);
    } finally {
      setLoadingLichTham(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-red-500">Không thể tải dữ liệu dashboard</div>;
  }

  const benhNhanChartData = dashboardData.benh_nhan_theo_dich_vu?.map(item => ({
    name: item.loai_dich_vu?.replace('_', ' ') || 'Khác',
    value: item.so_luong || 0,
  })) || [];

  // Chuẩn bị dữ liệu cho biểu đồ số người sử dụng dịch vụ theo tháng
  const prepareServiceUsageData = () => {
    if (!dashboardData.su_dung_dich_vu_theo_thang || dashboardData.su_dung_dich_vu_theo_thang.length === 0) {
      return {};
    }

    const services = {};
    dashboardData.su_dung_dich_vu_theo_thang.forEach(item => {
      if (!services[item.ten_dich_vu]) {
        services[item.ten_dich_vu] = [];
      }
      services[item.ten_dich_vu].push({
        thang: item.thang,
        so_nguoi: item.so_nguoi
      });
    });

    // Tạo đầy đủ 12 tháng gần nhất cho mỗi dịch vụ
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    const result = {};
    Object.keys(services).forEach(serviceName => {
      result[serviceName] = months.map(month => {
        const existing = services[serviceName].find(item => item.thang === month);
        return {
          thang: month,
          so_nguoi: existing ? existing.so_nguoi : 0
        };
      });
    });

    return result;
  };

  const serviceUsageData = prepareServiceUsageData();

  // Chuẩn bị dữ liệu cho biểu đồ số người nhập viện theo tháng
  const prepareAdmissionsData = () => {
    if (!dashboardData.nguoi_nhap_vien_theo_thang || dashboardData.nguoi_nhap_vien_theo_thang.length === 0) {
      return [];
    }

    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }

    return months.map(month => {
      const existing = dashboardData.nguoi_nhap_vien_theo_thang.find(item => item.thang === month);
      return {
        thang: month,
        so_nguoi_nhap_vien: existing ? existing.so_nguoi_nhap_vien : 0
      };
    });
  };

  const admissionsData = prepareAdmissionsData();

  const stats = [
    {
      title: 'Tổng số bệnh nhân',
      value: dashboardData.tong_so_benh_nhan || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Nhân viên đang làm',
      value: dashboardData.nhan_vien_dang_lam || 0,
      icon: '👨‍⚕️',
      color: 'bg-green-500',
    },
    {
      title: 'Nhân viên trực hôm nay',
      value: dashboardData.nhan_vien_truc_hom_nay || 0,
      icon: '🕐',
      color: 'bg-yellow-500',
    },
    {
      title: 'Lịch thăm hôm nay',
      value: lichThamHomNay.length || 0,
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-purple-500',
    },
    {
      title: 'Lịch hẹn tư vấn',
      value: dashboardData.lich_hen_tu_van_hom_nay || 0,
      icon: '📞',
      color: 'bg-pink-500',
    },
    {
      title: 'Cảnh báo chỉ số',
      value: dashboardData.canh_bao_chi_so?.length || 0,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="p-8 bg-gray-50 font-raleway">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-gray-800 text-3xl font-bold leading-tight tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng quan hệ thống</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg p-5 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-gray-600 text-sm font-medium leading-normal">{stat.title}</p>
            <p className="text-gray-800 text-3xl font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid - Sắp xếp đều */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bệnh nhân theo dịch vụ */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-gray-800 text-lg font-bold mb-4">Bệnh nhân theo dịch vụ</h2>
          {benhNhanChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={benhNhanChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {benhNhanChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Tổng số người nhập viện theo tháng */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-gray-800 text-lg font-bold mb-4">Tổng số người nhập viện theo tháng</h2>
          {admissionsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={admissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="thang" 
                  tickFormatter={(value) => {
                    const date = new Date(value + '-01');
                    return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const date = new Date(value + '-01');
                    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
                  }}
                  formatter={(value) => {
                    return new Intl.NumberFormat('vi-VN').format(value) + ' người';
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="so_nguoi_nhap_vien" 
                  stroke="#4A90E2" 
                  strokeWidth={2}
                  name="Số người nhập viện"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu nhập viện</p>
          )}
        </div>
      </div>

      {/* Second Row - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Nhân viên trực ca hôm nay */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-gray-800 text-lg font-bold p-4 border-b border-gray-200">
            Nhân viên trực ca
          </h2>
          <div className="p-4">
            {dashboardData.nhan_vien_truc_ca_hom_nay?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.nhan_vien_truc_ca_hom_nay.slice(0, 5).map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {staff.ho_ten?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{staff.ho_ten}</p>
                      <p className="text-xs text-gray-500">
                        {staff.ca ? staff.ca.charAt(0).toUpperCase() + staff.ca.slice(1) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Không có nhân viên trực ca</p>
            )}
          </div>
        </div>

        {/* Sự kiện sắp tới */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-gray-800 text-lg font-bold p-4 border-b border-gray-200">
            Sự kiện sắp tới
          </h2>
          <div className="p-4 space-y-3">
            {dashboardData.su_kien_sap_toi?.length > 0 ? (
              dashboardData.su_kien_sap_toi.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>celebration</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{event.tieu_de}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.ngay).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Không có sự kiện</p>
            )}
          </div>
        </div>

        {/* Cảnh báo chỉ số */}
        {dashboardData.canh_bao_chi_so && dashboardData.canh_bao_chi_so.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-gray-800 text-lg font-bold p-4 border-b border-gray-200">
              Cảnh báo chỉ số
            </h2>
            <div className="p-4 space-y-3">
              {dashboardData.canh_bao_chi_so.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex items-center justify-center size-8 rounded-full bg-red-500 text-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>priority_high</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{alert.ten_benh_nhan || 'Bệnh nhân'}</p>
                    <p className="text-xs text-gray-600">{alert.mo_ta || 'Cảnh báo chỉ số sức khỏe'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-gray-800 text-lg font-bold p-4 border-b border-gray-200">
              Cảnh báo chỉ số
            </h2>
            <div className="p-4">
              <p className="text-gray-500 text-center py-4">Không có cảnh báo</p>
            </div>
          </div>
        )}
      </div>


      {/* Số người sử dụng dịch vụ theo tháng */}
      {Object.keys(serviceUsageData).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-gray-800 text-lg font-bold mb-4">Số người sử dụng dịch vụ theo tháng</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(serviceUsageData).map((serviceName) => (
              <div key={serviceName}>
                <h3 className="text-base font-semibold mb-3 text-gray-700">{serviceName}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={serviceUsageData[serviceName]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="thang" 
                      tickFormatter={(value) => {
                        const date = new Date(value + '-01');
                        return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value + '-01');
                        return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="so_nguoi" fill="#0088FE" name="Số người" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tables Section - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Danh sách công việc hôm nay */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 text-lg font-bold">Danh sách công việc hôm nay</h2>
            <button
              onClick={() => navigate('/admin/cong-viec')}
              className="text-[#4A90E2] hover:text-[#4A90E2]/80 text-sm font-semibold transition-colors"
            >
              Xem tất cả →
            </button>
          </div>
        {dashboardData.cong_viec_hom_nay?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên người phụ trách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên công việc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Dự kiến hoàn thành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.cong_viec_hom_nay.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.ten_nguoi_phu_trach || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.ten_benh_nhan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.ten_cong_viec || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {task.thoi_gian_du_kien 
                        ? new Date(task.thoi_gian_du_kien).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        task.trang_thai === 'hoan_thanh' 
                          ? 'bg-green-100 text-green-800' 
                          : task.trang_thai === 'dang_lam'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.trang_thai === 'hoan_thanh' 
                          ? 'Hoàn thành' 
                          : task.trang_thai === 'dang_lam'
                          ? 'Đang làm'
                          : 'Chưa làm'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Không có công việc hôm nay</p>
        )}
        </div>

        {/* Danh sách lịch thăm khám hôm nay */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 text-lg font-bold">Lịch thăm khám hôm nay</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/lich-kham')}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
            >
              Xem tất cả →
            </button>
          </div>
        </div>
        {loadingLichTham ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : (lichThamHomNay && lichThamHomNay.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Người thân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Khung giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Số người đi cùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lichThamHomNay.map((ltb) => (
                  <tr key={ltb.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ltb.ten_benh_nhan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ltb.ten_nguoi_than || '-'}
                      {ltb.moi_quan_he && (
                        <span className="text-gray-400 ml-1">({ltb.moi_quan_he})</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {ltb.khung_gio === '8_10' ? '8:00 - 10:00' :
                         ltb.khung_gio === '14_16' ? '14:00 - 16:00' :
                         ltb.khung_gio === '18_20' ? '18:00 - 20:00' : ltb.khung_gio || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ltb.so_nguoi_di_cung || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ltb.trang_thai === 'da_duyet' ? 'bg-green-100 text-green-800' :
                        ltb.trang_thai === 'tu_choi' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ltb.trang_thai === 'cho_duyet' ? 'Chờ duyệt' :
                         ltb.trang_thai === 'da_duyet' ? 'Đã duyệt' :
                         ltb.trang_thai === 'tu_choi' ? 'Từ chối' : ltb.trang_thai || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ltb.ghi_chu ? (
                        <span className="truncate block max-w-xs" title={ltb.ghi_chu}>
                          {ltb.ghi_chu}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Không có lịch thăm khám hôm nay</p>
            <p className="text-xs text-gray-400">
              (Đã load {lichThamHomNay?.length || 0} bản ghi)
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

