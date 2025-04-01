const authService = require("../service/auth-service");
const logger = require("../utils/logger");

const middlewareAuthorization = function (permissionsNeeded = []) {
  if (typeof permissionsNeeded === "string") {
    permissionsNeeded = [permissionsNeeded];
  }
  return async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {

      logger.error(__filename + " Falha - sem token");
      return res
        .status(401)
        .send({ auth: false, message: "Sem Token.", errors: { msg: "Sem Token" } });
    }
    const tokenWithBearerPrefix = token.substr(7);
    const decoded = authService.verifyJWT(tokenWithBearerPrefix);

    if (decoded.err) {
      logger.error(__filename + " Falha ao autenticar o token [" + token + "] - " + decoded.err);
      return res
        .status(401)
        .send({ auth: false, message: "Falha ao autenticar o Token. Precisa fazer login." });
    }

    req.user = { userId: decoded.userId, permissions: decoded.permissions };

    if (!req.user || !req.user.permissions || !Array.isArray(req.user.permissions)) {

      logger.error(`Falha, usuário sem permissões: ${req.user.userId} path ${req.originalUrl}`)
      return res.status(401).json({ message: "Sem permissão", errors: [{ msg: "Sem Permissão" }] });
    }

    var intersectionpermissions = permissionsNeeded.filter((x) => req.user.permissions.includes(x));

    if (permissionsNeeded.length && intersectionpermissions.length == 0) {

      logger.error(`Falha, usuário (${req.user.userId}) sem permissão para acessar o path: ${req.originalUrl}`)
      logger.error(`Permissões necessárias:${JSON.stringify(permissionsNeeded)}; permissões usuário: ${JSON.stringify(req.user.permissions)}`);

      return res.status(401).json({ message: "Sem permissão", errors: [{ msg: "Sem Permissão" }] });
    }

    next();
  };
};

module.exports = middlewareAuthorization;
