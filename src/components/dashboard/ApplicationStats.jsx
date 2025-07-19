import React from "react";
import "./ApplicationStats.css"

const ApplicationStats = ({ applications }) => {
    const sent = applications.filter((a) => a.status === "sent").length;
    const interviews = applications.filter((a) => a.status === "interview").length;
    const offers = applications.filter((a) => a.status === "offer").length;

    return (
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <StatBox label="Applications Sent" count={sent} />
            <StatBox label="Interviews Scheduled" count={interviews} />
            <StatBox label="Offers Received" count={offers} />
        </div>
    );
};

const StatBox = ({ label, count }) => (
    <div className="stat-card">
        <h3>{count}</h3>
        <p style={{ margin: 0 }}>{label}</p>
    </div>
);

export default ApplicationStats;
