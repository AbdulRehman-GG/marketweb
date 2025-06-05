import User from '../../models/User.js';
import { successResponse, errorResponse, tryCatch } from '../../utils/responseHandler.js';


export const login = tryCatch(async (req, res) => {
    const { login, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: login }, { username: login }]
    });

    if (!user) {
        return errorResponse(res, 'Invalid credentials');
    }
    if (!user.isVerified) {
        return errorResponse(res, 'Please verify your email first');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return errorResponse(res, 'Invalid credentials');
    }

    const token = await user.createAuthToken();
    const userData = await user.getPublicProfile();
    
    const data = {
        token,
        user: userData
    }

    successResponse(res, data, 'Login successful');
});
