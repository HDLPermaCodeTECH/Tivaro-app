import { Router } from 'express';
import { createCheckoutSession, createSubscription } from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Protect this route, only logged in users can create a session
router.post('/create-session', authenticate, createCheckoutSession);
router.post('/create-subscription', authenticate, createSubscription);

export default router;
