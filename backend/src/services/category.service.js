const CategoryRepository = require('../repositories/category.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData) {
    // Verifica se categoria com o mesmo nome ou slug já existe
    const existingCategory = await this.categoryRepository.findBySlug(categoryData.slug);
    if (existingCategory) {
      throw new ValidationError('Slug já está em uso');
    }

    // Cria a categoria
    const category = await this.categoryRepository.create(categoryData);
    return category;
  }

  async getCategoryById(categoryId) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }
    return category;
  }

  async getCategoryBySlug(slug) {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }
    return category;
  }

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async updateCategory(categoryId, updateData) {
    const updatedCategory = await this.categoryRepository.update(categoryId, updateData);
    if (!updatedCategory) {
      throw new NotFoundError('Categoria não encontrada');
    }
    return updatedCategory;
  }

  async deleteCategory(categoryId) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }
    await this.categoryRepository.delete(categoryId);
    return true;
  }
}

module.exports = new CategoryService();
