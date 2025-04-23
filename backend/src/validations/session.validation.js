const { body, param } = require('express-validator');

module.exports = {
  sessionSchema: [
    body('title')
      .notEmpty().withMessage('Título é obrigatório')
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 }).withMessage('Máximo 1000 caracteres'),
    
    body('sessionDate')
      .notEmpty().withMessage('Data da sessão é obrigatória')
      .isISO8601().withMessage('Data inválida, use o formato YYYY-MM-DD'),
    
    body('location')
      .optional()
      .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    
    body('categories')
      .optional()
      .isArray().withMessage('Deve ser um array de IDs de categorias'),
    
    body('categories.*')
      .isInt().withMessage('Cada ID de categoria deve ser um número'),
    
    param('id')
      .optional()
      .isInt().withMessage('ID deve ser um número')
  ],

  publishSchema: [
    body('publish')
      .notEmpty().withMessage('Status de publicação é obrigatório')
      .isBoolean().withMessage('Deve ser verdadeiro ou falso')
  ]
};