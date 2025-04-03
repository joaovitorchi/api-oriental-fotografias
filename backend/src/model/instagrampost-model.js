/**
 * @swagger
 * definitions:
 *   InstagramPost:
 *     type: object
 *     properties:
 *       postId:
 *         type: string
 *         description: ID do post no Instagram
 *       caption:
 *         type: string
 *         description: Legenda do post
 *       mediaUrl:
 *         type: string
 *         description: URL da mídia
 *       permalink:
 *         type: string
 *         description: Link permanente para o post
 *       mediaType:
 *         type: string
 *         enum: [IMAGE, VIDEO, CAROUSEL_ALBUM]
 *         description: Tipo de mídia
 *       thumbnailUrl:
 *         type: string
 *         description: URL da miniatura (para vídeos)
 *       timestamp:
 *         type: string
 *         format: date-time
 *         description: Data de criação no Instagram
 *       isFeatured:
 *         type: boolean
 *         description: Se é um post destacado
 *       isVisible:
 *         type: boolean
 *         description: Se está visível no site
 */
class InstagramPost {
    constructor(dto) {
      this.postId = dto.post_id || dto.postId;
      this.caption = dto.caption || null;
      this.mediaUrl = dto.media_url || dto.mediaUrl;
      this.permalink = dto.permalink;
      this.mediaType = dto.media_type || dto.mediaType;
      this.thumbnailUrl = dto.thumbnail_url || dto.thumbnailUrl || null;
      this.timestamp = new Date(dto.timestamp);
      this.isFeatured = dto.is_featured || dto.isFeatured || false;
      this.isVisible = dto.is_visible !== undefined ? dto.is_visible : true;
    }
  
    validate() {
      if (!this.postId) throw new Error("Post ID is required");
      if (!this.mediaUrl) throw new Error("Media URL is required");
      if (!this.permalink) throw new Error("Permalink is required");
      if (!['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(this.mediaType)) {
        throw new Error("Invalid media type");
      }
      return true;
    }
  }
  
  module.exports = InstagramPost;