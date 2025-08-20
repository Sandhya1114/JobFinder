import React from 'react';
import './JobDetailModal.css'; // Create a CSS file for styling

const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{job.title || 'No Title'}</h2>
        <p><strong>Company:</strong> {job.companies?.name || job.company?.name || 'Company not specified'}</p>
        <p><strong>Location:</strong> {job.location || 'Location not specified'}</p>
        <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
        <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
        <p><strong>Description:</strong> {job.description || 'No description available'}</p>
        {job.requirements?.length > 0 && (
          <div className="job-requirements">
            <h4>Requirements:</h4>
            <ul>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailModal;
