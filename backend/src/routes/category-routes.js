const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validator = require('../middlewares/validator.middleware');
const { categorySchema } = require('../validations/category.validation');

// Rotas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Rotas autenticadas
router.post(
  '/', 
  validator(categorySchema),
  categoryController.createCategory
);

router.put(
  '/:id', 
  validator(categorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id', 
  categoryController.deleteCategory
);

module.exports = router;