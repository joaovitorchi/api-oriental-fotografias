const pool = require("../database/pool");
const Permission = require("../model/permission-model");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class PermissionRepository {
  async listPermissionsFromUser(userId) {
    try {
      const sql = 
        `SELECT q.* FROM (
          SELECT 
            p."name",
            p.description
          FROM users.user_group ug 
          JOIN users.group_permission gp ON gp.group_id = ug.group_id 
          JOIN users."permission" p ON p.permission_id = gp.permission_id
          WHERE ug.user_id = $1
          UNION 
          SELECT 
            p2."name",
            p2.description
          FROM users."permission" p2 
          JOIN users.user_permisson up ON up.permission_id = p2.permission_id
          WHERE up.user_id = $1
        ) q
        GROUP BY q."name", q.description
        ORDER BY q.description;`;

      const { rows } = await pool.query(sql, [userId]);
      return this.factory(rows);
    } catch (error) {
      logger.error(`Ocorreu um erro ao consultar as permissões do usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Erro ao consultar as permissões do usuário.");
    }
  }

  factory(rows) {
    return rows && rows.length > 0 ? rows.map(row => new Permission(row)) : [];
  }
}

module.exports = PermissionRepository;