const { body } = require('express-validator');

module.exports = {
  loginSchema: [
    body('email')
      .notEmpty().withMessage('Email é obrigatório')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Senha é obrigatória')
      .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
  ],

  registerSchema: [
    body('name')
      .notEmpty().withMessage('Nome é obrigatório')
      .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    
    body('email')
      .notEmpty().withMessage('Email é obrigatório')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Senha é obrigatória')
      .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    
    body('role')
      .optional()
      .isIn(['admin', 'photographer', 'editor', 'assistant', 'client']).withMessage('Tipo de usuário inválido')
  ],

  changePasswordSchema: [
    body('currentPassword')
      .notEmpty().withMessage('Senha atual é obrigatória'),
    
    body('newPassword')
      .notEmpty().withMessage('Nova senha é obrigatória')
      .isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
      .not().equals(body('currentPassword')).withMessage('Nova senha deve ser diferente da atual')
  ]
};