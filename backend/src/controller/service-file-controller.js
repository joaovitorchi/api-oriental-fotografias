const { AXIOS_IMGBB_INSTANCE } = require('../api/imgbb');
const url = require('url');
const logger = require('../utils/logger');
const { whereAndStackError } = require('../utils/where-and-stack-error');
const ServiceFileRepository = require('../repository/service-file-repository');
const ServiceFile = require('../model/service-file-model');

class ServiceFileController {

  async sendImage(req, res) {
    try {
      const serviceFileRepository = new ServiceFileRepository();
      let errors = [];
      let aux = 0;
      for await (const file of req.files) {
        aux++;
        const form = new FormData();
        form.append("name", `${req.params.serviceId}-${req.user.userId}-${aux}`);
        form.append("image", file.buffer.toString('base64'));
        const params = new url.URLSearchParams({ key: process.env.IMGBB_API_KEY });
        
        await AXIOS_IMGBB_INSTANCE.post(
          '/upload', 
          form,
          {
            params: params
          }
        )
        .then(async response => {
          const serviceFileDto = new ServiceFile({
            externalId: response.data.data.display_url,
            serviceId: req.params.serviceId,
            userId: req.user.userId,
            name: response.data.data.image.filename,
          });
          await serviceFileRepository.createFile(serviceFileDto)
        })
        .catch(error => {
          errors.push({ msg: error.message });
        });
      }

      if (errors.length > 0) {
        return res.status(500).send(errors);
      }

      return res.status(200).send({ msg: "ok" });
    } catch (error) {
      logger.error(`Ocorreu um erro ao atualizar o serviço. ${whereAndStackError(__filename, error)}`);
      return res.status(400).send({ 
        errors: [{ msg: error.message }] 
      });
    }
  }
}

module.exports = new ServiceFileController();


