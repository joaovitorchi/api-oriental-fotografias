const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errors');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new ValidationError('Tipo de arquivo não suportado', [{
      field: file.fieldname,
      message: 'Apenas imagens JPEG, PNG ou GIF são permitidas'
    }]);
    return cb(error, false);
  }
  cb(null, true);
};

// Configuração do Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/**
 * Middleware de upload de arquivos
 * @param {string} fieldName - Nome do campo do arquivo
 * @returns {Function} Middleware function
 */
module.exports = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ValidationError('Arquivo muito grande', [{
              field: fieldName,
              message: 'O arquivo não pode exceder 10MB'
            }]));
          }
          return next(new ValidationError('Erro no upload do arquivo', [{
            field: fieldName,
            message: err.message
          }]));
        }
        return next(err);
      }

      if (req.file) {
        logger.debug('Arquivo enviado com sucesso', {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        });
      }

      next();
    });
  };
};