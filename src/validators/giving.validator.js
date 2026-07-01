const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().trim().email().required(),
  amount: Joi.number().min(1).required(),
  frequency: Joi.string().valid('once', 'monthly').required(),
});

module.exports = { create };
