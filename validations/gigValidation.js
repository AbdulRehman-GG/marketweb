import Joi from 'joi';

export const createGigSchema = Joi.object({
    game: Joi.string().required().trim(),
    type: Joi.string().required().valid('boosting', 'account', 'topup'),
    title: Joi.string().required().min(5).max(100).trim(),
    price: Joi.number().required().min(0),
    deliveryType: Joi.string().required().valid('automated', 'manual'),
    deliveryTime: Joi.alternatives().conditional('deliveryType', {
        is: 'manual',
        then: Joi.string().required().pattern(/^\d+\s+(minutes|hours|days)$/)
            .message('Delivery time must be in format "number hours|minutes|days"'),
        otherwise: Joi.valid('instant').default('instant')
    })
});

// export const updateGigSchema = Joi.object({
//     game: Joi.string().trim(),
//     type: Joi.string().valid('boosting', 'account', 'topup'),
//     title: Joi.string().min(5).max(100).trim(),
//     price: Joi.number().min(0),
//     deliveryType: Joi.string().valid('automated', 'manual'),
//     deliveryTime: Joi.when('deliveryType', {
//         is: 'manual',
//         then: Joi.object({
//             value: Joi.number().min(1),
//             unit: Joi.string().valid('hours', 'minutes', 'days')
//         }),
//         otherwise: Joi.string().valid('instant').default('instant')
//     }),
//     status: Joi.string().valid('active', 'inactive', 'completed')
// }).min(1);