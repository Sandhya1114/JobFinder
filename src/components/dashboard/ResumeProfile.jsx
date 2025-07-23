import React, { useState } from "react";
import "./ResumeProfile.css"

const ResumeProfile = ({ profile }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(profile.resume || "");

  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setUploadMessage("");
  };

  const handleMockUpload = async () => {
    if (!resumeFile) {
      setUploadMessage("Please select a resume file first.");
      return;
    }

    const fakeResume = {
      filename: resumeFile.name,
      size: resumeFile.size,
    };

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: JSON.stringify(fakeResume),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUploadMessage(data.message);
      setUploadedUrl(data.filePath);
    } catch (err) {
      setUploadMessage("Failed to upload resume.");
      console.error(err);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Resume & Profile</h3>

      {uploadedUrl && (
        <p>
          <strong>Resume:</strong>{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button onClick={handleMockUpload} style={{ marginLeft: "10px" }}>
          Upload Resume
        </button>
        {uploadMessage && <p style={{ color: "green" }}>{uploadMessage}</p>}
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Skills:</strong>

        <input
          type="text"
          placeholder="Add new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <button onClick={handleAddSkill} style={{ marginLeft: "8px" }}>
          Add Skill
        </button>

        <ul>
          {skills.map((skill, index) => (
            <li key={index}>
              {skill}{" "}
              <button
                onClick={() => handleRemoveSkill(skill)}
                style={{
                  marginLeft: "8px",
                  color: "red",
                  border: "none",
                  cursor: "pointer",
                  background: "none"
                }}
              >
                <a href="#" className=" delete fa fa-trash"></a>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeProfile;
