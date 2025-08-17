// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../services/api';

// // Async thunks for education operations
// export const fetchEducation = createAsyncThunk(
//   'education/fetchEducation',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await api.fetchEducation();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const addEducation = createAsyncThunk(
//   'education/addEducation',
//   async (educationData, { rejectWithValue }) => {
//     try {
//       const data = await api.addEducation(educationData);
//       return data.education;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updateEducation = createAsyncThunk(
//   'education/updateEducation',
//   async ({ id, educationData }, { rejectWithValue }) => {
//     try {
//       const data = await api.updateEducation(id, educationData);
//       return data.education;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const deleteEducation = createAsyncThunk(
//   'education/deleteEducation',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.deleteEducation(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Education slice
// const educationSlice = createSlice({
//   name: 'education',
//   initialState: {
//     items: [],
//     loading: false,
//     saving: false,
//     error: null,
//     message: '',
//     editingItem: null,
//     showForm: false,
//     formData: {
//       institution: '',
//       degree: '',
//       field_of_study: '',
//       start_date: '',
//       end_date: '',
//       grade: '',
//       description: '',
//       is_current: false
//     }
//   },
//   reducers: {
//     setShowForm: (state, action) => {
//       state.showForm = action.payload;
//       if (!action.payload) {
//         state.editingItem = null;
//         state.formData = {
//           institution: '',
//           degree: '',
//           field_of_study: '',
//           start_date: '',
//           end_date: '',
//           grade: '',
//           description: '',
//           is_current: false
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
//         institution: '',
//         degree: '',
//         field_of_study: '',
//         start_date: '',
//         end_date: '',
//         grade: '',
//         description: '',
//         is_current: false
//       };
//       state.editingItem = null;
//       state.showForm = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch education
//       .addCase(fetchEducation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEducation.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.education || [];
//       })
//       .addCase(fetchEducation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Add education
//       .addCase(addEducation.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(addEducation.fulfilled, (state, action) => {
//         state.saving = false;
//         state.items.unshift(action.payload);
//         state.message = 'Education added successfully!';
//         state.showForm = false;
//         state.formData = {
//           institution: '',
//           degree: '',
//           field_of_study: '',
//           start_date: '',
//           end_date: '',
//           grade: '',
//           description: '',
//           is_current: false
//         };
//       })
//       .addCase(addEducation.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload;
//       })
      
//       // Update education
//       .addCase(updateEducation.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(updateEducation.fulfilled, (state, action) => {
//         state.saving = false;
//         const updatedItem = action.payload;
//         const index = state.items.findIndex(item => item.id === updatedItem.id);
//         if (index !== -1) {
//           state.items[index] = updatedItem;
//         }
//         state.message = 'Education updated successfully!';
//         state.showForm = false;
//         state.editingItem = null;
//         state.formData = {
//           institution: '',
//           degree: '',
//           field_of_study: '',
//           start_date: '',
//           end_date: '',
//           grade: '',
//           description: '',
//           is_current: false
//         };
//       })
//       .addCase(updateEducation.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload;
//       })
      
//       // Delete education
//       .addCase(deleteEducation.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(deleteEducation.fulfilled, (state, action) => {
//         state.saving = false;
//         const deletedId = action.payload;
//         state.items = state.items.filter(item => item.id !== deletedId);
//         state.message = 'Education deleted successfully!';
//       })
//       .addCase(deleteEducation.rejected, (state, action) => {
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
// } = educationSlice.actions;

// export default educationSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Helper function to clean date data for API submission
const cleanDateData = (data) => {
  const cleanedData = { ...data };
  
  // Convert empty strings to null for date fields
  if (cleanedData.start_date === '') {
    delete cleanedData.start_date; // Let backend handle null
  }
  if (cleanedData.end_date === '') {
    delete cleanedData.end_date; // Let backend handle null
  }
  
  // If is_current is true, ensure end_date is removed
  if (cleanedData.is_current) {
    delete cleanedData.end_date;
  }
  
  // Clean other potential date fields
  if (cleanedData.application_date === '') {
    delete cleanedData.application_date;
  }
  if (cleanedData.reminder_date === '') {
    delete cleanedData.reminder_date;
  }
  
  return cleanedData;
};

// Helper function to format dates for form inputs
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

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
      const cleanedData = cleanDateData(educationData);
      console.log('Submitting education data:', cleanedData); // Debug log
      const data = await api.addEducation(cleanedData);
      return data.education;
    } catch (error) {
      console.error('Error in addEducation thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateEducation = createAsyncThunk(
  'education/updateEducation',
  async ({ id, educationData }, { rejectWithValue }) => {
    try {
      const cleanedData = cleanDateData(educationData);
      console.log('Updating education data:', cleanedData); // Debug log
      const data = await api.updateEducation(id, cleanedData);
      return data.education;
    } catch (error) {
      console.error('Error in updateEducation thunk:', error);
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
        // Format dates for input fields and handle potential null values
        const item = { ...action.payload };
        item.start_date = formatDateForInput(item.start_date);
        item.end_date = formatDateForInput(item.end_date);
        
        // Ensure all required fields have default values
        state.formData = {
          institution: item.institution || '',
          degree: item.degree || '',
          field_of_study: item.field_of_study || '',
          start_date: item.start_date || '',
          end_date: item.end_date || '',
          grade: item.grade || '',
          description: item.description || '',
          is_current: item.is_current || false
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
        console.error('Add education failed:', action.payload);
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
        console.error('Update education failed:', action.payload);
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