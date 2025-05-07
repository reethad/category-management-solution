const Category = require("../models/category")

/**
 * Controller for handling category-related operations
 */
class CategoryController {
  /**
   * Get all categories in tree structure
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllCategories(req, res) {
    try {
      const categories = await Category.getAllCategoriesTree()
      res.status(200).json({
        success: true,
        data: categories,
      })
    } catch (err) {
      console.error("Error in getAllCategories:", err)
      res.status(500).json({
        success: false,
        error: "Server error",
      })
    }
  }

  /**
   * Create a new category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createCategory(req, res) {
    try {
      const { name, parentPath, description } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          error: "Category name is required",
        })
      }

      const category = await Category.createCategory(name, parentPath, description)
      res.status(201).json({
        success: true,
        data: category,
      })
    } catch (err) {
      console.error("Error in createCategory:", err)
      if (err.message === "Parent category not found") {
        return res.status(404).json({
          success: false,
          error: err.message,
        })
      }
      res.status(500).json({
        success: false,
        error: "Server error",
      })
    }
  }

  /**
   * Update a category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params
      const { name, description } = req.body

      if (!name && description === undefined) {
        return res.status(400).json({
          success: false,
          error: "At least one field to update is required",
        })
      }

      const category = await Category.updateCategory(id, { name, description })
      res.status(200).json({
        success: true,
        data: category,
      })
    } catch (err) {
      console.error("Error in updateCategory:", err)
      if (err.message === "Category not found") {
        return res.status(404).json({
          success: false,
          error: err.message,
        })
      }
      res.status(500).json({
        success: false,
        error: "Server error",
      })
    }
  }

  /**
   * Delete a category and all its children
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params

      const result = await Category.deleteCategory(id)
      res.status(200).json({
        success: true,
        ...result,
      })
    } catch (err) {
      console.error("Error in deleteCategory:", err)
      if (err.message === "Category not found") {
        return res.status(404).json({
          success: false,
          error: err.message,
        })
      }
      res.status(500).json({
        success: false,
        error: "Server error",
      })
    }
  }

  /**
   * Get a category by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params

      const category = await Category.getCategoryById(id)
      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        })
      }

      res.status(200).json({
        success: true,
        data: category,
      })
    } catch (err) {
      console.error("Error in getCategoryById:", err)
      res.status(500).json({
        success: false,
        error: "Server error",
      })
    }
  }
}

module.exports = CategoryController
