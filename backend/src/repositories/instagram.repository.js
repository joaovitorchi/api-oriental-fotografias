const BaseRepository = require('./base.repository');
const { InstagramPost } = require('../models/instagrampost.model');

class InstagramRepository extends BaseRepository {
  constructor() {
    super('instagram_posts');
  }

  async createOrUpdate(integrationData) {
    const existing = await this.query(
      'SELECT * FROM instagram_integration WHERE user_id = $1',
      [integrationData.user_id]
    );

    if (existing.rows.length > 0) {
      return this.update(existing.rows[0].id, integrationData);
    } else {
      return this.create(integrationData);
    }
  }

  async getActiveIntegration() {
    const result = await this.query(
      'SELECT * FROM instagram_integration WHERE is_active = true AND token_expires_at > NOW() LIMIT 1'
    );
    return result.rows[0] || null;
  }

  async syncPosts(posts) {
    await this.query('BEGIN');
    
    try {
      // Upsert para cada post
      for (const post of posts) {
        await this.query(`
          INSERT INTO instagram_posts (id, caption, media_url, permalink, media_type, thumbnail_url, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            caption = EXCLUDED.caption,
            media_url = EXCLUDED.media_url,
            permalink = EXCLUDED.permalink,
            thumbnail_url = EXCLUDED.thumbnail_url,
            last_updated = NOW()
        `, [
          post.postId,
          post.caption,
          post.mediaUrl,
          post.permalink,
          post.mediaType,
          post.thumbnailUrl,
          post.timestamp
        ]);
      }
      
      await this.query('COMMIT');
    } catch (error) {
      await this.query('ROLLBACK');
      throw error;
    }
  }

  async getLatestPosts(limit = 10) {
    const result = await this.query(`
      SELECT * FROM instagram_posts 
      WHERE is_visible = true
      ORDER BY timestamp DESC
      LIMIT $1
    `, [limit]);
    return result.rows.map(row => new InstagramPost(row));
  }

  async updatePost(postId, updateData) {
    const result = await this.query(`
      UPDATE instagram_posts
      SET ${Object.keys(updateData).map((k, i) => `${k} = $${i + 1}`).join(', ')}
      WHERE id = $${Object.keys(updateData).length + 1}
      RETURNING *
    `, [...Object.values(updateData), postId]);
    
    return result.rows[0] ? new InstagramPost(result.rows[0]) : null;
  }
}

module.exports = InstagramRepository;