import Joi from 'joi';
import { tryCatch, successResponse, errorResponse } from '../utils/responseHandler.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false, // returns all errors
            allowUnknown: true, // allows unknown props
            stripUnknown: true // removes unknown props
        });

        if (error) {
            return errorResponse(res, error.details.map(detail => detail.message).join(', '));
        }

        // Replace req.body with validated data
        req.body = schema.validate(req.body, { stripUnknown: true }).value;
        next();
    };
};