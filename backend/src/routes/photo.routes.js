const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer.config');
const validator = require('../middlewares/validator.middleware');
const { photoSchema } = require('../validations/photo.validation');

// Rotas públicas (fotos publicadas)
router.get('/', photoController.getPublishedPhotos);
router.get('/:id', photoController.getById);

// Rotas autenticadas
router.use(authMiddleware());  // Aplica o middleware de autenticação para todas as rotas abaixo

// Upload de foto
router.post('/upload', 
  upload.single('photo'), 
  validator(photoSchema), 
  photoController.uploadPhoto
);

// Atualização de foto
router.put('/:id', 
  validator(photoSchema), 
  photoController.update
);

// Exclusão de foto
router.delete('/:id', 
  photoController.delete
);

// Rota para download de foto
router.get('/:id/download', 
  photoController.downloadPhoto
);

module.exports = router;
