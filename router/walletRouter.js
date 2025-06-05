import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { tryCatch } from '../utils/responseHandler.js';
import { getBalance } from '../controllers/wallet/balance.js';
import { create } from '../controllers/wallet/create.js';
const router = Router();

router.use(authenticateToken); // Protect all order routes
router.post('/create', create);

router.get('/balance', getBalance);

export default router;