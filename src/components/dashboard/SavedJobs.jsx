// components/SavedJobs.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyToJob } from '../../redux/dashboardSlice.js';
import { unsaveJob } from '../../redux/savedJobsSlice.js';
import './SavedJobs.css';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.savedJobs?.savedJobs || []);

  const handleApply = (jobId) => {
    dispatch(applyToJob(jobId));
  };

  const handleRemove = (jobId) => {
    dispatch(unsaveJob(jobId));
  };

  return (
    <div className='saved-jobs'>
      <h2>Saved Jobs</h2>
      <div className='job-cards-saved'>
        {savedJobs.length === 0 ? (
          <p>No saved jobs available.</p>
        ) : (
          savedJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div>
                <strong>{job.title}</strong>
                <p>{job.company.name} – {job.location}</p>
              </div>
              <div className="job-actions">
                <button onClick={() => handleApply(job.id)} className="apply-btn">
                  Apply
                </button>
                <button onClick={() => handleRemove(job.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
