import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { tryCatch, successResponse, errorResponse } from '../utils/responseHandler.js';

export const authenticateToken = async (req, res, next) => {
    console.log("Auth middleware triggered for:", req.path); // Add this

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("Token found:", !!token); // And this

        if (!token) {
            return errorResponse(res, 'Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return errorResponse(res, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid token');
    }
};