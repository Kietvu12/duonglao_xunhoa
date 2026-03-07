import express from 'express';
import { getPublicHealthAlerts } from '../controllers/publicHealthAlertsController.js';

const router = express.Router();

// Public route - không cần authentication
router.get('/', getPublicHealthAlerts);

export default router;

