"use client"

import { useState } from "react"
import { Box, Button, Popover, Grid, Tooltip } from "@mui/material"

// Predefined color palette
const COLORS = [
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#03a9f4", // Light Blue
  "#00bcd4", // Cyan
  "#009688", // Teal
  "#4caf50", // Green
  "#8bc34a", // Light Green
  "#cddc39", // Lime
  "#ffeb3b", // Yellow
  "#ffc107", // Amber
  "#ff9800", // Orange
  "#ff5722", // Deep Orange
  "#795548", // Brown
  "#607d8b", // Blue Grey
]

const ColorPicker = ({ selectedColor, onSelectColor, size = "medium" }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColorSelect = (color) => {
    onSelectColor(color)
    handleClose()
  }

  const open = Boolean(anchorEl)
  const id = open ? "color-popover" : undefined

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        size={size}
        sx={{
          backgroundColor: selectedColor,
          color: "#fff",
          borderColor: "rgba(0, 0, 0, 0.23)",
          "&:hover": {
            backgroundColor: selectedColor,
            opacity: 0.9,
            borderColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {size === "small" ? "" : "Select Color"}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Grid container spacing={1}>
            {COLORS.map((color) => (
              <Grid item key={color}>
                <Tooltip title={color}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: color,
                      cursor: "pointer",
                      border: selectedColor === color ? "2px solid black" : "1px solid #ddd",
                      borderRadius: "4px",
                      "&:hover": {
                        opacity: 0.8,
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleColorSelect(color)}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  )
}

export default ColorPicker
