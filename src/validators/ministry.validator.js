const Joi = require('joi');

const create = Joi.object({
  title: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).required(),
  tagline: Joi.string().trim().max(200).required(),
  iconName: Joi.string().valid('smile', 'users', 'heart').required(),
  detailedDescription: Joi.string().trim().max(2000).required(),
  meetingTimes: Joi.string().trim().max(300).required(),
  contactEmail: Joi.string().trim().email().required(),
  volunteerNeeds: Joi.string().trim().max(500).allow(''),
});

const update = Joi.object({
  title: Joi.string().trim().max(100),
  description: Joi.string().trim().max(500),
  tagline: Joi.string().trim().max(200),
  iconName: Joi.string().valid('smile', 'users', 'heart'),
  detailedDescription: Joi.string().trim().max(2000),
  meetingTimes: Joi.string().trim().max(300),
  contactEmail: Joi.string().trim().email(),
  volunteerNeeds: Joi.string().trim().max(500).allow(''),
}).min(1);

const idParam = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = { create, update, idParam };
