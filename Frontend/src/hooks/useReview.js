import { useSelector, useDispatch } from 'react-redux';
import {
    fetchReviewsByRestaurant,
    fetchOwnerReviews,
    createReview,
    respondToReview,
    deleteReview,
    setReviewFilters,
    setReviewPage,
    clearReviewFilters,
    clearReviews,
    clearReviewError,
    selectReviews,
    selectOwnerReviews,
    selectReviewAnalytics,
    selectReviewLoading,
    selectReviewError,
    selectReviewFilters,
    selectReviewPagination
} from '../store/slices/reviewSlice';

export const useReview = () => {
    const dispatch = useDispatch();
    const reviews = useSelector(selectReviews);
    const ownerReviews = useSelector(selectOwnerReviews);
    const analytics = useSelector(selectReviewAnalytics);
    const loading = useSelector(selectReviewLoading);
    const error = useSelector(selectReviewError);
    const filters = useSelector(selectReviewFilters);
    const pagination = useSelector(selectReviewPagination);

    const fetchRestaurantReviews = async ({ restaurantId, params = {} }) => {
        return dispatch(fetchReviewsByRestaurant({ restaurantId, params }));
    };

    const fetchReviews = async (params = {}) => {
        return dispatch(fetchOwnerReviews({ ...filters, ...params }));
    };

    const addReview = async (data) => {
        return dispatch(createReview(data));
    };

    const respondToReviewById = async ({ reviewId, response }) => {
        return dispatch(respondToReview({ reviewId, response }));
    };

    const removeReview = async (reviewId) => {
        return dispatch(deleteReview(reviewId));
    };

    const updateReviewFilters = (newFilters) => {
        dispatch(setReviewFilters(newFilters));
    };

    const changeReviewPage = (page) => {
        dispatch(setReviewPage(page));
    };

    const resetReviewFilters = () => {
        dispatch(clearReviewFilters());
    };

    const clearReviewErrors = () => {
        dispatch(clearReviewError());
    };

    const clearAllReviews = () => {
        dispatch(clearReviews());
    };

    return {
        reviews,
        ownerReviews,
        analytics,
        loading,
        error,
        filters,
        pagination,
        fetchRestaurantReviews,
        fetchReviews,
        addReview,
        respondToReviewById,
        removeReview,
        updateReviewFilters,
        changeReviewPage,
        resetReviewFilters,
        clearReviewErrors,
        clearAllReviews,
    };
};

export default useReview;
