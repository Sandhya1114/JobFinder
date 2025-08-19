// // redux/savedJobsSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// // ⬇️ Utility to load from localStorage
// const loadSavedJobsFromStorage = () => {
//   const data = localStorage.getItem('savedJobs');
//   return data ? JSON.parse(data) : [];
// };

// const savedJobsSlice = createSlice({
//   name: 'savedJobs',
//   initialState: {
//     savedJobs: loadSavedJobsFromStorage(), // ⬅️ Load from storage
//   },
//   reducers: {
//     saveJob: (state, action) => {
//       const job = action.payload;
//       const exists = state.savedJobs.some(j => j.id === job.id);
//       if (!exists) {
//         state.savedJobs.push(job);
//         localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs)); // ⬅️ Save to storage
//       }
//     },
//     unsaveJob: (state, action) => {
//       const jobId = action.payload;
//       state.savedJobs = state.savedJobs.filter(job => job.id !== jobId);
//       localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs)); // ⬅️ Update storage
//     },
//     clearSavedJobs: (state) => {
//       state.savedJobs = [];
//       localStorage.removeItem('savedJobs'); // ⬅️ Clear from storage
//     },
//   },
// });

// export const { saveJob, unsaveJob, clearSavedJobs } = savedJobsSlice.actions;
// export default savedJobsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks for saved jobs operations
export const fetchSavedJobs = createAsyncThunk(
  'savedJobs/fetchSavedJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.fetchSavedJobs(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  'savedJobs/saveJob',
  async ({ jobId, notes = '', priority = 0 }, { rejectWithValue }) => {
    try {
      const data = await api.saveJob(jobId, notes, priority);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSavedJob = createAsyncThunk(
  'savedJobs/updateSavedJob',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const data = await api.updateSavedJob(id, updateData);
      return { id, ...data.savedJob };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeSavedJob = createAsyncThunk(
  'savedJobs/removeSavedJob',
  async (id, { rejectWithValue }) => {
    try {
      await api.removeSavedJob(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkJobSaved = createAsyncThunk(
  'savedJobs/checkJobSaved',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await api.checkJobSaved(jobId);
      return { jobId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Saved jobs slice
const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState: {
    jobs: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalJobs: 0,
      jobsPerPage: 20
    },
    filters: {
      status: '',
      page: 1,
      limit: 20
    },
    savedJobsMap: {}, // Map to track which jobs are saved (jobId -> savedJobData)
    loading: false,
    saving: false,
    error: null,
    message: ''
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        page: 1,
        limit: 20
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch saved jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.savedJobs || [];
        state.pagination = action.payload.pagination || state.pagination;
        
        // Update savedJobsMap
        const newMap = {};
        state.jobs.forEach(savedJob => {
          if (savedJob.jobs) {
            newMap[savedJob.jobs.id] = savedJob;
          }
        });
        state.savedJobsMap = newMap;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save job
      .addCase(saveJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.saving = false;
        const savedJob = action.payload.savedJob;
        state.jobs.unshift(savedJob);
        state.message = 'Job saved successfully!';
        
        // Update savedJobsMap
        if (savedJob.jobs) {
          state.savedJobsMap[savedJob.jobs.id] = savedJob;
        }
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.saving = false;
        if (action.payload.includes('already saved')) {
          state.message = 'Job is already saved';
        } else {
          state.error = action.payload;
        }
      })
      
      // Update saved job
      .addCase(updateSavedJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSavedJob.fulfilled, (state, action) => {
        state.saving = false;
        const updatedJob = action.payload;
        const index = state.jobs.findIndex(job => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], ...updatedJob };
        }
        state.message = 'Job updated successfully!';
        
        // Update savedJobsMap
        if (updatedJob.jobs) {
          state.savedJobsMap[updatedJob.jobs.id] = updatedJob;
        }
      })
      .addCase(updateSavedJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Remove saved job
      .addCase(removeSavedJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(removeSavedJob.fulfilled, (state, action) => {
        state.saving = false;
        const removedId = action.payload;
        const removedJob = state.jobs.find(job => job.id === removedId);
        state.jobs = state.jobs.filter(job => job.id !== removedId);
        state.message = 'Job removed from saved list';
        
        // Update savedJobsMap
        if (removedJob && removedJob.jobs) {
          delete state.savedJobsMap[removedJob.jobs.id];
        }
      })
      .addCase(removeSavedJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Check job saved
      .addCase(checkJobSaved.fulfilled, (state, action) => {
        const { jobId, isSaved, savedJob } = action.payload;
        if (isSaved && savedJob) {
          state.savedJobsMap[jobId] = savedJob;
        } else {
          delete state.savedJobsMap[jobId];
        }
      });
  }
});

export const { 
  setFilters, 
  clearMessage, 
  clearError, 
  resetFilters 
} = savedJobsSlice.actions;

export default savedJobsSlice.reducer;