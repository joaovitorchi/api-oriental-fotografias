const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validator = require('../middlewares/validator.middleware');
const { 
  loginSchema, 
  registerSchema,
  changePasswordSchema
} = require('../validations/auth.validation');

// Rotas públicas
router.post('/login', validator(loginSchema), authController.login);
router.post('/register', validator(registerSchema), authController.register);

// Rotas protegidas (requerem autenticação)
router.get('/me', authController.getProfile);
router.put('/me', validator(registerSchema), authController.updateProfile);
router.post('/change-password', validator(changePasswordSchema), authController.changePassword);
router.post('/refresh-token', authController.refreshToken);

// Rotas de administração (requerem role 'admin')
router.get('/users', authController.listUsers);
router.put('/users/:id', validator(registerSchema), authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;