// src/redux/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../SupabaseClient';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const { data: user } = await supabase.auth.getUser();
  const { email } = user?.user || {};

  return {
    name: email?.split('@')[0] || 'Guest',
    email: email || '',
    resume: '',
    skills: [],
  };
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: '',
    email: '',
    resume: '',
    skills: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      return { ...state, ...action.payload, status: 'succeeded' };
    });
  },
});

export default profileSlice.reducer;
