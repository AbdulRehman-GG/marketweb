import User from '../../models/User.js';
import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';

export const getCurrentUser = tryCatch(async (req, res) => {
    if (!req.user) {
        return errorResponse(res, 'User not found');
    }
    
    const userProfile = await req.user.getPublicProfile();
    if (!userProfile) {
        return errorResponse(res, 'Error fetching user profile');
    }
    
    successResponse(res, userProfile);
});

export const updateProfile = tryCatch(async (req, res) => {
    const updates = Object.keys(req.body);
    
    if (req.body.username && req.body.username !== req.user.username) {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return errorResponse(res, 'Username already taken');
        }
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    await successResponse(res, req.user.getPublicProfile(), 'Profile updated successfully');
});

export const deleteAccount = tryCatch(async (req, res) => {
    const { password } = req.body;
    
    if (!(await req.user.comparePassword(password))) {
        return errorResponse(res, 'Invalid password');
    }

    await User.deleteOne({ _id: req.user._id });
    successResponse(res, null, 'Account deleted successfully');
});