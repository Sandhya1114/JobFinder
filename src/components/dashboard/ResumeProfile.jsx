import React from "react";

const ResumeProfile = ({ profile }) => (
  <div style={{ marginBottom: "30px" }}>
    <h3>Resume & Profile</h3>
    <p><strong>Resume:</strong> {profile.resume}</p>
    <p><strong>Skills:</strong> {profile.skills?.join(", ")}</p>
  </div>
);

export default ResumeProfile;
