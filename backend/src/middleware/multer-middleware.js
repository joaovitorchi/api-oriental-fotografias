const multer = require('multer');
const storage = multer.memoryStorage();
const util = require('util');

const uploadMulter = multer({
  storage: storage,
});

const middlewareMulter = function(field, size) {
  return async (req, res, next) => {
    const upload = util.promisify(uploadMulter.array(field, size));

    try {
      await upload(req, res);
      next();
    } catch (err) {
      return res.status(500).send({ 
        errors: [{ msg: `Ocorreu um erro ao subir os arquivos. É permitido apenas ${size} imagens por vez.` }] 
      });
    }
  }
}

module.exports = middlewareMulter;
