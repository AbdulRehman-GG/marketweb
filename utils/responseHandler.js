export const successResponse = (res, data = null, message = 'Success', status = null) => {
    const response = {
        success: true
    };

    if (message) response.message = message;
    if (data) response.data = data;

    if (status) {
        res.status(status).json(response);
    } else {
        res.json(response);
    }
};

export const errorResponse = (res, message, status = null) => {
    const response = {
        success: false,
        message
    };

    if (status) {
        res.status(status).json(response);
    } else {
        res.json(response);
    }
};

export const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        errorResponse(res, error.message);
    }
};

