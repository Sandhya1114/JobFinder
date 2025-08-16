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
//       <h2>Saved Jobs</h2>
//       <div className='job-cards-saved'>
//         {savedJobs.length === 0 ? (
//           <p>No saved jobs available.</p>
//         ) : (
//           savedJobs.map((job) => (
//             <div key={job.id} className="job-card">
//               <div>
//                 <strong>{job.title}</strong>
//                 <p>{job.company.name} – {job.location}</p>
//               </div>
//               <div className="job-actions">
//                 <button onClick={() => handleApply(job.id)} className="apply-btn">
//                   Apply
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
      <h2>💼 Saved Jobs</h2>
      <div className='job-cards-saved'>
        {savedJobs.length === 0 ? (
          <div className="no-jobs-message">
            <p>📌 No saved jobs available yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>
              Save jobs from the job search page to see them here.
            </p>
          </div>
        ) : (
          savedJobs.map((job) => (
            <div key={job.id} className="job-card">
              {/* <div className="job-badge">Saved</div> */}
              <div className="job-info">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company.name}</p>
                <div className="job-location">
                  <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="job-actions">
                <button onClick={() => handleApply(job.id)} className="apply-btn">
                  Apply Now
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