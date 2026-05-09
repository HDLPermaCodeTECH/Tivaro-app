import { Router } from 'express';
import * as reportsController from './reports.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/shift', authenticate, reportsController.createShiftReport);
router.get('/shift-stats', authenticate, reportsController.getMyShiftStats);
router.get('/', authenticate, reportsController.getShiftReports);

export default router;
