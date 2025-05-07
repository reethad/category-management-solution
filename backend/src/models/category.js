const mongoose = require("mongoose")

/**
 * Category Schema
 * Represents a fashion category in the e-commerce system
 * Uses a materialized path pattern for efficient tree operations
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    // Path represents the hierarchical position (e.g., "women.clothing.dresses")
    path: {
      type: String,
      required: true,
      index: true,
    },
    // Level in the hierarchy (1 = root, 2 = first child, etc.)
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    // Optional description for the category
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
)

// Index the path field for efficient tree queries
categorySchema.index({ path: 1 })
categorySchema.index({ level: 1 })

const Category = mongoose.model("Category", categorySchema)

/**
 * Category Model Methods
 */
class CategoryModel {
  /**
   * Get all categories in a hierarchical tree structure
   * @returns {Promise<Array>} Array of categories in tree structure
   */
  static async getAllCategoriesTree() {
    try {
      // Get all categories sorted by path for easier tree building
      const categories = await Category.find().sort({ path: 1 }).lean()

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
   * @param {string} name - Category name
   * @param {string|null} parentPath - Parent category path (null for root categories)
   * @param {string} description - Category description (optional)
   * @returns {Promise<Object>} Created category
   */
  static async createCategory(name, parentPath = null, description = "") {
    try {
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
      })

      await category.save()

      return {
        id: category._id,
        name: category.name,
        path: category.path,
        level: category.level,
        description: category.description,
      }
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
   * @param {Object} updateData - Data to update (name, description)
   * @returns {Promise<Object>} Updated category
   */
  static async updateCategory(id, { name, description }) {
    try {
      const category = await Category.findById(id)
      if (!category) {
        throw new Error("Category not found")
      }

      // Update fields if provided
      if (name !== undefined) category.name = name
      if (description !== undefined) category.description = description

      await category.save()

      return {
        id: category._id,
        name: category.name,
        path: category.path,
        level: category.level,
        description: category.description,
      }
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
      const category = await Category.findById(id)
      if (!category) return null

      return {
        id: category._id,
        name: category.name,
        path: category.path,
        level: category.level,
        description: category.description,
      }
    } catch (error) {
      console.error("Error in getCategoryById:", error)
      throw error
    }
  }
}

module.exports = CategoryModel
