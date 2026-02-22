import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import MyReservations from "./pages/MyReservations";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import ManageRestaurant from "./pages/ManageRestaurant";
import ApplyRestaurant from "./pages/ApplyRestaurant";
import AdminRestaurantApplications from "./pages/AdminRestaurantApplications";
import ManageReviews from "./pages/ManageReviews";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/apply-restaurant" element={<ApplyRestaurant />} />

            {/* Restaurant Owner Routes */}
            <Route path="/manage-restaurant" element={<ManageRestaurant />} />
            <Route path="/manage-reviews" element={<ManageReviews />} />

            {/* Super Admin Routes */}
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route
              path="/admin/restaurant-applications"
              element={<AdminRestaurantApplications />}
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
