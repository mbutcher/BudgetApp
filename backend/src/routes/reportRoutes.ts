import { Router } from 'express';
import { reportController } from '@controllers/reportController';
import { authenticate } from '@middleware/authenticate';

const router = Router();

router.use(authenticate);

router.get('/monthly-summary', reportController.monthlySummary);
router.get('/forecast', reportController.forecast);

export default router;
