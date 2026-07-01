const Joi = require('joi');

const create = Joi.object({
  day: Joi.string().trim().max(2).required(),
  month: Joi.string().trim().max(3).required(),
  title: Joi.string().trim().max(200).required(),
  time: Joi.string().trim().max(100).required(),
  location: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(2000).required(),
  rsvpCount: Joi.number().integer().min(0).default(0),
});

const update = Joi.object({
  day: Joi.string().trim().max(2),
  month: Joi.string().trim().max(3),
  title: Joi.string().trim().max(200),
  time: Joi.string().trim().max(100),
  location: Joi.string().trim().max(200),
  description: Joi.string().trim().max(2000),
  rsvpCount: Joi.number().integer().min(0),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = { create, update, idParam };
