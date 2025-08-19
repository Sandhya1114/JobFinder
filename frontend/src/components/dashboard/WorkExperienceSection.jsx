// WorkExperienceSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWorkExperience,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  setShowForm,
  setEditingItem,
  updateFormData,
  clearMessage,
  clearError,
  resetForm
} from '../../redux/workExperienceSlice';

const WorkExperienceSection = () => {
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
  } = useSelector(state => state.workExperience);

  useEffect(() => {
    dispatch(fetchWorkExperience());
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
    if (confirm('Are you sure you want to delete this work experience?')) {
      dispatch(deleteWorkExperience(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateWorkExperience({ id: editingItem.id, experienceData: formData }));
    } else {
      dispatch(addWorkExperience(formData));
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 1) return '1 month';
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading work experience...</p>
      </div>
    );
  }

  return (
    <div className="work-experience-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-briefcase"></i>
          Work Experience ({items.length})
        </h2>
        <button className="add-btn" onClick={handleAdd}>
          <i className="fas fa-plus"></i>
          Add Experience
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

      {/* Work Experience Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>
              <i className="fas fa-plus"></i>
              {editingItem ? 'Edit Work Experience' : 'Add Work Experience'}
            </h3>
            <button className="modal-close" onClick={handleCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="work-experience-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="job_title">
                  <i className="fas fa-user-tie"></i>
                  Job Title *
                </label>
                <input
                  type="text"
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => handleFieldChange('job_title', e.target.value)}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">
                  <i className="fas fa-building"></i>
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  placeholder="e.g., Google Inc."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <i className="fas fa-map-marker-alt"></i>
                Location *
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
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
                  <label htmlFor="is_current">I currently work here</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <i className="fas fa-align-left"></i>
                Job Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe your role, responsibilities, and key contributions..."
                rows="4"
                required
              />
              <small className="form-hint">
                Focus on your key responsibilities and what you accomplished in this role
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="achievements">
                <i className="fas fa-trophy"></i>
                Key Achievements (Optional)
              </label>
              <textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleFieldChange('achievements', e.target.value)}
                placeholder="• Increased sales by 30%&#10;• Led a team of 5 developers&#10;• Implemented new system that reduced costs by $50K"
                rows="3"
              />
              <small className="form-hint">
                List your major accomplishments, quantify results where possible
              </small>
            </div>

            <div className="form-actions">
              <button type="button" className="save-btn secondary" onClick={handleCancel}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" className="save-btn primary" disabled={saving}>
                <i className="fas fa-save"></i>
                {saving ? 'Saving...' : (editingItem ? 'Update Experience' : 'Add Experience')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Work Experience List */}
      {items.length === 0 && !showForm ? (
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <h3>No Work Experience Added</h3>
          <p>Add your professional work experience to showcase your career journey.</p>
          <button className="add-btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="experience-timeline">
          {items.map((experience, index) => (
            <div key={experience.id} className="timeline-item">
              <div className="timeline-marker">
                <i className="fas fa-briefcase"></i>
              </div>
              
              <div className="timeline-content">
                <div className="experience-card">
                  <div className="experience-header">
                    <div className="experience-info">
                      <h3 className="job-title">{experience.job_title}</h3>
                      <p className="company-name">
                        <i className="fas fa-building"></i>
                        {experience.company}
                      </p>
                    </div>
                    <div className="experience-actions">
                      <button
                        onClick={() => handleEdit(experience)}
                        title="Edit Experience"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        className="delete"
                        title="Delete Experience"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="experience-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>
                        {new Date(experience.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        })} - {
                          experience.is_current ? 'Present' : 
                          new Date(experience.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })
                        }
                      </span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-clock"></i>
                      <span>
                        {calculateDuration(
                          experience.start_date, 
                          experience.end_date, 
                          experience.is_current
                        )}
                      </span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{experience.location}</span>
                    </div>
                    {experience.is_current && (
                      <div className="current-badge">
                        <i className="fas fa-circle"></i>
                        Current Position
                      </div>
                    )}
                  </div>

                  <div className="experience-description">
                    <h4>
                      <i className="fas fa-tasks"></i>
                      Responsibilities
                    </h4>
                    <p>{experience.description}</p>
                  </div>

                  {experience.achievements && (
                    <div className="experience-achievements">
                      <h4>
                        <i className="fas fa-trophy"></i>
                        Key Achievements
                      </h4>
                      <div className="achievements-list">
                        {experience.achievements.split('\n').filter(line => line.trim()).map((achievement, idx) => (
                          <div key={idx} className="achievement-item">
                            <i className="fas fa-check-circle"></i>
                            <span>{achievement.replace(/^[•\-\*]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkExperienceSection;