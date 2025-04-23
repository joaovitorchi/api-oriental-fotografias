const { whereAndStackError } = require("../utils/where-and-stack-error");
const logger = require("../utils/logger");

/**
 * @swagger
 * definitions:
 *   Photo:
 *     type: object
 *     properties:
 *       photoId:
 *         type: integer
 *         description: ID único da foto
 *       sessionId:
 *         type: integer
 *         description: ID da sessão relacionada
 *       photoUrl:
 *         type: string
 *         description: URL da imagem original
 *       thumbnailUrl:
 *         type: string
 *         description: URL da miniatura
 *       title:
 *         type: string
 *         description: Título da foto
 *       description:
 *         type: string
 *         description: Descrição da foto
 *       uploadDate:
 *         type: string
 *         format: date-time
 *         description: Data de upload
 *       isFeatured:
 *         type: boolean
 *         description: Se é uma foto destacada
 *       metadata:
 *         type: object
 *         description: Metadados EXIF
 *       width:
 *         type: integer
 *         description: Largura em pixels
 *       height:
 *         type: integer
 *         description: Altura em pixels
 *       fileSize:
 *         type: integer
 *         description: Tamanho em bytes
 *       fileType:
 *         type: string
 *         description: Tipo do arquivo
 */
class Photo {
  constructor(dto) {
    this.photoId = dto.photo_id || dto.photoId;
    this.sessionId = dto.session_id || dto.sessionId;
    this.photoUrl = dto.photo_url || dto.photoUrl;
    this.thumbnailUrl = dto.thumbnail_url || dto.thumbnailUrl || null;
    this.title = dto.title || null;
    this.description = dto.description || null;
    this.uploadDate = new Date(dto.upload_date || Date.now());
    this.isFeatured = dto.is_featured || dto.isFeatured || false;
    this.metadata = dto.metadata ? JSON.parse(dto.metadata) : {};
    this.width = dto.width || null;
    this.height = dto.height || null;
    this.fileSize = dto.file_size || dto.fileSize || null;
    this.fileType = dto.file_type || dto.fileType || null;
  }

  validate() {
    if (!this.photoUrl) throw new Error("Photo URL is required");
    if (!this.sessionId) throw new Error("Session ID is required");
    return true;
  }

  extractMetadata(exifData) {
    this.metadata = {
      camera: exifData.Model || null,
      lens: exifData.LensModel || null,
      aperture: exifData.FNumber || null,
      shutterSpeed: exifData.ExposureTime || null,
      iso: exifData.ISO || null,
      focalLength: exifData.FocalLength || null,
      dateTaken: exifData.DateTimeOriginal || null,
      gps: exifData.GPSLatitude ? {
        latitude: exifData.GPSLatitude,
        longitude: exifData.GPSLongitude
      } : null
    };
  }
}

module.exports = Photo;