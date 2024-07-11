const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(6).max(15).alphanum().required(),
    password: Joi.string().min(6).max(15).alphanum().required(),
    confirm_password: Joi.ref('password'),
    firstname: Joi.string().required(),
    lastname: Joi.string().required()
})

const bookSchema = Joi.object({
    bookdate : Joi.any().required(),
    time_start : Joi.string().regex(/^([01]\d|2[0-3]):?([0][0])$/).required(),
    time_end : Joi.string().regex(/^([01]\d|2[0-3]):?([0][0])$/).required().invalid(Joi.ref('time_start')),
    ref_code : Joi.string(),   
    rate_cost : Joi.number().required(),
    user_id : Joi.number().required()
})

const oValidateUserData = (oData) => {
    const oResult = userSchema.validate(oData);
    return oResult;
}

const oValidateBookSchema = (oData) => {
    const oResult = bookSchema.validate(oData);
    return oResult;
}

module.exports.oValidateUserData = oValidateUserData;
module.exports.oValidateBookSchema = oValidateBookSchema;