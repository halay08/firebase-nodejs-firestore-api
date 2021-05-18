import { getCountryCodes, getCountryNames, getTimezones } from '@/src/app/helpers';
import { Joi, validate } from 'express-validation';

export type NewUserPayload = {
    id?: string;
    role?: string;
    email: string;
    name?: string;
    password?: string;
};

const Validation = {
    create: {
        body: Joi.object({
            role: Joi.string().optional(),
            email: Joi.string().email().required(),
            id: Joi.string().optional(),
            name: Joi.string().optional(),
            password: Joi.string().optional().min(8)
        })
    },
    update: {
        body: Joi.object({
            role: Joi.string().optional(),
            email: Joi.string().email().optional(),
            name: Joi.string().optional(),
            phoneNumber: Joi.string().optional(),
            biography: Joi.string().optional(),
            birthday: Joi.date().optional(),
            address: Joi.string().optional(),
            timezone: Joi.string()
                .optional()
                .valid(...getTimezones()),
            avatar: Joi.string().optional(),
            country: Joi.string()
                .optional()
                .valid(...getCountryNames()),
            language: Joi.string()
                .optional()
                .valid(...getCountryCodes())
        })
    }
};

export const validateCreate = validate(Validation.create);
export const validateUpdate = validate(Validation.update);
