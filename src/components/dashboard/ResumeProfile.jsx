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
// components/ResumeProfile.jsx - Fixed version
import React, { useState, useEffect } from "react";
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
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  // Update local state when profile prop changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || ''
      });
      setSkills(profile.skills || []);
    }
  }, [profile]);

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
      setUploadMessage("Uploading...");
      const result = await dispatch(uploadResumeAsync(resumeFile)).unwrap();

      setUploadMessage("Resume uploaded successfully!");
      setResumeFile(null);

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Add activity log
      dispatch(addRecentActivity({
        action: 'Uploaded resume',
        details: `Uploaded ${resumeFile.name}`
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(`Failed to upload: ${error}`);
    }
  };

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill === "") {
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      setNewSkill("");
      return;
    }

    const updatedSkills = [...skills, trimmedSkill];
    
    // Update local state immediately for better UX
    setSkills(updatedSkills);
    setNewSkill("");
    
    // Update backend
    try {
      await dispatch(updateProfileAsync({ 
        ...profileData, 
        skills: updatedSkills 
      })).unwrap();
      
      dispatch(addRecentActivity({
        action: 'Added skill',
        details: `Added skill: ${trimmedSkill}`
      }));
    } catch (error) {
      // Revert local state if backend fails
      setSkills(skills);
      console.error('Failed to add skill:', error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    
    // Update local state immediately
    setSkills(updatedSkills);
    
    // Update backend
    try {
      await dispatch(updateProfileAsync({ 
        ...profileData, 
        skills: updatedSkills 
      })).unwrap();
      
      dispatch(addRecentActivity({
        action: 'Removed skill',
        details: `Removed skill: ${skillToRemove}`
      }));
    } catch (error) {
      // Revert local state if backend fails
      setSkills([...skills]);
      console.error('Failed to remove skill:', error);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfileAsync({ 
        ...profileData, 
        skills 
      })).unwrap();
      
      dispatch(addRecentActivity({
        action: 'Updated profile',
        details: 'Profile information updated'
      }));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
            <div className={`upload-message ${uploadMessage.includes('success') || uploadMessage.includes('successfully') ? 'success' : uploadMessage.includes('Uploading') ? 'info' : 'error'}`}>
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
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

        {skills.length > 0 ? (
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
        ) : (
          <div className="empty-skills">
            <p>No skills added yet. Add your first skill above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeProfile;