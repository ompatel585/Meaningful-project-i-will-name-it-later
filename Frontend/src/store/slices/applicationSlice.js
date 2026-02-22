import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationAPI } from '../../api';

const initialState = {
    myApplication: null,
    applications: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
};

// Async thunks
export const fetchMyApplication = createAsyncThunk(
    'application/fetchMyApplication',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationAPI.getMyApplication();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
        }
    }
);

export const submitApplication = createAsyncThunk(
    'application/submit',
    async (data, { rejectWithValue }) => {
        try {
            const response = await applicationAPI.apply(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
        }
    }
);

export const fetchAllApplications = createAsyncThunk(
    'application/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await applicationAPI.getAllApplications(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
        }
    }
);

export const approveApplication = createAsyncThunk(
    'application/approve',
    async ({ id, notes }, { rejectWithValue }) => {
        try {
            const response = await applicationAPI.approveApplication(id, notes);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve application');
        }
    }
);

export const rejectApplication = createAsyncThunk(
    'application/reject',
    async ({ id, notes }, { rejectWithValue }) => {
        try {
            const response = await applicationAPI.rejectApplication(id, notes);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject application');
        }
    }
);

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        clearApplicationError: (state) => {
            state.error = null;
        },
        clearMyApplication: (state) => {
            state.myApplication = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch My Application
            .addCase(fetchMyApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.myApplication = action.payload.hasApplication ? action.payload.application : null;
            })
            .addCase(fetchMyApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Submit Application
            .addCase(submitApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.myApplication = action.payload;
            })
            .addCase(submitApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All Applications
            .addCase(fetchAllApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications || action.payload;
                state.pagination = {
                    page: action.payload.currentPage || 1,
                    limit: action.payload.limit || 10,
                    total: action.payload.total || action.payload.length,
                    totalPages: action.payload.totalPages || Math.ceil(action.payload.length / 10),
                };
            })
            .addCase(fetchAllApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Approve Application
            .addCase(approveApplication.fulfilled, (state, action) => {
                const index = state.applications.findIndex(a => a._id === action.payload._id);
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }
            })
            // Reject Application
            .addCase(rejectApplication.fulfilled, (state, action) => {
                const index = state.applications.findIndex(a => a._id === action.payload._id);
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }
            });
    },
});

export const { clearApplicationError, clearMyApplication } = applicationSlice.actions;

// Selectors
export const selectMyApplication = (state) => state.application.myApplication;
export const selectApplications = (state) => state.application.applications;
export const selectApplicationLoading = (state) => state.application.loading;
export const selectApplicationError = (state) => state.application.error;
export const selectApplicationPagination = (state) => state.application.pagination;

export default applicationSlice.reducer;
