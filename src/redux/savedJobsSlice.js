// redux/savedJobsSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ⬇️ Utility to load from localStorage
const loadSavedJobsFromStorage = () => {
  const data = localStorage.getItem('savedJobs');
  return data ? JSON.parse(data) : [];
};

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState: {
    savedJobs: loadSavedJobsFromStorage(), // ⬅️ Load from storage
  },
  reducers: {
    saveJob: (state, action) => {
      const job = action.payload;
      const exists = state.savedJobs.some(j => j.id === job.id);
      if (!exists) {
        state.savedJobs.push(job);
        localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs)); // ⬅️ Save to storage
      }
    },
    unsaveJob: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(job => job.id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs)); // ⬅️ Update storage
    },
    clearSavedJobs: (state) => {
      state.savedJobs = [];
      localStorage.removeItem('savedJobs'); // ⬅️ Clear from storage
    },
  },
});

export const { saveJob, unsaveJob, clearSavedJobs } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;
