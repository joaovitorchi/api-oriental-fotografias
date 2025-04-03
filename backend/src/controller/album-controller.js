const albumService = require('../services/album.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class AlbumController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const album = await albumService.createAlbum(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        album
      });
    } catch (error) {
      logger.error(`Create album failed: ${error.message}`);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const album = await albumService.getAlbumDetails(req.params.id);
      
      // Verifica se o usuário tem acesso
      if (album.createdBy !== req.user.userId && !album.isPublic) {
        return res.status(403).json({ 
          success: false,
          message: 'Você não tem permissão para acessar este álbum' 
        });
      }

      res.json({
        success: true,
        album
      });
    } catch (error) {
      logger.error(`Get album failed: ${error.message}`);
      next(error);
    }
  }

  async getUserAlbums(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const albums = await albumService.getUserAlbums(
        req.user.userId,
        page,
        limit
      );

      res.json({
        success: true,
        albums,
        pagination: {
          page,
          limit,
          total: albums.length
        }
      });
    } catch (error) {
      logger.error(`Get user albums failed: ${error.message}`);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const album = await albumService.updateAlbum(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        album
      });
    } catch (error) {
      logger.error(`Update album failed: ${error.message}`);
      next(error);
    }
  }

  async generateShareLink(req, res, next) {
    try {
      const shareUrl = await albumService.generateShareToken(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        shareUrl
      });
    } catch (error) {
      logger.error(`Generate share link failed: ${error.message}`);
      next(error);
    }
  }

  async getSharedAlbum(req, res, next) {
    try {
      const album = await albumService.getAlbumByShareToken(req.params.token);

      res.json({
        success: true,
        album
      });
    } catch (error) {
      logger.error(`Get shared album failed: ${error.message}`);
      next(error);
    }
  }

  async verifyPassword(req, res, next) {
    try {
      const { password } = req.body;
      const album = await albumService.verifyAlbumPassword(
        req.params.token,
        password
      );

      res.json({
        success: true,
        album
      });
    } catch (error) {
      logger.error(`Verify album password failed: ${error.message}`);
      next(error);
    }
  }

  async notifyClient(req, res, next) {
    try {
      await albumService.notifyClient(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        message: 'Cliente notificado com sucesso'
      });
    } catch (error) {
      logger.error(`Notify client failed: ${error.message}`);
      next(error);
    }
  }

  async setPassword(req, res, next) {
    try {
      const { password } = req.body;
      await albumService.setAlbumPassword(
        req.user.userId,
        req.params.id,
        password
      );

      res.json({
        success: true,
        message: password 
          ? 'Senha do álbum definida com sucesso' 
          : 'Proteção por senha removida'
      });
    } catch (error) {
      logger.error(`Set album password failed: ${error.message}`);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await albumService.deleteAlbum(
        req.user.userId,
        req.params.id
      );

      res.json({
        success: true,
        message: 'Álbum excluído com sucesso'
      });
    } catch (error) {
      logger.error(`Delete album failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new AlbumController();