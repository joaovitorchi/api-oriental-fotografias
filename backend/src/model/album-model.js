/**
 * @swagger
 * definitions:
 *   Album:
 *     type: object
 *     properties:
 *       albumId:
 *         type: integer
 *         description: ID único do álbum
 *       title:
 *         type: string
 *         description: Título do álbum
 *       description:
 *         type: string
 *         description: Descrição detalhada
 *       coverPhotoId:
 *         type: integer
 *         description: ID da foto de capa
 *       isPublic:
 *         type: boolean
 *         description: Se o álbum é público
 *       passwordHash:
 *         type: string
 *         description: Hash da senha (se protegido)
 *       clientId:
 *         type: integer
 *         description: ID do cliente dono
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *       photoIds:
 *         type: array
 *         items:
 *           type: integer
 *         description: IDs das fotos no álbum
 */
class Album {
    constructor(dto) {
      this.albumId = dto.album_id || dto.albumId;
      this.title = dto.title;
      this.description = dto.description || null;
      this.coverPhotoId = dto.cover_photo_id || dto.coverPhotoId || null;
      this.isPublic = dto.is_public || dto.isPublic || false;
      this.passwordHash = dto.password_hash || dto.passwordHash || null;
      this.clientId = dto.client_id || dto.clientId || null;
      this.createdAt = new Date(dto.created_at || Date.now());
      this.updatedAt = new Date(dto.updated_at || Date.now());
      this.photoIds = dto.photo_ids || dto.photoIds || [];
    }
  
    setPassword(password) {
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(10);
      this.passwordHash = bcrypt.hashSync(password, salt);
    }
  
    checkPassword(password) {
      if (!this.passwordHash) return true; // Álbum sem senha
      const bcrypt = require('bcryptjs');
      return bcrypt.compareSync(password, this.passwordHash);
    }
  
    addPhoto(photoId) {
      if (!this.photoIds.includes(photoId)) {
        this.photoIds.push(photoId);
      }
    }
  
    removePhoto(photoId) {
      this.photoIds = this.photoIds.filter(id => id !== photoId);
      if (this.coverPhotoId === photoId) {
        this.coverPhotoId = this.photoIds[0] || null;
      }
    }
  }
  
  module.exports = Album;