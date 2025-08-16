// // src/redux/dashboardSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchDashboardData = createAsyncThunk(
//   'dashboard/fetchData',
//   async () => {
//     const res = await fetch('/api/dashboard');
//     return await res.json();
//   }
// );

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState: {
//     applications: [],
//     savedJobs: [],
//     messages: [],
//     interviews: [],
//     recentActivity: [],
//     status: 'idle',
//     error: null
//   },
//   reducers: {
//     markMessageRead: (state, action) => {
//       const msg = state.messages.find(m => m.id === action.payload);
//       if (msg) msg.read = true;
//     },
//     applyToJob: (state, action) => {
//       state.savedJobs = state.savedJobs.filter(job => job.id !== action.payload);
//       state.applications.push({ id: Date.now(), status: 'sent' });
//       state.recentActivity.unshift({ id: Date.now(), action: 'Applied to a job' });
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         const data = action.payload;
//         state.applications = data.applications;
//         state.savedJobs = data.savedJobs;
//         state.messages = data.messages;
//         state.interviews = data.interviews;
//         state.recentActivity = data.recentActivity;
//         state.status = 'succeeded';
//       });
//   }
// });

// export const { markMessageRead, applyToJob } = dashboardSlice.actions;
// export default dashboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks for dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      savedJobs: 0,
      appliedJobs: 0,
      totalSkills: 0,
      totalEducation: 0
    },
    activeTab: 'overview',
    loading: false,
    error: null
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setActiveTab, clearError, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;