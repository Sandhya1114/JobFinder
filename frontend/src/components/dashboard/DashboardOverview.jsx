// // DashboardOverview.jsx
// import { useDispatch } from 'react-redux';
// import { setActiveTab } from '../../redux/dashboardSlice';
// // import { setActiveTab } from '../store/dashboardSlice';

// const DashboardOverview = ({ stats }) => {
//   const dispatch = useDispatch();

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
//       count: stats.totalSkills,
//       icon: 'fas fa-tools',
//       color: '#d69e2e',
//       action: () => dispatch(setActiveTab('skills'))
//     },
//     {
//       title: 'Education',
//       count: stats.totalEducation,
//       icon: 'fas fa-graduation-cap',
//       color: '#9f7aea',
//       action: () => dispatch(setActiveTab('education'))
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
//     }
//   ];

//   return (
//     <div className="dashboard-overview">
//       <div className="welcome-section">
//         <h2>
//           <i className="fas fa-home"></i>
//           Dashboard Overview
//         </h2>
//         <p>Here's a summary of your job search progress and profile completion.</p>
//       </div>

//       {/* Stats Grid */}
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
//               <p>Your profile has {stats.totalSkills} skills listed</p>
//               <span className="activity-time">Keep adding more to stand out</span>
//             </div>
//           </div>
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
//               style={{ width: `${Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}%` }}
//             ></div>
//           </div>
//           <p>
//             {Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}% Complete
//           </p>
//         </div>
//         <div className="completion-tips">
//           {stats.totalSkills === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Add your skills to increase your profile visibility
//             </div>
//           )}
//           {stats.totalEducation === 0 && (
//             <div className="tip-item">
//               <i className="fas fa-exclamation-circle"></i>
//               Add your education background
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverview;
// Enhanced DashboardOverview.jsx - Shows comprehensive profile data with navigation
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/dashboardSlice';
import { useEffect } from 'react';
// Import actions to fetch data from different sections
import { fetchProfile } from '../../redux/profileSlice';
import { fetchEducation } from '../../redux/educationSlice';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchWorkExperience } from '../../redux/workExperienceSlice';
import { fetchResumes } from '../../redux/resumesSlice';
import   './DashboardOverview.css'
const DashboardOverview = ({ stats }) => {
  const dispatch = useDispatch();
  
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

  const statCards = [
    {
      title: 'Saved Jobs',
      count: stats.savedJobs,
      icon: 'fas fa-bookmark',
      color: '#3182ce',
      action: () => dispatch(setActiveTab('saved-jobs'))
    },
    {
      title: 'Applied Jobs',
      count: stats.appliedJobs,
      icon: 'fas fa-paper-plane',
      color: '#38a169',
      action: () => dispatch(setActiveTab('saved-jobs'))
    },
    {
      title: 'Skills',
      count: skills.length,
      icon: 'fas fa-tools',
      color: '#d69e2e',
      action: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Education',
      count: education.length,
      icon: 'fas fa-graduation-cap',
      color: '#9f7aea',
      action: () => dispatch(setActiveTab('education'))
    },
    {
      title: 'Work Experience',
      count: workExperience.length,
      icon: 'fas fa-briefcase',
      color: '#e53e3e',
      action: () => dispatch(setActiveTab('experience'))
    },
    {
      title: 'Resumes',
      count: resumes.length,
      icon: 'fas fa-file-alt',
      color: '#38a169',
      action: () => dispatch(setActiveTab('resumes'))
    }
  ];

  const quickActions = [
    {
      label: 'Update Profile',
      icon: 'fas fa-user-edit',
      action: () => dispatch(setActiveTab('profile')),
      type: 'primary'
    },
    {
      label: 'Add Education',
      icon: 'fas fa-plus',
      action: () => dispatch(setActiveTab('education')),
      type: 'secondary'
    },
    {
      label: 'Add Skills',
      icon: 'fas fa-plus',
      action: () => dispatch(setActiveTab('skills')),
      type: 'secondary'
    },
    {
      label: 'Upload Resume',
      icon: 'fas fa-upload',
      action: () => dispatch(setActiveTab('resumes')),
      type: 'secondary'
    },
    {
      label: 'Add Experience',
      icon: 'fas fa-plus',
      action: () => dispatch(setActiveTab('experience')),
      type: 'secondary'
    }
  ];

  // Helper function to group skills by category
  const groupSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completion = 0;
    const totalSections = 6;
    
    // Profile basic info
    if (profile.name && profile.email) completion += 1;
    
    // Education
    if (education.length > 0) completion += 1;
    
    // Skills
    if (skills.length > 0) completion += 1;
    
    // Work Experience
    if (workExperience.length > 0) completion += 1;
    
    // Resumes
    if (resumes.length > 0) completion += 1;
    
    // Profile details (about, location, etc.)
    if (profile.about || profile.location) completion += 1;
    
    return Math.round((completion / totalSections) * 100);
  };

  return (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h2>
          <i className="fas fa-home"></i>
          Dashboard Overview
        </h2>
        <p>Complete overview of your job search progress and profile information.</p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="stat-card"
            onClick={stat.action}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Summary Section */}
      <div className="overview-section profile-summary">
        <div className="section-header">
          <h3>
            <i className="fas fa-user"></i>
            Profile Summary
          </h3>
          <button 
            className="edit-link"
            onClick={() => dispatch(setActiveTab('profile'))}
          >
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>
        
        <div className="profile-overview-content">
          {profile.name || profile.email ? (
            <div className="profile-info">
              <div className="profile-basic">
                <h4>{profile.name || 'Name not provided'}</h4>
                <p><i className="fas fa-envelope"></i> {profile.email || 'Email not provided'}</p>
                {profile.phone && <p><i className="fas fa-phone"></i> {profile.phone}</p>}
                {profile.location && <p><i className="fas fa-map-marker-alt"></i> {profile.location}</p>}
              </div>
              {profile.about && (
                <div className="profile-about">
                  <strong>About:</strong>
                  <p>{profile.about.length > 200 ? `${profile.about.substring(0, 200)}...` : profile.about}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info">
              <p>Complete your profile to make a strong first impression.</p>
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Summary */}
      <div className="overview-section experience-summary">
        <div className="section-header">
          <h3>
            <i className="fas fa-briefcase"></i>
            Work Experience ({workExperience.length})
          </h3>
          <button 
            className="edit-link"
            onClick={() => dispatch(setActiveTab('experience'))}
          >
            <i className="fas fa-plus"></i>
            Manage Experience
          </button>
        </div>
        
        <div className="experience-overview-content">
          {workExperience.length > 0 ? (
            <div className="experience-list">
              {workExperience.slice(0, 3).map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="exp-header">
                    <strong>{exp.job_title}</strong>
                    <span className="company-name">{exp.company}</span>
                  </div>
                  <div className="exp-meta">
                    <span>
                      <i className="fas fa-calendar"></i>
                      {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {exp.location}
                    </span>
                  </div>
                </div>
              ))}
              {workExperience.length > 3 && (
                <div className="view-more">
                  <button onClick={() => dispatch(setActiveTab('experience'))}>
                    View all {workExperience.length} experiences
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info">
              <p>Add your work experience to showcase your professional background.</p>
            </div>
          )}
        </div>
      </div>

      {/* Education Summary */}
      <div className="overview-section education-summary">
        <div className="section-header">
          <h3>
            <i className="fas fa-graduation-cap"></i>
            Education ({education.length})
          </h3>
          <button 
            className="edit-link"
            onClick={() => dispatch(setActiveTab('education'))}
          >
            <i className="fas fa-plus"></i>
            Manage Education
          </button>
        </div>
        
        <div className="education-overview-content">
          {education.length > 0 ? (
            <div className="education-list">
              {education.slice(0, 3).map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="edu-header">
                    <strong>{edu.degree}</strong>
                    <span className="institution-name">{edu.institution}</span>
                  </div>
                  <div className="edu-details">
                    <span className="field-study">{edu.field_of_study}</span>
                    <span className="edu-date">
                      <i className="fas fa-calendar"></i>
                      {edu.start_date ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'N/A'} - 
                      {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}` : ' N/A')}
                    </span>
                  </div>
                </div>
              ))}
              {education.length > 3 && (
                <div className="view-more">
                  <button onClick={() => dispatch(setActiveTab('education'))}>
                    View all {education.length} education entries
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info">
              <p>Add your educational background to strengthen your profile.</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="overview-section skills-summary">
        <div className="section-header">
          <h3>
            <i className="fas fa-tools"></i>
            Skills ({skills.length})
          </h3>
          <button 
            className="edit-link"
            onClick={() => dispatch(setActiveTab('skills'))}
          >
            <i className="fas fa-plus"></i>
            Manage Skills
          </button>
        </div>
        
        <div className="skills-overview-content">
          {skills.length > 0 ? (
            <div className="skills-categories">
              {Object.entries(groupSkillsByCategory()).slice(0, 3).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h4>{category}</h4>
                  <div className="skills-tags">
                    {categorySkills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill.skill_name}
                        {skill.is_verified && <i className="fas fa-certificate" title="Verified"></i>}
                      </span>
                    ))}
                    {categorySkills.length > 6 && (
                      <span className="more-skills">+{categorySkills.length - 6} more</span>
                    )}
                  </div>
                </div>
              ))}
              {Object.keys(groupSkillsByCategory()).length > 3 && (
                <div className="view-more">
                  <button onClick={() => dispatch(setActiveTab('skills'))}>
                    View all skill categories
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info">
              <p>Add your technical and professional skills to showcase your expertise.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumes Summary */}
      <div className="overview-section resumes-summary">
        <div className="section-header">
          <h3>
            <i className="fas fa-file-alt"></i>
            Resumes ({resumes.length})
          </h3>
          <button 
            className="edit-link"
            onClick={() => dispatch(setActiveTab('resumes'))}
          >
            <i className="fas fa-plus"></i>
            Manage Resumes
          </button>
        </div>
        
        <div className="resumes-overview-content">
          {resumes.length > 0 ? (
            <div className="resumes-list">
              {resumes.slice(0, 3).map((resume, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-header">
                    <i className="fas fa-file-pdf"></i>
                    <div className="resume-info">
                      <strong>{resume.title}</strong>
                      {resume.is_primary && <span className="primary-badge">Primary</span>}
                    </div>
                  </div>
                  <div className="resume-meta">
                    <span>Added {new Date(resume.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {resumes.length > 3 && (
                <div className="view-more">
                  <button onClick={() => dispatch(setActiveTab('resumes'))}>
                    View all {resumes.length} resumes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info">
              <p>Upload your resumes to apply for jobs more efficiently.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>
          <i className="fas fa-bolt"></i>
          Quick Actions
        </h3>
        <div className="action-buttons">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`action-btn ${action.type}`}
              onClick={action.action}
            >
              <i className={action.icon}></i>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="profile-completion">
        <h3>
          <i className="fas fa-tasks"></i>
          Profile Completion
        </h3>
        <div className="completion-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProfileCompletion()}%` }}
            ></div>
          </div>
          <p>{calculateProfileCompletion()}% Complete</p>
        </div>
        <div className="completion-tips">
          {!profile.name && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Complete your profile information
              <button onClick={() => dispatch(setActiveTab('profile'))}>Update Profile</button>
            </div>
          )}
          {skills.length === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Add your skills to increase profile visibility
              <button onClick={() => dispatch(setActiveTab('skills'))}>Add Skills</button>
            </div>
          )}
          {education.length === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Add your education background
              <button onClick={() => dispatch(setActiveTab('education'))}>Add Education</button>
            </div>
          )}
          {workExperience.length === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Add your work experience
              <button onClick={() => dispatch(setActiveTab('experience'))}>Add Experience</button>
            </div>
          )}
          {resumes.length === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Upload at least one resume
              <button onClick={() => dispatch(setActiveTab('resumes'))}>Upload Resume</button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>
          <i className="fas fa-clock"></i>
          Recent Activity
        </h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-bookmark"></i>
            </div>
            <div className="activity-content">
              <p>You have {stats.savedJobs} saved jobs waiting for your application</p>
              <span className="activity-time">Last updated today</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-tools"></i>
            </div>
            <div className="activity-content">
              <p>Your profile has {skills.length} skills listed</p>
              <span className="activity-time">Keep adding more to stand out</span>
            </div>
          </div>
          {workExperience.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="activity-content">
                <p>You have {workExperience.length} work experience entries</p>
                <span className="activity-time">Showcase your professional journey</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;