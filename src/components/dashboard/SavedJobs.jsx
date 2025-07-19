import React from "react";
import "./SavedJobs.css"

const SavedJobs = ({ savedJobs, onApply }) => {
    return (
        <div style={{ marginBottom: "30px" }}>
            <h3>Saved Jobs</h3>
            {savedJobs.length === 0 ? (
                <p>No saved jobs available.</p>
            ) : (
                savedJobs.map((job) => (
                    <div
                        key={job.id}
                        className="job-card"
                    >
                        <div className="">
                            <strong>{job.title}</strong>
                            <p>{job.company} – {job.location}</p>
                        </div>
                        <button
                            onClick={() => onApply(job.id)} className="apply-btn"
                        >
                            Apply
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SavedJobs;
