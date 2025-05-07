"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
} from "../services/api"

interface Category {
  id: number
  name: string
  path: string
}

const CategoryForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [name, setName] = useState<string>("")
  const [parentPath, setParentPath] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load all categories
        const categoriesData = await fetchCategories()
        setCategories(categoriesData)

        if (isEditMode && id) {
          const categoryData = await fetchCategoryById(Number(id))
          setName(categoryData.name)

          // Get parent path from full path
          const pathParts = categoryData.path.split(".")
          if (pathParts.length > 1) {
            const parentPathValue = pathParts.slice(0, -1).join(".")
            setParentPath(parentPathValue)
          }
        }

        setError(null)
      } catch (err) {
        console.error(err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, isEditMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    try {
      setSubmitting(true)

      if (isEditMode && id) {
        await updateCategory(Number(id), { name })
      } else {
        await createCategory({ name, parentPath: parentPath || null })
      }

      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Failed to save category")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Category" : "Add New Category"}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category name"
            required
          />
        </div>

        {!isEditMode && (
          <div className="mb-6">
            <label htmlFor="parentPath" className="block text-gray-700 text-sm font-bold mb-2">
              Parent Category (optional)
            </label>
            <select
              id="parentPath"
              value={parentPath}
              onChange={(e) => setParentPath(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">-- No Parent (Root Category) --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.path}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
