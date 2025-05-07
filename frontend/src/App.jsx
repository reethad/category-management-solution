import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, ThemeProvider, createTheme } from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import CategoryTree from "./components/CategoryTree"
import "./App.css"

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Indigo
    },
    secondary: {
      main: "#f50057", // Pink
    },
  },
  typography: {
    fontFamily: ['"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <div className="App">
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <CategoryIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                Fashion Categories Manager
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ bgcolor: "#f5f7fa", minHeight: "calc(100vh - 64px)", py: 3 }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<CategoryTree />} />
              </Routes>
            </Container>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
