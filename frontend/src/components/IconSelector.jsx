"use client"

import { useState } from "react"
import { Box, Button, Popover, Grid, Tooltip } from "@mui/material"
import Icon from "./Icon"

// Common icons for categories
const ICONS = [
  "folder",
  "category",
  "shopping_bag",
  "checkroom",
  "styler",
  "dry_cleaning",
  "iron",
  "footwear",
  "female",
  "male",
  "child_care",
  "format_paint",
  "palette",
  "texture",
  "diamond",
  "watch",
  "sports_basketball",
  "sports_football",
  "sports_tennis",
  "sports_esports",
  "celebration",
  "weekend",
  "verified",
  "new_releases",
  "star",
  "favorite",
]

const IconSelector = ({ selectedIcon, onSelectIcon, size = "medium" }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleIconSelect = (icon) => {
    onSelectIcon(icon)
    handleClose()
  }

  const open = Boolean(anchorEl)
  const id = open ? "icon-popover" : undefined

  return (
    <>
      <Button variant="outlined" onClick={handleClick} size={size} startIcon={<Icon name={selectedIcon} />}>
        {size === "small" ? "" : "Select Icon"}
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
        <Box sx={{ p: 2, width: 300 }}>
          <Grid container spacing={1}>
            {ICONS.map((icon) => (
              <Grid item key={icon}>
                <Tooltip title={icon}>
                  <Box
                    sx={{
                      padding: 1,
                      cursor: "pointer",
                      border: selectedIcon === icon ? "2px solid #1976d2" : "1px solid transparent",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleIconSelect(icon)}
                  >
                    <Icon name={icon} />
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  )
}

export default IconSelector
