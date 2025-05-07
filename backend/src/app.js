const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { connectDb } = require("./models/db")
const categoryRoutes = require("./routes/categoryRoutes")

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev")) // Logging middleware

// Routes
app.use("/api/categories", categoryRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date(),
  })
})

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack)
  res.status(500).json({
    success: false,
    error: "Server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    await connectDb()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer()
}

module.exports = app // Export for testing
