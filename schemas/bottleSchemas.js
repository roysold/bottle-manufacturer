import Joi from "joi";

const POSTbottleSchema = {
    creationDate: Joi.date().required(),
    orderID: Joi.string().regex(/^\d+$/).required(),
    factoryID: Joi.string().regex(/^\d+$/).required()
};

const PUTbottleSchema = {
    id: Joi.string().regex(/^\d+$/).required(),
    creationDate: Joi.date(),
    orderID: Joi.string().regex(/^\d+$/),
    factoryID: Joi.string().regex(/^\d+$/)
}

export default {
    POST: POSTbottleSchema,
    PUT: PUTbottleSchema
};