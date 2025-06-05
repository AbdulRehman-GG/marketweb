import crypto from 'crypto';
import sendEmail from '../../utils/sendEmail.js';
import User from '../../models/User.js';
import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';

export const changePassword = tryCatch(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!(await req.user.comparePassword(currentPassword))) {
        return errorResponse(res, 'Current password is incorrect');
    }

    req.user.password = newPassword;
    await req.user.save();

    successResponse(res, null, 'Password updated successfully');
});

export const forgotPassword = tryCatch(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return successResponse(res, null, 
            'If an account exists, you will receive a password reset email'
        );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
        to: email,
        subject: 'Password Reset',
        html: `<h1>Reset Your Password</h1><a href="${resetUrl}">Click here to reset</a>`
    });

    successResponse(res, null, 'Password reset email sent');
});

export const resetPassword = tryCatch(async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return errorResponse(res, 'Invalid or expired token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    successResponse(res, null, 'Password reset successful');
});