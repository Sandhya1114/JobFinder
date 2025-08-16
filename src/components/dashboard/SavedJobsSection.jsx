// SavedJobsSection.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSavedJobs,
  updateSavedJob,
  removeSavedJob,
  setFilters,
  clearMessage,
  clearError
} from '../../redux/savedJobsSlice';

const SavedJobsSection = () => {
  const dispatch = useDispatch();
  const { 
    jobs, 
    pagination, 
    filters, 
    loading, 
    saving, 
    error, 
    message 
  } = useSelector(state => state.savedJobs);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    application_status: 'saved',
    notes: '',
    priority: 0
  });

  useEffect(() => {
    dispatch(fetchSavedJobs(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'offer', label: 'Offer Received' }
  ];

  const priorityLevels = [
    { value: 0, label: 'Normal', color: '#718096' },
    { value: 1, label: 'High', color: '#d69e2e' },
    { value: 2, label: 'Urgent', color: '#e53e3e' }
  ];

  const handleStatusFilter = (status) => {
    dispatch(setFilters({ ...filters, status, page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }));
  };

  const handleUpdateJob = (job) => {
    setSelectedJob(job);
    setUpdateData({
      application_status: job.application_status || 'saved',
      notes: job.notes || '',
      priority: job.priority || 0
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = () => {
    if (selectedJob) {
      dispatch(updateSavedJob({ 
        id: selectedJob.id, 
        updateData 
      })).then(() => {
        setShowUpdateModal(false);
        setSelectedJob(null);
      });
    }
  };

  const handleRemoveJob = (id) => {
    if (confirm('Are you sure you want to remove this job from your saved list?')) {
      dispatch(removeSavedJob(id));
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      saved: { icon: 'fas fa-bookmark', color: '#3182ce', label: 'Saved' },
      applied: { icon: 'fas fa-paper-plane', color: '#38a169', label: 'Applied' },
      interviewing: { icon: 'fas fa-users', color: '#d69e2e', label: 'Interviewing' },
      rejected: { icon: 'fas fa-times-circle', color: '#e53e3e', label: 'Rejected' },
      offer: { icon: 'fas fa-trophy', color: '#9f7aea', label: 'Offer Received' }
    };
    
    const statusInfo = statusMap[status] || statusMap.saved;
    
    return (
      <span 
        className="status-badge" 
        style={{ color: statusInfo.color, backgroundColor: `${statusInfo.color}20` }}
      >
        <i className={statusInfo.icon}></i>
        {statusInfo.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityInfo = priorityLevels.find(p => p.value === priority) || priorityLevels[0];
    
    if (priority === 0) return null;
    
    return (
      <span 
        className="priority-badge" 
        style={{ color: priorityInfo.color, backgroundColor: `${priorityInfo.color}20` }}
      >
        <i className="fas fa-flag"></i>
        {priorityInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="section-loading">
        <div className="spinner"></div>
        <p>Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-bookmark"></i>
          Saved Jobs ({pagination.totalJobs})
        </h2>
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
          <label>Filter by Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-stats">
          <span>
            Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalJobs} jobs
          </span>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-bookmark"></i>
          <h3>No Saved Jobs</h3>
          <p>You haven't saved any jobs yet. Start browsing and save interesting positions!</p>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {jobs.map(savedJob => (
              <div key={savedJob.id} className="item-card job-card">
                <div className="item-header">
                  <div className="job-info">
                    <h3 className="item-title">{savedJob.jobs?.title}</h3>
                    <p className="item-subtitle">
                      <i className="fas fa-building"></i>
                      {savedJob.jobs?.companies?.name}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleUpdateJob(savedJob)}
                      title="Update Status"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleRemoveJob(savedJob.id)}
                      className="delete"
                      title="Remove Job"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="job-details">
                  <div className="job-badges">
                    {getStatusBadge(savedJob.application_status)}
                    {getPriorityBadge(savedJob.priority)}
                  </div>

                  <div className="item-meta">
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {savedJob.jobs?.location}
                    </span>
                    <span>
                      <i className="fas fa-clock"></i>
                      Saved {new Date(savedJob.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      <i className="fas fa-tag"></i>
                      {savedJob.jobs?.categories?.name}
                    </span>
                  </div>

                  {savedJob.notes && (
                    <div className="job-notes">
                      <strong>Notes:</strong> {savedJob.notes}
                    </div>
                  )}

                  <div className="job-actions">
                    <a 
                      href={`/jobs/${savedJob.jobs?.id}`}
                      className="view-job-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      View Job
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Update Job Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <i className="fas fa-edit"></i>
                Update Job Status
              </h3>
              <button 
                className="modal-close" 
                onClick={() => setShowUpdateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Application Status</label>
                <select
                  value={updateData.application_status}
                  onChange={(e) => setUpdateData({
                    ...updateData,
                    application_status: e.target.value
                  })}
                >
                  {statusOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData({
                    ...updateData,
                    priority: parseInt(e.target.value)
                  })}
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({
                    ...updateData,
                    notes: e.target.value
                  })}
                  placeholder="Add notes about this job application..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  className="save-btn secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="save-btn primary"
                  onClick={handleSaveUpdate}
                  disabled={saving}
                >
                  <i className="fas fa-save"></i>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobsSection;