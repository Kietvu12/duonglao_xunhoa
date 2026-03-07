import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { thongBaoAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    try {
      const response = await thongBaoAPI.getThongBaos({ limit: 50 });
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await thongBaoAPI.getThongBaoChuaDoc();
      if (response.success) {
        setUnreadCount(response.data.so_luong_chua_doc || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.id) {
      console.log('⏳ Waiting for user to connect WebSocket...');
      return;
    }

    // Lấy base URL từ environment variable hoặc từ API_BASE_URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://duonglaoxuanhoa.net/api_quanlyduonglao/api';
    // Tách base URL (bỏ phần /api ở cuối nếu có)
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/api_quanlyduonglao\/?$/, '') || 'https://duonglaoxuanhoa.net';
    const socketPath = '/api_quanlyduonglao/socket.io/';
    
    console.log('🔌 Connecting to WebSocket:', baseUrl);
    console.log('🔌 Socket path:', socketPath);

    const newSocket = io(baseUrl, {
      path: socketPath,
      transports: ['polling', 'websocket'], // Ưu tiên polling trước, fallback websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket, socket ID:', newSocket.id);
      console.log('✅ Transport:', newSocket.io.engine.transport.name);
      setIsConnected(true);
      
      // Join user room
      newSocket.emit('join_user_room', user.id);
      console.log('👤 Joined user room:', `user_${user.id}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        type: error.type,
        description: error.description
      });
      setIsConnected(false);
      
      // Nếu WebSocket thất bại, thử polling
      if (newSocket.io.engine.transport.name === 'websocket') {
        console.log('🔄 Falling back to polling transport...');
        newSocket.io.opts.transports = ['polling'];
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket, reason:', reason);
      setIsConnected(false);
    });

    newSocket.on('notification', (notification) => {
      console.log('📬 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev]);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
    });

    setSocket(newSocket);

    // Load initial data
    loadNotifications();
    loadUnreadCount();

    return () => {
      if (newSocket) {
        newSocket.emit('leave_user_room', user.id);
        newSocket.disconnect();
      }
    };
  }, [user?.id, loadNotifications, loadUnreadCount]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await thongBaoAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, da_doc: 1 } : notif)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await thongBaoAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, da_doc: 1 }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await thongBaoAPI.deleteThongBao(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      // Update unread count if it was unread
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.da_doc) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    loadNotifications();
    loadUnreadCount();
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

