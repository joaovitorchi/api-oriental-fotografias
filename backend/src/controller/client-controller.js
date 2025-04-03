const clientService = require('../services/client.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class ClientController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = await clientService.createClient(req.body);
      res.status(201).json({
        success: true,
        client
      });
    } catch (error) {
      logger.error(`Create client failed: ${error.message}`);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const client = await clientService.getClientById(req.params.id);
      res.json({
        success: true,
        client
      });
    } catch (error) {
      logger.error(`Get client failed: ${error.message}`);
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const name = req.query.name || '';
      
      const clients = await clientService.searchClients(name, page, limit);

      res.json({
        success: true,
        clients,
        pagination: {
          page,
          limit,
          total: clients.length
        }
      });
    } catch (error) {
      logger.error(`Search clients failed: ${error.message}`);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = await clientService.updateClient(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        client
      });
    } catch (error) {
      logger.error(`Update client failed: ${error.message}`);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await clientService.deleteClient(req.params.id);
      res.json({
        success: true,
        message: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      logger.error(`Delete client failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new ClientController();