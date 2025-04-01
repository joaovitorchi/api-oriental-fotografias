const pool = require("../database/pool");
const ServiceSchedule = require("../model/service-schedule-model");
const { factory } = require("../utils/factory");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class ServiceScheduleRepository {

  /**
   * 
   * @param {ServiceSchedule} scheduleDto 
   * @returns {Promise<ServiceSchedule>}
   */
  async createSchedule(scheduleDto) {
    try {
      const sql = `
      INSERT INTO services.service_schedule (
        service_id,
        scheduler_user_id,
        appointment_date,
        obs
      )	VALUES ($1, $2, $3, $4)
      RETURNING *;`;

      const params = [
        scheduleDto.serviceId,
        scheduleDto.schedulerUserId,
        scheduleDto.appointmentDate,
        scheduleDto.obs,
      ];
      const result = await pool.query(sql, params);
      return result.rowCount > 0 ? (factory(result.rows, ServiceSchedule))[0] : null;
    } catch (error) {
      logger.error(`Ocorreu um erro ao criar um agendamento. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao criar um agendamento.");
    }
  }

  /**
   * 
   * @param {integer} userId 
   * @returns {Promise<Array<ServiceSchedule>>}
   */
  async listSchedulesByUserId(userId) {
    try {
      const sql = `
      SELECT 
        ss.id,
        ss.service_id,
        ss.scheduler_user_id,
        ss.appointment_date,
        ss.obs,
        ss.approved,
        u.user_id,
        u."name" user_provider,
        u2.user_id,
        u2."name" user_scheduler,
        AVG(ss2.score) average
      FROM services.service_schedule ss
      JOIN services.service s ON s.service_id = ss.service_id
      LEFT JOIN services.service_score ss2 ON ss2.service_id = s.service_id 
      JOIN users."user" u ON u.user_id = s.user_id 
      JOIN users."user" u2 ON u2.user_id = ss.scheduler_user_id 
      WHERE (u.user_id = $1 OR u2.user_id = $1)
      GROUP BY ss.id, u.user_id, u2.user_id;`;

      const params = [userId];
      const result = await pool.query(sql, params);
      return factory(result.rows, ServiceSchedule);
    } catch (error) {
      logger.error(`Ocorreu um erro ao listar os agendamentos. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro ao listar os agendamentos.");
    }
  }

  /**
   * 
   * @param {integer} scheduleId 
   * @param {boolean} approved 
   * @returns {Promise<ServiceSchedule>}
   */
  async approveDisapproveSchedule(scheduleId, approved) {
    try {
      const sql = `
        UPDATE services.service_schedule
        SET approved = $2
        WHERE id = $1
        RETURNING *;`;

      const params = [scheduleId, approved];
      const result = await pool.query(sql, params);
      return result.rowCount > 0 ? (factory(result.rows, ServiceSchedule))[0] : null;
    } catch (error) {
      logger.error(`Ocorreu um erro ao ${approved ? "aprovar" : "reprovar"} o agendamento. ${whereAndStackError(__filename, error)}`);
      throw new Error(`Ocorreu um erro ao ${approved ? "aprovar" : "reprovar"} o agendamento.`);
    }
  }
}

module.exports = ServiceScheduleRepository;