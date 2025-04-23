const { body, param } = require('express-validator');

module.exports = {
  photoSchema: [
    body('title')
      .optional()
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),
    
    body('sessionId')
      .notEmpty().withMessage('Sessão é obrigatória')
      .isInt().withMessage('ID da sessão deve ser um número'),
    
    body('isFeatured')
      .optional()
      .isBoolean().withMessage('Deve ser verdadeiro ou falso'),
    
    param('id')
      .optional()
      .isInt().withMessage('ID deve ser um número')
  ],

  photoUploadSchema: [
    body('sessionId')
      .notEmpty().withMessage('Sessão é obrigatória')
      .isInt().withMessage('ID da sessão deve ser um número'),
    
    // Validação do arquivo é feita no multer
  ]
};