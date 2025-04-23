const categoryService = require('../services/category.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class CategoryController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        category
      });
    } catch (error) {
      logger.error(`Create category failed: ${error.message}`);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json({
        success: true,
        category
      });
    } catch (error) {
      logger.error(`Get category failed: ${error.message}`);
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
      
      const sessions = await categoryService.getCategorySessions(category.id);
      
      res.json({
        success: true,
        category,
        sessions
      });
    } catch (error) {
      logger.error(`Get category by slug failed: ${error.message}`);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json({
        success: true,
        categories
      });
    } catch (error) {
      logger.error(`Get all categories failed: ${error.message}`);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        category
      });
    } catch (error) {
      logger.error(`Update category failed: ${error.message}`);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json({
        success: true,
        message: 'Categoria excluída com sucesso'
      });
    } catch (error) {
      logger.error(`Delete category failed: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new CategoryController();