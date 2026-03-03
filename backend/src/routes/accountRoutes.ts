import { Router } from 'express';
import { accountController } from '@controllers/accountController';
import { accountShareController } from '@controllers/accountShareController';
import { authenticateAny, requireScope } from '@middleware/authenticate';
import { loadHousehold } from '@middleware/requireHousehold';
import { validateRequest } from '@middleware/validateRequest';
import {
  createAccountSchema,
  updateAccountSchema,
  putSharesSchema,
  patchShareSchema,
} from '@validators/coreValidators';

const router = Router();

router.use(authenticateAny);
router.use(requireScope('accounts:read'));
router.use(loadHousehold);

router.get('/', accountController.list);
router.post('/', validateRequest(createAccountSchema), accountController.create);
router.get('/:id', accountController.get);
router.patch('/:id', validateRequest(updateAccountSchema), accountController.update);
router.delete('/:id', accountController.archive);

// ─── Account share management ─────────────────────────────────────────────────
router.get('/:id/shares', accountShareController.getShares);
router.put('/:id/shares', validateRequest(putSharesSchema), accountShareController.putShares);
router.patch(
  '/:id/shares/:userId',
  validateRequest(patchShareSchema),
  accountShareController.patchShare
);

export default router;
