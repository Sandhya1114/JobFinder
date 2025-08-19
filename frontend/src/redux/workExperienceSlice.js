// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../services/api';

// // Async thunks for work experience operations
// export const fetchWorkExperience = createAsyncThunk(
//   'workExperience/fetchWorkExperience',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await api.fetchWorkExperience();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const addWorkExperience = createAsyncThunk(
//   'workExperience/addWorkExperience',
//   async (experienceData, { rejectWithValue }) => {
//     try {
//       const data = await api.addWorkExperience(experienceData);
//       return data.experience;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updateWorkExperience = createAsyncThunk(
//   'workExperience/updateWorkExperience',
//   async ({ id, experienceData }, { rejectWithValue }) => {
//     try {
//       const data = await api.updateWorkExperience(id, experienceData);
//       return data.experience;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const deleteWorkExperience = createAsyncThunk(
//   'workExperience/deleteWorkExperience',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.deleteWorkExperience(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Work experience slice
// const workExperienceSlice = createSlice({
//   name: 'workExperience',
//   initialState: {
//     items: [],
//     loading: false,
//     saving: false,
//     error: null,
//     message: '',
//     editingItem: null,
//     showForm: false,
//     formData: {
//       job_title: '',
//       company: '',
//       location: '',
//       start_date: '',
//       end_date: '',
//       is_current: false,
//       description: '',
//       achievements: ''
//     }
//   },
//   reducers: {
//     setShowForm: (state, action) => {
//       state.showForm = action.payload;
//       if (!action.payload) {
//         state.editingItem = null;
//         state.formData = {
//           job_title: '',
//           company: '',
//           location: '',
//           start_date: '',
//           end_date: '',
//           is_current: false,
//           description: '',
//           achievements: ''
//         };
//       }
//     },
//     setEditingItem: (state, action) => {
//       state.editingItem = action.payload;
//       if (action.payload) {
//         state.formData = { ...action.payload };
//         state.showForm = true;
//       }
//     },
//     updateFormData: (state, action) => {
//       const { field, value } = action.payload;
//       state.formData[field] = value;
      
//       // If is_current is checked, clear end_date
//       if (field === 'is_current' && value) {
//         state.formData.end_date = '';
//       }
//     },
//     clearMessage: (state) => {
//       state.message = '';
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     resetForm: (state) => {
//       state.formData = {
//         job_title: '',
//         company: '',
//         location: '',
//         start_date: '',
//         end_date: '',
//         is_current: false,
//         description: '',
//         achievements: ''
//       };
//       state.editingItem = null;
//       state.showForm = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch work experience
//       .addCase(fetchWorkExperience.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWorkExperience.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.experience || [];
//       })
//       .addCase(fetchWorkExperience.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Add work experience
//       .addCase(addWorkExperience.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(addWorkExperience.fulfilled, (state, action) => {
//         state.saving = false;
//         state.items.unshift(action.payload);
//         state.message = 'Work experience added successfully!';
//         state.showForm = false;
//         state.formData = {
//           job_title: '',
//           company: '',
//           location: '',
//           start_date: '',
//           end_date: '',
//           is_current: false,
//           description: '',
//           achievements: ''
//         };
//       })
//       .addCase(addWorkExperience.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload;
//       })
      
//       // Update work experience
//       .addCase(updateWorkExperience.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(updateWorkExperience.fulfilled, (state, action) => {
//         state.saving = false;
//         const updatedItem = action.payload;
//         const index = state.items.findIndex(item => item.id === updatedItem.id);
//         if (index !== -1) {
//           state.items[index] = updatedItem;
//         }
//         state.message = 'Work experience updated successfully!';
//         state.showForm = false;
//         state.editingItem = null;
//         state.formData = {
//           job_title: '',
//           company: '',
//           location: '',
//           start_date: '',
//           end_date: '',
//           is_current: false,
//           description: '',
//           achievements: ''
//         };
//       })
//       .addCase(updateWorkExperience.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload;
//       })
      
//       // Delete work experience
//       .addCase(deleteWorkExperience.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(deleteWorkExperience.fulfilled, (state, action) => {
//         state.saving = false;
//         const deletedId = action.payload;
//         state.items = state.items.filter(item => item.id !== deletedId);
//         state.message = 'Work experience deleted successfully!';
//       })
//       .addCase(deleteWorkExperience.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { 
//   setShowForm, 
//   setEditingItem, 
//   updateFormData, 
//   clearMessage, 
//   clearError, 
//   resetForm 
// } = workExperienceSlice.actions;

// export default workExperienceSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Helper function to prepare data for API calls
const prepareFormData = (formData) => {
  return {
    ...formData,
    // Convert empty string to null for end_date when is_current is true
    end_date: formData.is_current || formData.end_date === '' ? null : formData.end_date
  };
};

// Async thunks for work experience operations
export const fetchWorkExperience = createAsyncThunk(
  'workExperience/fetchWorkExperience',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchWorkExperience();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addWorkExperience = createAsyncThunk(
  'workExperience/addWorkExperience',
  async (experienceData, { rejectWithValue }) => {
    try {
      const preparedData = prepareFormData(experienceData);
      const data = await api.addWorkExperience(preparedData);
      return data.experience;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkExperience = createAsyncThunk(
  'workExperience/updateWorkExperience',
  async ({ id, experienceData }, { rejectWithValue }) => {
    try {
      const preparedData = prepareFormData(experienceData);
      const data = await api.updateWorkExperience(id, preparedData);
      return data.experience;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkExperience = createAsyncThunk(
  'workExperience/deleteWorkExperience',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteWorkExperience(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Work experience slice
const workExperienceSlice = createSlice({
  name: 'workExperience',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
    message: '',
    editingItem: null,
    showForm: false,
    formData: {
      job_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: ''
    }
  },
  reducers: {
    setShowForm: (state, action) => {
      state.showForm = action.payload;
      if (!action.payload) {
        state.editingItem = null;
        state.formData = {
          job_title: '',
          company: '',
          location: '',
          start_date: '',
          end_date: '',
          is_current: false,
          description: '',
          achievements: ''
        };
      }
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
      if (action.payload) {
        // Handle null end_date from database
        state.formData = { 
          ...action.payload,
          end_date: action.payload.end_date || ''
        };
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
        job_title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        achievements: ''
      };
      state.editingItem = null;
      state.showForm = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch work experience
      .addCase(fetchWorkExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.experience || [];
      })
      .addCase(fetchWorkExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add work experience
      .addCase(addWorkExperience.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addWorkExperience.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.message = 'Work experience added successfully!';
        state.showForm = false;
        state.formData = {
          job_title: '',
          company: '',
          location: '',
          start_date: '',
          end_date: '',
          is_current: false,
          description: '',
          achievements: ''
        };
      })
      .addCase(addWorkExperience.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Update work experience
      .addCase(updateWorkExperience.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        state.saving = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        state.message = 'Work experience updated successfully!';
        state.showForm = false;
        state.editingItem = null;
        state.formData = {
          job_title: '',
          company: '',
          location: '',
          start_date: '',
          end_date: '',
          is_current: false,
          description: '',
          achievements: ''
        };
      })
      .addCase(updateWorkExperience.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Delete work experience
      .addCase(deleteWorkExperience.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteWorkExperience.fulfilled, (state, action) => {
        state.saving = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        state.message = 'Work experience deleted successfully!';
      })
      .addCase(deleteWorkExperience.rejected, (state, action) => {
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
} = workExperienceSlice.actions;

export default workExperienceSlice.reducer;