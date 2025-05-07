const express = require("express")
const CategoryController = require("../controllers/categoryController")

const router = express.Router()

/**
 * @route   GET /api/categories
 * @desc    Get all categories in tree structure
 * @access  Public
 */
router.get("/", CategoryController.getAllCategories)

/**
 * @route   GET /api/categories/:id
 * @desc    Get a category by ID
 * @access  Public
 */
router.get("/:id", CategoryController.getCategoryById)

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Public
 */
router.post("/", CategoryController.createCategory)

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Public
 */
router.put("/:id", CategoryController.updateCategory)

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category and all its children
 * @access  Public
 */
router.delete("/:id", CategoryController.deleteCategory)

module.exports = router
