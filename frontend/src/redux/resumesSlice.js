import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

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

// NEW: Handle file upload by converting to URL and adding to database
export const uploadResumeFile = createAsyncThunk(
  'resumes/uploadResumeFile',
  async ({ file, title }, { rejectWithValue, dispatch }) => {
    try {
      // Option A: Upload to a cloud service (recommended)
      // For now, we'll simulate this by creating a temporary URL
      // In production, you'd upload to AWS S3, Cloudinary, etc.
      
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Create resume data
      const resumeData = {
        title: title || `Uploaded ${file.name}`,
        file_url: fileUrl, // In production, this would be the cloud URL
        file_name: file.name,
        file_size: file.size,
        content: `Uploaded file: ${file.name}`,
        is_primary: false
      };

      // Add to database using existing API
      const result = await dispatch(addResume(resumeData));
      return result.payload;
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
      
      // Upload resume file
      .addCase(uploadResumeFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 50; // Simulate progress
      })
      .addCase(uploadResumeFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.message = 'Resume uploaded successfully!';
        
        // The resume is already added via the addResume action
      })
      .addCase(uploadResumeFile.rejected, (state, action) => {
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