const jwt = require("jsonwebtoken");

class AuthService {
  generateToken(user) {
    return jwt.sign({
      userId: user.userId,
      permissions: user.permissions,
      name: user.name,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return { error: "Token Inválido." };
    }
  }

  getIdUser(req) {
    const token = req.headers["authorization"];

    if (!token) {
      throw new Error('Usuário não encontrado.');
    }
    const tokenWithBearerPrefix = token.substr(7);
    const decoded = new AuthService().verifyJWT(tokenWithBearerPrefix);
    return decoded.userId;
  }

  getPermissions(req) {
    const token = req.headers["authorization"];

    if (!token) {
      throw new Error('Usuário não encontrado.');
    }
    const tokenWithBearerPrefix = token.substr(7);
    const decoded = new AuthService().verifyJWT(tokenWithBearerPrefix);
    return decoded.permissions;
  }
}

module.exports = new AuthService();
