import { Router } from 'express';
import { transactionController } from '@controllers/transactionController';
import { authenticateAny, requireScope } from '@middleware/authenticate';
import { validateRequest } from '@middleware/validateRequest';
import {
  createTransactionSchema,
  updateTransactionSchema,
  linkTransactionSchema,
} from '@validators/coreValidators';

const router = Router();

router.use(authenticateAny);

router.get('/tags', requireScope('transactions:read'), transactionController.listTags);
router.get('/', requireScope('transactions:read'), transactionController.list);
router.post(
  '/',
  requireScope('transactions:write'),
  validateRequest(createTransactionSchema),
  transactionController.create
);
router.get('/:id', requireScope('transactions:read'), transactionController.get);
router.patch(
  '/:id',
  requireScope('transactions:write'),
  validateRequest(updateTransactionSchema),
  transactionController.update
);
router.delete('/:id', requireScope('transactions:write'), transactionController.delete);

// Transfer linking
router.get(
  '/:id/candidates',
  requireScope('transactions:read'),
  transactionController.getCandidates
);
router.post(
  '/:id/link',
  requireScope('transactions:write'),
  validateRequest(linkTransactionSchema),
  transactionController.link
);
router.delete('/:id/link', requireScope('transactions:write'), transactionController.unlink);

export default router;
