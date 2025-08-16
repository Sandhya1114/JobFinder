import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

// Async thunks for profile operations
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await api.updateProfile(profileData);
      return data.profile || profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: {
      name: '',
      email: '',
      about: '',
      phone: '',
      location: '',
      resume: '',
      skills: []
    },
    loading: false,
    saving: false,
    error: null,
    message: '',
    isEditing: false
  },
  reducers: {
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.data[field] = value;
    },
    updateSkills: (state, action) => {
      const skillsArray = action.payload
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);
      state.data.skills = skillsArray;
    },
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      // Reset to initial values when canceling edit
      state.isEditing = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = { ...state.data, ...action.payload };
        state.message = 'Profile updated successfully!';
        state.isEditing = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.message = 'Failed to update profile';
      });
  }
});

export const { 
  setIsEditing, 
  updateProfileField, 
  updateSkills, 
  clearMessage, 
  clearError, 
  resetProfile 
} = profileSlice.actions;

export default profileSlice.reducer;