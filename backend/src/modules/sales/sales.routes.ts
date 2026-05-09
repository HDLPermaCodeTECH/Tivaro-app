import { Router } from 'express';
import * as salesController from './sales.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', salesController.createSale);
router.get('/', salesController.getSales);

export default router;
