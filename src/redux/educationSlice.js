import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks for education operations
export const fetchEducation = createAsyncThunk(
  'education/fetchEducation',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchEducation();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEducation = createAsyncThunk(
  'education/addEducation',
  async (educationData, { rejectWithValue }) => {
    try {
      const data = await api.addEducation(educationData);
      return data.education;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEducation = createAsyncThunk(
  'education/updateEducation',
  async ({ id, educationData }, { rejectWithValue }) => {
    try {
      const data = await api.updateEducation(id, educationData);
      return data.education;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'education/deleteEducation',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteEducation(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Education slice
const educationSlice = createSlice({
  name: 'education',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
    message: '',
    editingItem: null,
    showForm: false,
    formData: {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      grade: '',
      description: '',
      is_current: false
    }
  },
  reducers: {
    setShowForm: (state, action) => {
      state.showForm = action.payload;
      if (!action.payload) {
        state.editingItem = null;
        state.formData = {
          institution: '',
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          grade: '',
          description: '',
          is_current: false
        };
      }
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
      if (action.payload) {
        state.formData = { ...action.payload };
        state.showForm = true;
      }
    },
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      
      // If is_current is checked, clear end_date
      if (field === 'is_current' && value) {
        state.formData.end_date = '';
      }
    },
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetForm: (state) => {
      state.formData = {
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
        description: '',
        is_current: false
      };
      state.editingItem = null;
      state.showForm = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch education
      .addCase(fetchEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.education || [];
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add education
      .addCase(addEducation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.message = 'Education added successfully!';
        state.showForm = false;
        state.formData = {
          institution: '',
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          grade: '',
          description: '',
          is_current: false
        };
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Update education
      .addCase(updateEducation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.saving = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        state.message = 'Education updated successfully!';
        state.showForm = false;
        state.editingItem = null;
        state.formData = {
          institution: '',
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          grade: '',
          description: '',
          is_current: false
        };
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Delete education
      .addCase(deleteEducation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.saving = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        state.message = 'Education deleted successfully!';
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setShowForm, 
  setEditingItem, 
  updateFormData, 
  clearMessage, 
  clearError, 
  resetForm 
} = educationSlice.actions;

export default educationSlice.reducer;