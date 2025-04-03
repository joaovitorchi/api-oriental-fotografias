const BaseRepository = require("./base-repository");
const User = require("../models/user");

class UserRepository extends BaseRepository {
  constructor() {
    super("users"); // Nome da tabela no banco de dados
  }

  async findByEmail(email) {
    const result = await this.db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async findByUsername(username) {
    const result = await this.db.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async create(user) {
    const result = await this.db.query(
      `INSERT INTO users (name, email, username, role, password_hash, profile_photo, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.name, user.email, user.username, user.role, 
       user.passwordHash, user.profilePhoto, user.active]
    );
    return new User(result.rows[0]);
  }

  async updateLastLogin(userId) {
    await this.db.query(
      `UPDATE users SET last_login = NOW() WHERE user_id = $1`,
      [userId]
    );
  }
}

module.exports = UserRepository;