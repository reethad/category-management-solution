const mongoose = require("mongoose")
const Category = require("../src/models/category")

// Mock the mongoose model methods
jest.mock("../src/models/category", () => ({
  getAllCategoriesTree: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  getCategoryById: jest.fn(),
}))

const request = require("supertest")
const app = require("../src/app")

describe("Category API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe("GET /api/categories", () => {
    it("should return all categories in tree structure", async () => {
      // Mock data
      const mockCategories = [
        {
          id: "1",
          name: "Women",
          path: "women",
          level: 1,
          children: [],
        },
        {
          id: "2",
          name: "Men",
          path: "men",
          level: 1,
          children: [],
        },
      ]

      // Mock the getAllCategoriesTree method
      Category.getAllCategoriesTree.mockResolvedValue(mockCategories)

      const res = await request(app).get("/api/categories")

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.data).toEqual(mockCategories)
    })

    it("should handle errors when fetching categories", async () => {
      // Mock an error
      Category.getAllCategoriesTree.mockRejectedValue(new Error("Database error"))

      const res = await request(app).get("/api/categories")

      expect(res.statusCode).toBe(500)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Server error")
    })
  })

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      const newCategory = {
        name: "New Category",
        parentPath: "women",
        description: "Test description",
      }

      const mockCreatedCategory = {
        id: "3",
        name: "New Category",
        path: "women.new_category",
        level: 2,
        description: "Test description",
      }

      // Mock the createCategory method
      Category.createCategory.mockResolvedValue(mockCreatedCategory)

      const res = await request(app).post("/api/categories").send(newCategory)

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toEqual(mockCreatedCategory)
      expect(Category.createCategory).toHaveBeenCalledWith(
        newCategory.name,
        newCategory.parentPath,
        newCategory.description,
      )
    })

    it("should return 400 if name is missing", async () => {
      const res = await request(app).post("/api/categories").send({
        parentPath: "women",
        description: "Test description",
      })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Category name is required")
    })

    it("should return 404 if parent category not found", async () => {
      // Mock createCategory to throw an error
      Category.createCategory.mockRejectedValue(new Error("Parent category not found"))

      const res = await request(app).post("/api/categories").send({
        name: "New Category",
        parentPath: "nonexistent",
        description: "Test description",
      })

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Parent category not found")
    })
  })

  describe("PUT /api/categories/:id", () => {
    it("should update a category", async () => {
      const updatedCategory = {
        name: "Updated Category",
        description: "Updated description",
      }

      const mockUpdatedCategory = {
        id: "1",
        name: "Updated Category",
        path: "women",
        level: 1,
        description: "Updated description",
      }

      // Mock the updateCategory method
      Category.updateCategory.mockResolvedValue(mockUpdatedCategory)

      const res = await request(app).put("/api/categories/1").send(updatedCategory)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toEqual(mockUpdatedCategory)
      expect(Category.updateCategory).toHaveBeenCalledWith("1", updatedCategory)
    })

    it("should return 400 if no update data is provided", async () => {
      const res = await request(app).put("/api/categories/1").send({})

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it("should return 404 if category not found", async () => {
      // Mock updateCategory to throw an error
      Category.updateCategory.mockRejectedValue(new Error("Category not found"))

      const res = await request(app).put("/api/categories/999").send({ name: "Updated Category" })

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Category not found")
    })
  })

  describe("DELETE /api/categories/:id", () => {
    it("should delete a category and its children", async () => {
      // Mock deleteCategory
      Category.deleteCategory.mockResolvedValue({
        success: true,
        deletedCount: 3,
        message: "Category and 2 subcategories deleted successfully",
      })

      const res = await request(app).delete("/api/categories/1")

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.deletedCount).toBe(3)
      expect(Category.deleteCategory).toHaveBeenCalledWith("1")
    })

    it("should return 404 if category not found", async () => {
      // Mock deleteCategory to throw an error
      Category.deleteCategory.mockRejectedValue(new Error("Category not found"))

      const res = await request(app).delete("/api/categories/999")

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Category not found")
    })
  })

  describe("GET /api/categories/:id", () => {
    it("should get a category by ID", async () => {
      const mockCategory = {
        id: "1",
        name: "Women",
        path: "women",
        level: 1,
        description: "Women's fashion",
      }

      Category.getCategoryById.mockResolvedValue(mockCategory)

      const res = await request(app).get("/api/categories/1")

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toEqual(mockCategory)
      expect(Category.getCategoryById).toHaveBeenCalledWith("1")
    })

    it("should return 404 if category not found", async () => {
      Category.getCategoryById.mockResolvedValue(null)

      const res = await request(app).get("/api/categories/999")

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error).toBe("Category not found")
    })
  })
})
