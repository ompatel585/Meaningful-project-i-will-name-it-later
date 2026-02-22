import { useSelector, useDispatch } from 'react-redux';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserActive,
    setUserFilters,
    setUserPage,
    clearUserFilters,
    clearCurrentUser,
    clearUserError,
    selectUsers,
    selectCurrentUser,
    selectUserLoading,
    selectUserError,
    selectUserFilters,
    selectUserPagination
} from '../store/slices/userSlice';

export const useUser = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUsers);
    const currentUser = useSelector(selectCurrentUser);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);
    const filters = useSelector(selectUserFilters);
    const pagination = useSelector(selectUserPagination);

    const fetchAllUsers = async (params = {}) => {
        return dispatch(fetchUsers({ ...filters, ...params }));
    };

    const fetchUser = async (id) => {
        return dispatch(fetchUserById(id));
    };

    const addUser = async (data) => {
        return dispatch(createUser(data));
    };

    const updateUserData = async ({ id, data }) => {
        return dispatch(updateUser({ id, data }));
    };

    const removeUser = async (id) => {
        return dispatch(deleteUser(id));
    };

    const toggleActive = async (id) => {
        return dispatch(toggleUserActive(id));
    };

    const updateUserFilters = (newFilters) => {
        dispatch(setUserFilters(newFilters));
    };

    const changeUserPage = (page) => {
        dispatch(setUserPage(page));
    };

    const resetUserFilters = () => {
        dispatch(clearUserFilters());
    };

    const clearErrors = () => {
        dispatch(clearUserError());
    };

    const clearUser = () => {
        dispatch(clearCurrentUser());
    };

    return {
        users,
        currentUser,
        loading,
        error,
        filters,
        pagination,
        fetchAllUsers,
        fetchUser,
        addUser,
        updateUserData,
        removeUser,
        toggleActive,
        updateUserFilters,
        changeUserPage,
        resetUserFilters,
        clearErrors,
        clearUser,
    };
};

export default useUser;
