const ClientRepository = require('../repositories/client.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async createClient(clientData) {
    // Verifica se email já existe (opcional, caso tenha campo email)
    if (clientData.email) {
      const existingClient = await this.clientRepository.findByEmail(clientData.email);
      if (existingClient) {
        throw new ValidationError('Email já está em uso por outro cliente');
      }
    }

    const client = await this.clientRepository.create(clientData);
    return client;
  }

  async getClientById(clientId) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new NotFoundError('Cliente não encontrado');
    }
    return client;
  }

  async searchClients(name = '', page = 1, limit = 10) {
    return this.clientRepository.searchByName(name, page, limit);
  }

  async updateClient(clientId, updateData) {
    if (updateData.email) {
      const existingClient = await this.clientRepository.findByEmail(updateData.email);
      if (existingClient && existingClient.clientId !== clientId) {
        throw new ValidationError('Email já está em uso por outro cliente');
      }
    }

    const updatedClient = await this.clientRepository.update(clientId, updateData);
    return updatedClient;
  }

  async deleteClient(clientId) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new NotFoundError('Cliente não encontrado');
    }

    await this.clientRepository.delete(clientId);
  }
}

module.exports = new ClientService();
