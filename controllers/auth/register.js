import User from '../../models/User.js';
import crypto from 'crypto';
import Wallet from '../../models/Wallet.js';
import sendEmail from '../../utils/sendEmail.js';
import { tryCatch, successResponse } from '../../utils/responseHandler.js';

// improve, check if user already exist or not
export const register = tryCatch(async (req, res) => {
    console.log("Register endpoint hit!");
    const { email, password, name, username } = req.body;
    console.log("Received data:", {email, username});

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
        name,
        email,
        password,
        username,
        verificationToken,
        verificationTokenExpiry
    });

    await Wallet.createForUser(newUser._id);
    const verificationUrl = `${process.env.FRONTEND_URL + process.env.PORT}/verify-email/${verificationToken}`;
    await sendEmail({
        to: email,
        subject: 'Email Verification',
        html: `<h1>Verify Your Email</h1><a href="${verificationUrl}">Click here to verify</a>`
    });

    successResponse(res, newUser.getPublicProfile(), 
        'Registration successful. Please check your email for verification.'
    );
});