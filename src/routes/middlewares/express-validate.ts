import { NextFunction, Request, Response } from 'express';
import { ExpressResponse } from '../../core/utils/response.js';
import Joi, { ValidationResult } from 'joi';

const RequestCase = (originalUrl: string, method: string) => {
    return `[${ method }]-${ originalUrl }` as const
}

/* Request body validation schema */
const ExpressSchemas = async ({ originalUrl, method, body }: Request): Promise<ValidationResult | boolean> => {
    switch (RequestCase(originalUrl, method)) {
        case '[POST]-/api/webhooks/register' : {
            return await Joi.object({
                hookid: Joi.string().required(),
                handler: Joi.string().required()
            }).validateAsync(body) as ValidationResult
        }

        default: {
            return true
        }
    }
}

export const ExpressRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await ExpressSchemas(req)
        next()
    } catch (error: unknown) {
        if (Joi.isError(error)) {
            return ExpressResponse(res, false, 400, {
                missing: error.details[0].message.replace(/"/g, ''),
                message: 'INVALID_PAYLOAD'
            })
        }
        return ExpressResponse(res, false, 500, 'ERROR')
    }
}
