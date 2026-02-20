import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUser();
    }
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "super_admin",
    isRestaurantManager: user?.role === "restaurant_manager",
    isEndUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
