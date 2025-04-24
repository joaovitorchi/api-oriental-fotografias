const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class AuthController {
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = req.body;
      const user = await authService.register(userData);

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      logger.error(`Registration failed: ${error.message}`);
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.userId);
      res.json({
        success: true,
        user
      });
    } catch (error) {
      logger.error(`Get profile failed: ${error.message}`);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = await authService.refreshToken(req.user.userId);
      res.json({
        success: true,
        token
      });
    } catch (error) {
      logger.error(`Refresh token failed: ${error.message}`);
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      logger.error(`Change password failed: ${error.message}`);
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { id } = req.params;
      const updatedUser = await authService.updateUser(id, req.body);
  
      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      logger.error(`Update user failed: ${error.message}`);
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await authService.deleteUser(id);
  
      res.json({
        success: true,
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      logger.error(`Delete user failed: ${error.message}`);
      next(error);
    }
  }
  
}

module.exports = new AuthController();