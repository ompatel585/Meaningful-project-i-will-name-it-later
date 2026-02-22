import { useSelector, useDispatch } from 'react-redux';
import {
    fetchMyApplication,
    submitApplication,
    fetchAllApplications,
    approveApplication,
    rejectApplication,
    clearApplicationError,
    clearMyApplication,
    selectMyApplication,
    selectApplications,
    selectApplicationLoading,
    selectApplicationError,
    selectApplicationPagination
} from '../store/slices/applicationSlice';

export const useApplication = () => {
    const dispatch = useDispatch();
    const myApplication = useSelector(selectMyApplication);
    const applications = useSelector(selectApplications);
    const loading = useSelector(selectApplicationLoading);
    const error = useSelector(selectApplicationError);
    const pagination = useSelector(selectApplicationPagination);

    const fetchApplication = async () => {
        return dispatch(fetchMyApplication());
    };

    const submitNewApplication = async (data) => {
        return dispatch(submitApplication(data));
    };

    const fetchApplications = async (params = {}) => {
        return dispatch(fetchAllApplications(params));
    };

    const approveApp = async ({ id, notes }) => {
        return dispatch(approveApplication({ id, notes }));
    };

    const rejectApp = async ({ id, notes }) => {
        return dispatch(rejectApplication({ id, notes }));
    };

    const clearErrors = () => {
        dispatch(clearApplicationError());
    };

    const clearApplication = () => {
        dispatch(clearMyApplication());
    };

    return {
        myApplication,
        applications,
        loading,
        error,
        pagination,
        fetchApplication,
        submitNewApplication,
        fetchApplications,
        approveApp,
        rejectApp,
        clearErrors,
        clearApplication,
    };
};

export default useApplication;
