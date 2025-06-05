import { tryCatch, successResponse } from '../../utils/responseHandler.js';

export const listSessions = tryCatch(async (req, res) => {
    successResponse(res, req.user.sessions);
});

// this will be a socket function
export const revokeSession = tryCatch(async (req, res) => {
    const { id } = req.params;
    await req.user.removeSession(id);
    successResponse(res, null, 'Session revoked successfully');
});