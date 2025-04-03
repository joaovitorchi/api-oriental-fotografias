const logger = require('../utils/logger');

/**
 * Middleware de log de requisições
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 * @param {Function} next - Próximo middleware
 */
module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    if (req.user) {
      logData.userId = req.user.userId;
    }

    // Log diferente para status >= 400
    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.path} - ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.path} - ${res.statusCode}`, logData);
    }
  });

  next();
};