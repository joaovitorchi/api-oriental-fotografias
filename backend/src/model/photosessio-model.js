const { whereAndStackError } = require("../utils/where-and-stack-error");
const logger = require("../utils/logger");

/**
 * @swagger
 * definitions:
 *   PhotoSession:
 *     type: object
 *     properties:
 *       sessionId:
 *         type: integer
 *         description: ID único da sessão
 *       title:
 *         type: string
 *         description: Título da sessão
 *       description:
 *         type: string
 *         description: Descrição detalhada
 *       sessionDate:
 *         type: string
 *         format: date-time
 *         description: Data da sessão fotográfica
 *       location:
 *         type: string
 *         description: Local onde foi realizada
 *       coverPhotoUrl:
 *         type: string
 *         description: URL da foto de capa
 *       createdBy:
 *         type: integer
 *         description: ID do usuário que criou
 *       isPublished:
 *         type: boolean
 *         description: Se a sessão está publicada
 *       publishDate:
 *         type: string
 *         format: date-time
 *         description: Data de publicação
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *       categories:
 *         type: array
 *         items:
 *           type: integer
 *         description: IDs das categorias
 */
class PhotoSession {
  constructor(dto) {
    this.sessionId = dto.session_id || dto.sessionId;
    this.title = dto.title;
    this.description = dto.description || null;
    this.sessionDate = new Date(dto.session_date);
    this.location = dto.location || null;
    this.coverPhotoUrl = dto.cover_photo_url || dto.coverPhotoUrl || null;
    this.createdBy = dto.created_by || dto.createdBy;
    this.isPublished = dto.is_published || dto.isPublished || false;
    this.publishDate = dto.publish_date ? new Date(dto.publish_date) : null;
    this.createdAt = new Date(dto.created_at || Date.now());
    this.updatedAt = new Date(dto.updated_at || Date.now());
    this.categories = dto.categories || [];
  }

  validate() {
    if (!this.title) throw new Error("Title is required");
    if (!this.sessionDate) throw new Error("Session date is required");
    if (isNaN(this.sessionDate.getTime())) throw new Error("Invalid session date");
    return true;
  }

  addCategory(categoryId) {
    if (!this.categories.includes(categoryId)) {
      this.categories.push(categoryId);
    }
  }

  removeCategory(categoryId) {
    this.categories = this.categories.filter(id => id !== categoryId);
  }
}

module.exports = PhotoSession;