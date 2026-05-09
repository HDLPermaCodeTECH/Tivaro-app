import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', analyticsController.getAnalytics);
router.get('/pl', analyticsController.getPLReport);

export default router;
