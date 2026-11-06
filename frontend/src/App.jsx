import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PublicLayout from './components/PublicLayout'
import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import Service from './pages/Service'
import Amenity from './pages/Amenity'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import HuongDanSuDung from './pages/HuongDanSuDung'
import EventDetail from './pages/EventDetail'
import SuKienListPage from './pages/SuKienListPage'
import ChinhSachBaoMat from './pages/ChinhSachBaoMat'
import DieuKhoanSuDung from './pages/DieuKhoanSuDung'
import duTruHoatDong30Cu from './assets/dự trù hoạt động 12 tháng cho 30 cụ.html?url'
import soSanh30Cu50Cu from './assets/so sánh 30 cụ và 50 cụ.html?url'
import './App.css'

// Trang quản trị tải theo nhu cầu: khách xem site công khai không phải tải mã admin
const AdminShell = lazy(() => import('./components/Admin/AdminShell'))
const AdminHomePage = lazy(() => import('./pages/Admin/HomePage'))
const Login = lazy(() => import('./pages/Admin/Login'))
const BenhNhanPage = lazy(() => import('./pages/Admin/BenhNhanPage'))
const BenhNhanDetailPage = lazy(() => import('./pages/Admin/BenhNhanDetailPage'))
const NhanVienPage = lazy(() => import('./pages/Admin/NhanVienPage'))
const LichKhamPage = lazy(() => import('./pages/Admin/LichKhamPage'))
const QuanLyDichVuPage = lazy(() => import('./pages/Admin/QuanLyDichVuPage'))
const QuanLySuKienPage = lazy(() => import('./pages/Admin/QuanLySuKienPage'))
const BaiVietPage = lazy(() => import('./pages/Admin/BaiVietPage'))
const TuyenDungPage = lazy(() => import('./pages/Admin/TuyenDungPage'))
const ThuocPage = lazy(() => import('./pages/Admin/ThuocPage'))
const CongViecPage = lazy(() => import('./pages/Admin/CongViecPage'))
const KPIPage = lazy(() => import('./pages/Admin/KPIPage'))
const PhongPage = lazy(() => import('./pages/Admin/PhongPage'))
const QuanLyPhongPage = lazy(() => import('./pages/Admin/QuanLyPhongPage'))
const QuanLyPhongPageNew = lazy(() => import('./pages/Admin/QuanLyPhongPageNew'))
const LichHenTuVanPage = lazy(() => import('./pages/Admin/LichHenTuVanPage'))
const KhaoSatChatLuongPage = lazy(() => import('./pages/Admin/KhaoSatChatLuongPage'))
const TaiKhoanPage = lazy(() => import('./pages/Admin/TaiKhoanPage'))
const CauHinhPage = lazy(() => import('./pages/Admin/CauHinhPage'))
const MediaCaNhanPage = lazy(() => import('./pages/Admin/MediaCaNhanPage'))
const DanhSachTrieuChungPage = lazy(() => import('./pages/Admin/DanhSachTrieuChungPage'))
const TrieuChungBenhNhanPage = lazy(() => import('./pages/Admin/TrieuChungBenhNhanPage'))
const TuThuocPage = lazy(() => import('./pages/Admin/TuThuocPage'))
const VatTuTieuHaoPage = lazy(() => import('./pages/Admin/VatTuTieuHaoPage'))

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
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Đang tải...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/ve-chung-toi" element={<PublicLayout><AboutUs /></PublicLayout>} />
          <Route path="/dich-vu" element={<PublicLayout><Service /></PublicLayout>} />
          <Route path="/dich-vu/:loaiParam" element={<PublicLayout><Service /></PublicLayout>} />
          <Route path="/dich-vu/:loaiParam/:dichVuParam" element={<PublicLayout><Service /></PublicLayout>} />
          <Route path="/tien-ich" element={<PublicLayout><Amenity /></PublicLayout>} />
          <Route path="/blog/bai-viet/:slug" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/tuyen-dung/:jobSlug" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/lien-he" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/huong-dan-su-dung" element={<PublicLayout><HuongDanSuDung /></PublicLayout>} />
          <Route path="/su-kien" element={<PublicLayout><SuKienListPage /></PublicLayout>} />
          <Route path="/su-kien/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
          <Route path="/chinh-sach-bao-mat" element={<PublicLayout><ChinhSachBaoMat /></PublicLayout>} />
          <Route path="/dieu-khoan-su-dung" element={<PublicLayout><DieuKhoanSuDung /></PublicLayout>} />
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
                <AdminShell />
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
            <Route path="su-kien" element={<QuanLySuKienPage />} />
            <Route path="bai-viet" element={<BaiVietPage />} />
            <Route path="tuyen-dung" element={<TuyenDungPage />} />
            <Route path="thuoc" element={<ThuocPage />} />
            <Route path="tu-thuoc" element={<TuThuocPage />} />
            <Route path="vat-tu-tieu-hao" element={<VatTuTieuHaoPage />} />
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
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
