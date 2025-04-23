const { body, param } = require('express-validator');

module.exports = {
  categorySchema: [
    body('name')
      .notEmpty().withMessage('Nome é obrigatório')
      .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    
    param('id')
      .optional()
      .isInt().withMessage('ID deve ser um número'),
    
    param('slug')
      .optional()
      .isSlug().withMessage('Slug inválido')
  ]
};