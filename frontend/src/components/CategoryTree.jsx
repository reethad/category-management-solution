"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Snackbar,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from "@mui/icons-material/Refresh"
import CategoryNode from "./CategoryNode"
import { categoryApi } from "../services/api"
import ColorPicker from "./ColorPicker"
import IconSelector from "./IconSelector"

const CategoryTree = () => {
  // State for categories data
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for form
  const [showForm, setShowForm] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Form fields
  const [newCategoryName, setNewCategoryName] = useState("")
  const [parentPath, setParentPath] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("folder")
  const [selectedColor, setSelectedColor] = useState("#3f51b5")

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getAll()
      setCategories(response.data)
      setError(null)
    } catch (err) {
      console.error("Failed to load categories:", err)
      setError("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category and all its children?")) {
      try {
        const response = await categoryApi.delete(id)
        await loadCategories()

        setNotification({
          open: true,
          message: `Category deleted successfully. ${response.deletedCount} items removed.`,
          severity: "success",
        })
      } catch (err) {
        console.error("Failed to delete category:", err)
        setNotification({
          open: true,
          message: "Failed to delete category. Please try again.",
          severity: "error",
        })
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      setFormSubmitting(true)
      await categoryApi.create({
        name: newCategoryName,
        parentPath: parentPath || null,
        description: description || undefined,
        icon: selectedIcon,
        color: selectedColor,
      })

      // Reset form
      setNewCategoryName("")
      setParentPath("")
      setDescription("")
      setSelectedIcon("folder")
      setSelectedColor("#3f51b5")
      setShowForm(false)

      // Reload categories
      await loadCategories()

      // Show success notification
      setNotification({
        open: true,
        message: "Category created successfully!",
        severity: "success",
      })
    } catch (err) {
      console.error("Failed to create category:", err)
      setNotification({
        open: true,
        message: "Failed to create category. Please try again.",
        severity: "error",
      })
    } finally {
      setFormSubmitting(false)
    }
  }

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  // Loading state
  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with title and actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Fashion Categories
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadCategories} sx={{ mr: 2 }}>
            Refresh
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Category"}
          </Button>
        </Box>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Add category form */}
      {showForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Category
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  disabled={formSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="parent-category-label">Parent Category (optional)</InputLabel>
                  <Select
                    labelId="parent-category-label"
                    value={parentPath}
                    onChange={(e) => setParentPath(e.target.value)}
                    label="Parent Category (optional)"
                    disabled={formSubmitting}
                  >
                    <MenuItem value="">
                      <em>None (Root Category)</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.path}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  disabled={formSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconSelector selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
                  <Typography sx={{ ml: 2 }}>Selected Icon: {selectedIcon}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ColorPicker selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                  <Typography sx={{ ml: 2 }}>Selected Color: {selectedColor}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setShowForm(false)}
                    sx={{ mr: 2 }}
                    disabled={formSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formSubmitting || !newCategoryName.trim()}
                  >
                    {formSubmitting ? "Creating..." : "Create Category"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Categories tree */}
      {categories.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No categories found. Create your first category!
        </Alert>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Category Hierarchy
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ pl: 2 }}>
            {categories.map((category) => (
              <CategoryNode key={category.id} category={category} onDelete={handleDelete} onRefresh={loadCategories} />
            ))}
          </Box>
        </Paper>
      )}

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default CategoryTree
