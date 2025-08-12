// // // components/SavedJobs.jsx
// // import React from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { applyToJob } from '../../redux/dashboardSlice.js';
// // import { unsaveJob } from '../../redux/savedJobsSlice.js';
// // import './SavedJobs.css';

// // const SavedJobs = () => {
// //   const dispatch = useDispatch();
// //   const savedJobs = useSelector((state) => state.savedJobs?.savedJobs || []);

// //   const handleApply = (jobId) => {
// //     dispatch(applyToJob(jobId));
// //   };

// //   const handleRemove = (jobId) => {
// //     dispatch(unsaveJob(jobId));
// //   };

// //   return (
// //     <div className='saved-jobs'>
// //       <h2>Saved Jobs</h2>
// //       <div className='job-cards-saved'>
// //         {savedJobs.length === 0 ? (
// //           <p>No saved jobs available.</p>
// //         ) : (
// //           savedJobs.map((job) => (
// //             <div key={job.id} className="job-card">
// //               <div>
// //                 <strong>{job.title}</strong>
// //                 <p>{job.company.name} – {job.location}</p>
// //               </div>
// //               <div className="job-actions">
// //                 <button onClick={() => handleApply(job.id)} className="apply-btn">
// //                   Apply
// //                 </button>
// //                 <button onClick={() => handleRemove(job.id)} className="remove-btn">
// //                   Remove
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SavedJobs;
// // components/SavedJobs.jsx
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { applyToJob } from '../../redux/dashboardSlice.js';
// import { unsaveJob } from '../../redux/savedJobsSlice.js';
// import './SavedJobs.css';

// const SavedJobs = () => {
//   const dispatch = useDispatch();
//   const savedJobs = useSelector((state) => state.savedJobs?.savedJobs || []);

//   const handleApply = (jobId) => {
//     dispatch(applyToJob(jobId));
//   };

//   const handleRemove = (jobId) => {
//     dispatch(unsaveJob(jobId));
//   };

//   return (
//     <div className='saved-jobs'>
//       <h2>💼 Saved Jobs</h2>
//       <div className='job-cards-saved'>
//         {savedJobs.length === 0 ? (
//           <div className="no-jobs-message">
//             <p>📌 No saved jobs available yet.</p>
//             <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>
//               Save jobs from the job search page to see them here.
//             </p>
//           </div>
//         ) : (
//           savedJobs.map((job) => (
//             <div key={job.id} className="job-card">
//               {/* <div className="job-badge">Saved</div> */}
//               <div className="job-info">
//                 <h3 className="job-title">{job.title}</h3>
//                 <p className="job-company">{job.company.name}</p>
//                 <div className="job-location">
//                   <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span>{job.location}</span>
//                 </div>
//               </div>
//               <div className="job-actions">
//                 <button onClick={() => handleApply(job.id)} className="apply-btn">
//                   Apply Now
//                 </button>
//                 <button onClick={() => handleRemove(job.id)} className="remove-btn">
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default SavedJobs;
// components/SavedJobs.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  applyToJobAsync, 
  removeSavedJobAsync,
  addRecentActivity 
} from '../../redux/dashboardSlice';
import './SavedJobs.css';

const SavedJobs = ({ savedJobs = [], isLoading = false }) => {
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.dashboard);

  const handleApply = async (job) => {
    try {
      const result = await dispatch(applyToJobAsync(job.jobs.id)).unwrap();
      
      // Add to recent activity
      dispatch(addRecentActivity({
        action: 'Applied to job',
        details: `Applied to ${job.jobs.title} at ${job.jobs.companies?.name}`
      }));

      // Optional: Show success message
      alert(`Successfully applied to ${job.jobs.title}!`);
    } catch (error) {
      alert(`Failed to apply: ${error}`);
    }
  };

  const handleRemove = async (job) => {
    if (!window.confirm(`Remove "${job.jobs.title}" from saved jobs?`)) {
      return;
    }

    try {
      await dispatch(removeSavedJobAsync(job.jobs.id)).unwrap();
      
      // Add to recent activity
      dispatch(addRecentActivity({
        action: 'Removed saved job',
        details: `Removed ${job.jobs.title} from saved jobs`
      }));
    } catch (error) {
      alert(`Failed to remove job: ${error}`);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `$${min?.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className='saved-jobs'>
        <h2>💼 Saved Jobs</h2>
        <div className="loading-state">
          <p>Loading your saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='saved-jobs'>
      <h2>💼 Saved Jobs ({savedJobs.length})</h2>
      
      {error && (
        <div className="error-message" style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          Error: {error}
        </div>
      )}
      
      <div className='job-cards-saved'>
        {savedJobs.length === 0 ? (
          <div className="no-jobs-message">
            <p>📌 No saved jobs available yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>
              Save jobs from the job search page to see them here.
            </p>
          </div>
        ) : (
          savedJobs.map((savedJob) => {
            const job = savedJob.jobs;
            if (!job) return null;

            return (
              <div key={savedJob.id} className="job-card">
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.companies?.name || 'Company not specified'}</p>
                  
                  <div className="job-details">
                    <div className="job-location">
                      <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{job.location || 'Location not specified'}</span>
                    </div>
                    
                    {job.type && (
                      <div className="job-type">
                        <span className={`type-badge type-${job.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                          {job.type}
                        </span>
                      </div>
                    )}
                    
                    <div className="job-salary">
                      <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                  </div>

                  <div className="job-meta">
                    <small>
                      Saved on {new Date(savedJob.saved_at).toLocaleDateString()}
                      {job.categories?.name && ` • ${job.categories.name}`}
                    </small>
                  </div>
                </div>
                
                <div className="job-actions">
                  <button 
                    onClick={() => handleApply(savedJob)} 
                    className="apply-btn"
                    disabled={actionLoading.applying}
                  >
                    {actionLoading.applying ? (
                      <>
                        <span className="spinner-small"></span>
                        Applying...
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleRemove(savedJob)} 
                    className="remove-btn"
                    disabled={actionLoading.saving}
                    title="Remove from saved jobs"
                  >
                    {actionLoading.saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Removing...
                      </>
                    ) : (
                      'Remove'
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedJobs;