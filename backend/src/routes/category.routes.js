const express = require("express")
const CategoryController = require("../controllers/category.controller")

const router = express.Router()

/**
 * @route   GET /api/categories
 * @desc    Get all categories in tree structure
 * @access  Public
 * @query   {Boolean} isActive - Filter by active status
 */
router.get("/", CategoryController.getAllCategories)

/**
 * @route   GET /api/categories/:id
 * @desc    Get a category by ID
 * @access  Public
 * @param   {String} id - Category ID
 */
router.get("/:id", CategoryController.getCategoryById)

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Public
 * @body    {String} name - Category name (required)
 * @body    {String} parentPath - Parent category path (optional)
 * @body    {String} description - Category description (optional)
 * @body    {String} icon - Category icon name (optional)
 * @body    {String} color - Category color (optional)
 */
router.post("/", CategoryController.createCategory)

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Public
 * @param   {String} id - Category ID
 * @body    {String} name - Category name (optional)
 * @body    {String} description - Category description (optional)
 * @body    {String} icon - Category icon name (optional)
 * @body    {String} color - Category color (optional)
 * @body    {Boolean} isActive - Category active status (optional)
 */
router.put("/:id", CategoryController.updateCategory)

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category and all its children
 * @access  Public
 * @param   {String} id - Category ID
 */
router.delete("/:id", CategoryController.deleteCategory)

module.exports = router
