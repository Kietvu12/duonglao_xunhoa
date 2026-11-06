import { NotificationProvider } from '../../contexts/NotificationContext';
import AdminLayout from './Layout';

/** Khung admin (thông báo realtime + layout) – được tải lazy để site công khai không tải socket.io */
const AdminShell = () => (
  <NotificationProvider>
    <AdminLayout />
  </NotificationProvider>
);

export default AdminShell;
