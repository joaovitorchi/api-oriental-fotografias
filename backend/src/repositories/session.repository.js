const BaseRepository = require('./base.repository');
const { PhotoSession } = require('../models/photosessio.model');

class SessionRepository extends BaseRepository {
  constructor() {
    super('photo_sessions');
  }

  async findPublishedSessions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await this.query(`
      SELECT * FROM photo_sessions 
      WHERE is_published = true
      ORDER BY publish_date DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows.map(row => new PhotoSession(row));
  }

  async addCategories(sessionId, categoryIds) {
    const values = categoryIds.map((catId, index) => 
      `($${index * 2 + 1}, $${index * 2 + 2})`
    ).join(', ');

    const params = categoryIds.flatMap(catId => [sessionId, catId]);

    await this.query(`
      INSERT INTO session_categories (session_id, category_id)
      VALUES ${values}
    `, params);
  }

  async clearSessionCategories(sessionId) {
    await this.query('DELETE FROM session_categories WHERE session_id = $1', [sessionId]);
  }

  async findById(id) {
    const result = await super.findById(id);
    return result ? new PhotoSession(result) : null;
  }

  async create(sessionData) {
    const result = await super.create(sessionData);
    return new PhotoSession(result);
  }

  async update(id, sessionData) {
    const result = await super.update(id, sessionData);
    return new PhotoSession(result);
  }
}

module.exports = SessionRepository;