import Order from '../../models/Order.js';
import Gig from '../../models/Gig.js';
import Wallet from '../../models/Wallet.js';
import Transaction from '../../models/Transactions.js';
import mongoose from 'mongoose';
import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';

export const createOrder = tryCatch(async (req, res) => {
    const { gigID, deliveryDetails } = req.body;
    
    // 1. Validate gigID format
    if (!mongoose.Types.ObjectId.isValid(gigID)) {
        return errorResponse(res, 'Invalid gig ID format');
    }

    // 2. Find gig with detailed logging
    console.log(`Searching for gig with ID: ${gigID}`);
    const gig = await Gig.findById(gigID);
    
    if (!gig) {
        console.log('Gig not found in database');
        return errorResponse(res, 'Gig not found');
    }

    if (gig.status !== 'active') {
        console.log(`Gig found but status is ${gig.status}`);
       return errorResponse(res, 'Gig not available for purchase');
    }

    // 3. Check buyer wallet
    const buyerWallet = await Wallet.findOne({ owner: req.user._id });
    if (!buyerWallet) {
        return successResponse(res, 'Wallet not found');
    }

    if (buyerWallet.balance < gig.price) {
        return errorResponse(res, 'Insufficient funds in wallet');
    }

    // 4. Create transaction and order
    const transaction = await Transaction.createPurchase(req.user._id, gigID, gig.price);
    const order = new Order({
        buyerID: req.user._id,
        gigID,
        transactionID: transaction._id,
        amount: gig.price,
        deliveryDetails,
        status: 'processing'
    });

    await order.save();
    await buyerWallet.withdraw(gig.price);
    
    successResponse(res, order, 'Order created successfully');
});

