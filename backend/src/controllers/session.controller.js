const sessionService = require('../services/session.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class SessionController {
  async createSession(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const session = await sessionService.createSession(
        req.user.userId,
        req.body
      );

      res.status(201).json({
        success: true,
        session
      });
    } catch (error) {
      logger.error(`Create session failed: ${error.message}`);
      next(error);
    }
  }

  async getSessionPhotos(req, res, next) {
    try {
      const { sessionId } = req.params;

      // Recupera as fotos da sessão
      const photos = await photoService.getSessionPhotos(sessionId);

      if (!photos || photos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhuma foto encontrada para esta sessão'
        });
      }

      // Verificar se o usuário tem permissão para acessar as fotos da sessão
      const userHasPermission = photos.some(photo => 
        photo.userId === req.user.userId || req.user.hasPermission('view_all_photos')
      );

      if (!userHasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para visualizar as fotos desta sessão'
        });
      }

      res.json({
        success: true,
        photos
      });
    } catch (error) {
      logger.error(`Get session photos failed for user ${req.user.userId}: ${error.message}`);
      next(error);
    }
  }

  async getSessionById(req, res, next) {
    try {
      const session = await sessionService.getSessionById(req.params.id);
      
      // Verifica se é público ou se o usuário tem acesso
      if (!session.isPublished && session.createdBy !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para acessar esta sessão'
        });
      }

      res.json({
        success: true,
        session
      });
    } catch (error) {
      logger.error(`Get session failed: ${error.message}`);
      next(error);
    }
  }

  async getPublishedSessions(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const sessions = await sessionService.getPublishedSessions(page, limit);

      res.json({
        success: true,
        sessions,
        pagination: {
          page,
          limit,
          total: sessions.length
        }
      });
    } catch (error) {
      logger.error(`Get published sessions failed: ${error.message}`);
      next(error);
    }
  }

  async updateSession(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const session = await sessionService.updateSession(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        session
      });
    } catch (error) {
      logger.error(`Update session failed: ${error.message}`);
      next(error);
    }
  }

  async togglePublish(req, res, next) {
    try {
      const { publish } = req.body;
      const session = await sessionService.togglePublish(
        req.params.id,
        publish
      );

      res.json({
        success: true,
        session,
        message: publish 
          ? 'Sessão publicada com sucesso' 
          : 'Sessão despublicada'
      });
    } catch (error) {
      logger.error(`Toggle publish failed: ${error.message}`);
      next(error);
    }
  }

  async deleteSession(req, res, next) {
    try {
      await sessionService.deleteSession(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        message: 'Sessão excluída com sucesso'
      });
    } catch (error) {
      logger.error(`Delete session failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new SessionController();