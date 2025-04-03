const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer.config');
const validator = require('../middlewares/validator.middleware');
const { photoSchema } = require('../validations/photo.validation');

// Rotas públicas (fotos publicadas)
router.get('/', photoController.getPublishedPhotos);
router.get('/:id', photoController.getPhotoById);

// Rotas autenticadas
router.post(
  '/upload', 
  authMiddleware(),
  upload.single('photo'), 
  validator(photoSchema),
  photoController.uploadPhoto
);

router.put(
  '/:id', 
  authMiddleware(),
  validator(photoSchema),
  photoController.updatePhoto
);

router.delete(
  '/:id', 
  authMiddleware(),
  photoController.deletePhoto
);

// Rotas para downloads
router.get(
  '/:id/download', 
  authMiddleware(),
  photoController.downloadPhoto
);

module.exports = router;