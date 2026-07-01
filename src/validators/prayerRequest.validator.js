const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().trim().max(100).allow('').default('Anonymous'),
  category: Joi.string().valid('Guidance', 'Healing', 'Comfort', 'Thanksgiving', 'Other').required(),
  request: Joi.string().trim().max(1000).required(),
  isAnonymous: Joi.boolean().default(false),
});

const idParam = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = { create, idParam };
