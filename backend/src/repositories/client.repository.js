const BaseRepository = require('./base.repository');
const { Client } = require('../models/client.model');

class ClientRepository extends BaseRepository {
  constructor() {
    super('clients');
  }

  async findByEmail(email) {
    const result = await this.query('SELECT * FROM clients WHERE email = $1', [email]);
    return result.rows[0] ? new Client(result.rows[0]) : null;
  }

  async searchByName(name, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await this.query(`
      SELECT * FROM clients 
      WHERE name ILIKE $1
      ORDER BY name
      LIMIT $2 OFFSET $3
    `, [`%${name}%`, limit, offset]);
    return result.rows.map(row => new Client(row));
  }

  async findById(id) {
    const result = await super.findById(id);
    return result ? new Client(result) : null;
  }

  async create(clientData) {
    const result = await super.create(clientData);
    return new Client(result);
  }

  async update(id, clientData) {
    const result = await super.update(id, clientData);
    return new Client(result);
  }
}

module.exports = ClientRepository;