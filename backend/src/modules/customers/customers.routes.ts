import { Router } from 'express';
import * as customersController from './customers.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', customersController.getCustomers);
router.post('/', customersController.createCustomer);
router.get('/:id', customersController.getCustomerById);

export default router;
