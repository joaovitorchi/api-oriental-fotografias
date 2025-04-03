const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

const userRepo = new UserRepository();

module.exports = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // 1. Verificar token no header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: "Token de autenticação não fornecido" });
      }
      
      // 2. Verificar token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Buscar usuário no banco
      const user = await userRepo.findById(decoded.userId);
      if (!user || !user.active) {
        return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
      }
      
      // 4. Verificar permissões (se necessário)
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(perm => 
          user.permissions.includes(perm) || 
          user.additionalPermissions.includes(perm)
        );
        
        if (!hasPermission) {
          return res.status(403).json({ error: "Acesso não autorizado" });
        }
      }
      
      // 5. Adicionar usuário à requisição
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Falha na autenticação: " + error.message });
    }
  };
};