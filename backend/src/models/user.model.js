const bcrypt = require("bcryptjs");
const PermissionRepository = require("../repositories/permission.repository");
const { whereAndStackError } = require("../utils/where-and-stack-error");
const logger = require("../utils/logger");

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       userId:
 *         type: integer
 *         description: ID único do usuário
 *       name:
 *         type: string
 *         description: Nome completo do usuário
 *       email:
 *         type: string
 *         format: email
 *         description: E-mail do usuário (único)
 *       username:
 *         type: string
 *         description: Nome de usuário para login
 *       role:
 *         type: string
 *         enum: [admin, photographer, editor, assistant, client]
 *         description: Papel principal do usuário no sistema
 *       active:
 *         type: boolean
 *         description: Indica se a conta está ativa
 *       profilePhoto:
 *         type: string
 *         description: URL da foto de perfil
 *       lastLogin:
 *         type: string
 *         format: date-time
 *         description: Data do último login
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: Data de criação da conta
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         description: Data da última atualização
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 *         description: Permissões do usuário
 *       additionalPermissions:
 *         type: array
 *         items:
 *           type: string
 *         description: Permissões adicionais específicas
 */
class User {
  constructor(dto) {
    this.userId = dto.user_id || dto.userId;
    this.name = dto.name;
    this.email = dto.email;
    this.username = dto.username;
    this.role = dto.role || 'photographer'; // Valores padrão: admin, photographer, editor, assistant, client
    this.active = dto.active !== undefined ? dto.active : true;
    this.profilePhoto = dto.profilePhoto || null;
    this.lastLogin = dto.lastLogin || null;
    this.createdAt = dto.createdAt || new Date();
    this.updatedAt = dto.updatedAt || new Date();

    if (dto.password) {
      this.encryptPassword(dto.password);
    }

    if (dto.passwordHash) {
      this.passwordHash = dto.passwordHash;
    }

    this.permissions = [];
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
      
      // Permissões baseadas no role
      const rolePermissions = this.getDefaultRolePermissions();
      
      // Permissões específicas do usuário
      const userPermissions = permissions.map(p => p.name);
      
      // Combina ambas, removendo duplicatas
      this.permissions = [...new Set([...rolePermissions, ...userPermissions])];
    } catch (error) {
      logger.error(`Failed to load user permissions ${this.userId}. ${whereAndStackError(__filename, error)}`);
      throw new Error("Failed to load permissions");
    }
  }

  async loadAdditionalPermissions() {
    try {
      this.additionalPermissions = [];

      const permissionRepository = new PermissionRepository();
      const additionalPermissions = await permissionRepository.listAdditionalPermissionsOfUsuario(this.userId);

      this.additionalPermissions = additionalPermissions.map(p => p.permissao);
    } catch (error) {
      logger.error(`Failed to load additional permissions for user ${this.userId}. ${whereAndStackError(__filename, error)}`);
      throw new Error("Failed to load additional permissions.");
    }
  }

  getDefaultRolePermissions() {
    const rolePermissions = {
      admin: [
        'manage_users',
        'manage_sessions',
        'manage_photos',
        'publish_content',
        'edit_content',
        'view_analytics',
        'manage_settings'
      ],
      photographer: [
        'upload_photos',
        'edit_own_sessions',
        'publish_own_content',
        'view_own_analytics'
      ],
      editor: [
        'edit_photos',
        'edit_sessions',
        'publish_content'
      ],
      assistant: [
        'upload_photos',
        'view_sessions'
      ],
      client: [
        'view_own_photos',
        'download_own_photos'
      ]
    };

    return rolePermissions[this.role] || [];
  }

  hasPermission(permission) {
    return this.permissions.includes(permission) || 
           this.additionalPermissions.includes(permission);
  }

  // Métodos específicos para o estúdio de fotografia
  canUploadPhotos() {
    return this.hasPermission('upload_photos');
  }

  canEditSession(sessionId) {
    return this.hasPermission('manage_sessions') || 
           (this.hasPermission('edit_own_sessions'));
  }

  canPublishContent() {
    return this.hasPermission('publish_content');
  }
}

module.exports = User;