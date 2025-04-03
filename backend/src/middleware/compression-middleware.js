const compression = require('compression');
const logger = require('../utils/logger');

/**
 * Middleware de compressão de respostas
 * @returns {Function} Middleware function
 */
module.exports = () => {
  return compression({
    // Filtra quais tipos de conteúdo comprimir
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      
      const contentType = res.getHeader('Content-Type');
      const shouldCompress = /text|javascript|json|xml|font|css/i.test(contentType);
      
      if (shouldCompress) {
        logger.debug(`Comprimindo resposta para ${req.path}`, {
          contentType,
          originalSize: res.getHeader('Content-Length')
        });
      }
      
      return shouldCompress;
    },
    // Nível de compressão (1-9)
    level: 6,
    // Limiar mínimo para compressão (bytes)
    threshold: 1024
  });
};