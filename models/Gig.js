// models/Gig.js
import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['boosting', 'account', 'topup'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    deliveryType: {
        type: String,
        enum: ['automated', 'manual'],
        required: true
    },
    deliveryTime: {
        type: String,
        required: function() {
            return this.deliveryType === 'manual';
        },
        validate: {
            validator: function(v) {
                if (this.deliveryType === 'automated') return true;
                return /^\d+\s+(minutes|hours|days)$/.test(v);
            },
            message: props => `${props.value} is not a valid delivery time format!`
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    }
}, { timestamps: true });

// gigSchema.virtual('accounts', {
//     ref: 'Account',
//     localField: '_id',
//     foreignField: 'gigID'
// });

// gigSchema.set('toObject', { virtuals: true });
// gigSchema.set('toJSON', { virtuals: true });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;
