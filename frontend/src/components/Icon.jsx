import { Icon as MuiIcon } from "@mui/material"

const Icon = ({ name, color }) => {
  return (
    <MuiIcon
      sx={{
        color: color || "inherit",
        verticalAlign: "middle",
      }}
    >
      {name}
    </MuiIcon>
  )
}

export default Icon
