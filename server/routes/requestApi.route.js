import {TestApi} from '../controllers/requestApi.controller.js';
import express from 'express';
import { authMiddleware } from "../middleware/auth.js";

const router =express.Router();


router.post('/test', TestApi);



export default router;