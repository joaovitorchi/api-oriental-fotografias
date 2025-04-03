const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validator = require('../middlewares/validator.middleware');
const { sessionSchema } = require('../validations/session.validation');

// Rotas públicas (sessões publicadas)
router.get('/', sessionController.getPublishedSessions);
router.get('/:id', sessionController.getSessionById);
router.get('/:id/photos', sessionController.getSessionPhotos);

// Rotas autenticadas
router.post(
  '/', 
  authMiddleware(),
  validator(sessionSchema),
  sessionController.createSession
);

router.put(
  '/:id', 
  authMiddleware(),
  validator(sessionSchema),
  sessionController.updateSession
);

router.patch(
  '/:id/publish', 
  authMiddleware(),
  sessionController.togglePublish
);

router.delete(
  '/:id', 
  authMiddleware(),
  sessionController.deleteSession
);

module.exports = router;