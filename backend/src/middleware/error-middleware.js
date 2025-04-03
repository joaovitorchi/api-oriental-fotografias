const logger = require('../utils/logger');
const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} = require('../utils/errors');

/**
 * Middleware de tratamento de erros
 * @param {Error} err - Objeto de erro
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 * @param {Function} next - Próximo middleware
 */
module.exports = (err, req, res, next) => {
  // Log detalhado do erro
  logger.error(err.message, {
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    errorDetails: err.details || {}
  });

  // Formatando resposta baseada no tipo de erro
  if (err instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      error: err.message,
      code: 'VALIDATION_ERROR',
      details: err.details
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      error: err.message,
      code: 'UNAUTHORIZED'
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      success: false,
      error: err.message,
      code: 'FORBIDDEN'
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: err.message,
      code: 'NOT_FOUND'
    });
  }

  // Erro genérico (500)
  const errorResponse = {
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erro interno no servidor',
    code: 'INTERNAL_ERROR'
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
};