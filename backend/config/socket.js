import { Server } from 'socket.io';

let io = null;

/**
 * Khởi tạo Socket.IO server
 * @param {http.Server} server - HTTP server instance
 * @returns {Server} - Socket.IO server instance
 */
export function initializeSocket(server) {
  // Socket.IO lắng nghe tại /socket.io/ (path mặc định)
  // Nginx sẽ proxy từ /api_quanlyduonglao/socket.io/ đến /socket.io/
  io = new Server(server, {
    path: '/socket.io/',
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Người dùng join room theo user ID
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined room: user_${userId}`);
      }
    });

    // Người dùng leave room
    socket.on('leave_user_room', (userId) => {
      if (userId) {
        socket.leave(`user_${userId}`);
        console.log(`👋 User ${userId} left room: user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Lấy Socket.IO instance
 * @returns {Server|null} - Socket.IO server instance
 */
export function getSocketIO() {
  return io;
}

