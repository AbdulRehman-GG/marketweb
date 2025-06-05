import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';
import Wallet from '../../models/Wallet.js';

export const getBalance = tryCatch(async (req, res) => {
    const wallet = await Wallet.findOne({ owner: req.user._id });
    if (!wallet) return errorResponse(res, 'Wallet not found');

    successResponse(res, wallet.getBalance());

})

