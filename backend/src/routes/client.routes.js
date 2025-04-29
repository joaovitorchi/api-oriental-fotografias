const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validator = require('../middlewares/validator.middleware');
const { clientSchema } = require('../validations/client.validation');

// Rotas autenticadas
router.post(
  '/', 
  authMiddleware(),
  validator(clientSchema),
  clientController.create
);

router.get(
  '/search',
  authMiddleware(),
  clientController.search
);

router.get(
  '/:id',
  authMiddleware(),
  clientController.getById
);

router.put(
  '/:id', 
  authMiddleware(),
  validator(clientSchema),
  clientController.update
);

router.delete(
  '/:id', 
  authMiddleware(),
  clientController.delete
);

module.exports = router;