const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().trim().email().required(),
});

module.exports = { create };
