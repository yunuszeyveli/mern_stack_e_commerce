# MERN Stack E-Commerce Project

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js (MERN).

##  Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database

## 📁 Project Structure

```
MERN Stack E-Commerce/
├── frontend/
│   ├── public/          # Static assets (images, etc.)
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout wrappers
│   │   ├── context/     # Context API providers
│   │   ├── config/      # Configuration files
│   │   └── assets/      # Frontend assets
│   ├── index.html       # HTML entry point
│   ├── vite.config.js   # Vite configuration
│   └── package.json
│
└── backend/
    ├── models/          # Database models (MongoDB schemas)
    ├── routes/          # API route handlers
    ├── server.js        # Express server entry point
    └── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "MERN Stack E-Commerce"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## 🏃 Running the Project

### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000` (or your configured port)

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (Vite default)

## 📚 Key Features

### Products
- Browse and search products
- Filter by categories
- View detailed product information
- Add products to cart

### Cart & Checkout
- Add/remove items from cart
- Apply coupon codes
- View order summary
- Secure payment processing

### User Authentication
- User registration and login
- Account management
- Order history

### Admin Panel
- Product management
- Category management
- Coupon management
- Order management
- User management
- Sales statistics

### Additional Features
- Product reviews and ratings
- Blog section
- Brand listings
- Campaign promotions

## 🗄️ Database Models

- **User** - User accounts and authentication
- **Product** - Product catalog
- **Category** - Product categories
- **Order** - Customer orders
- **Coupon** - Discount codes

## 🔌 API Routes

The backend includes the following route modules:
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/categories` - Category management
- `/api/coupons` - Coupon management
- `/api/orders` - Order management
- `/api/payment` - Payment processing
- `/api/users` - User management
- `/api/stats` - Statistics and analytics

## 🛡️ Security Notes

- Admin access is controlled via `isAdmin` configuration
- Implement proper authentication middleware
- Validate and sanitize all user inputs
- Use environment variables for sensitive data

## 📝 Environment Variables

Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_DOMAIN=http://localhost:5173
STRIPE_SECRET_KEY=your_payment_gateway_key
```

#

