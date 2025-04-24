const BaseRepository = require('./base.repository');
const { Photo } = require('../models/photo.model');

class PhotoRepository extends BaseRepository {
  constructor() {
    super('photos');
  }

  async findBySession(sessionId) {
    const result = await this.query('SELECT * FROM photos WHERE session_id = $1 ORDER BY upload_date DESC', [sessionId]);
    return result.rows.map(row => new Photo(row));
  }

  async findByAlbum(albumId) {
    const result = await this.query(`
      SELECT p.* FROM photos p
      JOIN album_photos ap ON p.id = ap.photo_id
      WHERE ap.album_id = $1
      ORDER BY ap.created_at
    `, [albumId]);
    return result.rows.map(row => new Photo(row));
  }

  async findByIds(ids) {
    if (ids.length === 0) return [];
    const result = await this.query(`SELECT * FROM photos WHERE id = ANY($1::int[])`, [ids]);
    return result.rows.map(row => new Photo(row));
  }

  async findFirstBySession(sessionId) {
    const result = await this.query(`
      SELECT * FROM photos 
      WHERE session_id = $1 
      ORDER BY upload_date 
      LIMIT 1
    `, [sessionId]);
    return result.rows[0] ? new Photo(result.rows[0]) : null;
  }

  async create(photoData) {
    const result = await super.create(photoData);
    return new Photo(result);
  }

  async update(id, photoData) {
    const result = await super.update(id, photoData);
    return new Photo(result);
  }
}

module.exports = PhotoRepository;