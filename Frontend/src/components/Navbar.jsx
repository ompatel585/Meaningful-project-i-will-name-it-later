import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-blue-600">
            RestaurantReserve-xl font-bold text
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/restaurants"
              className="text-gray-600 hover:text-blue-600"
            >
              Restaurants
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-resaurants"
                  className="text-gray-600 hover:text-blue-600"
                >
                  My Reservations
                </Link>

                {user?.role === "restaurant_manager" && (
                  <Link
                    to="/manage-restaurant"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Manage Restaurant
                  </Link>
                )}

                {user?.role === "super_admin" && (
                  <Link
                    to="/admin/users"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Manage Users
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user?.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
