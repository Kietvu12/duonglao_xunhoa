import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import PublicLayout from './components/PublicLayout'
import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import Service from './pages/Service'
import Amenity from './pages/Amenity'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import HuongDanSuDung from './pages/HuongDanSuDung'
import EventDetail from './pages/EventDetail'
import AdminLayout from './components/Admin/Layout'
import AdminHomePage from './pages/Admin/HomePage'
import Login from './pages/Admin/Login'
import BenhNhanPage from './pages/Admin/BenhNhanPage'
import BenhNhanDetailPage from './pages/Admin/BenhNhanDetailPage'
import NhanVienPage from './pages/Admin/NhanVienPage'
import LichKhamPage from './pages/Admin/LichKhamPage'
import QuanLyDichVuPage from './pages/Admin/QuanLyDichVuPage'
import SuKienPage from './pages/Admin/SuKienPage'
import BaiVietPage from './pages/Admin/BaiVietPage'
import TuyenDungPage from './pages/Admin/TuyenDungPage'
import ThuocPage from './pages/Admin/ThuocPage'
import CongViecPage from './pages/Admin/CongViecPage'
import KPIPage from './pages/Admin/KPIPage'
import PhongPage from './pages/Admin/PhongPage'
import QuanLyPhongPage from './pages/Admin/QuanLyPhongPage'
import QuanLyPhongPageNew from './pages/Admin/QuanLyPhongPageNew'
import LichHenTuVanPage from './pages/Admin/LichHenTuVanPage'
import KhaoSatChatLuongPage from './pages/Admin/KhaoSatChatLuongPage'
import TaiKhoanPage from './pages/Admin/TaiKhoanPage'
import CauHinhPage from './pages/Admin/CauHinhPage'
import MediaCaNhanPage from './pages/Admin/MediaCaNhanPage'
import DanhSachTrieuChungPage from './pages/Admin/DanhSachTrieuChungPage'
import TrieuChungBenhNhanPage from './pages/Admin/TrieuChungBenhNhanPage'
import duTruHoatDong30Cu from './assets/dự trù hoạt động 12 tháng cho 30 cụ.html?url'
import soSanh30Cu50Cu from './assets/so sánh 30 cụ và 50 cụ.html?url'
import './App.css'

const HtmlAssetPage = ({ title, src }) => (
  <div className="h-screen w-screen bg-white">
    <iframe title={title} src={src} className="h-full w-full border-0" />
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

/** Trùng với `base` trong vite.config — nếu deploy tại /quanlyduonglao/ thì đặt base đó để route + asset khớp */
const routerBasename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

function App() {
  return (
    <AuthProvider>
      <Router basename={routerBasename}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/ve-chung-toi" element={<PublicLayout><AboutUs /></PublicLayout>} />
          <Route path="/dich-vu" element={<PublicLayout><Service /></PublicLayout>} />
          <Route path="/tien-ich" element={<PublicLayout><Amenity /></PublicLayout>} />
          <Route path="/blog/bai-viet/:slug" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/tuyen-dung/:jobSlug" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/lien-he" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/huong-dan-su-dung" element={<PublicLayout><HuongDanSuDung /></PublicLayout>} />
          <Route path="/su-kien/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
          <Route
            path="/du-tru-hoat-dong-12-thang-cho-30-cu"
            element={<HtmlAssetPage title="Dự trù hoạt động 12 tháng cho 30 cụ" src={duTruHoatDong30Cu} />}
          />
          <Route
            path="/so-sanh-30-cu-va-50-cu"
            element={<HtmlAssetPage title="So sánh 30 cụ và 50 cụ" src={soSanh30Cu50Cu} />}
          />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <NotificationProvider>
                  <AdminLayout />
                </NotificationProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="benh-nhan" element={<BenhNhanPage />} />
            <Route path="benh-nhan/:id" element={<BenhNhanDetailPage />} />
            <Route path="nhan-vien" element={<NhanVienPage />} />
            <Route path="lich-kham" element={<LichKhamPage />} />
            <Route path="quan-ly-phong" element={<QuanLyPhongPageNew />} />
            <Route path="dich-vu" element={<QuanLyDichVuPage />} />
            <Route path="su-kien" element={<SuKienPage />} />
            <Route path="bai-viet" element={<BaiVietPage />} />
            <Route path="tuyen-dung" element={<TuyenDungPage />} />
            <Route path="thuoc" element={<ThuocPage />} />
            <Route path="cong-viec" element={<CongViecPage />} />
            <Route path="kpi" element={<KPIPage />} />
            <Route path="lich-hen-tu-van" element={<LichHenTuVanPage />} />
            <Route path="khao-sat-chat-luong" element={<KhaoSatChatLuongPage />} />
            <Route path="tai-khoan" element={<TaiKhoanPage />} />
            <Route path="cau-hinh" element={<CauHinhPage />} />
            <Route path="media-ca-nhan" element={<MediaCaNhanPage />} />
            <Route path="danh-sach-trieu-chung" element={<DanhSachTrieuChungPage />} />
            <Route path="trieu-chung-benh-nhan" element={<TrieuChungBenhNhanPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
