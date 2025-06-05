import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    username: Joi.string().required().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
});

export const loginSchema = Joi.object({
    login: Joi.string().required(), // ✅ Or username if you prefer
    password: Joi.string().required()
});

export const emailSchema = Joi.object({
    email: Joi.string().required().email()
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().min(8).max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).allow(null),
    username: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).allow(null),
    bio: Joi.string().max(200).allow(null, ''),
    avatar: Joi.string().allow(null, '')
}).min(1);

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(8).max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

export const deleteAccountSchema = Joi.object({
    password: Joi.string().required()
});