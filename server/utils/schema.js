// Define a Joi schema to validate data against the Mongoose schema
const Joi = require('joi');
const memberInfoValidationSchema = Joi.object({
  name: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().required(),
  image: Joi.string().required(),
  year: Joi.string().required(),
  socialLinks: Joi.object({
      facebookLink: Joi.string().required(),
      linkedinLink: Joi.string().required(),
      instagramLink: Joi.string().required(),
  }).required()
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