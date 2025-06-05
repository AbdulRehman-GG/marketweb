import Gig from "../../models/Gig.js";
import { createGigSchema } from "../../validations/gigValidation.js";
import { tryCatch, successResponse, errorResponse } from '../../utils/responseHandler.js';

const CreateGig = async (req, res) => {
    try {
        // Validate request body
        const { error } = createGigSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message);
        }

        const { game, type, title, price, deliveryType, deliveryTime } = req.body;
        const sellerID = req.user._id;

        const gig = new Gig({
            sellerID,
            game,
            type,
            title,
            price,
            deliveryType,
            deliveryTime: deliveryType === 'manual' ? deliveryTime : 'instant',
            status: 'active'
        });

        await gig.save();
        successResponse(res,  gig, 'Gig created successfully');


    } catch (error) {
        errorResponse(res, error);
    }
}

export default CreateGig;