"use client"

import { useState } from "react"
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Collapse,
  Tooltip,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import { categoryApi } from "../services/api"
import Icon from "./Icon"
import ColorPicker from "./ColorPicker"
import IconSelector from "./IconSelector"

const CategoryNode = ({ category, onDelete, onRefresh }) => {
  // State for expansion
  const [expanded, setExpanded] = useState(true)

  // State for editing
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Edit form fields
  const [newName, setNewName] = useState(category.name)
  const [newDescription, setNewDescription] = useState(category.description || "")
  const [newIcon, setNewIcon] = useState(category.icon || "folder")
  const [newColor, setNewColor] = useState(category.color || "#3f51b5")

  // State for details dialog
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Check if category has children
  const hasChildren = category.children && category.children.length > 0

  // Toggle expansion
  const handleToggle = () => {
    setExpanded(!expanded)
  }

  // Start editing
  const handleStartEdit = () => {
    setNewName(category.name)
    setNewDescription(category.description || "")
    setNewIcon(category.icon || "folder")
    setNewColor(category.color || "#3f51b5")
    setEditing(true)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditing(false)
  }

  // Save edited category
  const handleSaveEdit = async () => {
    if (!newName.trim()) return

    setSubmitting(true)
    try {
      await categoryApi.update(category.id, {
        name: newName,
        description: newDescription || undefined,
        icon: newIcon,
        color: newColor,
      })

      setEditing(false)
      onRefresh()
    } catch (err) {
      console.error("Failed to update category:", err)
      alert("Failed to update category. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Render the category node
  return (
    <Box sx={{ mb: 2 }}>
      {/* Category header */}
      <Paper
        elevation={1}
        sx={{
          p: 1,
          borderLeft: `4px solid ${category.color || "#3f51b5"}`,
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: 3,
            transform: "translateX(4px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Expand/collapse button (if has children) */}
          {hasChildren ? (
            <IconButton size="small" onClick={handleToggle} sx={{ mr: 1 }}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} /> // Spacer for alignment
          )}

          {/* Category icon */}
          <Box
            sx={{
              mr: 2,
              color: category.color || "#3f51b5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={category.icon || "folder"} color={category.color} />
          </Box>

          {/* Category content */}
          {editing ? (
            // Edit form
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                size="small"
                fullWidth
                label="Category Name"
                variant="outlined"
                disabled={submitting}
                sx={{ mb: 1 }}
              />

              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <IconSelector selectedIcon={newIcon} onSelectIcon={setNewIcon} size="small" />
                </Grid>
                <Grid item>
                  <ColorPicker selectedColor={newColor} onSelectColor={setNewColor} size="small" />
                </Grid>
              </Grid>
            </Box>
          ) : (
            // Display mode
            <Typography
              variant="subtitle1"
              sx={{
                flexGrow: 1,
                fontWeight: 500,
                color: category.level === 1 ? "primary.main" : "text.primary",
              }}
            >
              {category.name}
            </Typography>
          )}

          {/* Action buttons */}
          <Box>
            {editing ? (
              // Edit mode buttons
              <>
                <Tooltip title="Save">
                  <IconButton
                    color="primary"
                    onClick={handleSaveEdit}
                    disabled={submitting || !newName.trim()}
                    size="small"
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton onClick={handleCancelEdit} disabled={submitting} size="small">
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // Display mode buttons
              <>
                <Tooltip title="View Details">
                  <IconButton color="info" onClick={() => setDetailsOpen(true)} size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={handleStartEdit} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => onDelete(category.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Children categories */}
      {hasChildren && (
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ pl: 4, borderLeft: "1px dashed #ccc", ml: 2, mt: 1 }}>
            {category.children.map((child) => (
              <CategoryNode key={child.id} category={child} onDelete={onDelete} onRefresh={onRefresh} />
            ))}
          </Box>
        </Collapse>
      )}

      {/* Category details dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle sx={{ bgcolor: category.color, color: "#fff" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Icon name={category.icon || "folder"} color="#fff" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {category.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Path:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {category.path}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Level:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {category.level}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Description:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {category.description || "No description provided"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Children:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {category.children?.length || 0} direct children
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CategoryNode
