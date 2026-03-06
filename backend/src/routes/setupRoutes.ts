import { Router } from 'express';
import { setupController } from '@controllers/setupController';

const router = Router();

// No auth — available only while no users/households exist (first run only)
router.get('/initial-secrets', setupController.getInitialSecrets);

export default router;
