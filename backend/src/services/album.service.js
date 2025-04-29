const AlbumRepository = require("../repositories/album.repository");
const PhotoRepository = require("../repositories/photo.repository");
const ClientRepository = require("../repositories/client.repository");
const notificationService = require("./notification.service");
const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../utils/errors");
const logger = require("../utils/logger");

class AlbumService {
  constructor() {
    this.albumRepository = new AlbumRepository();
    this.photoRepository = new PhotoRepository();
    this.clientRepository = new ClientRepository();
    this.notificationService = notificationService;
  }

  /**
   * Cria um novo álbum
   * @param {number} userId - ID do usuário criador
   * @param {Object} albumData - Dados do álbum
   * @returns {Promise<Object>} Álbum criado
   */
  async createAlbum(userId, albumData) {
    try {
      // Verifica se o cliente existe (se fornecido)
      if (albumData.clientId) {
        const clientExists = await this.clientRepository.exists(
          albumData.clientId
        );
        if (!clientExists) {
          throw new ValidationError("Cliente não encontrado");
        }
      }

      const album = await this.albumRepository.create({
        ...albumData,
        createdBy: userId,
      });

      // Adiciona fotos ao álbum se fornecidas
      if (albumData.photoIds && albumData.photoIds.length > 0) {
        await this.addPhotosToAlbum(album.albumId, albumData.photoIds);
      }

      return this.getAlbumDetails(album.albumId);
    } catch (error) {
      logger.error(`Falha ao criar álbum: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém detalhes de um álbum
   * @param {number} albumId - ID do álbum
   * @returns {Promise<Object>} Detalhes do álbum
   */
  async getAlbumDetails(albumId) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    const [photos, client] = await Promise.all([
      this.photoRepository.findByAlbum(albumId),
      album.clientId ? this.clientRepository.findById(album.clientId) : null,
    ]);

    return {
      ...album,
      photos,
      client,
    };
  }

  /**
   * Lista álbuns de um usuário
   * @param {number} userId - ID do usuário
   * @param {number} page - Página atual
   * @param {number} limit - Itens por página
   * @returns {Promise<Array>} Lista de álbuns
   */
  async getUserAlbums(userId, page = 1, limit = 10) {
    return this.albumRepository.findByUser(userId, page, limit);
  }

  /**
   * Atualiza um álbum
   * @param {number} userId - ID do usuário
   * @param {number} albumId - ID do álbum
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Álbum atualizado
   */
  async updateAlbum(userId, albumId, updateData) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (album.createdBy !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para editar este álbum"
      );
    }

    // Atualiza fotos se fornecido
    if (updateData.photoIds) {
      await this.albumRepository.clearAlbumPhotos(albumId);
      await this.addPhotosToAlbum(albumId, updateData.photoIds);
    }

    const updatedAlbum = await this.albumRepository.update(albumId, updateData);
    return this.getAlbumDetails(updatedAlbum.albumId);
  }

  /**
   * Adiciona fotos a um álbum
   * @param {number} albumId - ID do álbum
   * @param {Array<number>} photoIds - IDs das fotos
   * @returns {Promise<void>}
   */
  async addPhotosToAlbum(albumId, photoIds) {
    // Verifica se todas as fotos existem
    const existingPhotos = await this.photoRepository.findByIds(photoIds);
    if (existingPhotos.length !== photoIds.length) {
      throw new ValidationError("Uma ou mais fotos não foram encontradas");
    }

    await this.albumRepository.addPhotos(albumId, photoIds);

    // Atualiza foto de capa se necessário
    const album = await this.albumRepository.findById(albumId);
    if (!album.coverPhotoId && photoIds.length > 0) {
      await this.albumRepository.update(albumId, { coverPhotoId: photoIds[0] });
    }
  }

  /**
   * Remove fotos de um álbum
   * @param {number} albumId - ID do álbum
   * @param {Array<number>} photoIds - IDs das fotos
   * @returns {Promise<void>}
   */
  async removePhotosFromAlbum(albumId, photoIds) {
    await this.albumRepository.removePhotos(albumId, photoIds);

    // Verifica se a foto de capa foi removida
    const album = await this.albumRepository.findById(albumId);
    if (album.coverPhotoId && photoIds.includes(album.coverPhotoId)) {
      const remainingPhotos = await this.photoRepository.findByAlbum(albumId);
      const newCoverId =
        remainingPhotos.length > 0 ? remainingPhotos[0].photoId : null;
      await this.albumRepository.update(albumId, { coverPhotoId: newCoverId });
    }
  }

  /**
   * Gera um link de compartilhamento seguro
   * @param {number} userId - ID do usuário
   * @param {number} albumId - ID do álbum
   * @returns {Promise<string>} Token de compartilhamento
   */
  async generateShareToken(userId, albumId) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (album.createdBy !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para compartilhar este álbum"
      );
    }

    const shareToken = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

    await this.albumRepository.update(albumId, {
      shareToken,
      shareTokenExpires: expiresAt,
    });

    return `${process.env.APP_URL}/shared-album/${shareToken}`;
  }

  /**
   * Obtém um álbum pelo token de compartilhamento
   * @param {string} token - Token de compartilhamento
   * @returns {Promise<Object>} Detalhes do álbum
   */
  async getAlbumByShareToken(token) {
    const album = await this.albumRepository.findByShareToken(token);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado ou link expirado");
    }

    if (new Date(album.shareTokenExpires) < new Date()) {
      throw new ValidationError("Link de compartilhamento expirado");
    }

    if (album.passwordHash) {
      return {
        ...album,
        photos: [], // Não retorna fotos até que a senha seja verificada
        requiresPassword: true,
      };
    }

    return this.getAlbumDetails(album.albumId);
  }

  /**
   * Verifica a senha de um álbum protegido
   * @param {string} token - Token de compartilhamento
   * @param {string} password - Senha do álbum
   * @returns {Promise<Object>} Detalhes do álbum se a senha estiver correta
   */
  async verifyAlbumPassword(token, password) {
    const album = await this.albumRepository.findByShareToken(token);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (!album.passwordHash) {
      return this.getAlbumDetails(album.albumId);
    }

    const bcrypt = require("bcryptjs");
    const isValid = bcrypt.compareSync(password, album.passwordHash);
    if (!isValid) {
      throw new ValidationError("Senha incorreta");
    }

    return this.getAlbumDetails(album.albumId);
  }

  /**
   * Notifica o cliente sobre um álbum pronto
   * @param {number} userId - ID do usuário
   * @param {number} albumId - ID do álbum
   * @returns {Promise<void>}
   */
  async notifyClient(userId, albumId) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (album.createdBy !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para notificar sobre este álbum"
      );
    }

    if (!album.clientId) {
      throw new ValidationError("Este álbum não está associado a um cliente");
    }

    const client = await this.clientRepository.findById(album.clientId);
    if (!client || !client.email) {
      throw new ValidationError("Cliente não possui email cadastrado");
    }

    // Gera token se não existir
    if (!album.shareToken) {
      await this.generateShareToken(userId, albumId);
      const updatedAlbum = await this.albumRepository.findById(albumId);
      album.shareToken = updatedAlbum.shareToken;
    }

    const shareUrl = `${process.env.APP_URL}/shared-album/${album.shareToken}`;

    return this.notificationService.sendClientAlbumNotification(
      client.email,
      album.title,
      shareUrl
    );
  }

  /**
   * Define/remove a senha de um álbum
   * @param {number} userId - ID do usuário
   * @param {number} albumId - ID do álbum
   * @param {string|null} password - Nova senha (null para remover)
   * @returns {Promise<void>}
   */
  async setAlbumPassword(userId, albumId, password) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (album.createdBy !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para proteger este álbum"
      );
    }

    const passwordHash = password
      ? require("bcryptjs").hashSync(password, 10)
      : null;

    return this.albumRepository.update(albumId, { passwordHash });
  }

  /**
   * Remove um álbum
   * @param {number} userId - ID do usuário
   * @param {number} albumId - ID do álbum
   * @returns {Promise<void>}
   */
  async deleteAlbum(userId, albumId) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError("Álbum não encontrado");
    }

    if (album.createdBy !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para excluir este álbum"
      );
    }

    return this.albumRepository.delete(albumId);
  }
}

module.exports = new AlbumService();
