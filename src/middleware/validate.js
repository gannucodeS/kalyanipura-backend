const ApiError = require('../utils/ApiError');

const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    req[source] = value;
    next();
  };
};

const validateQuery = (schema) => validate(schema, 'query');
const validateParams = (schema) => validate(schema, 'params');
const validateBody = (schema) => validate(schema, 'body');

module.exports = { validate, validateQuery, validateParams, validateBody };
