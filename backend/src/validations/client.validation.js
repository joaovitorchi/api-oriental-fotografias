const { body, param } = require('express-validator');

module.exports = {
  clientSchema: [
    body('name')
      .notEmpty().withMessage('Nome é obrigatório')
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    body('email')
      .optional()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .isLength({ max: 20 }).withMessage('Máximo 20 caracteres'),
    
    body('address')
      .optional()
      .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    
    body('notes')
      .optional()
      .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),
    
    param('id')
      .optional()
      .isInt().withMessage('ID deve ser um número')
  ],

  clientSearchSchema: [
    query('name')
      .optional()
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Página deve ser um número maior que 0'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limite deve ser entre 1 e 100')
  ]
};