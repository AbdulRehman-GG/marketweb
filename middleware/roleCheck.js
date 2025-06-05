import { errorResponse, tryCatch } from '../utils/responseHandler';

export const checkRole = (...roles) => {
    return tryCatch(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Access denied');
        }
        next();
    });
};