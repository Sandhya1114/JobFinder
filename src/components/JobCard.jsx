import React from "react";
import "./JobCards.css";

const jobs = [
  { type: "Internship", title: "Product Design", location: "Bangalore" },
  { type: "Full Time", title: "PHP Developer", location: "Noida" },
  { type: "Freelance", title: ".Net Developer", location: "GuruGram" },
  { type: "Full Time", title: "Web Developer", location: "Delhi" },
  // ...add all 8 jobs
];

const JobCards = () => {
  return (
    <div className="job-cards">
      {jobs.map((job, i) => (
        <div key={i} className="card">
          <span className="type">{job.type}</span>
          <h3>{job.title}</h3>
          <p>{job.location}</p>
          <button>Browse Job</button>
        </div>
      ))}
      <div className="more-jobs">
        <button>Browse More Jobs</button>
      </div>
    </div>
  );
};

export default JobCards;
