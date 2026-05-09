import { Router } from 'express';
import * as authController from './auth.controller';

import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/upgrade', authenticate, authController.upgrade);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/logo', authenticate, authController.upload.single('logo'), authController.uploadLogo);
router.post('/staff', authenticate, authController.createStaff);
router.get('/staff', authenticate, authController.getStaff);
router.put('/staff/:id', authenticate, authController.updateStaff);
router.delete('/staff/:id', authenticate, authController.deleteStaff);
router.get('/me', authenticate, authController.getMe);
router.get('/shift-summary', authenticate, authController.getShiftSummary);

export default router;
