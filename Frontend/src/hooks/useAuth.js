import { useSelector, useDispatch } from 'react-redux';
import { 
  login as loginAction, 
  register as registerAction, 
  logout as logoutAction, 
  fetchCurrentUser,
  updateUser,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsRestaurantOwner,
  selectIsSuperAdmin,
  selectIsUser,
  selectAuthLoading,
  selectAuthError
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRestaurantOwner = useSelector(selectIsRestaurantOwner);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const isUser = useSelector(selectIsUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = async (email, password) => {
    return dispatch(loginAction({ email, password }));
  };

  const register = async (data) => {
    return dispatch(registerAction(data));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const refreshUser = async () => {
    return dispatch(fetchCurrentUser());
  };

  const updateUserData = (userData) => {
    dispatch(updateUser(userData));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isRestaurantOwner,
    isSuperAdmin,
    isUser,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUserData,
    clearAuthError,
  };
};

export default useAuth;
