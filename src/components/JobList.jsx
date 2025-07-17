import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { setJobs } from './store';
import './Joblist.css'; // Import your CSS file
import { setJobs } from '../redux/store';

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.jobs.jobs);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        dispatch(setJobs(data.jobs));
      });
  }, [dispatch]);

  return (
    <div className="job-list-container">
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h2>{job.title}</h2>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p>{job.description}</p>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <button className="apply-btn">Apply</button>
          </a>
        </div>
      ))}
    </div>
  );
};

export default JobList;
