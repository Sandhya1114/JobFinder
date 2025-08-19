// // SkillsSection.jsx
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   fetchSkills,
//   addSkill,
//   updateSkill,
//   deleteSkill,
//   setFilters,
//   setShowForm,
//   setEditingItem,
//   updateFormData,
//   clearMessage,
//   clearError,
//   resetForm,
//   addCustomCategory
// } from '../../redux/skillsSlice';

// const SkillsSection = () => {
//   const dispatch = useDispatch();
//   const { 
//     items, 
//     categories,
//     proficiencyLevels,
//     loading, 
//     saving, 
//     error, 
//     message,
//     filters,
//     editingItem,
//     showForm,
//     formData
//   } = useSelector(state => state.skills);

//   useEffect(() => {
//     dispatch(fetchSkills(filters));
//   }, [dispatch, filters]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         dispatch(clearMessage());
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message, dispatch]);

//   const handleAdd = () => {
//     dispatch(resetForm());
//     dispatch(setShowForm(true));
//   };

//   const handleEdit = (item) => {
//     dispatch(setEditingItem(item));
//   };

//   const handleDelete = (id) => {
//     if (confirm('Are you sure you want to delete this skill?')) {
//       dispatch(deleteSkill(id));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingItem) {
//       dispatch(updateSkill({ id: editingItem.id, skillData: formData }));
//     } else {
//       dispatch(addSkill(formData));
//     }
//   };

//   const handleFieldChange = (field, value) => {
//     dispatch(updateFormData({ field, value }));
//   };

//   const handleCancel = () => {
//     dispatch(resetForm());
//   };

//   const handleCategoryFilter = (category) => {
//     dispatch(setFilters({ category }));
//   };

//   const getProficiencyColor = (level) => {
//     const colorMap = {
//       'Beginner': '#e53e3e',
//       'Intermediate': '#d69e2e',
//       'Advanced': '#38a169',
//       'Expert': '#9f7aea'
//     };
//     return colorMap[level] || '#718096';
//   };

//   const getProficiencyWidth = (level) => {
//     const widthMap = {
//       'Beginner': '25%',
//       'Intermediate': '50%',
//       'Advanced': '75%',
//       'Expert': '100%'
//     };
//     return widthMap[level] || '0%';
//   };

//   const filteredItems = filters.category 
//     ? items.filter(item => item.category === filters.category)
//     : items;

//   const groupedSkills = filteredItems.reduce((acc, skill) => {
//     const category = skill.category || 'Other';
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(skill);
//     return acc;
//   }, {});

//   if (loading) {
//     return (
//       <div className="section-loading">
//         <div className="spinner"></div>
//         <p>Loading skills...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="skills-section">
//       <div className="section-header">
//         <h2>
//           <i className="fas fa-tools"></i>
//           Skills ({items.length})
//         </h2>
//         <button className="add-btn" onClick={handleAdd}>
//           <i className="fas fa-plus"></i>
//           Add Skill
//         </button>
//       </div>

//       {message && (
//         <div className="message success">
//           <i className="fas fa-check-circle"></i>
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="message error">
//           <i className="fas fa-exclamation-triangle"></i>
//           {error}
//           <button onClick={() => dispatch(clearError())}>
//             <i className="fas fa-times"></i>
//           </button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="filters-bar">
//         <div className="filter-group">
//           <label>Filter by Category:</label>
//           <select 
//             value={filters.category} 
//             onChange={(e) => handleCategoryFilter(e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {categories.map(category => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="filter-stats">
//           <span>{filteredItems.length} skills displayed</span>
//         </div>
//       </div>

//       {/* Skills Form */}
//       {showForm && (
//         <div className="form-container">
//           <div className="form-header">
//             <h3>
//               <i className="fas fa-plus"></i>
//               {editingItem ? 'Edit Skill' : 'Add Skill'}
//             </h3>
//             <button className="modal-close" onClick={handleCancel}>
//               <i className="fas fa-times"></i>
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="skills-form">
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="skill_name">
//                   <i className="fas fa-tag"></i>
//                   Skill Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="skill_name"
//                   value={formData.skill_name}
//                   onChange={(e) => handleFieldChange('skill_name', e.target.value)}
//                   placeholder="e.g., JavaScript, Project Management"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="category">
//                   <i className="fas fa-folder"></i>
//                   Category *
//                 </label>
//                 <select
//                   id="category"
//                   value={formData.category}
//                   onChange={(e) => handleFieldChange('category', e.target.value)}
//                   required
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="proficiency_level">
//                   <i className="fas fa-chart-line"></i>
//                   Proficiency Level 
//                 </label>
//                 <select
//                   id="proficiency_level"
//                   value={formData.proficiency_level}
//                   onChange={(e) => handleFieldChange('proficiency_level', e.target.value)}
//                   // required
//                 >
//                   {proficiencyLevels.map(level => (
//                     <option key={level} value={level}>
//                       {level}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="years_of_experience">
//                   <i className="fas fa-clock"></i>
//                   Years of Experience 
//                 </label>
//                 <input
//                   type="number"
//                   id="years_of_experience"
//                   value={formData.years_of_experience}
//                   onChange={(e) => handleFieldChange('years_of_experience', parseInt(e.target.value))}
//                   min="0"
//                   max="50"
//                   // required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <div className="checkbox-group">
//                 <input
//                   type="checkbox"
//                   id="is_verified"
//                   checked={formData.is_verified}
//                   onChange={(e) => handleFieldChange('is_verified', e.target.checked)}
//                 />
//                 <label htmlFor="is_verified">
//                   <i className="fas fa-certificate"></i>
//                   Verified/Certified Skill
//                 </label>
//               </div>
//               <small className="form-hint">
//                 Check this if you have a certification or formal verification for this skill
//               </small>
//             </div>

//             <div className="form-actions">
//               <button type="button" className="save-btn secondary" onClick={handleCancel}>
//                 <i className="fas fa-times"></i>
//                 Cancel
//               </button>
//               <button type="submit" className="save-btn primary" disabled={saving}>
//                 <i className="fas fa-save"></i>
//                 {saving ? 'Saving...' : (editingItem ? 'Update Skill' : 'Add Skill')}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Skills Display */}
//       {items.length === 0 && !showForm ? (
//         <div className="empty-state">
//           <i className="fas fa-tools"></i>
//           <h3>No Skills Added</h3>
//           <p>Add your technical and professional skills to showcase your expertise.</p>
//           <button className="add-btn" onClick={handleAdd}>
//             <i className="fas fa-plus"></i>
//             Add Your First Skill
//           </button>
//         </div>
//       ) : (
//         <div className="skills-display">
//           {Object.entries(groupedSkills).map(([category, categorySkills]) => (
//             <div key={category} className="skills-category">
//               <h3 className="category-title">
//                 <i className="fas fa-folder"></i>
//                 {category} ({categorySkills.length})
//               </h3>
              
//               <div className="skills-grid">
//                 {categorySkills.map(skill => (
//                   <div key={skill.id} className="skill-card">
//                     <div className="skill-header">
//                       <div className="skill-info">
//                         <h4 className="skill-name">
//                           {skill.skill_name}
//                           {skill.is_verified && (
//                             <span className="verified-badge" title="Verified/Certified">
//                               <i className="fas fa-certificate"></i>
//                             </span>
//                           )}
//                         </h4>
//                         <div className="skill-meta">
//                           <span className="experience-badge">
//                             <i className="fas fa-clock"></i>
//                             {skill.years_of_experience} year{skill.years_of_experience !== 1 ? 's' : ''}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="skill-actions">
//                         <button
//                           onClick={() => handleEdit(skill)}
//                           title="Edit Skill"
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                         <button
//                           onClick={() => handleDelete(skill.id)}
//                           className="delete"
//                           title="Delete Skill"
//                         >
//                           <i className="fas fa-trash"></i>
//                         </button>
//                       </div>
//                     </div>

//                     <div className="skill-proficiency">
//                       <div className="proficiency-label">
//                         <span>{skill.proficiency_level}</span>
//                       </div>
//                       <div className="proficiency-bar">
//                         <div 
//                           className="proficiency-fill"
//                           style={{
//                             width: getProficiencyWidth(skill.proficiency_level),
//                             backgroundColor: getProficiencyColor(skill.proficiency_level)
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkillsSection;
// SkillsSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  setFilters,
  setShowForm,
  setEditingItem,
  updateFormData,
  clearMessage,
  clearError,
  resetForm,
  addCustomCategory
} from '../../redux/skillsSlice';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const { 
    items, 
    categories,
    proficiencyLevels,
    loading, 
    saving, 
    error, 
    message,
    filters,
    editingItem,
    showForm,
    formData
  } = useSelector(state => state.skills);

  useEffect(() => {
    dispatch(fetchSkills(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleAdd = () => {
    dispatch(resetForm());
    dispatch(setShowForm(true));
  };

  const handleEdit = (item) => {
    dispatch(setEditingItem(item));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      dispatch(deleteSkill(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateSkill({ id: editingItem.id, skillData: formData }));
    } else {
      dispatch(addSkill(formData));
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category }));
  };

  const getProficiencyColor = (level) => {
    const colorMap = {
      'Beginner': '#e53e3e',
      'Intermediate': '#d69e2e',
      'Advanced': '#38a169',
      'Expert': '#9f7aea'
    };
    return colorMap[level] || '#718096';
  };

  const getProficiencyWidth = (level) => {
    const widthMap = {
      'Beginner': '25%',
      'Intermediate': '50%',
      'Advanced': '75%',
      'Expert': '100%'
    };
    return widthMap[level] || '0%';
  };

  // Helper function to check if a value exists and is not empty
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '' && value !== 0;
  };

  const filteredItems = filters.category 
    ? items.filter(item => item.category === filters.category)
    : items;

  const groupedSkills = filteredItems.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="skills-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-tools"></i>
          Skills ({items.length})
        </h2>
        <button className="add-btn" onClick={handleAdd}>
          <i className="fas fa-plus"></i>
          Add Skill
        </button>
      </div>

      {message && (
        <div className="message success">
          <i className="fas fa-check-circle"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="message error">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={() => dispatch(clearError())}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-stats">
          <span>{filteredItems.length} skills displayed</span>
        </div>
      </div>

      {/* Skills Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>
              <i className="fas fa-plus"></i>
              {editingItem ? 'Edit Skill' : 'Add Skill'}
            </h3>
            <button className="modal-close" onClick={handleCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="skills-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="skill_name">
                  <i className="fas fa-tag"></i>
                  Skill Name *
                </label>
                <input
                  type="text"
                  id="skill_name"
                  value={formData.skill_name}
                  onChange={(e) => handleFieldChange('skill_name', e.target.value)}
                  placeholder="e.g., JavaScript, Project Management"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">
                  <i className="fas fa-folder"></i>
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proficiency_level">
                  <i className="fas fa-chart-line"></i>
                  Proficiency Level 
                </label>
                <select
                  id="proficiency_level"
                  value={formData.proficiency_level}
                  onChange={(e) => handleFieldChange('proficiency_level', e.target.value)}
                  // required
                >
                  <option value="">Select proficiency (optional)</option>
                  {proficiencyLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="years_of_experience">
                  <i className="fas fa-clock"></i>
                  Years of Experience 
                </label>
                <input
                  type="number"
                  id="years_of_experience"
                  value={formData.years_of_experience || ''}
                  onChange={(e) => handleFieldChange('years_of_experience', e.target.value ? parseInt(e.target.value) : '')}
                  min="0"
                  max="50"
                  placeholder="Optional"
                  // required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={formData.is_verified}
                  onChange={(e) => handleFieldChange('is_verified', e.target.checked)}
                />
                <label htmlFor="is_verified">
                  <i className="fas fa-certificate"></i>
                  Verified/Certified Skill
                </label>
              </div>
              <small className="form-hint">
                Check this if you have a certification or formal verification for this skill
              </small>
            </div>

            <div className="form-actions">
              <button type="button" className="save-btn secondary" onClick={handleCancel}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" className="save-btn primary" disabled={saving}>
                <i className="fas fa-save"></i>
                {saving ? 'Saving...' : (editingItem ? 'Update Skill' : 'Add Skill')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills Display */}
      {items.length === 0 && !showForm ? (
        <div className="empty-state">
          <i className="fas fa-tools"></i>
          <h3>No Skills Added</h3>
          <p>Add your technical and professional skills to showcase your expertise.</p>
          <button className="add-btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="skills-display">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="skills-category">
              <h3 className="category-title">
                <i className="fas fa-folder"></i>
                {category} ({categorySkills.length})
              </h3>
              
              <div className="skills-grid">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="skill-card">
                    <div className="skill-header">
                      <div className="skill-info">
                        <h4 className="skill-name">
                          {skill.skill_name}
                          {skill.is_verified && (
                            <span className="verified-badge" title="Verified/Certified">
                              <i className="fas fa-certificate"></i>
                            </span>
                          )}
                        </h4>
                        {/* Only show experience if it exists and is greater than 0 */}
                        {hasValue(skill.years_of_experience) && (
                          <div className="skill-meta">
                            <span className="experience-badge">
                              <i className="fas fa-clock"></i>
                              {skill.years_of_experience} year{skill.years_of_experience !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="skill-actions">
                        <button
                          onClick={() => handleEdit(skill)}
                          title="Edit Skill"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="delete"
                          title="Delete Skill"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Only show proficiency section if proficiency_level exists */}
                    {hasValue(skill.proficiency_level) && (
                      <div className="skill-proficiency">
                        <div className="proficiency-label">
                          <span>{skill.proficiency_level}</span>
                        </div>
                        <div className="proficiency-bar">
                          <div 
                            className="proficiency-fill"
                            style={{
                              width: getProficiencyWidth(skill.proficiency_level),
                              backgroundColor: getProficiencyColor(skill.proficiency_level)
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;