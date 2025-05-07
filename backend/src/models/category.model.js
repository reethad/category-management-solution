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
    },
    // Optional icon for UI display
    icon: {
      type: String,
      default: "folder",
    },
    // Optional color for UI display
    color: {
      type: String,
      default: "#3f51b5", // Default indigo color
    },
    // Flag to hide/show category
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
)

// Index the path field for efficient tree queries
categorySchema.index({ path: 1 })
categorySchema.index({ level: 1 })
categorySchema.index({ isActive: 1 })

const Category = mongoose.model("Category", categorySchema)

module.exports = Category
