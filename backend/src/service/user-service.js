const UserRepository = require('../repositories/user.repository');
const PermissionRepository = require('../repositories/permission.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.permissionRepository = new PermissionRepository();
  }

  async createUser(userData) {
    // Verifica se email já existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError('Email já está em uso');
    }

    // Cria o usuário
    const user = await this.userRepository.create(userData);

    // Remove campos sensíveis antes de retornar
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(userId, updateData) {
    if (updateData.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.userId !== userId) {
        throw new ValidationError('Email já está em uso');
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  }

  async listUsers(page = 1, limit = 10, filters = {}) {
    return this.userRepository.findAll(page, limit, filters);
  }

  async updateUserPermissions(userId, permissions) {
    // Remove todas as permissões atuais
    await this.permissionRepository.removeAllUserPermissions(userId);

    // Adiciona as novas permissões
    const permissionRecords = permissions.map(permission => ({
      userId,
      permission
    }));

    await this.permissionRepository.addPermissions(permissionRecords);

    return this.getUserPermissions(userId);
  }

  async getUserPermissions(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const permissions = await this.permissionRepository.findByUserId(userId);
    return permissions.map(p => p.permission);
  }

  async deactivateUser(userId) {
    return this.userRepository.update(userId, { active: false });
  }
}

module.exports = new UserService();