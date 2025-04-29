const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const validator = require('../middlewares/validator.middleware');
const { albumSchema } = require('../validations/album.validation');

// Rotas para clientes (públicas)
router.get('/shared/:token', albumController.getSharedAlbum);
router.post('/shared/:token/verify', albumController.verifyPassword);

// Rotas autenticadas
router.post(
  '/', 
  validator(albumSchema),
  albumController.create
);

router.get(
  '/my-albums', 
  albumController.getUserAlbums  // Corrigido: era getMyAlbums
);

router.get(
  '/:id', 
  albumController.getById        // Corrigido: era getAlbumById
);

router.put(
  '/:id', 
  validator(albumSchema),
  albumController.update
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
  albumController.setPassword    // Corrigido: era setAlbumPassword
);

router.delete(
  '/:id', 
  albumController.delete
);

module.exports = router;
