import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Gig',
        required: function () {
            return this.type !== 'topup';
        },
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ['purchase', 'refund', 'topup']
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

transactionSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'transactionID',
    justOne: true
});

transactionSchema.set('toObject', { virtuals: true });
transactionSchema.set('toJSON', { virtuals: true });

transactionSchema.statics.createPurchase = async function(userId, gigId, amount) {
    return this.create({
        userId,
        productId: gigId,
        type: 'purchase',
        amount,
        status: 'pending'
    });
};

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction; 

// export default Transaction; // Changed from module.exports

// module.exports = mongoose.model('Transaction', transactionSchema);