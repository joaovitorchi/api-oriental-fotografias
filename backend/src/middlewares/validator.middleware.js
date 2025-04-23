const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errors');

/**
 * Middleware de validação de dados
 * @param {Array} validations - Array de validações do express-validator
 * @returns {Function} Middleware function
 */
module.exports = (validations) => {
  return async (req, res, next) => {
    try {
      // Executar todas as validações
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Verificar resultados
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
          field: err.param,
          location: err.location,
          message: err.msg,
          value: err.value
        }));

        logger.debug('Validação falhou', {
          path: req.path,
          errors: formattedErrors,
          body: req.body
        });

        throw new ValidationError('Dados inválidos', formattedErrors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};