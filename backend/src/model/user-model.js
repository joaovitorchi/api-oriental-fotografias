const bcrypt = require("bcryptjs");
const PermissionRepository = require("../repository/permission-repository");
const { whereAndStackError } = require("../utils/where-and-stack-error");
const logger = require("../utils/logger");

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       userId:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       active:
 *         type: boolean
 *       additionalPermissions:
 *         type: array
 *         items:
 *           type: string
 */
class User {
  constructor(dto) {
    this.userId = dto.user_id || dto.userId;
    this.name = dto.name;
    this.email = dto.email;
    this.active = dto.active;

    if (dto.password) {
      this.encryptPassword(dto.password);
    }

    if (dto.passwordHash) {
      this.passwordHash = dto.passwordHash;
    }
    this.additionalPermissions = [];
  }

  encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(password, salt);
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  async loadPermissions() {
    try {
      this.permissions = [];

      const permissionRepository = new PermissionRepository();
      const permissions = await permissionRepository.listPermissionsFromUser(this.userId);
      permissions.forEach((permission) => {
        this.permissions.push(permission.name);
      });
    } catch (error) {
      logger.error(`Não conseguiu carregar as permissões de um usuário ${this.userId}. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não conseguiu carregar as permissões");
    }
  }
  async loadAdditionalPermissions() {
    try {
      this.additionalPermissions = [];

      const permissionRepository = new PermissionRepository();
      const additionalPermissions = await permissionRepository.listAdditionalPermissionsOfUsuario(this.userId);

      additionalPermissions.forEach((permissao) => {
        this.additionalPermissions.push(permissao.permissao);
      });
    } catch (error) {
      logger.error(`Não conseguiu carregar as permissões adicionais de um usuario ${this.userId}. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não conseguiu carregar as permissões adicionais.");
    }
  }
}

module.exports = User;