import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationAPI } from '../../api';

const initialState = {
    reservations: [],
    myReservations: [],
    currentReservation: null,
    loading: false,
    error: null,
    filters: {
        status: '',
        date: '',
        restaurantId: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
};

// Async thunks
export const fetchReservations = createAsyncThunk(
    'reservation/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await reservationAPI.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
        }
    }
);

export const fetchMyReservations = createAsyncThunk(
    'reservation/fetchMyReservations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await reservationAPI.getAll({});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reservations');
        }
    }
);

export const createReservation = createAsyncThunk(
    'reservation/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await reservationAPI.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create reservation');
        }
    }
);

export const updateReservationStatus = createAsyncThunk(
    'reservation/updateStatus',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await reservationAPI.updateStatus(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update reservation');
        }
    }
);

export const cancelReservation = createAsyncThunk(
    'reservation/cancel',
    async (id, { rejectWithValue }) => {
        try {
            const response = await reservationAPI.cancel(id);
            return { id, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel reservation');
        }
    }
);

export const deleteReservation = createAsyncThunk(
    'reservation/delete',
    async (id, { rejectWithValue }) => {
        try {
            await reservationAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete reservation');
        }
    }
);

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setReservationFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setReservationPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearReservationFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentReservation: (state) => {
            state.currentReservation = null;
        },
        clearReservationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Reservations
            .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload.reservations || action.payload;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 10,
                    total: action.payload.total || action.payload.length,
                    totalPages: action.payload.totalPages || Math.ceil(action.payload.length / 10),
                };
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch My Reservations
            .addCase(fetchMyReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.myReservations = action.payload.reservations || action.payload;
            })
            .addCase(fetchMyReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Reservation
            .addCase(createReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.myReservations.unshift(action.payload);
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Reservation Status
            .addCase(updateReservationStatus.fulfilled, (state, action) => {
                const index = state.reservations.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.reservations[index] = action.payload;
                }
                const myIndex = state.myReservations.findIndex(r => r._id === action.payload._id);
                if (myIndex !== -1) {
                    state.myReservations[myIndex] = action.payload;
                }
            })
            // Cancel Reservation
            .addCase(cancelReservation.fulfilled, (state, action) => {
                const index = state.reservations.findIndex(r => r._id === action.payload.id);
                if (index !== -1) {
                    state.reservations[index].status = 'cancelled';
                }
                const myIndex = state.myReservations.findIndex(r => r._id === action.payload.id);
                if (myIndex !== -1) {
                    state.myReservations[myIndex].status = 'cancelled';
                }
            })
            // Delete Reservation
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.reservations = state.reservations.filter(r => r._id !== action.payload);
                state.myReservations = state.myReservations.filter(r => r._id !== action.payload);
            });
    },
});

export const { setReservationFilters, setReservationPage, clearReservationFilters, clearCurrentReservation, clearReservationError } = reservationSlice.actions;

// Selectors
export const selectReservations = (state) => state.reservation.reservations;
export const selectMyReservations = (state) => state.reservation.myReservations;
export const selectReservationLoading = (state) => state.reservation.loading;
export const selectReservationError = (state) => state.reservation.error;
export const selectReservationFilters = (state) => state.reservation.filters;
export const selectReservationPagination = (state) => state.reservation.pagination;

export default reservationSlice.reducer;
