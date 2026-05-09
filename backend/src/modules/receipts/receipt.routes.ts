import { Router } from 'express';
import * as receiptController from './receipt.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:id', receiptController.getReceipt);

export default router;
