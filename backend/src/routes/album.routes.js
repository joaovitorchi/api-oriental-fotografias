const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const validator = require('../middlewares/validator.middleware');
const { albumSchema } = require('../validations/album.validation');

// Rotas para clientes (com verificação de token)
router.get('/shared/:token', albumController.getSharedAlbum);
router.post('/shared/:token/verify', albumController.verifyAlbumPassword);

// Rotas autenticadas
router.post(
  '/', 
  validator(albumSchema),
  albumController.createAlbum
);

router.get(
  '/my-albums', 
  albumController.getMyAlbums
);

router.get(
  '/:id', 
  albumController.getAlbumById
);

router.put(
  '/:id', 
  validator(albumSchema),
  albumController.updateAlbum
);

router.post(
  '/:id/share', 
  albumController.generateShareLink
);

router.post(
  '/:id/notify',
  albumController.notifyClient
);

router.post(
  '/:id/password',
  albumController.setAlbumPassword
);

router.delete(
  '/:id', 
  albumController.deleteAlbum
);

module.exports = router;