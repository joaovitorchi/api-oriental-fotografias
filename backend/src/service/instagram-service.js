const axios = require('axios');
const InstagramRepository = require('../repositories/instagram.repository');
const logger = require('../utils/errors');
const { IntegrationError } = require('../utils/errors');

class InstagramService {
  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID;
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
    this.instagramRepo = new InstagramRepository();
  }

  getAuthorizationUrl() {
    return `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user_profile,user_media&response_type=code`;
  }

  async handleCallback(code) {
    try {
      // Troca o código por um token de acesso
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code
      });

      const { access_token, user_id } = response.data;

      // Obtém informações de longo prazo (token que expira em 60 dias)
      const longLivedToken = await this.getLongLivedToken(access_token);

      // Salva no banco de dados
      await this.instagramRepo.createOrUpdate({
        accessToken: longLivedToken.access_token,
        userId: user_id,
        tokenExpiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
        isActive: true
      });

      return { success: true };
    } catch (error) {
      logger.error('Instagram callback failed:', error);
      throw new IntegrationError('Falha na integração com Instagram');
    }
  }

  async getLongLivedToken(shortLivedToken) {
    const response = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: this.clientSecret,
        access_token: shortLivedToken
      }
    });
    return response.data;
  }

  async refreshToken() {
    const integration = await this.instagramRepo.getActiveIntegration();
    if (!integration) {
      throw new IntegrationError('Nenhuma integração ativa encontrada');
    }

    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: integration.accessToken
      }
    });

    await this.instagramRepo.update(integration.id, {
      accessToken: response.data.access_token,
      tokenExpiresAt: new Date(Date.now() + response.data.expires_in * 1000)
    });

    return { success: true };
  }

  async syncPosts() {
    const integration = await this.instagramRepo.getActiveIntegration();
    if (!integration) {
      throw new IntegrationError('Nenhuma integração ativa encontrada');
    }

    const response = await axios.get(`https://graph.instagram.com/${integration.userId}/media`, {
      params: {
        fields: 'id,caption,media_url,media_type,permalink,thumbnail_url,timestamp',
        access_token: integration.accessToken
      }
    });

    const posts = response.data.data.map(post => ({
      postId: post.id,
      caption: post.caption,
      mediaUrl: post.media_url,
      permalink: post.permalink,
      mediaType: post.media_type,
      thumbnailUrl: post.thumbnail_url || null,
      timestamp: new Date(post.timestamp)
    }));

    // Salva ou atualiza posts no banco de dados
    await this.instagramRepo.syncPosts(posts);

    return posts;
  }

  async getFeed(limit = 10) {
    return this.instagramRepo.getLatestPosts(limit);
  }

  async togglePostVisibility(postId, isVisible) {
    return this.instagramRepo.updatePost(postId, { isVisible });
  }
}

module.exports = new InstagramService();