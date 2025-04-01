const pool = require("../database/pool");
const Dashboard = require("../model/dashboard-model");
const { factory } = require("../utils/factory");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class DashboardRepository {
  async getMenuNumbers(userId) {
    try {
      const sql =
        `WITH my_services AS (
          SELECT COUNT(1) total
          FROM services.service s 
          WHERE s.user_id = $1
        )
        SELECT ms.total total_my_services FROM my_services ms;`;
      const params = [userId];
      const result = await pool.query(sql, params);
      return (factory(result.rows, Dashboard))[0];
    } catch (error) {
      logger.error(`Ocorreu um erro ao consultar os valores do menu dashboard no DB. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao consultar os valores do menu dashboard.");
    }
  }
}

module.exports = DashboardRepository;
