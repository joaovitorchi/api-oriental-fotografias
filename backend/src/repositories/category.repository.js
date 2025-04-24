const BaseRepository = require('./base.repository');
const { Category } = require('../models/category.model');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('categories');
  }

  async findBySession(sessionId) {
    const result = await this.query(`
      SELECT c.* FROM categories c
      JOIN session_categories sc ON c.id = sc.category_id
      WHERE sc.session_id = $1
    `, [sessionId]);
    return result.rows.map(row => new Category(row));
  }

  async findByIds(ids) {
    if (ids.length === 0) return [];
    const result = await this.query(
      'SELECT * FROM categories WHERE id = ANY($1::int[])',
      [ids]
    );
    return result.rows.map(row => new Category(row));
  }

  async findBySlug(slug) {
    const result = await this.query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );
    return result.rows[0] ? new Category(result.rows[0]) : null;
  }

  async create(categoryData) {
    const result = await super.create(categoryData);
    return new Category(result);
  }

  async update(id, categoryData) {
    const result = await super.update(id, categoryData);
    return new Category(result);
  }
}

module.exports = CategoryRepository;