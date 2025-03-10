# E-Commerce Backend

This is the backend for an e-commerce website built using **Node.js, Express, and MongoDB**. It provides APIs for user authentication, product management, orders, payments, and more.

## Features
- User authentication (JWT + Cookies)
- Product management
- Cart functionality
- Order processing
- Payment integration
- Reviews & ratings
- Category management
- Shipping & delivery tracking

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Cookies

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd <your-backend-folder>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file and add the following:**
   ```env
   PORT=8000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   COOKIE_SECRET=<your-cookie-secret>
   ```
4. **Run the server:**
   ```sh
   npm start
   ```
   The backend should now be running on `http://localhost:8000`



## Contributing
Feel free to fork and contribute to this project!

## License
This project is licensed under the MIT License.

