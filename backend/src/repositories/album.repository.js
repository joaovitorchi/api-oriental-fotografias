const BaseRepository = require('./base.repository');
const { Album } = require('../models/album.model');

class AlbumRepository extends BaseRepository {
  constructor() {
    super('albums');
  }

  async findByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await this.query(`
      SELECT * FROM albums 
      WHERE created_by = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    return result.rows.map(row => new Album(row));
  }

  async findByShareToken(token) {
    const result = await this.query(`
      SELECT * FROM albums 
      WHERE share_token = $1 AND share_token_expires > NOW()
    `, [token]);
    return result.rows[0] ? new Album(result.rows[0]) : null;
  }

  async addPhotos(albumId, photoIds) {
    const values = photoIds.map((photoId, index) => 
      `($${index * 2 + 1}, $${index * 2 + 2})`
    ).join(', ');

    const params = photoIds.flatMap(photoId => [albumId, photoId]);

    await this.query(`
      INSERT INTO album_photos (album_id, photo_id)
      VALUES ${values}
    `, params);
  }

  async removePhotos(albumId, photoIds) {
    await this.query(`
      DELETE FROM album_photos 
      WHERE album_id = $1 AND photo_id = ANY($2::int[])
    `, [albumId, photoIds]);
  }

  async clearAlbumPhotos(albumId) {
    await this.query('DELETE FROM album_photos WHERE album_id = $1', [albumId]);
  }

  async create(albumData) {
    const result = await super.create(albumData);
    return new Album(result);
  }

  async update(id, albumData) {
    const result = await super.update(id, albumData);
    return new Album(result);
  }
}

module.exports = AlbumRepository;