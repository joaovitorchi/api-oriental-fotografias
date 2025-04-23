const photoService = require('../services/photo.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class PhotoController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
      }

      const photo = await photoService.uploadPhoto(
        req.user.userId,
        req.body.sessionId,
        req.file,
        req.body
      );

      res.status(201).json({
        success: true,
        photo
      });
    } catch (error) {
      logger.error(`Upload photo failed for user ${req.user.userId}: ${error.message}`);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const photo = await photoService.getPhotoById(req.params.id);
      
      // Adicionar lógica para verificar se o usuário tem permissão
      if (photo.userId !== req.user.userId && !req.user.hasPermission('view_all_photos')) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para visualizar esta foto'
        });
      }

      res.json({
        success: true,
        photo
      });
    } catch (error) {
      logger.error(`Get photo failed for user ${req.user.userId}: ${error.message}`);
      next(error);
    }
  }

  async getSessionPhotos(req, res, next) {
    try {
      const photos = await photoService.getSessionPhotos(req.params.sessionId);

      // Verificar se o usuário tem permissão para acessar as fotos da sessão
      if (!photos.some(photo => photo.userId === req.user.userId || req.user.hasPermission('view_all_photos'))) {
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

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const photo = await photoService.updatePhoto(
        req.user.userId,
        req.params.id,
        req.body
      );

      if (photo.userId !== req.user.userId && !req.user.hasPermission('update_all_photos')) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para atualizar esta foto'
        });
      }

      res.json({
        success: true,
        photo
      });
    } catch (error) {
      logger.error(`Update photo failed for user ${req.user.userId}: ${error.message}`);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const photo = await photoService.getPhotoById(req.params.id);

      if (photo.userId !== req.user.userId && !req.user.hasPermission('delete_all_photos')) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para excluir esta foto'
        });
      }

      await photoService.deletePhoto(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        message: 'Foto excluída com sucesso'
      });
    } catch (error) {
      logger.error(`Delete photo failed for user ${req.user.userId}: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new PhotoController();
