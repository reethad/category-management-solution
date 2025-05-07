const mongoose = require("mongoose")

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fashion_categories"

// Connect to MongoDB
async function connectDb() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to MongoDB")
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err)
    process.exit(1)
  }
}

module.exports = {
  connectDb,
}
