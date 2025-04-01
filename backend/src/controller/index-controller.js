/**
 * @swagger
 * /info:
 *   get:
 *     description: Bem vindo à API Serviços!
 *     responses:
 *       200:
 *         description: Retorna nome e versão.
 */
class IndexController {
  async info(req, res) {
    return res.status(200).send({
      title: process.env.MODULE_NAME,
      version: "1.0.0",
    });
  }
}

module.exports = new IndexController();