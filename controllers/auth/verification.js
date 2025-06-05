import crypto from 'crypto';
import sendEmail from '../../utils/sendEmail.js';
import User from '../../models/User.js';
import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';

export const verifyEmail = tryCatch(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return errorResponse(res, 'Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    successResponse(res, null, 'Email verified successfully');
});

export const resendVerification = tryCatch(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
        return successResponse(res, null, 
            'If an unverified account exists, you will receive a verification email'
        );
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL + process.env.PORT}/verify-email/${verificationToken}`;
    await sendEmail({
        to: email,
        subject: 'Email Verification',
        html: `<h1>Verify Your Email</h1><a href="${verificationUrl}">Click here to verify</a>`
    });

    successResponse(res, null, 'Verification email sent');
});