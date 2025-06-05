import { Router } from 'express';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { register } from '../controllers/auth/register.js';
import { login } from '../controllers/auth/login.js';
import { logout } from '../controllers/auth/logout.js';
import { getCurrentUser, updateProfile, deleteAccount } from '../controllers/auth/profile.js';
import { changePassword, forgotPassword, resetPassword } from '../controllers/auth/password.js';
import { verifyEmail, resendVerification } from '../controllers/auth/verification.js';
import { listSessions, revokeSession } from '../controllers/auth/sessions.js';
import * as authValidation from '../validations/authValidation.js';

const router = Router();

// Public routes with rate limiting
router.post('/register', 
    rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
    validateRequest(authValidation.registerSchema),
    register
);

router.post('/login',
    // rateLimiter({ windowMs: 5 * 60 * 1000, max: 5 }),
    validateRequest(authValidation.loginSchema),
    login
);

router.post('/forgot-password',
    rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }),
    validateRequest(authValidation.emailSchema),
    forgotPassword
);

router.post('/reset-password',
    rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }),
    validateRequest(authValidation.resetPasswordSchema),
    resetPassword
);

router.get('/verify-email/:token',
    rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
    verifyEmail 
);

router.post('/resend-verification',
    rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }),
    validateRequest(authValidation.emailSchema),
    resendVerification
);

// Protected routes
router.use(authenticateToken);
    
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/me',
    validateRequest(authValidation.updateProfileSchema),
    updateProfile
);
router.put('/change-password',
    validateRequest(authValidation.changePasswordSchema),
    changePassword
);
router.get('/sessions', listSessions);
router.delete('/sessions/:id', revokeSession);
router.delete('/me',
    validateRequest(authValidation.deleteAccountSchema),
    deleteAccount
);

export default router;
