const { validationResult } = require('express-validator');

module.exports = (schema) => async (req, res, next) => {
  await Promise.all(schema.map(validation => validation.run(req)));
  
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};