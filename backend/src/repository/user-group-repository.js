const pool = require("../database/pool");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class UserGroupRepository {
  async associateUserGroup(userId, groupId) {
    try {
      const sql = 
        `INSERT INTO users.user_group (
          user_id, group_id 
        ) VALUES (
          $1, 1
        ) RETURNING *;`;

      const result = await pool.query(sql, [userId, groupId]);

      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Ocorreu um erro ao associar o usuário ao grupo. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao associar o usuário ao grupo.");
    }
  }
}

module.exports = UserGroupRepository;