const { Permission, UserPermission, AdditionalPermission } = require('../models/permission.model'); // Assumindo que esses modelos existem
const logger = require("../utils/logger");

/**
 * Repositório para gerenciar permissões de usuários
 */
class PermissionRepository {
  // Busca todas as permissões associadas a um usuário
  async listPermissionsFromUser(userId) {
    try {
      // Buscar permissões do usuário diretamente relacionadas a ele
      const permissions = await UserPermission.findAll({
        where: { userId },
        include: [
          {
            model: Permission,
            attributes: ['name'], // Nome da permissão
          }
        ]
      });

      // Retorna uma lista com os nomes das permissões
      return permissions.map(p => p.Permission);
    } catch (error) {
      logger.error(`Error fetching permissions for user ${userId}: ${error.message}`);
      throw new Error("Failed to fetch user permissions.");
    }
  }

  // Busca permissões adicionais do usuário
  async listAdditionalPermissionsOfUsuario(userId) {
    try {
      // Buscar permissões adicionais para o usuário
      const additionalPermissions = await AdditionalPermission.findAll({
        where: { userId },
        attributes: ['permissao'], // Campo 'permissao' na tabela de permissões adicionais
      });

      return additionalPermissions;
    } catch (error) {
      logger.error(`Error fetching additional permissions for user ${userId}: ${error.message}`);
      throw new Error("Failed to fetch additional permissions.");
    }
  }
}

module.exports = PermissionRepository;
