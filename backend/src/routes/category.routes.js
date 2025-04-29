const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validator = require('../middlewares/validator.middleware');
const { categorySchema } = require('../validations/category.validation');

// Rotas públicas
router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);

// Rotas autenticadas
router.post(
  '/', 
  validator(categorySchema),
  categoryController.create
);

router.put(
  '/:id', 
  validator(categorySchema),
  categoryController.update
);

router.delete(
  '/:id', 
  categoryController.delete
);

module.exports = router;