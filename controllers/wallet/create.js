import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';
import Wallet from '../../models/Wallet.js';

export const create = tryCatch(async (req, res) => {
    
    const wallet = await Wallet.createForUser(req.user._id);
    successResponse(res, wallet, 'Wallet created successfully');
})

