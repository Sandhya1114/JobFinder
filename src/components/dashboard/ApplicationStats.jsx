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
// components/ApplicationStats.jsx
// components/ApplicationStats.jsx
import React from "react";
import "./ApplicationStats.css";

const ApplicationStats = ({ applications = [], userStats = {}, isLoading = false }) => {
    // Calculate stats from real application data
    const sent = applications.filter((a) => a.status === "sent").length;
    const interviews = applications.filter((a) => a.status === "interview").length;
    const offers = applications.filter((a) => a.status === "offer").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    // Use userStats as fallback if applications array is empty
    const totalApplications = applications.length > 0 ? applications.length : (userStats.applications || 0);
    const savedJobs = userStats.savedJobs || 0;

    if (isLoading) {
        return (
            <div className="application-stats">
                <h3 className="stats-title">Your Progress</h3>
                <div className="stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card stat-card-loading">
                            <div className="loading-placeholder"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="application-stats">
            <h3 className="stats-title">Your Progress</h3>
            <div className="stats-grid">
                <StatBox 
                    label="Total Applications" 
                    count={totalApplications} 
                    icon="📄"
                    color="sent"
                    delay="0s"
                    subtitle={sent > 0 ? `${sent} sent` : "Get started!"}
                />
                <StatBox 
                    label="Saved Jobs" 
                    count={savedJobs} 
                    icon="💾"
                    color="saved"
                    delay="0.1s"
                    subtitle="Ready to apply"
                />
                <StatBox 
                    label="Interviews" 
                    count={interviews} 
                    icon="💼"
                    color="interview"
                    delay="0.2s"
                    subtitle={interviews > 0 ? "Great progress!" : "Coming soon"}
                />
                <StatBox 
                    label="Offers" 
                    count={offers} 
                    icon="🎉"
                    color="offer"
                    delay="0.3s"
                    subtitle={offers > 0 ? "Congratulations!" : "Keep going!"}
                />
            </div>
            
            {/* Recent Applications */}
            {applications.length > 0 && (
                <div className="recent-applications">
                    <h4>Recent Applications</h4>
                    <div className="applications-list">
                        {applications.slice(0, 3).map((app, index) => (
                            <div key={app.id || index} className="application-item">
                                <div className="application-info">
                                    <h5>{app.jobs?.title || 'Job Title'}</h5>
                                    <p>{app.jobs?.companies?.name || 'Company'}</p>
                                    <small>
                                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className={`status-badge status-${app.status}`}>
                                    {app.status === 'sent' && '📤'}
                                    {app.status === 'pending' && '⏳'}
                                    {app.status === 'interview' && '📞'}
                                    {app.status === 'offer' && '🎊'}
                                    {app.status === 'rejected' && '❌'}
                                    <span>{app.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatBox = ({ label, count, icon, color, delay, subtitle }) => (
    <div className={`stat-card stat-card-${color}`} style={{ animationDelay: delay }}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <h3 className="stat-number">{count}</h3>
            <p className="stat-label">{label}</p>
            {subtitle && <small className="stat-subtitle">{subtitle}</small>}
        </div>
        <div className="stat-background">
            <div className="stat-glow"></div>
        </div>
    </div>
);

export default ApplicationStats;