/**
 * Định nghĩa quyền truy cập cho các menu items dựa trên vai trò
 */

// Định nghĩa các vai trò
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  QUAN_LY_Y_TE: 'quan_ly_y_te',
  QUAN_LY_NHAN_SU: 'quan_ly_nhan_su',
  DIEU_DUONG_TRUONG: 'dieu_duong_truong',
  DIEU_DUONG: 'dieu_duong',
  MARKETING: 'marketing',
  NGUOI_NHA: 'nguoi_nha'
};

// Định nghĩa quyền truy cập cho từng menu item
export const MENU_PERMISSIONS = {
  '/admin': {
    // Dashboard - tất cả đều có quyền
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.QUAN_LY_NHAN_SU,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG,
      ROLES.MARKETING
    ]
  },
  '/admin/benh-nhan': {
    // Bệnh nhân - admin, quản lý y tế, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/nhan-vien': {
    // Nhân viên - chỉ admin và quản lý nhân sự
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_NHAN_SU
    ]
  },
  '/admin/lich-kham': {
    // Lịch thăm - admin, quản lý y tế, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/lich-hen-tu-van': {
    // Lịch hẹn tư vấn - admin, marketing, quản lý y tế
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.MARKETING
    ]
  },
  '/admin/quan-ly-phong': {
    // Quản lý Phòng - admin, quản lý y tế
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE
    ]
  },
  '/admin/dich-vu': {
    // Quản lý Dịch vụ - admin, quản lý y tế, marketing
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.MARKETING
    ]
  },
  '/admin/su-kien': {
    // Sự kiện - admin, marketing, quản lý y tế
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.MARKETING
    ]
  },
  '/admin/bai-viet': {
    // Bài viết - admin, marketing
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MARKETING
    ]
  },
  '/admin/tuyen-dung': {
    // Tuyển dụng - admin, quản lý nhân sự, marketing
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_NHAN_SU,
      ROLES.MARKETING
    ]
  },
  '/admin/thuoc': {
    // Thuốc - admin, quản lý y tế, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/cong-viec': {
    // Công việc - admin, quản lý y tế, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/kpi': {
    // KPI - admin, quản lý y tế, quản lý nhân sự, điều dưỡng trưởng, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.QUAN_LY_NHAN_SU,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/media-ca-nhan': {
    // Media cá nhân - tất cả đều có quyền
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.QUAN_LY_NHAN_SU,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG,
      ROLES.MARKETING
    ]
  },
  '/admin/tai-khoan': {
    // Tài khoản - chỉ admin và quản lý nhân sự
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_NHAN_SU
    ]
  },
  '/admin/danh-sach-trieu-chung': {
    // Danh sách Triệu chứng - admin, quản lý y tế, điều dưỡng
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.QUAN_LY_Y_TE,
      ROLES.DIEU_DUONG_TRUONG,
      ROLES.DIEU_DUONG
    ]
  },
  '/admin/cau-hinh': {
    // Cấu hình - chỉ admin
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN
    ]
  }
};

/**
 * Kiểm tra xem user có quyền truy cập menu item không
 * @param {string} path - Đường dẫn menu item
 * @param {string} userRole - Vai trò của user
 * @returns {boolean} - true nếu có quyền, false nếu không
 */
export function hasPermission(path, userRole) {
  if (!userRole) return false;
  
  const permission = MENU_PERMISSIONS[path];
  if (!permission) {
    // Nếu không có định nghĩa quyền, mặc định cho phép (để tương thích ngược)
    console.warn(`⚠️ No permission defined for path: ${path}`);
    return true;
  }
  
  return permission.allowedRoles.includes(userRole);
}

/**
 * Lọc danh sách menu items dựa trên quyền của user
 * @param {Array} items - Danh sách menu items
 * @param {string} userRole - Vai trò của user
 * @returns {Array} - Danh sách menu items đã được lọc
 */
export function filterMenuItemsByRole(items, userRole) {
  if (!userRole) return [];
  
  return items.filter(item => hasPermission(item.path, userRole));
}

/**
 * Tìm route đầu tiên mà user có quyền truy cập
 * @param {string} userRole - Vai trò của user
 * @returns {string|null} - Route path đầu tiên có quyền, hoặc null nếu không tìm thấy
 */
export function getFirstAllowedRoute(userRole) {
  if (!userRole) return null;
  
  // Danh sách tất cả các routes theo thứ tự ưu tiên (không bao gồm dashboard)
  const allRoutes = [
    '/admin/benh-nhan',
    '/admin/nhan-vien',
    '/admin/lich-kham',
    '/admin/lich-hen-tu-van',
    '/admin/quan-ly-phong',
    '/admin/dich-vu',
    '/admin/su-kien',
    '/admin/bai-viet',
    '/admin/tuyen-dung',
    '/admin/thuoc',
    '/admin/cong-viec',
    '/admin/kpi',
    '/admin/media-ca-nhan',
    '/admin/tai-khoan',
    '/admin/danh-sach-trieu-chung',
    '/admin/cau-hinh'
  ];
  
  // Tìm route đầu tiên mà user có quyền
  for (const route of allRoutes) {
    if (hasPermission(route, userRole)) {
      return route;
    }
  }
  
  // Nếu không tìm thấy route nào, kiểm tra dashboard
  if (hasPermission('/admin', userRole)) {
    return '/admin';
  }
  
  return null;
}

