// import React from "react";
// import "./ApplicationStats.css"

// const ApplicationStats = ({ applications }) => {
//     const sent = applications.filter((a) => a.status === "sent").length;
//     const interviews = applications.filter((a) => a.status === "interview").length;
//     const offers = applications.filter((a) => a.status === "offer").length;

//     return (
//         <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
//             <StatBox label="Applications Sent" count={sent} />
//             <StatBox label="Interviews Scheduled" count={interviews} />
//             <StatBox label="Offers Received" count={offers} />
//         </div>
//     );
// };

// const StatBox = ({ label, count }) => (
//     <div className="stat-card">
//         <h3>{count}</h3>
//         <p style={{ margin: 0 }}>{label}</p>
//     </div>
// );

// export default ApplicationStats;
import React from "react";
import "./ApplicationStats.css"

const ApplicationStats = ({ applications }) => {
    const sent = applications.filter((a) => a.status === "sent").length;
    const interviews = applications.filter((a) => a.status === "interview").length;
    const offers = applications.filter((a) => a.status === "offer").length;

    return (
        <div className="application-stats">
            <h3 className="stats-title">Your Progress</h3>
            <div className="stats-grid">
                <StatBox 
                    label="Applications Sent" 
                    count={sent} 
                    icon="📄"
                    color="sent"
                    delay="0s"
                />
                <StatBox 
                    label="Interviews Scheduled" 
                    count={interviews} 
                    icon="💼"
                    color="interview"
                    delay="0.1s"
                />
                <StatBox 
                    label="Offers Received" 
                    count={offers} 
                    icon="🎉"
                    color="offer"
                    delay="0.2s"
                />
            </div>
        </div>
    );
};

const StatBox = ({ label, count, icon, color, delay }) => (
    <div className={`stat-card stat-card-${color}`} style={{ animationDelay: delay }}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <h3 className="stat-number">{count}</h3>
            <p className="stat-label">{label}</p>
        </div>
        <div className="stat-background">
            <div className="stat-glow"></div>
        </div>
    </div>
);

export default ApplicationStats;