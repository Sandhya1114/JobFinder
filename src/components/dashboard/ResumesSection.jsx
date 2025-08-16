// ResumesSection.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchResumes,
  addResume,
  deleteResume,
  uploadResume,
  setShowUploadForm,
  updateFormData,
  setPrimaryResume,
  clearMessage,
  clearError,
  resetForm
} from '../../redux/resumesSlice';

const ResumesSection = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { 
    items, 
    loading, 
    uploading, 
    deleting, 
    error, 
    message,
    uploadProgress,
    showUploadForm,
    formData
  } = useSelector(state => state.resumes);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleUploadClick = () => {
    dispatch(resetForm());
    dispatch(setShowUploadForm(true));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF or Word document.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('resume', file);
      
      dispatch(uploadResume(formData));
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    dispatch(addResume(formData));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      dispatch(deleteResume(id));
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const handleSetPrimary = (id) => {
    dispatch(setPrimaryResume(id));
    // You might want to update this on the server too
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      default:
        return 'fas fa-file-alt';
    }
  };

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="resumes-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-file-alt"></i>
          Resumes ({items.length})
        </h2>
        <div className="header-actions">
          <button className="add-btn secondary" onClick={handleFileSelect}>
            <i className="fas fa-upload"></i>
            Quick Upload
          </button>
          <button className="add-btn" onClick={handleUploadClick}>
            <i className="fas fa-plus"></i>
            Add Resume
          </button>
        </div>
      </div>

      {/* Hidden file input for quick upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

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

      {/* Upload Progress */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-info">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Uploading resume... {uploadProgress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Resume Upload Form */}
      {showUploadForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>
              <i className="fas fa-plus"></i>
              Add New Resume
            </h3>
            <button className="modal-close" onClick={handleCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleManualAdd} className="resume-form">
            <div className="form-group">
              <label htmlFor="title">
                <i className="fas fa-tag"></i>
                Resume Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g., Software Engineer Resume 2024"
                required
              />
              <small className="form-hint">
                Give your resume a descriptive name to easily identify it
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="file_url">
                <i className="fas fa-link"></i>
                Resume URL *
              </label>
              <input
                type="url"
                id="file_url"
                value={formData.file_url}
                onChange={(e) => handleFieldChange('file_url', e.target.value)}
                placeholder="https://example.com/your-resume.pdf"
                required
              />
              <small className="form-hint">
                Link to your resume hosted on Google Drive, Dropbox, or your website
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="file_name">
                <i className="fas fa-file"></i>
                File Name
              </label>
              <input
                type="text"
                id="file_name"
                value={formData.file_name}
                onChange={(e) => handleFieldChange('file_name', e.target.value)}
                placeholder="resume.pdf"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">
                <i className="fas fa-align-left"></i>
                Description (Optional)
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                placeholder="Brief description of this resume version..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={formData.is_primary}
                  onChange={(e) => handleFieldChange('is_primary', e.target.checked)}
                />
                <label htmlFor="is_primary">
                  <i className="fas fa-star"></i>
                  Set as primary resume
                </label>
              </div>
              <small className="form-hint">
                Your primary resume will be used as the default for job applications
              </small>
            </div>

            <div className="form-actions">
              <button type="button" className="save-btn secondary" onClick={handleCancel}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" className="save-btn primary" disabled={uploading}>
                <i className="fas fa-save"></i>
                {uploading ? 'Adding...' : 'Add Resume'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resumes List */}
      {items.length === 0 && !showUploadForm ? (
        <div className="empty-state">
          <i className="fas fa-file-alt"></i>
          <h3>No Resumes Added</h3>
          <p>Upload or add links to your resumes to apply for jobs more efficiently.</p>
          <div className="empty-actions">
            <button className="add-btn" onClick={handleFileSelect}>
              <i className="fas fa-upload"></i>
              Upload Resume
            </button>
            <button className="add-btn secondary" onClick={handleUploadClick}>
              <i className="fas fa-link"></i>
              Add Resume Link
            </button>
          </div>
        </div>
      ) : (
        <div className="resumes-grid">
          {items.map(resume => (
            <div key={resume.id} className="resume-card">
              <div className="resume-header">
                <div className="resume-icon">
                  <i className={getFileIcon(resume.file_name)}></i>
                </div>
                <div className="resume-info">
                  <h3 className="resume-title">
                    {resume.title}
                    {resume.is_primary && (
                      <span className="primary-badge">
                        <i className="fas fa-star"></i>
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="resume-filename">{resume.file_name}</p>
                </div>
                <div className="resume-actions">
                  <button
                    onClick={() => window.open(resume.file_url, '_blank')}
                    title="View Resume"
                    className="view-btn"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="delete"
                    title="Delete Resume"
                    disabled={deleting}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="resume-meta">
                <span>
                  <i className="fas fa-calendar"></i>
                  Added {new Date(resume.created_at).toLocaleDateString()}
                </span>
                {resume.file_size && (
                  <span>
                    <i className="fas fa-file"></i>
                    {formatFileSize(resume.file_size)}
                  </span>
                )}
              </div>

              {resume.content && (
                <div className="resume-description">
                  {resume.content}
                </div>
              )}

              <div className="resume-footer">
                {!resume.is_primary && (
                  <button
                    className="set-primary-btn"
                    onClick={() => handleSetPrimary(resume.id)}
                  >
                    <i className="fas fa-star"></i>
                    Set as Primary
                  </button>
                )}
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  <i className="fas fa-download"></i>
                  Open Resume
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesSection;