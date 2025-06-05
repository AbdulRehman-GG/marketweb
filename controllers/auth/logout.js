import { tryCatch, successResponse } from '../../utils/responseHandler.js';

export const logout = tryCatch(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    req.user.sessions = req.user.sessions.filter(session => session.token !== token);
    await req.user.save();
    
    successResponse(res, null, 'Logged out successfully');
});