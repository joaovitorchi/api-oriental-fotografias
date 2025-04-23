const express = require('express');
const router = express.Router();
const PhotoController = require('../controllers/photo.controller');
const photoController = new PhotoController();
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
  photoController.upload
);

router.put(
  '/:id',
  authMiddleware(),
  validator(photoSchema),
  photoController.update
);

router.delete(
  '/:id',
  authMiddleware(),
  photoController.delete
);

// Rotas para downloads
router.get(
  '/:id/download',
  photoController.download
);

module.exports = router;
