const CategoryService = require("../services/category.service")

/**
 * Controller for handling category-related operations
 * Manages HTTP requests and responses for category endpoints
 */
class CategoryController {
  /**
   * Get all categories in tree structure
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllCategories(req, res) {
    try {
      // Extract query parameters for filtering
      const { isActive } = req.query
      const filter = {}

      // Apply filters if provided
      if (isActive !== undefined) {
        filter.isActive = isActive === "true"
      }

      const categories = await CategoryService.getAllCategoriesTree(filter)
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      })
    } catch (error) {
      console.error("Error in getAllCategories controller:", error)
      res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
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
      const { name, parentPath, description, icon, color } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          error: "Category name is required",
        })
      }

      const category = await CategoryService.createCategory({
        name,
        parentPath,
        description,
        icon,
        color,
      })

      res.status(201).json({
        success: true,
        data: category,
      })
    } catch (error) {
      console.error("Error in createCategory controller:", error)

      if (error.message === "Parent category not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      res.status(500).json({
        success: false,
        error: "Failed to create category",
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
      const { name, description, icon, color, isActive } = req.body

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          error: "No update data provided",
        })
      }

      const category = await CategoryService.updateCategory(id, {
        name,
        description,
        icon,
        color,
        isActive,
      })

      res.status(200).json({
        success: true,
        data: category,
      })
    } catch (error) {
      console.error("Error in updateCategory controller:", error)

      if (error.message === "Category not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      res.status(500).json({
        success: false,
        error: "Failed to update category",
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
      const result = await CategoryService.deleteCategory(id)

      res.status(200).json({
        success: true,
        ...result,
      })
    } catch (error) {
      console.error("Error in deleteCategory controller:", error)

      if (error.message === "Category not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        })
      }

      res.status(500).json({
        success: false,
        error: "Failed to delete category",
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
      const category = await CategoryService.getCategoryById(id)

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
    } catch (error) {
      console.error("Error in getCategoryById controller:", error)
      res.status(500).json({
        success: false,
        error: "Failed to fetch category",
      })
    }
  }
}

module.exports = CategoryController
