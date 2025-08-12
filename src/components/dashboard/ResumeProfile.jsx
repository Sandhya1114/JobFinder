// // import React, { useState } from "react";
// // import "./ResumeProfile.css"

// // const ResumeProfile = ({ profile }) => {
// //   const [resumeFile, setResumeFile] = useState(null);
// //   const [uploadMessage, setUploadMessage] = useState("");
// //   const [uploadedUrl, setUploadedUrl] = useState(profile.resume || "");

// //   const [skills, setSkills] = useState(profile.skills || []);
// //   const [newSkill, setNewSkill] = useState("");

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     setResumeFile(file);
// //     setUploadMessage("");
// //   };

// //   const handleMockUpload = async () => {
// //     if (!resumeFile) {
// //       setUploadMessage("Please select a resume file first.");
// //       return;
// //     }

// //     const fakeResume = {
// //       filename: resumeFile.name,
// //       size: resumeFile.size,
// //     };

// //     try {
// //       const res = await fetch("/api/upload-resume", {
// //         method: "POST",
// //         body: JSON.stringify(fakeResume),
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       const data = await res.json();
// //       setUploadMessage(data.message);
// //       setUploadedUrl(data.filePath);
// //     } catch (err) {
// //       setUploadMessage("Failed to upload resume.");
// //       console.error(err);
// //     }
// //   };

// //   const handleAddSkill = () => {
// //     if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
// //       setSkills([...skills, newSkill.trim()]);
// //       setNewSkill("");
// //     }
// //   };

// //   const handleRemoveSkill = (skillToRemove) => {
// //     setSkills(skills.filter((skill) => skill !== skillToRemove));
// //   };

// //   return (
// //     <div style={{ marginBottom: "30px" }}>
// //       <h3>Resume & Profile</h3>

// //       {uploadedUrl && (
// //         <p>
// //           <strong>Resume:</strong>{" "}
// //           <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
// //             {uploadedUrl}
// //           </a>
// //         </p>
// //       )}

// //       <div style={{ marginTop: "10px" }}>
// //         <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
// //         <button onClick={handleMockUpload} style={{ marginLeft: "10px" }}>
// //           Upload Resume
// //         </button>
// //         {uploadMessage && <p style={{ color: "green" }}>{uploadMessage}</p>}
// //       </div>

// //       <div style={{ marginTop: "20px" }}>
// //         <strong>Skills:</strong>

// //         <input
// //           type="text"
// //           placeholder="Add new skill"
// //           value={newSkill}
// //           onChange={(e) => setNewSkill(e.target.value)}
// //         />
// //         <button onClick={handleAddSkill} style={{ marginLeft: "8px" }}>
// //           Add Skill
// //         </button>

// //         <ul>
// //           {skills.map((skill, index) => (
// //             <li key={index}>
// //               {skill}{" "}
// //               <button
// //                 onClick={() => handleRemoveSkill(skill)}
// //                 style={{
// //                   marginLeft: "8px",
// //                   color: "red",
// //                   border: "none",
// //                   cursor: "pointer",
// //                   background: "none"
// //                 }}
// //               >
// //                 <a href="#" className=" delete fa fa-trash"></a>
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResumeProfile;
// import React, { useState } from "react";
// import "./ResumeProfile.css"

// const ResumeProfile = ({ profile }) => {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState(profile.resume || "");

//   const [skills, setSkills] = useState(profile.skills || []);
//   const [newSkill, setNewSkill] = useState("");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setResumeFile(file);
//     setUploadMessage("");
//   };

//   const handleMockUpload = async () => {
//     if (!resumeFile) {
//       setUploadMessage("Please select a resume file first.");
//       return;
//     }

//     const fakeResume = {
//       filename: resumeFile.name,
//       size: resumeFile.size,
//     };

//     try {
//       const res = await fetch("/api/upload-resume", {
//         method: "POST",
//         body: JSON.stringify(fakeResume),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       setUploadMessage(data.message);
//       setUploadedUrl(data.filePath);
//     } catch (err) {
//       setUploadMessage("Failed to upload resume.");
//       console.error(err);
//     }
//   };

//   const handleAddSkill = () => {
//     if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
//       setSkills([...skills, newSkill.trim()]);
//       setNewSkill("");
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setSkills(skills.filter((skill) => skill !== skillToRemove));
//   };

//   return (
//     <div className="resume-profile">
//       <h3>
//         <span className="section-icon">📄</span>
//         Resume & Profile
//       </h3>

//       <div className="resume-section">
//         {uploadedUrl && (
//           <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
//             <svg className="resume-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <span>View Current Resume</span>
//           </a>
//         )}

//         <div className="file-upload-section">
//           <div className="file-input-wrapper">
//             <input 
//               type="file" 
//               accept=".pdf,.doc,.docx" 
//               onChange={handleFileChange}
//               className="file-input"
//             />
//             <button onClick={handleMockUpload} className="upload-btn">
//               Upload Resume
//             </button>
//           </div>
//           {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
//         </div>
//       </div>

//       <div className="skills-section">
//         <h4 className="skills-title">
//           <span>🎯</span>
//           Skills
//         </h4>

//         <div className="skill-input-wrapper">
//           <input
//             type="text"
//             placeholder="Add new skill (e.g., React, Python, UI/UX)"
//             value={newSkill}
//             onChange={(e) => setNewSkill(e.target.value)}
//             className="skill-input"
//             onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
//           />
//           <button onClick={handleAddSkill} className="add-skill-btn">
//             Add Skill
//           </button>
//         </div>

//         <ul className="skills-list">
//           {skills.map((skill, index) => (
//             <li key={index} className="skill-item">
//               <span>{skill}</span>
//               <button
//                 onClick={() => handleRemoveSkill(skill)}
//                 className="remove-skill-btn"
//                 title={`Remove ${skill}`}
//               >
//                 <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ResumeProfile;
// components/ResumeProfile.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  uploadResumeAsync, 
  updateProfileAsync,
  addRecentActivity 
} from '../../redux/dashboardSlice';
import "./ResumeProfile.css";

const ResumeProfile = ({ profile, isUploading = false, isUpdating = false }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.dashboard);

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [profileData, setProfileData] = useState({
    name: profile.name || '',
    email: profile.email || ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setUploadMessage("");
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setUploadMessage("Please select a resume file first.");
      return;
    }

    try {
      const result = await dispatch(uploadResumeAsync({
        filename: resumeFile.name,
        size: resumeFile.size
      })).unwrap();

      setUploadMessage("Resume uploaded successfully!");
      setResumeFile(null);
      
      // Add to recent activity
      dispatch(addRecentActivity({
        action: 'Uploaded resume',
        details: `Uploaded ${resumeFile.name}`
      }));

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setUploadMessage(`Failed to upload resume: ${error}`);
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill !== "" && !skills.includes(trimmedSkill)) {
      const updatedSkills = [...skills, trimmedSkill];
      setSkills(updatedSkills);
      setNewSkill("");
      
      // Update profile with new skills
      handleUpdateProfile({ skills: updatedSkills });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    
    // Update profile with remaining skills
    handleUpdateProfile({ skills: updatedSkills });
  };

  const handleUpdateProfile = async (updates = {}) => {
    try {
      const updateData = {
        ...profileData,
        skills,
        ...updates
      };

      await dispatch(updateProfileAsync(updateData)).unwrap();
      
      dispatch(addRecentActivity({
        action: 'Updated profile',
        details: 'Profile information updated'
      }));

    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    handleUpdateProfile();
  };

  return (
    <div className="resume-profile">
      <h3>
        <span className="section-icon">📄</span>
        Resume & Profile
      </h3>

      {error && (
        <div className="error-message" style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          Error: {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="profile-section">
        <h4 className="profile-title">
          <span>👤</span>
          Profile Information
        </h4>
        
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) => handleProfileInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="profile-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) => handleProfileInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="profile-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="update-profile-btn"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="spinner-small"></span>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </form>
      </div>

      {/* Resume Section */}
      <div className="resume-section">
        <h4 className="resume-title">
          <span>📎</span>
          Resume
        </h4>
        
        {profile.resume && (
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="resume-link">
            <svg className="resume-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View Current Resume</span>
          </a>
        )}

        <div className="file-upload-section">
          <div className="file-input-wrapper">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange}
              className="file-input"
              disabled={isUploading}
            />
            <button 
              onClick={handleUploadResume} 
              className="upload-btn"
              disabled={isUploading || !resumeFile}
            >
              {isUploading ? (
                <>
                  <span className="spinner-small"></span>
                  Uploading...
                </>
              ) : (
                'Upload Resume'
              )}
            </button>
          </div>
          {uploadMessage && (
            <div className={`upload-message ${uploadMessage.includes('success') ? 'success' : 'error'}`}>
              {uploadMessage}
            </div>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <h4 className="skills-title">
          <span>🎯</span>
          Skills ({skills.length})
        </h4>

        <div className="skill-input-wrapper">
          <input
            type="text"
            placeholder="Add new skill (e.g., React, Python, UI/UX)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="skill-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            disabled={isUpdating}
          />
          <button 
            onClick={handleAddSkill} 
            className="add-skill-btn"
            disabled={isUpdating || !newSkill.trim()}
          >
            {isUpdating ? (
              <>
                <span className="spinner-small"></span>
                Adding...
              </>
            ) : (
              'Add Skill'
            )}
          </button>
        </div>

        <ul className="skills-list">
          {skills.map((skill, index) => (
            <li key={index} className="skill-item">
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="remove-skill-btn"
                title={`Remove ${skill}`}
                disabled={isUpdating}
              >
                <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeProfile;