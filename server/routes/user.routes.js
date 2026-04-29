import {register,login,logout,updateProfile} from '../controllers/user.controller.js';
import express from 'express';
import { authMiddleware } from "../middleware/auth.js";

const router =express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout',  authMiddleware,logout);
router.put('/profile', authMiddleware, updateProfile);



export default router;