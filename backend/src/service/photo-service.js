const PhotoRepository = require('../repositories/photo.repository');
const SessionRepository = require('../repositories/session.repository');
const StorageService = require('./storage.service');
const logger = require('../utils/logger');
const { NotFoundError, ValidationError } = require('../utils/errors');

class PhotoService {
  constructor() {
    this.photoRepository = new PhotoRepository();
    this.sessionRepository = new SessionRepository();
    this.storageService = new StorageService();
  }

  async uploadPhoto(userId, sessionId, file, metadata) {
    // Verifica se a sessão existe e pertence ao usuário
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Sessão não encontrada');
    }

    if (session.createdBy !== userId) {
      throw new UnauthorizedError('Você não tem permissão para adicionar fotos a esta sessão');
    }

    // Faz upload para o storage (S3, Google Cloud, etc)
    const uploadResult = await this.storageService.upload(file, {
      folder: `sessions/${sessionId}`,
      metadata
    });

    // Salva no banco de dados
    const photoData = {
      sessionId,
      photoUrl: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      metadata: uploadResult.metadata,
      width: uploadResult.width,
      height: uploadResult.height,
      fileSize: uploadResult.size,
      fileType: uploadResult.type
    };

    const photo = await this.photoRepository.create(photoData);

    // Atualiza a sessão com a foto de capa se necessário
    if (!session.coverPhotoUrl) {
      await this.sessionRepository.update(sessionId, { coverPhotoUrl: uploadResult.url });
    }

    return photo;
  }

  async getPhotoById(photoId) {
    const photo = await this.photoRepository.findById(photoId);
    if (!photo) {
      throw new NotFoundError('Foto não encontrada');
    }
    return photo;
  }

  async getSessionPhotos(sessionId) {
    return this.photoRepository.findBySession(sessionId);
  }

  async updatePhoto(userId, photoId, updateData) {
    const photo = await this.getPhotoById(photoId);
    const session = await this.sessionRepository.findById(photo.sessionId);

    if (session.createdBy !== userId) {
      throw new UnauthorizedError('Você não tem permissão para editar esta foto');
    }

    return this.photoRepository.update(photoId, updateData);
  }

  async deletePhoto(userId, photoId) {
    const photo = await this.getPhotoById(photoId);
    const session = await this.sessionRepository.findById(photo.sessionId);

    if (session.createdBy !== userId) {
      throw new UnauthorizedError('Você não tem permissão para excluir esta foto');
    }

    // Remove do storage
    await this.storageService.delete(photo.photoUrl);
    if (photo.thumbnailUrl) {
      await this.storageService.delete(photo.thumbnailUrl);
    }

    // Remove do banco de dados
    await this.photoRepository.delete(photoId);

    // Se era a foto de capa, atualiza a sessão
    if (session.coverPhotoUrl === photo.photoUrl) {
      const newCover = await this.photoRepository.findFirstBySession(photo.sessionId);
      await this.sessionRepository.update(photo.sessionId, {
        coverPhotoUrl: newCover ? newCover.photoUrl : null
      });
    }

    return { success: true };
  }
}

module.exports = new PhotoService();