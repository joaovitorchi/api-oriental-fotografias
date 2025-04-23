/**
 * @swagger
 * definitions:
 *   Category:
 *     type: object
 *     properties:
 *       categoryId:
 *         type: integer
 *         description: ID único da categoria
 *       name:
 *         type: string
 *         description: Nome da categoria
 *       slug:
 *         type: string
 *         description: Slug para URLs
 *       description:
 *         type: string
 *         description: Descrição da categoria
 *       coverPhotoUrl:
 *         type: string
 *         description: URL da foto de capa
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */
class Category {
    constructor(dto) {
      this.categoryId = dto.category_id || dto.categoryId;
      this.name = dto.name;
      this.slug = dto.slug || this.generateSlug(dto.name);
      this.description = dto.description || null;
      this.coverPhotoUrl = dto.cover_photo_url || dto.coverPhotoUrl || null;
      this.createdAt = new Date(dto.created_at || Date.now());
      this.updatedAt = new Date(dto.updated_at || Date.now());
    }
  
    generateSlug(name) {
      return name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    }
  
    validate() {
      if (!this.name) throw new Error("Category name is required");
      if (!this.slug) throw new Error("Slug is required");
      return true;
    }
  }
  
  module.exports = Category;