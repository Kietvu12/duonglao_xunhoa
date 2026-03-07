import express from 'express';
import { notifyHealthIndicator, notifySymptom } from '../controllers/externalNotificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * API endpoints để app khác trigger notification
 * Có thể yêu cầu authentication hoặc dùng API key
 */

// Endpoint để notify khi có chỉ số sức khỏe cảnh báo
// Có thể bỏ authenticate nếu app khác dùng API key riêng
router.post('/health-indicator', notifyHealthIndicator);

// Endpoint để notify khi có triệu chứng mới
router.post('/symptom', notifySymptom);

export default router;

