import {register,login,logout,updateUserProfile} from '../controllers/user.controller.js';
import express from 'express';

const router =express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/profile', updateUserProfile);



export default router;