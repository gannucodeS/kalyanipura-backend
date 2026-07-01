const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().trim().email().required(),
  topic: Joi.string().trim().max(100).required(),
  message: Joi.string().trim().max(5000).required(),
});

module.exports = { create };
