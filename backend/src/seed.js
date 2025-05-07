const mongoose = require("mongoose")
const { connectDb } = require("./models/db")
const Category = require("./models/category")

/**
 * Seed the database with initial category data
 */
async function seedDatabase() {
  try {
    await connectDb()
    console.log("Connected to MongoDB")

    // Clear existing data
    await mongoose.connection.dropCollection("categories").catch(() => console.log("No categories collection to drop"))
    console.log("Cleared existing categories")

    // Create root categories
    const women = await Category.createCategory("Women")
    const men = await Category.createCategory("Men")

    // Women's categories
    const womenClothing = await Category.createCategory("Clothing", women.path, "Women's clothing items")
    const womenTShirts = await Category.createCategory("T-Shirts", women.path, "Women's t-shirts collection")

    // Women's Clothing subcategories
    const womenDresses = await Category.createCategory("Dresses", womenClothing.path, "Women's dresses collection")
    await Category.createCategory("Casual Dresses", womenDresses.path, "Casual dresses for everyday wear")
    await Category.createCategory("Party Dresses", womenDresses.path, "Elegant dresses for special occasions")

    // Women's T-Shirts subcategories
    await Category.createCategory("Printed T-shirts", womenTShirts.path, "T-shirts with printed designs")
    await Category.createCategory("Casual T-Shirts", womenTShirts.path, "Comfortable t-shirts for everyday wear")
    await Category.createCategory("Plain T-Shirts", womenTShirts.path, "Simple, solid-colored t-shirts")

    // Men's categories
    const menFootwear = await Category.createCategory("Footwear", men.path, "Men's footwear collection")
    const menTShirts = await Category.createCategory("T-Shirts", men.path, "Men's t-shirts collection")
    const menShirts = await Category.createCategory("Shirts", men.path, "Men's shirts collection")

    // Men's Footwear subcategories
    await Category.createCategory("Branded", menFootwear.path, "Premium branded footwear")
    await Category.createCategory("Non Branded", menFootwear.path, "Affordable non-branded footwear")

    // Men's T-Shirts subcategories
    await Category.createCategory("Printed T-shirts", menTShirts.path, "T-shirts with printed designs")
    await Category.createCategory("Casual T-Shirts", menTShirts.path, "Comfortable t-shirts for everyday wear")
    await Category.createCategory("Plain T-Shirts", menTShirts.path, "Simple, solid-colored t-shirts")

    // Men's Shirts subcategories
    await Category.createCategory("Party Shirts", menShirts.path, "Stylish shirts for parties and events")
    await Category.createCategory("Casual Shirts", menShirts.path, "Comfortable shirts for everyday wear")
    await Category.createCategory("Plain Shirts", menShirts.path, "Simple, solid-colored shirts")

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  } finally {
    mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Seeding failed:", error)
      process.exit(1)
    })
}

module.exports = { seedDatabase }
