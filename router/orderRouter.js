import { Router } from 'express';
import { createOrder } from '../controllers/order/createOrder.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

router.use(authenticateToken); // Protect all order routes
router.post('/', createOrder); // POST /api/orders

export default router;