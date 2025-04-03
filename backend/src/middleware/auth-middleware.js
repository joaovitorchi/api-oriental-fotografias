const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');
const { UnauthorizedError } = require('../utils/errors');

const userRepo = new UserRepository();

/**
 * Middleware de autenticação JWT
 * @param {string[]} requiredPermissions - Permissões necessárias (opcional)
 * @returns {Function} Middleware function
 */
module.exports = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // 1. Obter token do header
      const authHeader = req.header('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (!token) {
        logger.warn('Tentativa de acesso sem token', { path: req.path });
        throw new UnauthorizedError('Token de autenticação não fornecido');
      }

      // 2. Verificar e decodificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Buscar usuário no banco
      const user = await userRepo.findById(decoded.userId);
      if (!user || !user.active) {
        logger.warn('Tentativa de acesso com token inválido', { 
          userId: decoded.userId, 
          path: req.path 
        });
        throw new UnauthorizedError('Usuário não encontrado ou inativo');
      }

      // 4. Verificar permissões (se especificado)
      if (requiredPermissions.length > 0) {
        await user.loadPermissions();
        
        const hasPermission = requiredPermissions.some(perm => 
          user.hasPermission(perm)
        );
        
        if (!hasPermission) {
          logger.warn('Tentativa de acesso sem permissão', { 
            userId: user.userId, 
            requiredPermissions,
            userPermissions: user.permissions
          });
          throw new UnauthorizedError('Acesso não autorizado');
        }
      }

      // 5. Adicionar usuário à requisição
      req.user = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      };

      logger.info(`Acesso autorizado para ${user.email}`, { 
        path: req.path,
        method: req.method 
      });

      next();
    } catch (error) {
      logger.error('Falha na autenticação', {
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: 'Token inválido ou expirado',
          code: 'INVALID_TOKEN'
        });
      }

      next(error);
    }
  };
};