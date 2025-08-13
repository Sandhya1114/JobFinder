// // src/redux/profileSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { supabase } from '../SupabaseClient';

// export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
//   const { data: user } = await supabase.auth.getUser();
//   const { email } = user?.user || {};

//   return {
//     name: email?.split('@')[0] || 'Guest',
//     email: email || '',
//     resume: '',
//     skills: [],
//   };
// });

// const profileSlice = createSlice({
//   name: 'profile',
//   initialState: {
//     name: '',
//     email: '',
//     resume: '',
//     skills: [],
//     status: 'idle',
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchProfile.fulfilled, (state, action) => {
//       return { ...state, ...action.payload, status: 'succeeded' };
//     });
//   },
// });

// export default profileSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  try {
    const data = await api.fetchProfile();
    return data;
  } catch (error) {
    // Return default profile if API fails
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      resume: '',
      skills: ['React', 'JavaScript', 'Node.js'],
    };
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: '',
    email: '',
    resume: '',
    skills: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearProfileError, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;