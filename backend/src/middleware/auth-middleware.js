const authService = require("../service/auth-service");
const UserRepository = require("../repositories/user-repository");
const logger = require("../utils/logger");

class AuthorizationMiddleware {
  constructor() {
    this.userRepository = new UserRepository();
    
    // Bind methods to maintain 'this' context
    this.verifyToken = this.verifyToken.bind(this);
    this.checkPermissions = this.checkPermissions.bind(this);
    this.middleware = this.middleware.bind(this);
  }

  /**
   * Verify JWT token
   * @param {string} token 
   * @returns {Promise<{userId: number, permissions: string[]}|{err: Error}>}
   */
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error("Token não fornecido");
      }
      
      // Remove 'Bearer ' prefix if present
      const tokenWithoutPrefix = token.startsWith('Bearer ') ? token.substr(7) : token;
      return authService.verifyJWT(tokenWithoutPrefix);
    } catch (error) {
      logger.error(__filename + " - Falha ao verificar token: " + error.message);
      return { err: error };
    }
  }

  /**
   * Check if user has required permissions
   * @param {string[]} userPermissions 
   * @param {string|string[]} requiredPermissions 
   * @returns {boolean}
   */
  checkPermissions(userPermissions = [], requiredPermissions = []) {
    if (!requiredPermissions.length) return true;
    
    const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    return required.some(perm => userPermissions.includes(perm));
  }

  /**
   * Main middleware function
   * @param {string|string[]} permissionsNeeded 
   * @returns {Function}
   */
  middleware(permissionsNeeded = []) {
    return async (req, res, next) => {
      try {
        // 1. Get token from headers
        const token = req.headers.authorization;
        
        // 2. Verify token
        const decoded = await this.verifyToken(token);
        if (decoded.err) {
          logger.error(`${__filename} - Token inválido: ${token}`);
          return res.status(401).json({ 
            auth: false, 
            message: "Falha na autenticação",
            errors: [{ msg: "Token inválido ou expirado" }] 
          });
        }

        // 3. Get fresh user data from database
        const user = await this.userRepository.findById(decoded.userId);
        if (!user || !user.active) {
          logger.error(`${__filename} - Usuário não encontrado ou inativo: ${decoded.userId}`);
          return res.status(401).json({ 
            message: "Acesso não autorizado",
            errors: [{ msg: "Conta inativa ou não existente" }] 
          });
        }

        // 4. Load user permissions
        await user.loadPermissions();
        await user.loadAdditionalPermissions();
        const allPermissions = [...user.permissions, ...user.additionalPermissions];

        // 5. Check permissions
        if (!this.checkPermissions(allPermissions, permissionsNeeded)) {
          logger.error(`Acesso negado para usuário ${user.userId} (${user.email}) em ${req.method} ${req.originalUrl}`);
          logger.debug(`Permissões necessárias: ${JSON.stringify(permissionsNeeded)}`);
          logger.debug(`Permissões do usuário: ${JSON.stringify(allPermissions)}`);
          return res.status(403).json({ 
            message: "Acesso proibido",
            errors: [{ msg: "Permissões insuficientes" }] 
          });
        }

        // 6. Attach user to request
        req.user = {
          userId: user.userId,
          email: user.email,
          role: user.role,
          name: user.name,
          permissions: allPermissions
        };

        // 7. Proceed to next middleware
        next();
      } catch (error) {
        logger.error(`${__filename} - Erro no middleware de autorização: ${error.message}`);
        return res.status(500).json({ 
          message: "Erro interno no servidor",
          errors: [{ msg: "Falha ao processar autorização" }] 
        });
      }
    };
  }
}

// Export singleton instance
module.exports = new AuthorizationMiddleware().middleware;