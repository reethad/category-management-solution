const Category = require("../models/category.model")

/**
 * Service layer for category operations
 * Handles business logic for managing categories
 */
class CategoryService {
  /**
   * Get all categories in a hierarchical tree structure
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise<Array>} Array of categories in tree structure
   */
  static async getAllCategoriesTree(filter = {}) {
    try {
      // Default filter to only active categories
      const queryFilter = { ...filter }
      if (!queryFilter.hasOwnProperty("isActive")) {
        queryFilter.isActive = true
      }

      // Get all categories sorted by path for easier tree building
      const categories = await Category.find(queryFilter)
        .sort({ path: 1 })
        .select("_id name path level description icon color")

      // Build and return the tree structure
      return this.buildTree(categories)
    } catch (error) {
      console.error("Error in getAllCategoriesTree:", error)
      throw error
    }
  }

  /**
   * Build a tree structure from flat categories array
   * @param {Array} categories - Flat array of categories with path
   * @returns {Array} Tree structure of categories
   */
  static buildTree(categories) {
    const tree = []
    const map = {}

    // First pass: create nodes and map
    categories.forEach((category) => {
      const node = {
        id: category._id.toString(),
        name: category.name,
        path: category.path,
        level: category.level,
        description: category.description,
        icon: category.icon,
        color: category.color,
        children: [],
      }
      map[category.path] = node
    })

    // Second pass: build the tree
    categories.forEach((category) => {
      const pathParts = category.path.split(".")
      if (pathParts.length === 1) {
        // Root level category
        tree.push(map[category.path])
      } else {
        // Child category
        const parentPath = pathParts.slice(0, -1).join(".")
        if (map[parentPath]) {
          map[parentPath].children.push(map[category.path])
        }
      }
    })

    return tree
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data including name, parentPath, etc.
   * @returns {Promise<Object>} Created category
   */
  static async createCategory(categoryData) {
    try {
      const { name, parentPath, description, icon, color } = categoryData

      let path
      let level

      if (parentPath) {
        // Check if parent exists
        const parent = await Category.findOne({ path: parentPath })
        if (!parent) {
          throw new Error("Parent category not found")
        }

        // Generate new path by appending to parent path
        const label = this.generatePathLabel(name)
        path = `${parentPath}.${label}`
        level = parent.level + 1
      } else {
        // Root level category
        path = this.generatePathLabel(name)
        level = 1
      }

      // Create the new category
      const category = new Category({
        name,
        path,
        level,
        description,
        icon,
        color,
      })

      await category.save()
      return category
    } catch (error) {
      console.error("Error in createCategory:", error)
      throw error
    }
  }

  /**
   * Generate a valid path label from a name
   * @param {string} name - Category name
   * @returns {string} Valid path label
   */
  static generatePathLabel(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_") // Replace multiple underscores with a single one
      .replace(/^_|_$/g, "") // Remove leading/trailing underscores
  }

  /**
   * Update a category by ID
   * @param {string} id - Category ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated category
   */
  static async updateCategory(id, updateData) {
    try {
      const { name, description, icon, color, isActive } = updateData

      const category = await Category.findById(id)
      if (!category) {
        throw new Error("Category not found")
      }

      // Update fields if provided
      if (name !== undefined) category.name = name
      if (description !== undefined) category.description = description
      if (icon !== undefined) category.icon = icon
      if (color !== undefined) category.color = color
      if (isActive !== undefined) category.isActive = isActive

      await category.save()
      return category
    } catch (error) {
      console.error("Error in updateCategory:", error)
      throw error
    }
  }

  /**
   * Delete a category and all its children
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteCategory(id) {
    try {
      const category = await Category.findById(id)
      if (!category) {
        throw new Error("Category not found")
      }

      // Delete all categories whose path starts with this category's path
      const result = await Category.deleteMany({
        path: { $regex: `^${category.path}(\\..*)?$` },
      })

      return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Category and ${result.deletedCount - 1} subcategories deleted successfully`,
      }
    } catch (error) {
      console.error("Error in deleteCategory:", error)
      throw error
    }
  }

  /**
   * Get a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Category or null if not found
   */
  static async getCategoryById(id) {
    try {
      return await Category.findById(id)
    } catch (error) {
      console.error("Error in getCategoryById:", error)
      throw error
    }
  }
}

module.exports = CategoryService
