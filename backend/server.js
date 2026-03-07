import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeSocket } from './config/socket.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import benhNhanRoutes from './routes/benhNhanRoutes.js';
import lichKhamRoutes from './routes/lichKhamRoutes.js';
import lichThamBenhRoutes from './routes/lichThamBenhRoutes.js';
import nhanVienRoutes from './routes/nhanVienRoutes.js';
import dichVuRoutes from './routes/dichVuRoutes.js';
import loaiDichVuRoutes from './routes/loaiDichVuRoutes.js';
import suKienRoutes from './routes/suKienRoutes.js';
import baiVietRoutes from './routes/baiVietRoutes.js';
import baiVietDichVuRoutes from './routes/baiVietDichVuRoutes.js';
import baiVietPhongRoutes from './routes/baiVietPhongRoutes.js';
import tuyenDungRoutes from './routes/tuyenDungRoutes.js';
import loaiPhongRoutes from './routes/loaiPhongRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import thuocRoutes from './routes/thuocRoutes.js';
import congViecRoutes from './routes/congViecRoutes.js';
import kpiRoutes from './routes/kpiRoutes.js';
import phongRoutes from './routes/phongRoutes.js';
import phanKhuRoutes from './routes/phanKhuRoutes.js';
import phongNewRoutes from './routes/phongNewRoutes.js';
import nguoiThanRoutes from './routes/nguoiThanRoutes.js';
import doDungRoutes from './routes/doDungRoutes.js';
import phanLoaiDoDungRoutes from './routes/phanLoaiDoDungRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import benhNhanDichVuRoutes from './routes/benhNhanDichVuRoutes.js';
import loaiBenhLyRoutes from './routes/loaiBenhLyRoutes.js';
import thongTinBenhRoutes from './routes/thongTinBenhRoutes.js';
import taiKhoanRoutes from './routes/taiKhoanRoutes.js';
import danhSachTrieuChungRoutes from './routes/danhSachTrieuChungRoutes.js';
import trieuChungBenhNhanRoutes from './routes/trieuChungBenhNhanRoutes.js';
import cauHinhChiSoCanhBaoRoutes from './routes/cauHinhChiSoCanhBaoRoutes.js';
import mediaCaNhanBenhNhanRoutes from './routes/mediaCaNhanBenhNhanRoutes.js';
import thongBaoRoutes from './routes/thongBaoRoutes.js';
import externalNotificationRoutes from './routes/externalNotificationRoutes.js';
import publicHealthAlertsRoutes from './routes/publicHealthAlertsRoutes.js';
import { startPhanCaScheduler } from './services/phanCaScheduler.js';
import { startMediaCleanupScheduler } from './services/mediaCleanupScheduler.js';
import { startBaiVietScheduler } from './services/baiVietScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4545;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/benh-nhan', benhNhanRoutes);
app.use('/api/lich-kham', lichKhamRoutes);
app.use('/api/lich-tham-benh', lichThamBenhRoutes);
app.use('/api/nhan-vien', nhanVienRoutes);
app.use('/api/dich-vu', dichVuRoutes);
app.use('/api/loai-dich-vu', loaiDichVuRoutes);
app.use('/api/su-kien', suKienRoutes);
app.use('/api/bai-viet', baiVietRoutes);
app.use('/api/bai-viet-dich-vu', baiVietDichVuRoutes);
app.use('/api/bai-viet-phong', baiVietPhongRoutes);
app.use('/api/tuyen-dung', tuyenDungRoutes);
app.use('/api/loai-phong', loaiPhongRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/thuoc', thuocRoutes);
app.use('/api/cong-viec', congViecRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/phong', phongRoutes);
app.use('/api/phan-khu', phanKhuRoutes);
app.use('/api/phong-moi', phongNewRoutes);
app.use('/api/nguoi-than', nguoiThanRoutes);
app.use('/api/do-dung', doDungRoutes);
app.use('/api/phan-loai-do-dung', phanLoaiDoDungRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/benh-nhan-dich-vu', benhNhanDichVuRoutes);
app.use('/api/loai-benh-ly', loaiBenhLyRoutes);
app.use('/api/thong-tin-benh', thongTinBenhRoutes);
app.use('/api/tai-khoan', taiKhoanRoutes);
app.use('/api/danh-sach-trieu-chung', danhSachTrieuChungRoutes);
app.use('/api/trieu-chung-benh-nhan', trieuChungBenhNhanRoutes);
app.use('/api/cau-hinh-chi-so-canh-bao', cauHinhChiSoCanhBaoRoutes);
app.use('/api/media-ca-nhan-benh-nhan', mediaCaNhanBenhNhanRoutes);
app.use('/api/thong-bao', thongBaoRoutes);
app.use('/api/external/notify', externalNotificationRoutes);
app.use('/api/public/health-alerts', publicHealthAlertsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket server initialized`);
  
  // Start schedulers
  startPhanCaScheduler();
  startMediaCleanupScheduler();
  startBaiVietScheduler();
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

