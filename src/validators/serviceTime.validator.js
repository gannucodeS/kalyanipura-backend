const Joi = require('joi');

const create = Joi.object({
  title: Joi.string().trim().max(100).required(),
  time: Joi.string().trim().max(100).required(),
  tagline: Joi.string().trim().max(200).required(),
  category: Joi.string().trim().max(100).required(),
  icon: Joi.string().valid('sun', 'moon', 'users').required(),
});

const update = Joi.object({
  title: Joi.string().trim().max(100),
  time: Joi.string().trim().max(100),
  tagline: Joi.string().trim().max(200),
  category: Joi.string().trim().max(100),
  icon: Joi.string().valid('sun', 'moon', 'users'),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = { create, update, idParam };
