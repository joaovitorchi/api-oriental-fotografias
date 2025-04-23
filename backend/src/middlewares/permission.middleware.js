module.exports = (requiredPermission) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }
      
      if (!req.user.hasPermission(requiredPermission)) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }
      
      next();
    };
  };