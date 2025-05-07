import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Named exports for the functions required by CategoryForm.tsx
export const fetchCategories = async () => {
  const response = await api.get("/categories")
  return response.data.data
}

export const fetchCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data.data
}

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData)
  return response.data.data
}

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data.data
}

// Original categoryApi object for backward compatibility
export const categoryApi = {
  getAll: async () => {
    const response = await api.get("/categories")
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post("/categories", data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}

export default api
