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
  clientController.createClient
);

router.get(
  '/search',
  authMiddleware(),
  clientController.searchClients
);

router.get(
  '/:id',
  authMiddleware(),
  clientController.getClientById
);

router.put(
  '/:id', 
  authMiddleware(),
  validator(clientSchema),
  clientController.updateClient
);

router.delete(
  '/:id', 
  authMiddleware(),
  clientController.deleteClient
);

module.exports = router;