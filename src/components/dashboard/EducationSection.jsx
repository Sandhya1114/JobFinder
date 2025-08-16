// EducationSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  setShowForm,
  setEditingItem,
  updateFormData,
  clearMessage,
  clearError,
  resetForm
} from '../../redux/educationSlice';

const EducationSection = () => {
  const dispatch = useDispatch();
  const { 
    items, 
    loading, 
    saving, 
    error, 
    message,
    editingItem,
    showForm,
    formData
  } = useSelector(state => state.education);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

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
    if (confirm('Are you sure you want to delete this education entry?')) {
      dispatch(deleteEducation(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateEducation({ id: editingItem.id, educationData: formData }));
    } else {
      dispatch(addEducation(formData));
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const degreeOptions = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Certificate',
    'Diploma',
    'Other'
  ];

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading education...</p>
      </div>
    );
  }

  return (
    <div className="education-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-graduation-cap"></i>
          Education ({items.length})
        </h2>
        <button className="add-btn" onClick={handleAdd}>
          <i className="fas fa-plus"></i>
          Add Education
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

      {/* Education Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>
              <i className="fas fa-plus"></i>
              {editingItem ? 'Edit Education' : 'Add Education'}
            </h3>
            <button className="modal-close" onClick={handleCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="education-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="institution">
                  <i className="fas fa-university"></i>
                  Institution Name *
                </label>
                <input
                  type="text"
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleFieldChange('institution', e.target.value)}
                  placeholder="e.g., Harvard University"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="degree">
                  <i className="fas fa-graduation-cap"></i>
                  Degree *
                </label>
                <select
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => handleFieldChange('degree', e.target.value)}
                  required
                >
                  <option value="">Select Degree</option>
                  {degreeOptions.map(degree => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="field_of_study">
                <i className="fas fa-book"></i>
                Field of Study *
              </label>
              <input
                type="text"
                id="field_of_study"
                value={formData.field_of_study}
                onChange={(e) => handleFieldChange('field_of_study', e.target.value)}
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">
                  <i className="fas fa-calendar-alt"></i>
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => handleFieldChange('start_date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">
                  <i className="fas fa-calendar-check"></i>
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={(e) => handleFieldChange('end_date', e.target.value)}
                  disabled={formData.is_current}
                />
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={(e) => handleFieldChange('is_current', e.target.checked)}
                  />
                  <label htmlFor="is_current">Currently studying here</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="grade">
                <i className="fas fa-award"></i>
                Grade/GPA (Optional)
              </label>
              <input
                type="text"
                id="grade"
                value={formData.grade}
                onChange={(e) => handleFieldChange('grade', e.target.value)}
                placeholder="e.g., 3.8 GPA, First Class, A+"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <i className="fas fa-align-left"></i>
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe relevant coursework, achievements, activities, or projects..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="save-btn secondary" onClick={handleCancel}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" className="save-btn primary" disabled={saving}>
                <i className="fas fa-save"></i>
                {saving ? 'Saving...' : (editingItem ? 'Update Education' : 'Add Education')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      {items.length === 0 && !showForm ? (
        <div className="empty-state">
          <i className="fas fa-graduation-cap"></i>
          <h3>No Education Added</h3>
          <p>Add your educational background to strengthen your profile.</p>
          <button className="add-btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Add Your First Education
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card education-card">
              <div className="item-header">
                <div className="education-info">
                  <h3 className="item-title">{item.degree}</h3>
                  <p className="item-subtitle">
                    <i className="fas fa-university"></i>
                    {item.institution}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    title="Edit Education"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete"
                    title="Delete Education"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="education-details">
                <div className="field-of-study">
                  <strong>{item.field_of_study}</strong>
                </div>

                <div className="item-meta">
                  <span>
                    <i className="fas fa-calendar"></i>
                    {new Date(item.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })} - {
                      item.is_current ? 'Present' : 
                      new Date(item.end_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })
                    }
                  </span>
                  {item.grade && (
                    <span>
                      <i className="fas fa-award"></i>
                      {item.grade}
                    </span>
                  )}
                  {item.is_current && (
                    <span className="current-badge">
                      <i className="fas fa-clock"></i>
                      Current
                    </span>
                  )}
                </div>

                {item.description && (
                  <div className="item-description">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;