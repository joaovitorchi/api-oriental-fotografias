const logger = require('../utils/logger');

/**
 * Middleware de log de requisições
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 * @param {Function} next - Próximo middleware
 */
module.exports = (req, res, next) => {
  // Verifica se 'req' e 'res' são objetos válidos
  if (!req || typeof req.method !== 'string' || !res || typeof res.on !== 'function') {
    logger.error('Objeto req ou res não é válido', {
      req: req,
      res: res
    });
    return;  // Interrompe a execução do middleware
  }

  const start = Date.now();

  // Usa 'finish' para logar quando a resposta for concluída
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,  // Usando 'originalUrl' para garantir o caminho correto
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    // Loga o ID do usuário se estiver presente
    if (req.user) {
      logData.userId = req.user.userId;
    }

    // Loga a resposta com base no status
    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, logData);
    }
  });

  // Passa para o próximo middleware ou rota se 'req' e 'res' estiverem válidos
  next();
};
