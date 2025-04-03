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
      logger.error(`Upload photo failed: ${error.message}`);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const photo = await photoService.getPhotoById(req.params.id);
      
      // Aqui você pode adicionar verificação de permissões
      // se necessário (ex: se a foto pertence a um álbum/sessão do usuário)

      res.json({
        success: true,
        photo
      });
    } catch (error) {
      logger.error(`Get photo failed: ${error.message}`);
      next(error);
    }
  }

  async getSessionPhotos(req, res, next) {
    try {
      const photos = await photoService.getSessionPhotos(req.params.sessionId);
      res.json({
        success: true,
        photos
      });
    } catch (error) {
      logger.error(`Get session photos failed: ${error.message}`);
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

      res.json({
        success: true,
        photo
      });
    } catch (error) {
      logger.error(`Update photo failed: ${error.message}`);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await photoService.deletePhoto(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        message: 'Foto excluída com sucesso'
      });
    } catch (error) {
      logger.error(`Delete photo failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new PhotoController();