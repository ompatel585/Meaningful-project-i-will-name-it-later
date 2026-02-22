import { useSelector, useDispatch } from 'react-redux';
import {
    fetchReservations,
    fetchMyReservations,
    createReservation,
    updateReservationStatus,
    cancelReservation,
    deleteReservation,
    setReservationFilters,
    setReservationPage,
    clearReservationFilters,
    clearCurrentReservation,
    clearReservationError,
    selectReservations,
    selectMyReservations,
    selectReservationLoading,
    selectReservationError,
    selectReservationFilters,
    selectReservationPagination
} from '../store/slices/reservationSlice';

export const useReservation = () => {
    const dispatch = useDispatch();
    const reservations = useSelector(selectReservations);
    const myReservations = useSelector(selectMyReservations);
    const loading = useSelector(selectReservationLoading);
    const error = useSelector(selectReservationError);
    const filters = useSelector(selectReservationFilters);
    const pagination = useSelector(selectReservationPagination);

    const fetchAllReservations = async (params = {}) => {
        return dispatch(fetchReservations({ ...filters, ...params }));
    };

    const fetchUserReservations = async () => {
        return dispatch(fetchMyReservations());
    };

    const makeReservation = async (data) => {
        return dispatch(createReservation(data));
    };

    const updateStatus = async ({ id, data }) => {
        return dispatch(updateReservationStatus({ id, data }));
    };

    const cancelUserReservation = async (id) => {
        return dispatch(cancelReservation(id));
    };

    const removeReservation = async (id) => {
        return dispatch(deleteReservation(id));
    };

    const updateReservationFilters = (newFilters) => {
        dispatch(setReservationFilters(newFilters));
    };

    const changeReservationPage = (page) => {
        dispatch(setReservationPage(page));
    };

    const resetReservationFilters = () => {
        dispatch(clearReservationFilters());
    };

    const clearReservationErrors = () => {
        dispatch(clearReservationError());
    };

    const clearReservation = () => {
        dispatch(clearCurrentReservation());
    };

    return {
        reservations,
        myReservations,
        loading,
        error,
        filters,
        pagination,
        fetchAllReservations,
        fetchUserReservations,
        makeReservation,
        updateStatus,
        cancelUserReservation,
        removeReservation,
        updateReservationFilters,
        changeReservationPage,
        resetReservationFilters,
        clearReservationErrors,
        clearReservation,
    };
};

export default useReservation;
