// Define a Joi schema to validate data against the Mongoose schema
const Joi = require('joi');
const memberInfoValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.object({
      url: Joi.string().uri(),
      filename: Joi.string(),
    }),
  });

const eventValidationSchema = Joi.object({
    eventName: Joi.string().required(),
    eventDate: Joi.string().required(),
});

const messageValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
});




module.exports = {
    memberInfoValidationSchema,
    eventValidationSchema,
    messageValidationSchema
};