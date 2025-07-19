import React from "react";

const RecentActivity = ({ activity }) => (
  <div style={{ marginBottom: "30px" }}>
    <h3>Recent Activity</h3>
    <ul>
      {activity.map(item => (
        <li key={item.id}>{item.action}</li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
