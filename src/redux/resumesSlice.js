import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
// import { api } from '../api';

// Async thunks for resumes operations
export const fetchResumes = createAsyncThunk(
  'resumes/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchResumes();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addResume = createAsyncThunk(
  'resumes/addResume',
  async (resumeData, { rejectWithValue }) => {
    try {
      const data = await api.addResume(resumeData);
      return data.resume;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resumes/deleteResume',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteResume(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadResume = createAsyncThunk(
  'resumes/uploadResume',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.uploadResume(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Resumes slice
const resumesSlice = createSlice({
  name: 'resumes',
  initialState: {
    items: [],
    loading: false,
    uploading: false,
    deleting: false,
    error: null,
    message: '',
    uploadProgress: 0,
    showUploadForm: false,
    formData: {
      title: '',
      file_url: '',
      file_name: '',
      content: '',
      is_primary: false
    }
  },
  reducers: {
    setShowUploadForm: (state, action) => {
      state.showUploadForm = action.payload;
      if (!action.payload) {
        state.formData = {
          title: '',
          file_url: '',
          file_name: '',
          content: '',
          is_primary: false
        };
        state.uploadProgress = 0;
      }
    },
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setPrimaryResume: (state, action) => {
      const resumeId = action.payload;
      // Set all resumes to not primary
      state.items.forEach(item => {
        item.is_primary = item.id === resumeId;
      });
    },
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetForm: (state) => {
      state.formData = {
        title: '',
        file_url: '',
        file_name: '',
        content: '',
        is_primary: false
      };
      state.showUploadForm = false;
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch resumes
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.resumes || [];
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add resume
      .addCase(addResume.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(addResume.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
        state.message = 'Resume added successfully!';
        state.showUploadForm = false;
        state.formData = {
          title: '',
          file_url: '',
          file_name: '',
          content: '',
          is_primary: false
        };
        state.uploadProgress = 0;
      })
      .addCase(addResume.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      
      // Delete resume
      .addCase(deleteResume.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        state.message = 'Resume deleted successfully!';
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      
      // Upload resume (legacy)
      .addCase(uploadResume.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.message = 'Resume uploaded successfully!';
        
        // Add uploaded resume to items if it has proper structure
        if (action.payload.filePath) {
          const newResume = {
            id: Date.now(), // Temporary ID
            title: 'Uploaded Resume',
            file_url: action.payload.filePath,
            file_name: action.payload.fileName || 'resume.pdf',
            is_primary: state.items.length === 0,
            created_at: new Date().toISOString()
          };
          state.items.unshift(newResume);
        }
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      });
  }
});

export const { 
  setShowUploadForm, 
  updateFormData, 
  setUploadProgress,
  setPrimaryResume,
  clearMessage, 
  clearError, 
  resetForm 
} = resumesSlice.actions;

export default resumesSlice.reducer;