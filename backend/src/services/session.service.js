const SessionRepository = require('../repositories/session.repository');
const PhotoRepository = require('../repositories/photo.repository');
const CategoryRepository = require('../repositories/category.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class SessionService {
  constructor() {
    this.sessionRepository = new SessionRepository();
    this.photoRepository = new PhotoRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createSession(userId, sessionData) {
    const session = await this.sessionRepository.create({
      ...sessionData,
      createdBy: userId
    });

    // Adiciona categorias se fornecidas
    if (sessionData.categories && sessionData.categories.length > 0) {
      await this.addCategoriesToSession(session.sessionId, sessionData.categories);
    }

    return this.getSessionById(session.sessionId);
  }

  async getSessionById(sessionId) {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Sessão não encontrada');
    }

    const [photos, categories] = await Promise.all([
      this.photoRepository.findBySession(sessionId),
      this.categoryRepository.findBySession(sessionId)
    ]);

    return {
      ...session,
      photos,
      categories
    };
  }

  async getPublishedSessions(page = 1, limit = 10) {
    return this.sessionRepository.findPublishedSessions(page, limit);
  }

  async updateSession(userId, sessionId, updateData) {
    const session = await this.sessionRepository.findById(sessionId);
    
    if (session.createdBy !== userId) {
      throw new UnauthorizedError('Você não tem permissão para editar esta sessão');
    }

    // Atualiza categorias se fornecidas
    if (updateData.categories) {
      await this.sessionRepository.clearSessionCategories(sessionId);
      await this.addCategoriesToSession(sessionId, updateData.categories);
    }

    return this.sessionRepository.update(sessionId, updateData);
  }

  async togglePublish(sessionId, publish) {
    const updateData = {
      isPublished: publish,
      publishDate: publish ? new Date() : null
    };
    
    return this.sessionRepository.update(sessionId, updateData);
  }

  async addCategoriesToSession(sessionId, categoryIds) {
    const validCategories = await this.categoryRepository.findByIds(categoryIds);
    
    if (validCategories.length !== categoryIds.length) {
      throw new ValidationError('Uma ou mais categorias são inválidas');
    }

    return this.sessionRepository.addCategories(sessionId, categoryIds);
  }

  async deleteSession(userId, sessionId) {
    const session = await this.sessionRepository.findById(sessionId);
    
    if (session.createdBy !== userId) {
      throw new UnauthorizedError('Você não tem permissão para excluir esta sessão');
    }

    // Primeiro exclui todas as fotos da sessão
    const photos = await this.photoRepository.findBySession(sessionId);
    await Promise.all(photos.map(photo => 
      this.photoRepository.delete(photo.photoId)
    ));

    // Depois exclui a sessão
    return this.sessionRepository.delete(sessionId);
  }
}

module.exports = new SessionService();