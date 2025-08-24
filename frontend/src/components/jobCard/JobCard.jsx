
import React, { useEffect, useState } from "react";
import "./JobCards.css";

const JobCards = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(6); // Initially show 10 jobs

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data.jobs);
    };

    fetchJobs();
  }, []);

  const loadMoreJobs = () => {
    setVisibleJobs((prevVisible) => prevVisible + 6); // Load 10 more jobs
  };

  return (
    <>
    <div><h1>Browse Jobs</h1></div>
    <div className="job-cards">
      {jobs.slice(0, visibleJobs).map((job) => (
        <div key={job.id} className="card">
          
          <h3>{job.title}</h3>
          <span className="type">{job.type}</span>
          <p>{job.location}</p>
          <button className="btnForApply" onClick={() => window.open(job.applyUrl, "_blank")}>Apply Job</button>
        </div>
      ))}
      {visibleJobs < jobs.length && (
        <div className="more-jobs">
          <button onClick={loadMoreJobs}>Browse More Jobs</button>
        </div>
      )}
    </div>
    </>
  );
};

export default JobCards;
