const { Pool } = require('pg');
const logger = require('../utils/logger');
require('dotenv').config();
class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async query(sql, params = []) {
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      logger.error(`Database error in ${this.table} repository: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    const result = await this.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findAll(page = 1, limit = 10, where = {}) {
    const offset = (page - 1) * limit;
    let whereClause = '';
    const values = [];
    let counter = 1;

    if (Object.keys(where).length > 0) {
      const conditions = [];
      for (const [key, value] of Object.entries(where)) {
        conditions.push(`${key} = $${counter}`);
        values.push(value);
        counter++;
      }
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const sql = `
      SELECT * FROM ${this.table}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${counter} OFFSET $${counter + 1}
    `;
    values.push(limit, offset);

    const result = await this.query(sql, values);
    return result.rows;
  }

  async create(data) {
    const keys = Object.keys(data);
    const indices = keys.map((_, i) => `$${i + 1}`);
    const values = Object.values(data);

    const sql = `
      INSERT INTO ${this.table} (${keys.join(', ')})
      VALUES (${indices.join(', ')})
      RETURNING *
    `;

    const result = await this.query(sql, values);
    return result.rows[0];
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(data);
    values.push(id);

    const sql = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result = await this.query(sql, values);
    return result.rows[0];
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
    const result = await this.query(sql, [id]);
    return result.rows[0];
  }

  async exists(id) {
    const sql = `SELECT EXISTS(SELECT 1 FROM ${this.table} WHERE id = $1)`;
    const result = await this.query(sql, [id]);
    return result.rows[0].exists;
  }
}

module.exports = BaseRepository;