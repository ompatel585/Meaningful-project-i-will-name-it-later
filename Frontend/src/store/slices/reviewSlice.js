import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewAPI } from '../../api';

const initialState = {
  reviews: [],
  ownerReviews: [],
  analytics: null,
  loading: false,
  error: null,
  filters: {
    rating: '',
    status: 'all', // all, responded, unresponded
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchReviewsByRestaurant = createAsyncThunk(
  'review/fetchByRestaurant',
  async ({ restaurantId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getByRestaurant(restaurantId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchOwnerReviews = createAsyncThunk(
  'review/fetchOwnerReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getOwnerReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'review/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const respondToReview = createAsyncThunk(
  'review/respond',
  async ({ reviewId, response }, { rejectWithValue }) => {
    try {
      const result = await reviewAPI.respondToReview(reviewId, response);
      return { reviewId, review: result.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewAPI.delete(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviewFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setReviewPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearReviewFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.analytics = null;
    },
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews by Restaurant
      .addCase(fetchReviewsByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = {
          page: action.payload.currentPage || 1,
          limit: action.payload.limit || 10,
          total: action.payload.count || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchReviewsByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Owner Reviews
      .addCase(fetchOwnerReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerReviews = action.payload.reviews;
        state.analytics = action.payload.analytics;
        state.pagination = {
          page: action.payload.currentPage || 1,
          limit: action.payload.limit || 10,
          total: action.payload.count || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchOwnerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Respond to Review
      .addCase(respondToReview.fulfilled, (state, action) => {
        const index = state.ownerReviews.findIndex(r => r._id === action.payload.reviewId);
        if (index !== -1) {
          state.ownerReviews[index] = action.payload.review;
        }
      })
      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.ownerReviews = state.ownerReviews.filter(r => r._id !== action.payload);
      });
  },
});

export const { setReviewFilters, setReviewPage, clearReviewFilters, clearReviews, clearReviewError } = reviewSlice.actions;

// Selectors
export const selectReviews = (state) => state.review.reviews;
export const selectOwnerReviews = (state) => state.review.ownerReviews;
export const selectReviewAnalytics = (state) => state.review.analytics;
export const selectReviewLoading = (state) => state.review.loading;
export const selectReviewError = (state) => state.review.error;
export const selectReviewFilters = (state) => state.review.filters;
export const selectReviewPagination = (state) => state.review.pagination;

export default reviewSlice.reducer;
