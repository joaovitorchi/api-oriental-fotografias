const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.active) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isValidPassword = user.comparePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    await this.userRepository.updateLastLogin(user.userId);

    const token = this.generateToken({
      userId: user.userId,
      role: user.role,
      email: user.email
    });

    return {
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      },
      token
    };
  }

  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }

  async refreshToken(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    return this.generateToken({
      userId: user.userId,
      role: user.role,
      email: user.email
    });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    
    if (!user.comparePassword(currentPassword)) {
      throw new ValidationError('Senha atual incorreta');
    }

    user.encryptPassword(newPassword);
    await this.userRepository.update(user);
    
    return { success: true };
  }
}

module.exports = new AuthService();