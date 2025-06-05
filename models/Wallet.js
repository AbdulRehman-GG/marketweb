import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Transfer money to another wallet
walletSchema.methods.transfer = async function (toWallet, amount) {
    if (amount <= 0) {
        throw new Error('Transfer amount must be positive');
    }
    if (this.balance < amount) {
        throw new Error('Insufficient funds');
    }

    this.balance -= amount;
    toWallet.balance += amount;

    await Promise.all([this.save(), toWallet.save()]);
    return true;
};

// Add funds to wallet
walletSchema.methods.deposit = async function (amount) {
    if (amount <= 0) {
        throw new Error('Deposit amount must be positive');
    }

    this.balance += amount;
    return this.save();
};

// Remove funds from wallet
walletSchema.methods.withdraw = async function (amount) {
    if (amount <= 0) {
        throw new Error('Withdrawal amount must be positive');
    }
    if (this.balance < amount) {
        throw new Error('Insufficient funds');
    }

    this.balance -= amount;
    return this.save();
};

// Add to existing Wallet model
walletSchema.statics.createForUser = async function(userId) {
    const existingWallet = await this.findOne({ owner: userId });
    if (existingWallet) return existingWallet;
    
    return this.create({ owner: userId });
};

// Add this method
walletSchema.methods.getBalance = function() {
    return {
        balance: this.balance,
        lastUpdated: this.updatedAt
    };
};

export default mongoose.model('Wallet', walletSchema);
// module.exports = mongoose.model('Wallet', walletSchema);