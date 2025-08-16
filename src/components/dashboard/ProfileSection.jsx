// ProfileSection.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProfile, 
  updateProfile,
  setIsEditing,
  updateProfileField,
  updateSkills,
  clearMessage,
  clearError,
  resetProfile
} from '../../redux/profileSlice';

const ProfileSection = () => {
  const dispatch = useDispatch();
  const { 
    data, 
    loading, 
    saving, 
    error, 
    message, 
    isEditing 
  } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleEdit = () => {
    dispatch(setIsEditing(true));
  };

  const handleCancel = () => {
    dispatch(resetProfile());
    dispatch(fetchProfile()); // Reload original data
  };

  const handleSave = () => {
    dispatch(updateProfile(data));
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateProfileField({ field, value }));
  };

  const handleSkillsChange = (value) => {
    dispatch(updateSkills(value));
  };

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-user"></i>
          Profile Information
        </h2>
        {!isEditing ? (
          <button className="edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="edit-btn cancel" onClick={handleCancel}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button 
              className="save-btn primary" 
              onClick={handleSave}
              disabled={saving}
            >
              <i className="fas fa-save"></i>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
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

      {isEditing ? (
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={data.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={data.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={data.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">
                <i className="fas fa-map-marker-alt"></i>
                Location
              </label>
              <input
                type="text"
                id="location"
                value={data.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="City, State/Country"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="about">
              <i className="fas fa-align-left"></i>
              About Me
            </label>
            <textarea
              id="about"
              value={data.about || ''}
              onChange={(e) => handleFieldChange('about', e.target.value)}
              placeholder="Tell us about yourself, your career goals, and what makes you unique..."
              rows="4"
            />
            <small className="form-hint">
              Write a brief summary about your professional background and career objectives
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              <i className="fas fa-tools"></i>
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              value={data.skills ? data.skills.join(', ') : ''}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
            />
            <small className="form-hint">
              List your technical and professional skills separated by commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="resume">
              <i className="fas fa-file-alt"></i>
              Resume URL
            </label>
            <input
              type="url"
              id="resume"
              value={data.resume || ''}
              onChange={(e) => handleFieldChange('resume', e.target.value)}
              placeholder="https://example.com/your-resume.pdf"
            />
            <small className="form-hint">
              Link to your online resume or portfolio
            </small>
          </div>
        </div>
      ) : (
        <div className="profile-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="preview-basic">
                <h4>{data.name || 'Your Name'}</h4>
                <p>
                  <i className="fas fa-envelope"></i>
                  {data.email || 'your.email@example.com'}
                </p>
                {data.phone && (
                  <p>
                    <i className="fas fa-phone"></i>
                    {data.phone}
                  </p>
                )}
                {data.location && (
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {data.location}
                  </p>
                )}
              </div>
            </div>

            {data.about && (
              <div className="preview-about">
                <h5>
                  <i className="fas fa-user-circle"></i>
                  About Me
                </h5>
                <p>{data.about}</p>
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div className="preview-skills">
                <h5>
                  <i className="fas fa-tools"></i>
                  Skills
                </h5>
                <div className="skills-tags">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.resume && (
              <div className="preview-resume">
                <h5>
                  <i className="fas fa-file-alt"></i>
                  Resume
                </h5>
                <a 
                  href={data.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  <i className="fas fa-external-link-alt"></i>
                  View Resume
                </a>
              </div>
            )}

            {(!data.about && (!data.skills || data.skills.length === 0) && !data.resume) && (
              <div className="empty-state">
                <i className="fas fa-info-circle"></i>
                <h3>Complete Your Profile</h3>
                <p>Add more information to make your profile stand out to employers.</p>
                <button className="edit-btn" onClick={handleEdit}>
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;