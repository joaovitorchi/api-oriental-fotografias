const pool = require("../database/pool");
const ServiceFile = require("../model/service-file-model");
const { factory } = require("../utils/factory");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class ServiceFileRepository {
  /**
   * 
   * @param {Array<integer>} serviceIdList 
   * @returns {Promise<ServiceFile>}
   */
  async listFilesByServiceIdList(serviceIdList) {
    try {
      const sql =
        `SELECT 
          sf.service_file_id,
          sf.service_id,
          sf.user_id,
          sf.external_id,
          sf.name
        FROM services.service_file sf 
        WHERE sf.service_id IN ($1);`;
      
      const params = [serviceIdList];
      const result = await pool.query(sql, params);
      return factory(result.rows, ServiceFile);
    } catch (error) {
      logger.error(`Ocorreu um erro ao listar as imagens pelos ID's dos serviços no DB. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao listar as imagens.");
    }
  }

  /**
   * 
   * @param {ServiceFile} fileDto 
   * @returns {Promise<ServiceFile>}
   */
  async createFile(fileDto) {
    try {
      const sql =
        `INSERT INTO services.service_file (
          service_id,
          user_id,
          external_id,
          name
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING *;`;
      
      const params = [
        fileDto.serviceId,
        fileDto.userId,
        fileDto.externalId,
        fileDto.name,
      ];
      const result = await pool.query(sql, params);
      return result.rowCount > 0 ? (factory(result.rows, ServiceFile))[0] : null;
    } catch (error) {
      logger.error(`Ocorreu um erro ao salvar a imagem no DB. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao salvar a imagem.");
    }
  }
}

module.exports = ServiceFileRepository;
