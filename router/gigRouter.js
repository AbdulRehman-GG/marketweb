import { Router } from 'express';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import CreateGig from '../controllers/gig/createGig.js';
import * as gigValidation from '../validations/gigValidation.js';
import { tryCatch, successResponse, errorResponse } from '../utils/responseHandler.js';

const router = Router();


const isSeller = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return errorResponse(res, 'Only sellers can create gigs');
    }
    next();
};


// Protected routes
router.use(authenticateToken);
router.use(isSeller);
router.post('/',
    // rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
    validateRequest(gigValidation.createGigSchema),
    CreateGig
);


export default router;
