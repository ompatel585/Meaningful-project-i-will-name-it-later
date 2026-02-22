import { useAuth } from "./AuthContext";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  RESTAURANT_OWNER: "restaurant_owner",
  USER: "user",
};

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_APPLICATIONS: "manage_applications",
  VIEW_ALL_RESTAURANTS: "view_all_restaurants",

  // Restaurant Owner permissions
  MANAGE_RESTAURANT: "manage_restaurant",
  MANAGE_RESERVATIONS: "manage_reservations",
  MANAGE_REVIEWS: "manage_reviews",
  VIEW_OWN_RESTAURANT: "view_own_restaurant",

  // User permissions
  BROWSE_RESTAURANTS: "browse_restaurants",
  MAKE_RESERVATIONS: "make_reservations",
  VIEW_OWN_RESERVATIONS: "view_own_reservations",
  WRITE_REVIEWS: "write_reviews",
};

const rolePermissions = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_RESTAURANTS,
  ],
  [ROLES.RESTAURANT_OWNER]: [
    PERMISSIONS.MANAGE_RESTAURANT,
    PERMISSIONS.MANAGE_RESERVATIONS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.VIEW_OWN_RESTAURANT,
    PERMISSIONS.BROWSE_RESTAURANTS,
  ],
  [ROLES.USER]: [
    PERMISSIONS.BROWSE_RESTAURANTS,
    PERMISSIONS.MAKE_RESERVATIONS,
    PERMISSIONS.VIEW_OWN_RESERVATIONS,
    PERMISSIONS.WRITE_REVIEWS,
  ],
};

export const useRole = () => {
  const { user, isSuperAdmin, isRestaurantOwner, isUser } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    return permissions.some((permission) =>
      rolePermissions[user.role]?.includes(permission),
    );
  };

  const hasAllPermissions = (permissions) => {
    if (!user) return false;
    return permissions.every((permission) =>
      rolePermissions[user.role]?.includes(permission),
    );
  };

  const canAccessRoute = (allowedRoles) => {
    if (!user) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  };

  return {
    user,
    isSuperAdmin,
    isRestaurantOwner,
    isUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    role: user?.role,
  };
};

export default useRole;
