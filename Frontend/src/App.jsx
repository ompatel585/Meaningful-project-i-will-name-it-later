import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Role-specific Dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import RestaurantOwnerDashboard from "./pages/restaurant-owner/Dashboard";
import UserDashboard from "./pages/user/Dashboard";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
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

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Main Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Role-specific Dashboards */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/restaurant-owner/dashboard"
              element={<RestaurantOwnerDashboard />}
            />
            <Route path="/user/dashboard" element={<UserDashboard />} />

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
      <Footer />
    </div>
  );
}

export default App;
