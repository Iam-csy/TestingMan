import express from 'express';
import { getHistory, createHistory, clearHistory } from '../controllers/history.controller.js';
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.post('/', authMiddleware, createHistory);
router.delete('/', authMiddleware, clearHistory);

export default router;
