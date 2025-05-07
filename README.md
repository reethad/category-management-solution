# E-Commerce Fashion Categories Management System

A modern application to manage E-Commerce Fashion categories in a tree structure. This project uses React with Material UI for the frontend, Node.js with Express for the backend, and MongoDB for the database.

## Features

- RESTful API for CRUD operations on categories
- Hierarchical tree view of categories with unlimited nesting levels
- MongoDB database with efficient tree structure implementation
- Modern UI with Material UI components
- Color and icon selection for categories
- Comprehensive unit tests with Jest

## Screenshots

### Main Dashboard
![Main Dashboard](https://i.imgur.com/example1.png)

### Category Tree View
![Category Tree](https://i.imgur.com/example2.png)

### Add Category Form
![Add Category](https://i.imgur.com/example3.png)

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Jest for unit testing

### Frontend
- React with Material UI components
- Axios for API requests
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository
   \`\`\`
   git clone <repository-url>
   \`\`\`

2. Set up the backend
   \`\`\`
   cd backend
   npm install
   \`\`\`

3. Set up environment variables
   - Create a `.env` file in the backend directory with:
     \`\`\`
     MONGODB_URI=mongodb://localhost:27017/fashion_categories
     PORT=3001
     NODE_ENV=development
     \`\`\`

4. Initialize and seed the database
   \`\`\`
   npm run seed
   \`\`\`

5. Start the backend server
   \`\`\`
   npm run dev
   \`\`\`

6. Set up the frontend
   \`\`\`
   cd ../frontend
   npm install
   \`\`\`

7. Set up frontend environment variables
   - Create a `.env` file in the frontend directory with:
     \`\`\`
     REACT_APP_API_URL=http://localhost:3001/api
     \`\`\`

8. Start the frontend development server
   \`\`\`
   npm start
   \`\`\`

9. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### GET /api/categories
- Returns all categories in a hierarchical tree structure
- Query parameters:
  - `isActive`: Filter by active status (true/false)

### GET /api/categories/:id
- Returns a specific category by ID

### POST /api/categories
- Creates a new category
- Request body:
  \`\`\`json
  {
    "name": "Category Name",
    "parentPath": "optional.parent.path",
    "description": "Optional description",
    "icon": "folder",
    "color": "#3f51b5"
  }
  \`\`\`

### PUT /api/categories/:id
- Updates an existing category
- Request body:
  \`\`\`json
  {
    "name": "Updated Category Name",
    "description": "Updated description",
    "icon": "updated_icon",
    "color": "#ff5722",
    "isActive": true
  }
  \`\`\`

### DELETE /api/categories/:id
- Deletes a category and all its children

## Database Schema

The application uses MongoDB with Mongoose for data modeling.

### Category Schema
- name: String (required)
- path: String (required, indexed)
- level: Number (required)
- description: String (optional)
- icon: String (optional)
- color: String (optional)
- isActive: Boolean
- timestamps: true (adds createdAt and updatedAt fields)

The `path` field uses a materialized path pattern to represent the hierarchical path of each category. For example:
- "women" (root level)
- "women.clothing" (first level)
- "women.clothing.dresses" (second level)
- "women.clothing.dresses.casual" (third level)

## Running Tests

To run the backend tests:
\`\`\`
cd backend
npm test
\`\`\`

## Project Structure

### Backend
\`\`\`
backend/
├── src/
│   ├── app.js                # Express application setup
│   ├── models/
│   │   └── category.model.js # Category schema definition
│   ├── services/
│   │   └── category.service.js # Service layer for category operations
│   ├── controllers/
│   │   └── category.controller.js # Request handlers
│   ├── routes/
│   │   └── category.routes.js     # API routes
│   └── seed.js               # Database seeding script
├── tests/
│   └── category.test.js      # Unit tests
└── package.json
\`\`\`

### Frontend
\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── CategoryTree.jsx  # Main component for displaying the tree
│   │   ├── CategoryNode.jsx  # Component for rendering a single tree node
│   │   ├── ColorPicker.jsx   # Color selection component
│   │   ├── IconSelector.jsx  # Icon selection component
│   │   └── Icon.jsx          # Icon display component
│   ├── services/
│   │   └── api.js            # API service for backend communication
│   ├── App.jsx               # Main application component
│   └── index.jsx             # Application entry point
└── package.json
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
