const DashboardRepository = require("../repository/dashboard-repository");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class DashboardController {
  async getMenuNumbers(req, res) {
    try {
      const values = await new DashboardRepository().getMenuNumbers(req.user.userId);
      return res.status(200).send({ values });
    } catch (error) {
      logger.error(`Ocorreu um erro ao tentar consultar os valores para o dashboard. ${whereAndStackError(__filename, error)}`);
      return res.status(400).send({ errors: [{ msg: error.message }]});
    }
  }
}

module.exports = new DashboardController();
