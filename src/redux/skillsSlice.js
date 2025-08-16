import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks for skills operations
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.fetchSkills(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSkill = createAsyncThunk(
  'skills/addSkill',
  async (skillData, { rejectWithValue }) => {
    try {
      const data = await api.addSkill(skillData);
      return data.skill;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ id, skillData }, { rejectWithValue }) => {
    try {
      const data = await api.updateSkill(id, skillData);
      return data.skill;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteSkill(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Skills slice
const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    categories: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks', 'Other'],
    proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    loading: false,
    saving: false,
    error: null,
    message: '',
    filters: {
      category: ''
    },
    editingItem: null,
    showForm: false,
    formData: {
      skill_name: '',
      category: 'Technical',
      proficiency_level: 'Intermediate',
      years_of_experience: 1,
      is_verified: false
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
      if (!action.payload) {
        state.editingItem = null;
        state.formData = {
          skill_name: '',
          category: 'Technical',
          proficiency_level: 'Intermediate',
          years_of_experience: 1,
          is_verified: false
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
    },
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetForm: (state) => {
      state.formData = {
        skill_name: '',
        category: 'Technical',
        proficiency_level: 'Intermediate',
        years_of_experience: 1,
        is_verified: false
      };
      state.editingItem = null;
      state.showForm = false;
    },
    addCustomCategory: (state, action) => {
      const newCategory = action.payload;
      if (!state.categories.includes(newCategory)) {
        state.categories.push(newCategory);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.skills || [];
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add skill
      .addCase(addSkill.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.message = 'Skill added successfully!';
        state.showForm = false;
        state.formData = {
          skill_name: '',
          category: 'Technical',
          proficiency_level: 'Intermediate',
          years_of_experience: 1,
          is_verified: false
        };
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Update skill
      .addCase(updateSkill.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.saving = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        state.message = 'Skill updated successfully!';
        state.showForm = false;
        state.editingItem = null;
        state.formData = {
          skill_name: '',
          category: 'Technical',
          proficiency_level: 'Intermediate',
          years_of_experience: 1,
          is_verified: false
        };
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Delete skill
      .addCase(deleteSkill.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.saving = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        state.message = 'Skill deleted successfully!';
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setFilters,
  setShowForm, 
  setEditingItem, 
  updateFormData, 
  clearMessage, 
  clearError, 
  resetForm,
  addCustomCategory
} = skillsSlice.actions;

export default skillsSlice.reducer;