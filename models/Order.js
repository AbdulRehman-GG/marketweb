import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gigID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true
    },
    transactionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'disputed'],
        default: 'pending'
    },
    deliveryDetails: {
        type: String // Could be game account info or other details
    },
    disputeReason: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);