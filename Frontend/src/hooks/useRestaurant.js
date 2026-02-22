import { useSelector, useDispatch } from 'react-redux';
import {
    fetchRestaurants,
    fetchRestaurantById,
    fetchMyRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    setFilters,
    setPage,
    clearFilters,
    clearCurrentRestaurant,
    clearError,
    selectRestaurants,
    selectMyRestaurant,
    selectCurrentRestaurant,
    selectRestaurantLoading,
    selectRestaurantError,
    selectFilters,
    selectPagination
} from '../store/slices/restaurantSlice';

export const useRestaurant = () => {
    const dispatch = useDispatch();
    const restaurants = useSelector(selectRestaurants);
    const myRestaurant = useSelector(selectMyRestaurant);
    const currentRestaurant = useSelector(selectCurrentRestaurant);
    const loading = useSelector(selectRestaurantLoading);
    const error = useSelector(selectRestaurantError);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);

    const fetchAllRestaurants = async (params = {}) => {
        return dispatch(fetchRestaurants({ ...filters, ...params }));
    };

    const fetchRestaurant = async (id) => {
        return dispatch(fetchRestaurantById(id));
    };

    const fetchRestaurantDetails = async () => {
        return dispatch(fetchMyRestaurant());
    };

    const createNewRestaurant = async (data) => {
        return dispatch(createRestaurant(data));
    };

    const updateRestaurantDetails = async ({ id, data }) => {
        return dispatch(updateRestaurant({ id, data }));
    };

    const removeRestaurant = async (id) => {
        return dispatch(deleteRestaurant(id));
    };

    const updateFilters = (newFilters) => {
        dispatch(setFilters(newFilters));
    };

    const changePage = (page) => {
        dispatch(setPage(page));
    };

    const resetFilters = () => {
        dispatch(clearFilters());
    };

    const clearRestaurantError = () => {
        dispatch(clearError());
    };

    const clearRestaurant = () => {
        dispatch(clearCurrentRestaurant());
    };

    return {
        restaurants,
        myRestaurant,
        currentRestaurant,
        loading,
        error,
        filters,
        pagination,
        fetchAllRestaurants,
        fetchRestaurant,
        fetchRestaurantDetails,
        createNewRestaurant,
        updateRestaurantDetails,
        removeRestaurant,
        updateFilters,
        changePage,
        resetFilters,
        clearRestaurantError,
        clearRestaurant,
    };
};

export default useRestaurant;
