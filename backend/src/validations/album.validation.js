const { body, param } = require('express-validator');

module.exports = {
  albumSchema: [
    body('title')
      .notEmpty().withMessage('Título é obrigatório')
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),
    
    body('clientId')
      .optional()
      .isInt().withMessage('ID do cliente deve ser um número'),
    
    body('photoIds')
      .optional()
      .isArray().withMessage('Deve ser um array de IDs de fotos'),
    
    body('photoIds.*')
      .isInt().withMessage('Cada ID de foto deve ser um número'),
    
    body('isPublic')
      .optional()
      .isBoolean().withMessage('Deve ser verdadeiro ou falso'),
    
    param('id')
      .optional()
      .isInt().withMessage('ID deve ser um número')
  ],

  albumPasswordSchema: [
    body('password')
      .optional()
      .isLength({ min: 4 }).withMessage('Senha deve ter no mínimo 4 caracteres')
      .custom((value, { req }) => {
        if (value === '') {
          return true; // Permite remover a senha
        }
        return true;
      })
  ],

  verifyPasswordSchema: [
    body('password')
      .notEmpty().withMessage('Senha é obrigatória')
      .isLength({ min: 4 }).withMessage('Senha deve ter no mínimo 4 caracteres')
  ]
};