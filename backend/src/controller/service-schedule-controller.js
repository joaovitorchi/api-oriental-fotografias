const ServiceSchedule = require("../model/service-schedule-model");
const ServiceScheduleRepository = require("../repository/service-schedule-repository");
const logger = require("../utils/logger");
const { toLogico } = require("../utils/parser");

class ServiceScheduleController {
  async createSchedule(req, res) {
    try {
      req.body.schedulerUserId = req.user.userId;
      const ret = await new ServiceScheduleRepository().createSchedule(new ServiceSchedule(req.body));

      logger.info(`Usuário ${req.user.userId} agendou um serviço.`);

      return res.status(200).send({ msg: "Agendamento criado." });
    } catch (error) {
      logger.error();
      return res.status(400).send({ errors: [{ msg: error.message }] });
    }
  }

  async listSchedulesByUserId(req, res) {
    try {
      const schedules = await new ServiceScheduleRepository().listSchedulesByUserId(req.user.userId);

      logger.info(`Usuário ${req.user.userId} listou seus agendamentos.`);

      return res.status(200).send({ schedules });
    } catch (error) {
      logger.error();
      return res.status(400).send({ errors: [{ msg: error.message }] });
    }
  }

  async approveDisapproveSchedule(req, res) {
    try {
      const approved = toLogico(req.params.approved);
      const schedule = await new ServiceScheduleRepository().approveDisapproveSchedule(req.params.scheduleId, approved);

      if (!schedule) {
        return res.status(404).send({ errors: [{ msg: "Agendamento não encontrado." }] });
      }

      logger.info(`Usuário ${req.user.userId} ${approved ? "aprovou" : "reprovou"} um agendamento.`);

      return res.status(200).send({ msg: `Agendamento ${approved ? "aprovado" : "reprovado"}` });
    } catch (error) {
      logger.error();
      return res.status(400).send({ errors: [{ msg: error.message }] });
    }
  }
}

module.exports = new ServiceScheduleController();