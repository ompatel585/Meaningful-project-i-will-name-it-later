import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI, loyaltyAPI } from '../../api';

const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    filters: {
        role: '',
        search: '',
        isActive: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    // Loyalty program state
    loyalty: {
        loyaltyPoints: 0,
        loyaltyTier: 'Bronze',
        tierColor: '#CD7F32',
        totalReservations: 0,
        streakData: {
            currentStreak: 0,
            lastOrderDate: null,
            monthlyOrders: {},
            lastStreakBonus: null
        },
        achievements: {
            firstReservation: false,
            firstReview: false,
            profileCompleted: false,
            milestone5: false,
            milestone10: false,
            milestone25: false,
            milestone50: false,
            threeMonthStreak: false,
            firstYearCompleted: false,
            firstYearMonthly: false
        },
        nextTier: null,
        pointsToNextTier: 0,
        memberSince: null,
        referralCode: null
    },
    loyaltyTransactions: [],
    loyaltyLoading: false,
    loyaltyError: null
};

// Async thunks
export const fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userAPI.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userAPI.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const createUser = createAsyncThunk(
    'user/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await userAPI.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await userAPI.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (id, { rejectWithValue }) => {
        try {
            await userAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const toggleUserActive = createAsyncThunk(
    'user/toggleActive',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userAPI.toggleActive(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status');
        }
    }
);

// Loyalty thunks
export const fetchLoyaltyInfo = createAsyncThunk(
    'user/fetchLoyalty',
    async (_, { rejectWithValue }) => {
        try {
            const response = await loyaltyAPI.getInfo();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch loyalty info');
        }
    }
);

export const fetchLoyaltyTransactions = createAsyncThunk(
    'user/fetchLoyaltyTransactions',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await loyaltyAPI.getTransactions(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const fetchLoyaltyAchievements = createAsyncThunk(
    'user/fetchLoyaltyAchievements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await loyaltyAPI.getAchievements();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
        }
    }
);

export const applyReferralCode = createAsyncThunk(
    'user/applyReferral',
    async (referralCode, { rejectWithValue }) => {
        try {
            const response = await loyaltyAPI.applyReferral(referralCode);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to apply referral code');
        }
    }
);

export const generateReferralCode = createAsyncThunk(
    'user/generateReferralCode',
    async (_, { rejectWithValue }) => {
        try {
            const response = await loyaltyAPI.generateReferralCode();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate referral code');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setUserPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearUserFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        updateLoyaltyPoints: (state, action) => {
            state.loyalty.loyaltyPoints = action.payload.loyaltyPoints;
            state.loyalty.loyaltyTier = action.payload.loyaltyTier;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || action.payload;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 10,
                    total: action.payload.total || action.payload.length,
                    totalPages: action.payload.totalPages || Math.ceil(action.payload.length / 10),
                };
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.unshift(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.currentUser = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            // Toggle User Active
            .addCase(toggleUserActive.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Fetch Loyalty Info
            .addCase(fetchLoyaltyInfo.pending, (state) => {
                state.loyaltyLoading = true;
                state.loyaltyError = null;
            })
            .addCase(fetchLoyaltyInfo.fulfilled, (state, action) => {
                state.loyaltyLoading = false;
                state.loyalty = { ...state.loyalty, ...action.payload };
            })
            .addCase(fetchLoyaltyInfo.rejected, (state, action) => {
                state.loyaltyLoading = false;
                state.loyaltyError = action.payload;
            })
            // Fetch Loyalty Transactions
            .addCase(fetchLoyaltyTransactions.fulfilled, (state, action) => {
                state.loyaltyTransactions = action.payload.transactions;
            })
            // Fetch Loyalty Achievements
            .addCase(fetchLoyaltyAchievements.fulfilled, (state, action) => {
                state.loyalty.achievements = action.payload.achievements;
            })
            // Apply Referral
            .addCase(applyReferralCode.fulfilled, (state, action) => {
                // Refresh loyalty info after applying referral
            })
            // Generate Referral Code
            .addCase(generateReferralCode.fulfilled, (state, action) => {
                state.loyalty.referralCode = action.payload.referralCode;
            });
    },
});

export const { setUserFilters, setUserPage, clearUserFilters, clearCurrentUser, clearUserError, updateLoyaltyPoints } = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.user.users;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserFilters = (state) => state.user.filters;
export const selectUserPagination = (state) => state.user.pagination;
export const selectLoyalty = (state) => state.user.loyalty;
export const selectLoyaltyTransactions = (state) => state.user.loyaltyTransactions;
export const selectLoyaltyLoading = (state) => state.user.loyaltyLoading;

export default userSlice.reducer;
