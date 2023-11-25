# E-commerce Mini API 

Welcome to the E-commerce Mini API project! This API is designed to serve as the backend for an e-commerce platform, offering a range of features for both administrators and customers. It is built using Node.js, Express, MongoDB, and Mongoose.

## Project Overview

The E-commerce Mini API is organized into different versions, each of which adds new functionalities and improvements. Here's a brief overview of what each version entails:

### Version 1: Admin Features

- **Shop Item Model**: Defines the structure of shop items, including fields like title, image, price, description, availableCount, and genre or category.

- **Admin Routes (/admin)**:
  - Add new shop items
  - Update shop item details
  - Delete shop items
  - Search for shop items based on different properties

### Version 2: Customer Features

- **Customer Routes (/customer)**:
  - Get all shop items with filtering by category and price range
  - Search for shop items
  - Add items to the cart (checking inventory availability)
  - Checkout and create an order with bill calculation
  - Get information about a single item

- **Models**:
  - Customer model for user management
  - Cart model for handling shopping carts
  - Order model for storing customer orders

### Version 3: Authentication and Authorization

- **Admin Authentication (/admin)**:
  - Sign in with email and password
  - Remain signed in with access to admin routes
  - Sign out
  - Admin authorization for admin-specific routes
  - Fetch all orders and customer information
  - Create new admin accounts

- **Customer Authentication (/customer)**:
  - Sign up with email and password or social media account
  - Sign in with email and password or social media account
  - Remain signed in with access to customer routes
  - Sign out
  - Customer authorization for customer-specific routes
  - Fetch previous orders
  - Fetch and update customer profile
  - Update the shopping cart.
