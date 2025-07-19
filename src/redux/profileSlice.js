// src/redux/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const res = await fetch('/api/profile');
    return await res.json();
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: '',
    email: '',
    resume: '',
    skills: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      return { ...state, ...action.payload, status: 'succeeded' };
    });
  }
});

export default profileSlice.reducer;
