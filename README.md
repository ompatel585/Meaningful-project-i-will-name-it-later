# Restaurant Reservation System

A full-stack restaurant reservation application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **User Roles:**
  - Regular Users - Browse restaurants and make reservations
  - Restaurant Managers - Manage their restaurant and reservations
  - Super Admin - Manage all users

- **Core Functionality:**
  - User registration and authentication (JWT)
  - Restaurant browsing with search and filters
  - Table reservation system
  - Restaurant management for managers
  - Admin panel for user management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   
2. **Install all dependencies:**
   
```
bash
   npm run install:all
   
```

3. **Configure environment variables:**
   
   Create a `.env` file in the Backend directory:
   
```
env
   MONGOURI=mongodb://localhost:27017/restaurant_reservation
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   
```
   
   The Frontend already has a default `.env` configured to connect to `http://localhost:5000/api`

4. **Start MongoDB** (ensure MongoDB is running locally)

5. **Run the application:**
   
```
bash
   npm run dev
   
```
   
   This will start:
   - Backend server on http://localhost:5000
   - Frontend on http://localhost:5173

## How to Create Users and Restaurants

### Method 1: Using the Admin Panel (Recommended)

#### 1. First, create a Super Admin user:

You can create the first super admin user directly through the API:

```
bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

Or use Postman/Insomnia to make the request.

#### 2. Login as Super Admin:

1. Open http://localhost:5173 in your browser
2. Navigate to `/login`
3. Login with your super admin credentials
4. Go to Dashboard → Manage Users (Admin panel)

#### 3. Create Users from Admin Panel:

1. After logging in as super admin, click "Manage Users" in the dashboard
2. Click "Add User" button
3. Fill in the user details:
   - **Name**: User's full name
   - **Email**: User's email address
   - **Password**: Set a password
   - **Role**: Select one of:
     - `user` - Regular customer
     - `restaurant_manager` - Restaurant owner/manager
     - `super_admin` - System administrator

#### 4. Create Restaurants:

**Option A: Using Admin Panel**
1. As super admin, navigate to Manage Users
2. Create a user with role `restaurant_manager`
3. Login as that restaurant manager
4. Go to "Manage Restaurant" in the dashboard
5. Fill in restaurant details:
   - Restaurant Name
   - Cuisine Type
   - Description
   - Address (Street, City, State, Zip Code)
   - Operating Hours for each day

**Option B: Direct API Creation:**
```
bash
# First login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "manager@example.com", "password": "password123"}'

# Then create restaurant (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "My Restaurant",
    "description": "A great place to eat",
    "cuisine": "Italian",
    "location": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "operatingHours": {
      "monday": "9:00 AM - 10:00 PM",
      "tuesday": "9:00 AM - 10:00 PM",
      "wednesday": "9:00 AM - 10:00 PM",
      "thursday": "9:00 AM - 10:00 PM",
      "friday": "9:00 AM - 11:00 PM",
      "saturday": "10:00 AM - 11:00 PM",
      "sunday": "10:00 AM - 9:00 PM"
    }
  }'
```

### Method 2: User Self-Registration

Regular users can register themselves through the frontend:

1. Open http://localhost:5173
2. Click "Register" in the navigation
3. Fill in:
   - Full Name
   - Email
   - Password
   - Confirm Password
4. Click "Create Account"
5. User will be assigned role `user` by default

## User Roles and Permissions

### Super Admin
- Access to all features
- Can create/edit/delete any users
- Can view all restaurants and reservations
- Access: `/admin/users`

### Restaurant Manager
- Can manage their own restaurant details
- Can view/confirm/cancel reservations for their restaurant
- Can update reservation status (pending → confirmed → completed)
- Access: `/manage-restaurant`

### Regular User
- Can browse all restaurants
- Can view restaurant details
- Can make reservations
- Can view/cancel their own reservations
- Access: `/dashboard`, `/my-reservations`, `/restaurants`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - List all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (manager only)
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `GET /api/restaurants/manager/my-restaurant` - Get manager's restaurant

### Reservations
- `GET /api/reservations` - List reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id/status` - Update reservation status
- `PUT /api/reservations/:id/cancel` - Cancel reservation

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
├── Frontend/                 # React + Tailwind CSS
│   ├── src/
│   │   ├── api/            # API configuration
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts (Auth)
│   │   └── pages/          # Page components
│   └── package.json
│
├── Backend/                  # Express + MongoDB
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
│   └── package.json
│
└── package.json            # Root package with scripts
```

## Running in Production

1. Build the frontend:
   
```
bash
   npm run build
   
```

2. Set environment variables for production:
   - Update `MONGOURI` to your production MongoDB URL
   - Set `JWT_SECRET` to a secure random string
   - Update `VITE_API_URL` in Frontend `.env`

3. Serve the backend with PM2 or similar

4. Configure reverse proxy (nginx) to serve both frontend and backend

## License

ISC
