import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import PartnerResources from "./pages/PartnerResources";
import BecomePartner from "./pages/BecomePartner";
import ListRestaurant from "./pages/ListRestaurant";
import PartnerLogin from "./pages/PartnerLogin";
import CrownCircle from "./pages/CrownCircle";

// User Pages
import MyReservations from "./pages/user/MyReservations";
import ApplyRestaurant from "./pages/user/ApplyRestaurant";
import Loyalty from "./pages/user/Loyalty";

// Admin Pages
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRestaurantApplications from "./pages/admin/AdminRestaurantApplications";

// Restaurant Owner Pages
import ManageRestaurant from "./pages/restaurant-owner/ManageRestaurant";
import ManageReviews from "./pages/restaurant-owner/ManageReviews";

// Role-specific Dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import RestaurantOwnerDashboard from "./pages/restaurant-owner/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <ScrollToTop />
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

          {/* Additional Public Pages */}
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partner-resources" element={<PartnerResources />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/crown-circle" element={<CrownCircle />} />
          <Route path="/list-restaurant" element={<ListRestaurant />} />
          <Route path="/partner-login" element={<PartnerLogin />} />

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
            <Route path="/loyalty" element={<Loyalty />} />

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
