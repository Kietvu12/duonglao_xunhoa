import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirstAllowedRoute, hasPermission } from '../../utils/permissions';

export default function Login() {
  const [credentials, setCredentials] = useState({ so_dien_thoai: '', mat_khau: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Thêm class vào body khi ở login page và xóa khi unmount
  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => {
      document.body.classList.remove('admin-route');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(credentials);
      const user = response?.data?.user;
      const userRole = user?.vai_tro;
      
      // Kiểm tra quyền truy cập dashboard
      if (userRole) {
        // Nếu có quyền dashboard, điều hướng đến dashboard
        if (hasPermission('/admin', userRole)) {
          navigate('/admin');
        } else {
          // Nếu không có quyền dashboard, điều hướng đến route đầu tiên có quyền
          const firstRoute = getFirstAllowedRoute(userRole);
          navigate(firstRoute || '/admin');
        }
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4A90E2] via-[#4A90E2]/90 to-[#4A90E2]/80 p-4 font-raleway">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="text-[#4A90E2] size-16 flex items-center justify-center">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600 text-sm sm:text-base">Hệ thống Quản lý Viện Dưỡng Lão</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>error</span>
            <p className="text-red-700 text-sm font-medium flex-1">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>phone</span>
              </div>
              <input
                type="text"
                value={credentials.so_dien_thoai}
                onChange={(e) => setCredentials({ ...credentials, so_dien_thoai: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 focus:bg-white text-gray-800 transition-colors"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.mat_khau}
                onChange={(e) => setCredentials({ ...credentials, mat_khau: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 focus:bg-white text-gray-800 transition-colors"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4A90E2] text-white py-3 px-4 rounded-lg hover:bg-[#4A90E2]/90 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm sm:text-base"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sync</span>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>login</span>
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Hệ thống Quản lý Viện Dưỡng Lão. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

