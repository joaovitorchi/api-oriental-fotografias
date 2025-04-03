const BaseRepository = require('./base.repository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async findByUsername(username) {
    const result = await this.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async updateLastLogin(userId) {
    await this.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
  }

  async findById(id) {
    const result = await super.findById(id);
    return result ? new User(result) : null;
  }

  async create(userData) {
    const result = await super.create(userData);
    return new User(result);
  }

  async update(id, userData) {
    const result = await super.update(id, userData);
    return new User(result);
  }
}

module.exports = UserRepository;