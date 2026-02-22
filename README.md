<p align="center">
  <img src="https://via.placeholder.com/200x200/6366f1/ffffff?text=R" alt="ReserveTable Logo" width="120" />
</p>

<h1 align="center">ReserveTable</h1>

<p align="center">
  <strong>A Premium Restaurant Reservation & Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

---

## ✨ Premium Features

### For Customers 🍽️
- 🔍 **Browse Restaurants** - Discover restaurants by name, cuisine, or location
- 📅 **Easy Reservations** - Book tables with date, time, and party size selection
- 📋 **My Reservations** - View and manage all your reservations
- ⭐ **Reviews & Ratings** - Share your dining experience

### For Restaurant Owners 🏪
- 📊 **Restaurant Dashboard** - Comprehensive management overview
- 🖼️ **Image Management** - Upload and showcase restaurant photos via Cloudinary
- 📋 **Menu Management** - Create and manage menu items with categories and pricing
- ⏰ **Operating Hours** - Set daily opening and closing times
- 📅 **Reservation Management** - View, confirm, or reject booking requests
- ✅ **Reservation Status Tracking** - Track pending, confirmed, and completed reservations

### For Administrators 👑
- 👥 **User Management** - View and manage all registered users
- 📝 **Application Processing** - Review and approve restaurant owner applications
- 🔒 **Role-based Access** - Secure admin, owner, and user roles

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + Vite + Tailwind CSS + React Router                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
┌─────────────────────────▼───────────────────────────────────┐
│                        BACKEND                               │
│  Node.js + Express + MongoDB + Mongoose                     │
│  Authentication: JWT + bcrypt                                │
│  File Upload: Multer + Cloudinary                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| MongoDB | 6.0 or higher |

### Installation

#### 1. Clone the Repository
```
bash
git clone <repository-url>
cd FinalProject
```

#### 2. Backend Setup
```
bash
cd Backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Frontend Setup
```
bash
cd Frontend
npm install
```

### Environment Variables

Create a `.env` file in the Backend directory:

```
env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGOURI=mongodb://localhost:27017/reservetable

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

#### Development Mode
```
bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

#### Production Build
```
bash
# Backend
cd Backend
npm start

# Frontend
cd Frontend
npm run build
```

---

## 📁 Project Structure

```
FinalProject/
├── Backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── api/           # API service
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `user` | Regular customers | Browse, Reserve, Review |
| `restaurant_owner` | Restaurant partners | Manage restaurant, Handle reservations |
| `super_admin` | Platform administrators | Full system control |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants/:id` | Get restaurant by ID |
| POST | `/api/restaurants` | Create restaurant |
| PUT | `/api/restaurants/:id` | Update restaurant |
| DELETE | `/api/restaurants/:id` | Delete restaurant |
| POST | `/api/restaurants/upload-images` | Upload images |
| DELETE | `/api/restaurants/delete-image` | Delete image |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get reservations |
| POST | `/api/reservations` | Create reservation |
| PUT | `/api/reservations/:id/status` | Update status |
| DELETE | `/api/reservations/:id` | Cancel reservation |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/apply-restaurant` | Apply as partner |
| GET | `/api/applications/my-application` | Get my application |
| GET | `/api/applications/admin/restaurant-applications` | Get all (admin) |
| PUT | `/api/applications/admin/.../approve` | Approve application |
| PUT | `/api/applications/admin/.../reject` | Reject application |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image storage

---

## 📱 Screenshots

The application features a modern, responsive design with:

- 🌙 **Dark/Light Theme** support
- 📱 **Mobile-first** responsive layout
- 🎨 **Gradient accents** and modern UI elements
- ✨ **Smooth animations** and transitions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ReserveTable Team**
- GitHub: [@reserve-table](https://github.com)

---

<p align="center">
  <strong>Made with ❤️ for restaurant lovers</strong>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=reserve-table&label=Profile%20Views&color=6366f1&style=flat" alt="Profile Views" />
</p>
