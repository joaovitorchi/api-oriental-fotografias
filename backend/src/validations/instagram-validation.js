const { query, body } = require('express-validator');

module.exports = {
  instagramAuthSchema: [
    query('code')
      .notEmpty().withMessage('Código de autorização é obrigatório')
  ],

  syncSchema: [
    body('force')
      .optional()
      .isBoolean().withMessage('Deve ser verdadeiro ou falso')
  ],

  postVisibilitySchema: [
    body('isVisible')
      .notEmpty().withMessage('Status de visibilidade é obrigatório')
      .isBoolean().withMessage('Deve ser verdadeiro ou falso')
  ],

  feedSchema: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 }).withMessage('Limite deve ser entre 1 e 50')
  ]
};