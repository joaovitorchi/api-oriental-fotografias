/**
 * Middleware de CORS configurável
 * @param {Object} options - Opções de configuração
 * @returns {Function} Middleware function
 */
module.exports = (options = {}) => {
    const defaults = {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: [],
      maxAge: 86400 // 24 horas
    };
  
    const config = { ...defaults, ...options };
  
    return (req, res, next) => {
      const origin = req.headers.origin;
      
      // Verificar origem permitida
      if (config.allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
  
      res.setHeader('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
      res.setHeader('Access-Control-Expose-Headers', config.exposeHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', config.maxAge);
  
      // Permitir credenciais se necessário
      if (config.allowCredentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
  
      // Responder imediatamente para requisições OPTIONS
      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
  
      next();
    };
  };