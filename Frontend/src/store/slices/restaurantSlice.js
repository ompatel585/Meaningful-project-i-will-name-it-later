import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantAPI } from '../../api';

const initialState = {
    restaurants: [],
    myRestaurant: null,
    currentRestaurant: null,
    loading: false,
    error: null,
    filters: {
        search: '',
        cuisine: '',
        city: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
};

// Async thunks
export const fetchRestaurants = createAsyncThunk(
    'restaurant/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
        }
    }
);

export const fetchRestaurantById = createAsyncThunk(
    'restaurant/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
        }
    }
);

export const fetchMyRestaurant = createAsyncThunk(
    'restaurant/fetchMyRestaurant',
    async (_, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.getMyRestaurant();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your restaurant');
        }
    }
);

export const createRestaurant = createAsyncThunk(
    'restaurant/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create restaurant');
        }
    }
);

export const updateRestaurant = createAsyncThunk(
    'restaurant/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update restaurant');
        }
    }
);

export const deleteRestaurant = createAsyncThunk(
    'restaurant/delete',
    async (id, { rejectWithValue }) => {
        try {
            await restaurantAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete restaurant');
        }
    }
);

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentRestaurant: (state) => {
            state.currentRestaurant = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Restaurants
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload.restaurants || action.payload;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 10,
                    total: action.payload.total || action.payload.length,
                    totalPages: action.payload.totalPages || Math.ceil(action.payload.length / 10),
                };
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Restaurant By ID
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRestaurant = action.payload;
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch My Restaurant
            .addCase(fetchMyRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.myRestaurant = action.payload;
            })
            .addCase(fetchMyRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.myRestaurant = null;
            })
            // Create Restaurant
            .addCase(createRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.myRestaurant = action.payload;
                state.restaurants.push(action.payload);
            })
            .addCase(createRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Restaurant
            .addCase(updateRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.myRestaurant = action.payload;
                const index = state.restaurants.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.restaurants[index] = action.payload;
                }
            })
            .addCase(updateRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Restaurant
            .addCase(deleteRestaurant.fulfilled, (state, action) => {
                state.restaurants = state.restaurants.filter(r => r._id !== action.payload);
                if (state.myRestaurant?._id === action.payload) {
                    state.myRestaurant = null;
                }
            });
    },
});

export const { setFilters, setPage, clearFilters, clearCurrentRestaurant, clearError } = restaurantSlice.actions;

// Selectors
export const selectRestaurants = (state) => state.restaurant.restaurants;
export const selectMyRestaurant = (state) => state.restaurant.myRestaurant;
export const selectCurrentRestaurant = (state) => state.restaurant.currentRestaurant;
export const selectRestaurantLoading = (state) => state.restaurant.loading;
export const selectRestaurantError = (state) => state.restaurant.error;
export const selectFilters = (state) => state.restaurant.filters;
export const selectPagination = (state) => state.restaurant.pagination;

export default restaurantSlice.reducer;
