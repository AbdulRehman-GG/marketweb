import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Wallet from './Wallet.js'; // Assuming you have a Wallet model
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Add these fields to your existing schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return emailRegex.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    bio: {
        type: String,
        maxlength: [200, 'Bio cannot be more than 200 characters'],
        default: ''
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        select: false // Hide from query results by default
    },
    verificationTokenExpiry: {
        type: Date,
        select: false // Hide from query results by default
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    sessions: [{
        token: String,
        device: String,
        lastActive: {
            type: Date,
            default: Date.now
        },
        expiresAt: Date
    }],
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }
});

// Add these methods to your existing schema
userSchema.methods.createAuthToken = async function () {
    const token = jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    this.sessions.push({
        token,
        device: 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await this.save();
    return token;
};

userSchema.methods.removeSession = async function (sessionId) {
    this.sessions = this.sessions.filter(session =>
        session._id.toString() !== sessionId
    );
    await this.save();
};

// Index for faster queries
userSchema.index({ email: 1, username: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

userSchema.methods.getPublicProfile = async function () {
    const wallet = await Wallet.findOne({ owner: this._id });
    
    const profile = {   
        id: this._id,
        username: this.username,
        email: this.email,
        name: this.name,
        avatar: this.avatar,
        bio: this.bio,
        status: this.status,
        balance: wallet ? wallet.balance : 0
    };

    Object.keys(profile).forEach(key => {
        if (profile[key] === undefined) {
            profile[key] = null;
        }
    });

    return profile;
};

const User = mongoose.model('User', userSchema);
export default User;