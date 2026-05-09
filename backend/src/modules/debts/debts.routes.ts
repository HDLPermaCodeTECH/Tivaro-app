import { Router } from 'express';
import * as debtsController from './debts.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', debtsController.getDebts);
router.post('/', debtsController.createDebt);
router.post('/:id/payments', debtsController.addPayment);
router.delete('/:id', debtsController.deleteDebt);

export default router;
