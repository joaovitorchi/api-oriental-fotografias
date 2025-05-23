const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validator = require('../middlewares/validator.middleware');
const { 
  loginSchema, 
  registerSchema,
  changePasswordSchema
} = require('../validations/auth.validation');
const authMiddleware = require('../middlewares/auth.middleware');

// Rotas públicas
router.post('/login', validator(loginSchema), authController.login);
router.post('/register', validator(registerSchema), authController.register);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware());  // Aplica o middleware de autenticação para todas as rotas abaixo
router.get('/me', authController.getProfile);
router.put('/me', validator(registerSchema), authController.updateUser);
router.post('/change-password', validator(changePasswordSchema), authController.changePassword);
router.post('/refresh-token', authController.refreshToken);

// Rotas de administração (requerem role 'admin')
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Requer permissão de administrador.' });
  }
  next();
});

router.put('/users/:id', validator(registerSchema), authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
