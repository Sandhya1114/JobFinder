// src/redux/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const res = await fetch('/api/dashboard');
    return await res.json();
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    applications: [],
    savedJobs: [],
    messages: [],
    interviews: [],
    recentActivity: [],
    status: 'idle',
    error: null
  },
  reducers: {
    markMessageRead: (state, action) => {
      const msg = state.messages.find(m => m.id === action.payload);
      if (msg) msg.read = true;
    },
    applyToJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(job => job.id !== action.payload);
      state.applications.push({ id: Date.now(), status: 'sent' });
      state.recentActivity.unshift({ id: Date.now(), action: 'Applied to a job' });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        const data = action.payload;
        state.applications = data.applications;
        state.savedJobs = data.savedJobs;
        state.messages = data.messages;
        state.interviews = data.interviews;
        state.recentActivity = data.recentActivity;
        state.status = 'succeeded';
      });
  }
});

export const { markMessageRead, applyToJob } = dashboardSlice.actions;
export default dashboardSlice.reducer;