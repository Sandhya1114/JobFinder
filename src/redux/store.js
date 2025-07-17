import { configureStore, createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
    },
  },
});

export const { setJobs } = jobSlice.actions;

const store = configureStore({
  reducer: {
    jobs: jobSlice.reducer,
  },
});

export default store;
