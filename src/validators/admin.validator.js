const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

module.exports = { login };
