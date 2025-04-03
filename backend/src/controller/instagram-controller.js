const instagramService = require('../services/instagram.service');
const logger = require('../utils/logger');

class InstagramController {
  async startAuth(req, res, next) {
    try {
      const authUrl = instagramService.getAuthorizationUrl();
      res.redirect(authUrl);
    } catch (error) {
      logger.error(`Instagram auth failed: ${error.message}`);
      next(error);
    }
  }

  async handleCallback(req, res, next) {
    try {
      const { code } = req.query;
      await instagramService.handleCallback(code);
      
      res.send(`
        <script>
          window.close();
        </script>
        <p>Autenticação com Instagram concluída. Você pode fechar esta janela.</p>
      `);
    } catch (error) {
      logger.error(`Instagram callback failed: ${error.message}`);
      next(error);
    }
  }

  async getAdminFeed(req, res, next) {
    try {
      const posts = await instagramService.getAdminFeed();
      res.json({
        success: true,
        posts
      });
    } catch (error) {
      logger.error(`Get admin feed failed: ${error.message}`);
      next(error);
    }
  }

  async syncPosts(req, res, next) {
    try {
      const posts = await instagramService.syncPosts();
      res.json({
        success: true,
        count: posts.length,
        message: 'Posts sincronizados com sucesso'
      });
    } catch (error) {
      logger.error(`Sync posts failed: ${error.message}`);
      next(error);
    }
  }

  async togglePostVisibility(req, res, next) {
    try {
      const { isVisible } = req.body;
      const post = await instagramService.togglePostVisibility(
        req.params.id,
        isVisible
      );

      res.json({
        success: true,
        post,
        message: isVisible 
          ? 'Post visível no site' 
          : 'Post oculto do site'
      });
    } catch (error) {
      logger.error(`Toggle post visibility failed: ${error.message}`);
      next(error);
    }
  }

  async getPublicFeed(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 12;
      const posts = await instagramService.getFeed(limit);
      res.json({
        success: true,
        posts
      });
    } catch (error) {
      logger.error(`Get public feed failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new InstagramController();