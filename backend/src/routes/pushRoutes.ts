import { Router } from 'express';
import { authenticateAny } from '@middleware/authenticate';
import { validateRequest } from '@middleware/validateRequest';
import { subscribePushSchema } from '@validators/coreValidators';
import { pushController } from '@controllers/pushController';

const router = Router();

// VAPID public key — no auth required (needed before the user is logged in)
router.get('/vapid-key', pushController.getVapidKey);

// All other push routes require authentication
router.use(authenticateAny);
router.post('/subscribe', validateRequest(subscribePushSchema), pushController.subscribe);
router.delete('/subscribe/:id', pushController.unsubscribe);
router.get('/subscriptions', pushController.listSubscriptions);

export default router;
