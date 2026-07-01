const Joi = require('joi');

const create = Joi.object({
  imageUrl: Joi.string().trim().uri().required(),
  description: Joi.string().trim().max(500).required(),
  category: Joi.string().trim().max(100).required(),
});

const update = Joi.object({
  imageUrl: Joi.string().trim().uri(),
  description: Joi.string().trim().max(500),
  category: Joi.string().trim().max(100),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = { create, update, idParam };
