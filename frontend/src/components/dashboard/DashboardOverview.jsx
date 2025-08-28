// // // DashboardOverview.jsx
// // import { useDispatch } from 'react-redux';
// // import { setActiveTab } from '../../redux/dashboardSlice';
// // // import { setActiveTab } from '../store/dashboardSlice';

// // const DashboardOverview = ({ stats }) => {
// //   const dispatch = useDispatch();

// //   const statCards = [
// //     {
// //       title: 'Saved Jobs',
// //       count: stats.savedJobs,
// //       icon: 'fas fa-bookmark',
// //       color: '#3182ce',
// //       action: () => dispatch(setActiveTab('saved-jobs'))
// //     },
// //     {
// //       title: 'Applied Jobs',
// //       count: stats.appliedJobs,
// //       icon: 'fas fa-paper-plane',
// //       color: '#38a169',
// //       action: () => dispatch(setActiveTab('saved-jobs'))
// //     },
// //     {
// //       title: 'Skills',
// //       count: stats.totalSkills,
// //       icon: 'fas fa-tools',
// //       color: '#d69e2e',
// //       action: () => dispatch(setActiveTab('skills'))
// //     },
// //     {
// //       title: 'Education',
// //       count: stats.totalEducation,
// //       icon: 'fas fa-graduation-cap',
// //       color: '#9f7aea',
// //       action: () => dispatch(setActiveTab('education'))
// //     }
// //   ];

// //   const quickActions = [
// //     {
// //       label: 'Update Profile',
// //       icon: 'fas fa-user-edit',
// //       action: () => dispatch(setActiveTab('profile')),
// //       type: 'primary'
// //     },
// //     {
// //       label: 'Add Education',
// //       icon: 'fas fa-plus',
// //       action: () => dispatch(setActiveTab('education')),
// //       type: 'secondary'
// //     },
// //     {
// //       label: 'Add Skills',
// //       icon: 'fas fa-plus',
// //       action: () => dispatch(setActiveTab('skills')),
// //       type: 'secondary'
// //     },
// //     {
// //       label: 'Upload Resume',
// //       icon: 'fas fa-upload',
// //       action: () => dispatch(setActiveTab('resumes')),
// //       type: 'secondary'
// //     }
// //   ];

// //   return (
// //     <div className="dashboard-overview">
// //       <div className="welcome-section">
// //         <h2>
// //           <i className="fas fa-home"></i>
// //           Dashboard Overview
// //         </h2>
// //         <p>Here's a summary of your job search progress and profile completion.</p>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="stats-grid">
// //         {statCards.map((stat, index) => (
// //           <div 
// //             key={index}
// //             className="stat-card"
// //             onClick={stat.action}
// //             style={{ cursor: 'pointer' }}
// //           >
// //             <div className="stat-icon" style={{ color: stat.color }}>
// //               <i className={stat.icon}></i>
// //             </div>
// //             <div className="stat-content">
// //               <h3>{stat.count}</h3>
// //               <p>{stat.title}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="quick-actions">
// //         <h3>
// //           <i className="fas fa-bolt"></i>
// //           Quick Actions
// //         </h3>
// //         <div className="action-buttons">
// //           {quickActions.map((action, index) => (
// //             <button
// //               key={index}
// //               className={`action-btn ${action.type}`}
// //               onClick={action.action}
// //             >
// //               <i className={action.icon}></i>
// //               {action.label}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Recent Activity */}
// //       <div className="recent-activity">
// //         <h3>
// //           <i className="fas fa-clock"></i>
// //           Recent Activity
// //         </h3>
// //         <div className="activity-list">
// //           <div className="activity-item">
// //             <div className="activity-icon">
// //               <i className="fas fa-bookmark"></i>
// //             </div>
// //             <div className="activity-content">
// //               <p>You have {stats.savedJobs} saved jobs waiting for your application</p>
// //               <span className="activity-time">Last updated today</span>
// //             </div>
// //           </div>
// //           <div className="activity-item">
// //             <div className="activity-icon">
// //               <i className="fas fa-tools"></i>
// //             </div>
// //             <div className="activity-content">
// //               <p>Your profile has {stats.totalSkills} skills listed</p>
// //               <span className="activity-time">Keep adding more to stand out</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Profile Completion */}
// //       <div className="profile-completion">
// //         <h3>
// //           <i className="fas fa-tasks"></i>
// //           Profile Completion
// //         </h3>
// //         <div className="completion-progress">
// //           <div className="progress-bar">
// //             <div 
// //               className="progress-fill" 
// //               style={{ width: `${Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}%` }}
// //             ></div>
// //           </div>
// //           <p>
// //             {Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}% Complete
// //           </p>
// //         </div>
// //         <div className="completion-tips">
// //           {stats.totalSkills === 0 && (
// //             <div className="tip-item">
// //               <i className="fas fa-exclamation-circle"></i>
// //               Add your skills to increase your profile visibility
// //             </div>
// //           )}
// //           {stats.totalEducation === 0 && (
// //             <div className="tip-item">
// //               <i className="fas fa-exclamation-circle"></i>
// //               Add your education background
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardOverview;
// // Enhanced DashboardOverview.jsx - Shows comprehensive profile data with navigation
// import { useDispatch, useSelector } from 'react-redux';
// import { setActiveTab } from '../../redux/dashboardSlice';
// import { useEffect } from 'react';
// // Import actions to fetch data from different sections
// import { fetchProfile } from '../../redux/profileSlice';
// import { fetchEducation } from '../../redux/educationSlice';
// import { fetchSkills } from '../../redux/skillsSlice';
// import { fetchWorkExperience } from '../../redux/workExperienceSlice';
// import { fetchResumes } from '../../redux/resumesSlice';
// import   './DashboardOverview.css'
// const DashboardOverview = ({ stats }) => {
//   const dispatch = useDispatch();
  
//   // Get data from all sections
//   const profile = useSelector(state => state.profile?.data || {});
//   const education = useSelector(state => state.education?.items || []);
//   const skills = useSelector(state => state.skills?.items || []);
//   const workExperience = useSelector(state => state.workExperience?.items || []);
//   const resumes = useSelector(state => state.resumes?.items || []);

//   // Fetch all data when component mounts
//   useEffect(() => {
//     dispatch(fetchProfile());
//     dispatch(fetchEducation());
//     dispatch(fetchSkills());
//     dispatch(fetchWorkExperience());
//     dispatch(fetchResumes());
//   }, [dispatch]);

//   const statCards = [
//     {
//       title: 'Saved Jobs',
//       count: stats.savedJobs,
//       icon: 'fas fa-bookmark',
//       color: '#3182ce',
//       action: () => dispatch(setActiveTab('saved-jobs'))
//     },
//     {
//       title: 'Applied Jobs',
//       count: stats.appliedJobs,
//       icon: 'fas fa-paper-plane',
//       color: '#38a169',
//       action: () => dispatch(setActiveTab('saved-jobs'))
//     },
//     {
//       title: 'Skills',
//       count: skills.length,
//       icon: 'fas fa-tools',
//       color: '#d69e2e',
//       action: () => dispatch(setActiveTab('skills'))
//     },
//     {
//       title: 'Education',
//       count: education.length,
//       icon: 'fas fa-graduation-cap',
//       color: '#9f7aea',
//       action: () => dispatch(setActiveTab('education'))
//     },
//     {
//       title: 'Work Experience',
//       count: workExperience.length,
//       icon: 'fas fa-briefcase',
//       color: '#e53e3e',
//       action: () => dispatch(setActiveTab('experience'))
//     },
//     {
//       title: 'Resumes',
//       count: resumes.length,
//       icon: 'fas fa-file-alt',
//       color: '#38a169',
//       action: () => dispatch(setActiveTab('resumes'))
//     }
//   ];

//   const quickActions = [
//     {
//       label: 'Update Profile',
//       icon: 'fas fa-user-edit',
//       action: () => dispatch(setActiveTab('profile')),
//       type: 'primary'
//     },
//     {
//       label: 'Add Education',
//       icon: 'fas fa-plus',
//       action: () => dispatch(setActiveTab('education')),
//       type: 'secondary'
//     },
//     {
//       label: 'Add Skills',
//       icon: 'fas fa-plus',
//       action: () => dispatch(setActiveTab('skills')),
//       type: 'secondary'
//     },
//     {
//       label: 'Upload Resume',
//       icon: 'fas fa-upload',
//       action: () => dispatch(setActiveTab('resumes')),
//       type: 'secondary'
//     },
//     {
//       label: 'Add Experience',
//       icon: 'fas fa-plus',
//       action: () => dispatch(setActiveTab('experience')),
//       type: 'secondary'
//     }
//   ];

//   // Helper function to group skills by category
//   const groupSkillsByCategory = () => {
//     return skills.reduce((acc, skill) => {
//       const category = skill.category || 'Other';
//       if (!acc[category]) acc[category] = [];
//       acc[category].push(skill);
//       return acc;
//     }, {});
//   };

//   // Calculate profile completion percentage
//   const calculateProfileCompletion = () => {
//     let completion = 0;
//     const totalSections = 6;
    
//     // Profile basic info
//     if (profile.name && profile.email) completion += 1;
    
//     // Education
//     if (education.length > 0) completion += 1;
    
//     // Skills
//     if (skills.length > 0) completion += 1;
    
//     // Work Experience
//     if (workExperience.length > 0) completion += 1;
    
//     // Resumes
//     if (resumes.length > 0) completion += 1;
    
//     // Profile details (about, location, etc.)
//     if (profile.about || profile.location) completion += 1;
    
//     return Math.round((completion / totalSections) * 100);
//   };

//   return (
//     <div className="dashboard-overview">
//       <div className="welcome-section">
//         <h2>
//           <i className="fas fa-home"></i>
//           Dashboard Overview
//         </h2>
//         <p>Complete overview of your job search progress and profile information.</p>
//       </div>

//       {/* Enhanced Stats Grid */}
//       <div className="stats-grid">
//         {statCards.map((stat, index) => (
//           <div 
//             key={index}
//             className="stat-card"
//             onClick={stat.action}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="stat-icon" style={{ color: stat.color }}>
//               <i className={stat.icon}></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stat.count}</h3>
//               <p>{stat.title}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Profile Summary Section */}
//       <div className="overview-section profile-summary">
//         <div className="section-header">
//           <h3>
//             <i className="fas fa-user"></i>
//             Profile Summary
//           </h3>
//           <button 
//             className="edit-link"
//             onClick={() => dispatch(setActiveTab('profile'))}
//           >
//             <i className="fas fa-edit"></i>
//             Edit Profile
//           </button>
//         </div>
        
//         <div className="profile-overview-content">
//           {profile.name || profile.email ? (
//             <div className="profile-info">
//               <div className="profile-basic">
//                 <h4>{profile.name || 'Name not provided'}</h4>
//                 <p><i className="fas fa-envelope"></i> {profile.email || 'Email not provided'}</p>
//                 {profile.phone && <p><i className="fas fa-phone"></i> {profile.phone}</p>}
//                 {profile.location && <p><i className="fas fa-map-marker-alt"></i> {profile.location}</p>}
//               </div>
//               {profile.about && (
//                 <div className="profile-about">
//                   <strong>About:</strong>
//                   <p>{profile.about.length > 200 ? `${profile.about.substring(0, 200)}...` : profile.about}</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-info">
//               <p>Complete your profile to make a strong first impression.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Work Experience Summary */}
//       <div className="overview-section experience-summary">
//         <div className="section-header">
//           <h3>
//             <i className="fas fa-briefcase"></i>
//             Work Experience ({workExperience.length})
//           </h3>
//           <button 
//             className="edit-link"
//             onClick={() => dispatch(setActiveTab('experience'))}
//           >
//             <i className="fas fa-plus"></i>
//             Manage Experience
//           </button>
//         </div>
        
//         <div className="experience-overview-content">
//           {workExperience.length > 0 ? (
//             <div className="experience-list">
//               {workExperience.slice(0, 3).map((exp, index) => (
//                 <div key={index} className="experience-item">
//                   <div className="exp-header">
//                     <strong>{exp.job_title}</strong>
//                     <span className="company-name">{exp.company}</span>
//                   </div>
//                   <div className="exp-meta">
//                     <span>
//                       <i className="fas fa-calendar"></i>
//                       {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
//                       {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
//                     </span>
//                     <span>
//                       <i className="fas fa-map-marker-alt"></i>
//                       {exp.location}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {workExperience.length > 3 && (
//                 <div className="view-more">
//                   <button onClick={() => dispatch(setActiveTab('experience'))}>
//                     View all {workExperience.length} experiences
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-info">
//               <p>Add your work experience to showcase your professional background.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Education Summary */}
//       <div className="overview-section education-summary">
//         <div className="section-header">
//           <h3>
//             <i className="fas fa-graduation-cap"></i>
//             Education ({education.length})
//           </h3>
//           <button 
//             className="edit-link"
//             onClick={() => dispatch(setActiveTab('education'))}
//           >
//             <i className="fas fa-plus"></i>
//             Manage Education
//           </button>
//         </div>
        
//         <div className="education-overview-content">
//           {education.length > 0 ? (
//             <div className="education-list">
//               {education.slice(0, 3).map((edu, index) => (
//                 <div key={index} className="education-item">
//                   <div className="edu-header">
//                     <strong>{edu.degree}</strong>
//                     <span className="institution-name">{edu.institution}</span>
//                   </div>
//                   <div className="edu-details">
//                     <span className="field-study">{edu.field_of_study}</span>
//                     <span className="edu-date">
//                       <i className="fas fa-calendar"></i>
//                       {edu.start_date ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'N/A'} - 
//                       {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}` : ' N/A')}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {education.length > 3 && (
//                 <div className="view-more">
//                   <button onClick={() => dispatch(setActiveTab('education'))}>
//                     View all {education.length} education entries
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-info">
//               <p>Add your educational background to strengthen your profile.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Skills Summary */}
//       <div className="overview-section skills-summary">
//         <div className="section-header">
//           <h3>
//             <i className="fas fa-tools"></i>
//             Skills ({skills.length})
//           </h3>
//           <button 
//             className="edit-link"
//             onClick={() => dispatch(setActiveTab('skills'))}
//           >
//             <i className="fas fa-plus"></i>
//             Manage Skills
//           </button>
//         </div>
        
//         <div className="skills-overview-content">
//           {skills.length > 0 ? (
//             <div className="skills-categories">
//               {Object.entries(groupSkillsByCategory()).slice(0, 3).map(([category, categorySkills]) => (
//                 <div key={category} className="skill-category">
//                   <h4>{category}</h4>
//                   <div className="skills-tags">
//                     {categorySkills.slice(0, 6).map((skill, index) => (
//                       <span key={index} className="skill-tag">
//                         {skill.skill_name}
//                         {skill.is_verified && <i className="fas fa-certificate" title="Verified"></i>}
//                       </span>
//                     ))}
//                     {categorySkills.length > 6 && (
//                       <span className="more-skills">+{categorySkills.length - 6} more</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {Object.keys(groupSkillsByCategory()).length > 3 && (
//                 <div className="view-more">
//                   <button onClick={() => dispatch(setActiveTab('skills'))}>
//                     View all skill categories
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-info">
//               <p>Add your technical and professional skills to showcase your expertise.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Resumes Summary */}
//       <div className="overview-section resumes-summary">
//         <div className="section-header">
//           <h3>
//             <i className="fas fa-file-alt"></i>
//             Resumes ({resumes.length})
//           </h3>
//           <button 
//             className="edit-link"
//             onClick={() => dispatch(setActiveTab('resumes'))}
//           >
//             <i className="fas fa-plus"></i>
//             Manage Resumes
//           </button>
//         </div>
        
//         <div className="resumes-overview-content">
//           {resumes.length > 0 ? (
//             <div className="resumes-list">
//               {resumes.slice(0, 3).map((resume, index) => (
//                 <div key={index} className="resume-item">
//                   <div className="resume-header">
//                     <i className="fas fa-file-pdf"></i>
//                     <div className="resume-info">
//                       <strong>{resume.title}</strong>
//                       {resume.is_primary && <span className="primary-badge">Primary</span>}
//                     </div>
//                   </div>
//                   <div className="resume-meta">
//                     <span>Added {new Date(resume.created_at).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               ))}
//               {resumes.length > 3 && (
//                 <div className="view-more">
//                   <button onClick={() => dispatch(setActiveTab('resumes'))}>
//                     View all {resumes.length} resumes
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="empty-info">
//               <p>Upload your resumes to apply for jobs more efficiently.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h3>
//           <i className="fas fa-bolt"></i>
//           Quick Actions
//         </h3>
//         <div className="action-buttons">
//           {quickActions.map((action, index) => (
//             <button
//               key={index}
//               className={`action-btn ${action.type}`}
//               onClick={action.action}
//             >
//               <i className={action.icon}></i>
//               {action.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Profile Completion */}
//       <div className="profile-completion">
//         <h3>
//           <i className="fas fa-tasks"></i>
//           Profile Completion
//         </h3>
//         <div className="completion-progress">
//           <div className="progress-bar">
//             <div 
//               className="progress-fill" 
//               style={{ width: `${calculateProfileCompletion()}%` }}
//             ></div>
//           </div>
//           <p>{calculateProfileCompletion()}% Complete</p>
//         </div>
//         <div className="completion-tips">
//           {!profile.name && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Complete your profile information
//               <button onClick={() => dispatch(setActiveTab('profile'))}>Update Profile</button>
//             </div>
//           )}
//           {skills.length === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Add your skills to increase profile visibility
//               <button onClick={() => dispatch(setActiveTab('skills'))}>Add Skills</button>
//             </div>
//           )}
//           {education.length === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Add your education background
//               <button onClick={() => dispatch(setActiveTab('education'))}>Add Education</button>
//             </div>
//           )}
//           {workExperience.length === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Add your work experience
//               <button onClick={() => dispatch(setActiveTab('experience'))}>Add Experience</button>
//             </div>
//           )}
//           {resumes.length === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Upload at least one resume
//               <button onClick={() => dispatch(setActiveTab('resumes'))}>Upload Resume</button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="recent-activity">
//         <h3>
//           <i className="fas fa-clock"></i>
//           Recent Activity
//         </h3>
//         <div className="activity-list">
//           <div className="activity-item">
//             <div className="activity-icon">
//               <i className="fas fa-bookmark"></i>
//             </div>
//             <div className="activity-content">
//               <p>You have {stats.savedJobs} saved jobs waiting for your application</p>
//               <span className="activity-time">Last updated today</span>
//             </div>
//           </div>
//           <div className="activity-item">
//             <div className="activity-icon">
//               <i className="fas fa-tools"></i>
//             </div>
//             <div className="activity-content">
//               <p>Your profile has {skills.length} skills listed</p>
//               <span className="activity-time">Keep adding more to stand out</span>
//             </div>
//           </div>
//           {workExperience.length > 0 && (
//             <div className="activity-item">
//               <div className="activity-icon">
//                 <i className="fas fa-briefcase"></i>
//               </div>
//               <div className="activity-content">
//                 <p>You have {workExperience.length} work experience entries</p>
//                 <span className="activity-time">Showcase your professional journey</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverview;
// Enhanced DashboardOverview.jsx - Profile-style layout matching the provided image
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/dashboardSlice';
import { useEffect, useState } from 'react';
// Import actions to fetch data from different sections
import { fetchProfile } from '../../redux/profileSlice';
import { fetchEducation } from '../../redux/educationSlice';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchWorkExperience } from '../../redux/workExperienceSlice';
import { fetchResumes } from '../../redux/resumesSlice';
import './DashboardOverview.css'

const DashboardOverview = ({ stats }) => {
  const dispatch = useDispatch();
  const [activeProfileTab, setActiveProfileTab] = useState('experience');
  
  // Get data from all sections
  const profile = useSelector(state => state.profile?.data || {});
  const education = useSelector(state => state.education?.items || []);
  const skills = useSelector(state => state.skills?.items || []);
  const workExperience = useSelector(state => state.workExperience?.items || []);
  const resumes = useSelector(state => state.resumes?.items || []);

  // Fetch all data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchEducation());
    dispatch(fetchSkills());
    dispatch(fetchWorkExperience());
    dispatch(fetchResumes());
  }, [dispatch]);

  // Helper function to calculate total experience
  const calculateTotalExperience = () => {
    if (workExperience.length === 0) return { years: 0, type: 'No Experience' };
    
    let totalMonths = 0;
    workExperience.forEach(exp => {
      const startDate = new Date(exp.start_date);
      const endDate = exp.is_current ? new Date() : new Date(exp.end_date);
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    });
    
    const years = Math.floor(totalMonths / 12);
    return { years, type: 'Experience' };
  };

  // Helper function to count certificates/verified skills
  const getCertificatesCount = () => {
    return skills.filter(skill => skill.is_verified).length;
  };

  // Helper function to get job duration
  const getJobDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 1) return '1 month';
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  // Helper function to group skills by category
  const groupSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
  };

  const profileTabs = [
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'biography', label: 'Biography', icon: 'fas fa-user' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-tools' },
    { id: 'portfolio', label: 'Portfolio', icon: 'fas fa-folder' }
  ];

  const experienceData = calculateTotalExperience();
  const certificatesCount = getCertificatesCount();

  return (
    <div className="dashboard-overview-new">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          <img 
            src="/api/placeholder/120/120" 
            alt="Profile" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="avatar-fallback">
            {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="profile-header-info">
          <div className="profile-name-section">
            <h1 className="profile-name">{profile.name || 'Your Name'}</h1>
            <button 
              className="edit-profile-btn"
              onClick={() => dispatch(setActiveTab('profile'))}
            >
              Edit Profile
            </button>
            <button className="public-view-btn">
              Public View
            </button>
          </div>
          
          <div className="profile-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{profile.location || 'Add your location'}</span>
          </div>
          
          <div className="profile-bio">
            <p>{profile.about || 'Add a professional summary about yourself, your experience, and career goals to make a great first impression on potential employers.'}</p>
            {!profile.about && (
              <button 
                className="add-bio-btn"
                onClick={() => dispatch(setActiveTab('profile'))}
              >
                MORE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-row">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{experienceData.years}+ Years</div>
            <div className="stat-label">{experienceData.type}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{certificatesCount}</div>
            <div className="stat-label">Certificates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{education.length}</div>
            <div className="stat-label">Education</div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="profile-content-section">
        <div className="profile-tabs">
          {profileTabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab ${activeProfileTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveProfileTab(tab.id)}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-content">
          {/* Experience Tab */}
          {activeProfileTab === 'experience' && (
            <div className="experience-content">
              <div className="content-header">
                <h3>
                  <i className="fas fa-briefcase"></i>
                  Job Experience 
                  <span className="count">{workExperience.length} job history</span>
                </h3>
                <button 
                  className="add-more-btn"
                  onClick={() => dispatch(setActiveTab('experience'))}
                >
                  <i className="fas fa-plus"></i>
                  Add More
                </button>
              </div>

              {workExperience.length > 0 ? (
                <div className="jobs-timeline">
                  {workExperience.slice(0, 3).map((exp, index) => (
                    <div key={exp.id} className="job-timeline-item">
                      <div className="company-logo">
                        <i className="fas fa-building"></i>
                      </div>
                      
                      <div className="job-details">
                        <div className="job-header">
                          <h4 className="job-title">{exp.job_title}</h4>
                          <div className="job-meta">
                            <span className="job-duration">
                              <i className="fas fa-calendar"></i>
                              {new Date(exp.start_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })} - {exp.is_current ? 'Present' : 
                                new Date(exp.end_date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })
                              }
                            </span>
                            <span className="job-location">
                              <i className="fas fa-map-marker-alt"></i>
                              {exp.location}
                            </span>
                          </div>
                        </div>
                        
                        <div className="company-name">{exp.company}</div>
                        
                        <div className="job-description">
                          {exp.description.length > 150 
                            ? `${exp.description.substring(0, 150)}...` 
                            : exp.description
                          }
                        </div>

                        {exp.achievements && (
                          <div className="job-achievements">
                            <strong>Key Achievements:</strong>
                            <div className="achievements-preview">
                              {exp.achievements.split('\n').slice(0, 2).map((achievement, idx) => (
                                <div key={idx} className="achievement-item">
                                  <i className="fas fa-check-circle"></i>
                                  {achievement.replace(/^[•\-\*]\s*/, '')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Media Files Placeholder */}
                        <div className="media-files">
                          <span>Media Files ({Math.floor(Math.random() * 3) + 1})</span>
                          <div className="media-thumbnails">
                            <div className="media-thumb">
                              <i className="fas fa-image"></i>
                            </div>
                            <div className="media-thumb">
                              <i className="fas fa-file-pdf"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {workExperience.length > 3 && (
                    <div className="view-all-experiences">
                      <button onClick={() => dispatch(setActiveTab('experience'))}>
                        View all {workExperience.length} experiences
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-experience">
                  <i className="fas fa-briefcase"></i>
                  <h4>No Work Experience Added</h4>
                  <p>Add your professional experience to showcase your career journey.</p>
                  <button 
                    className="add-first-btn"
                    onClick={() => dispatch(setActiveTab('experience'))}
                  >
                    <i className="fas fa-plus"></i>
                    Add Your First Job
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Biography Tab */}
          {activeProfileTab === 'biography' && (
            <div className="biography-content">
              <div className="content-header">
                <h3>
                  <i className="fas fa-user"></i>
                  About Me
                </h3>
                <button 
                  className="edit-btn"
                  onClick={() => dispatch(setActiveTab('profile'))}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
              </div>
              
              {profile.about ? (
                <div className="biography-text">
                  <p>{profile.about}</p>
                </div>
              ) : (
                <div className="empty-biography">
                  <i className="fas fa-user-edit"></i>
                  <h4>Tell Your Story</h4>
                  <p>Add a professional summary to help employers understand your background and career goals.</p>
                  <button 
                    className="add-bio-btn"
                    onClick={() => dispatch(setActiveTab('profile'))}
                  >
                    <i className="fas fa-plus"></i>
                    Add Biography
                  </button>
                </div>
              )}

              {/* Contact Information */}
              <div className="contact-info">
                <h4>Contact Information</h4>
                <div className="contact-details">
                  {profile.email && (
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeProfileTab === 'skills' && (
            <div className="skills-content">
              <div className="content-header">
                <h3>
                  <i className="fas fa-tools"></i>
                  Skills & Expertise
                  <span className="count">{skills.length} skills</span>
                </h3>
                <button 
                  className="add-more-btn"
                  onClick={() => dispatch(setActiveTab('skills'))}
                >
                  <i className="fas fa-plus"></i>
                  Add More
                </button>
              </div>

              {skills.length > 0 ? (
                <div className="skills-categories">
                  {Object.entries(groupSkillsByCategory()).map(([category, categorySkills]) => (
                    <div key={category} className="skill-category">
                      <h4 className="category-name">{category}</h4>
                      <div className="skills-list">
                        {categorySkills.map(skill => (
                          <div key={skill.id} className="skill-item">
                            <div className="skill-name">
                              {skill.skill_name}
                              {skill.is_verified && (
                                <i className="fas fa-certificate verified" title="Verified"></i>
                              )}
                            </div>
                            {skill.proficiency_level && (
                              <div className="skill-level">
                                <span className="level-text">{skill.proficiency_level}</span>
                                <div className="level-bar">
                                  <div 
                                    className="level-fill"
                                    style={{
                                      width: skill.proficiency_level === 'Expert' ? '100%' :
                                             skill.proficiency_level === 'Advanced' ? '75%' :
                                             skill.proficiency_level === 'Intermediate' ? '50%' : '25%'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            {skill.years_of_experience > 0 && (
                              <div className="skill-experience">
                                {skill.years_of_experience} year{skill.years_of_experience !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-skills">
                  <i className="fas fa-tools"></i>
                  <h4>No Skills Added</h4>
                  <p>Add your technical and professional skills to showcase your expertise.</p>
                  <button 
                    className="add-first-btn"
                    onClick={() => dispatch(setActiveTab('skills'))}
                  >
                    <i className="fas fa-plus"></i>
                    Add Your Skills
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeProfileTab === 'portfolio' && (
            <div className="portfolio-content">
              <div className="content-header">
                <h3>
                  <i className="fas fa-folder"></i>
                  Portfolio & Documents
                </h3>
                <button 
                  className="add-more-btn"
                  onClick={() => dispatch(setActiveTab('resumes'))}
                >
                  <i className="fas fa-plus"></i>
                  Add More
                </button>
              </div>

              <div className="portfolio-sections">
                {/* Resumes Section */}
                <div className="portfolio-section">
                  <h4>
                    <i className="fas fa-file-alt"></i>
                    Resumes ({resumes.length})
                  </h4>
                  {resumes.length > 0 ? (
                    <div className="documents-grid">
                      {resumes.slice(0, 4).map(resume => (
                        <div key={resume.id} className="document-card">
                          <div className="doc-icon">
                            <i className="fas fa-file-pdf"></i>
                          </div>
                          <div className="doc-info">
                            <div className="doc-name">{resume.title}</div>
                            <div className="doc-meta">
                              {resume.is_primary && <span className="primary-badge">Primary</span>}
                              <span className="doc-date">
                                {new Date(resume.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="doc-actions">
                            <button 
                              onClick={() => window.open(resume.file_url, '_blank')}
                              title="View Resume"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-portfolio-section">
                      <p>No resumes uploaded yet.</p>
                      <button onClick={() => dispatch(setActiveTab('resumes'))}>
                        Upload Resume
                      </button>
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="portfolio-section">
                  <h4>
                    <i className="fas fa-graduation-cap"></i>
                    Education ({education.length})
                  </h4>
                  {education.length > 0 ? (
                    <div className="education-list">
                      {education.slice(0, 3).map(edu => (
                        <div key={edu.id} className="education-item">
                          <div className="edu-icon">
                            <i className="fas fa-university"></i>
                          </div>
                          <div className="edu-details">
                            <div className="edu-degree">{edu.degree}</div>
                            <div className="edu-institution">{edu.institution}</div>
                            <div className="edu-field">{edu.field_of_study}</div>
                            <div className="edu-date">
                              {new Date(edu.start_date).getFullYear()} - {
                                edu.is_current ? 'Present' : new Date(edu.end_date).getFullYear()
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-portfolio-section">
                      <p>No education added yet.</p>
                      <button onClick={() => dispatch(setActiveTab('education'))}>
                        Add Education
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h3>Complete Your Profile</h3>
        <div className="action-cards">
          {!profile.about && (
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-user-edit"></i>
              </div>
              <div className="action-content">
                <h4>Add Professional Summary</h4>
                <p>Tell employers about your background and goals</p>
              </div>
              <button onClick={() => dispatch(setActiveTab('profile'))}>
                Add Now
              </button>
            </div>
          )}

          {skills.length === 0 && (
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-tools"></i>
              </div>
              <div className="action-content">
                <h4>Add Your Skills</h4>
                <p>Showcase your technical and professional expertise</p>
              </div>
              <button onClick={() => dispatch(setActiveTab('skills'))}>
                Add Skills
              </button>
            </div>
          )}

          {workExperience.length === 0 && (
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="action-content">
                <h4>Add Work Experience</h4>
                <p>Share your professional journey and achievements</p>
              </div>
              <button onClick={() => dispatch(setActiveTab('experience'))}>
                Add Experience
              </button>
            </div>
          )}

          {education.length === 0 && (
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="action-content">
                <h4>Add Education</h4>
                <p>Include your academic background and qualifications</p>
              </div>
              <button onClick={() => dispatch(setActiveTab('education'))}>
                Add Education
              </button>
            </div>
          )}

          {resumes.length === 0 && (
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-file-upload"></i>
              </div>
              <div className="action-content">
                <h4>Upload Resume</h4>
                <p>Add your resume for quick job applications</p>
              </div>
              <button onClick={() => dispatch(setActiveTab('resumes'))}>
                Upload Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;