// Updated DashboardOverview.jsx - Professional layout inspired by the provided image
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/dashboardSlice';
import { useEffect } from 'react';
import { fetchProfile } from '../../redux/profileSlice';
import { fetchEducation } from '../../redux/educationSlice';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchWorkExperience } from '../../redux/workExperienceSlice';
import { fetchResumes } from '../../redux/resumesSlice';
import './DashboardOverview.css';

const DashboardOverview = ({ stats }) => {
  const dispatch = useDispatch();
  
  // Get data from all sections
  const profile = useSelector(state => state.profile?.data || {});
  const education = useSelector(state => state.education?.items || []);
  const skills = useSelector(state => state.skills?.items || []);
  const workExperience = useSelector(state => state.workExperience?.items || []);
  const resumes = useSelector(state => state.resumes?.items || []);
  const user = useSelector(state => state.auth?.user);

  // Fetch all data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchEducation());
    dispatch(fetchSkills());
    dispatch(fetchWorkExperience());
    dispatch(fetchResumes());
  }, [dispatch]);

  // Helper function to get user initials
  const getUserInitials = () => {
    const name = profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completion = 0;
    const totalSections = 6;
    
    if (profile.name && profile.email) completion += 1;
    if (education.length > 0) completion += 1;
    if (skills.length > 0) completion += 1;
    if (workExperience.length > 0) completion += 1;
    if (resumes.length > 0) completion += 1;
    if (profile.about || profile.location) completion += 1;
    
    return Math.round((completion / totalSections) * 100);
  };

  const statCards = [
    {
      title: 'Skills',
      count: skills.length,
      icon: 'fas fa-tools',
      color: '#d69e2e',
      className: 'skills',
      action: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Education',
      count: education.length,
      icon: 'fas fa-graduation-cap',
      color: '#9f7aea',
      className: 'education',
      action: () => dispatch(setActiveTab('education'))
    },
    {
      title: 'Experience',
      count: workExperience.length,
      icon: 'fas fa-briefcase',
      color: '#e53e3e',
      className: 'experience',
      action: () => dispatch(setActiveTab('experience'))
    },
    {
      title: 'Resumes',
      count: resumes.length,
      icon: 'fas fa-file-alt',
      color: '#38a169',
      className: 'resumes',
      action: () => dispatch(setActiveTab('resumes'))
    },
    {
      title: 'Saved Jobs',
      count: stats.savedJobs || 0,
      icon: 'fas fa-bookmark',
      color: '#3182ce',
      className: 'saved-jobs',
      action: () => dispatch(setActiveTab('saved-jobs'))
    }
  ];

  const quickActions = [
    { icon: 'fas fa-user-edit', label: 'Update Profile', action: () => dispatch(setActiveTab('profile')) },
    { icon: 'fas fa-plus', label: 'Add Skills', action: () => dispatch(setActiveTab('skills')) },
    { icon: 'fas fa-briefcase', label: 'Add Experience', action: () => dispatch(setActiveTab('experience')) },
    { icon: 'fas fa-upload', label: 'Upload Resume', action: () => dispatch(setActiveTab('resumes')) }
  ];

  return (
    <div className="dashboard-overview">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {getUserInitials()}
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">
              {profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Your Name'}
            </h2>
            <div className="profile-email">
              <i className="fas fa-envelope"></i>
              <span>{profile.email || user?.email || 'your.email@example.com'}</span>
            </div>
            {(profile.location || profile.phone) && (
              <div className="profile-location">
                {profile.location && (
                  <>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{profile.location}</span>
                  </>
                )}
                {profile.phone && (
                  <>
                    <i className="fas fa-phone"></i>
                    <span>{profile.phone}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="profile-header-actions">
            <button 
              className="profile-action-btn primary"
              onClick={() => dispatch(setActiveTab('profile'))}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
            <button className="profile-action-btn secondary">
              <i className="fas fa-eye"></i>
              Public View
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`stat-card-new ${stat.className}`}
            onClick={stat.action}
          >
            <div className="stat-header">
              <div 
                className="stat-icon-new"
                style={{ backgroundColor: stat.color }}
              >
                <i className={stat.icon}></i>
              </div>
              <div className="stat-count-new">{stat.count}</div>
            </div>
            <div className="stat-label-new">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Work Experience Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">
            <i className="fas fa-briefcase"></i>
            Job Experience
            <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#718096' }}>
              {workExperience.length} job{workExperience.length !== 1 ? 's' : ''} history
            </span>
          </h3>
          <button 
            className="view-all-btn"
            onClick={() => dispatch(setActiveTab('experience'))}
          >
            + Add More
          </button>
        </div>
        <div className="content-card-body">
          {workExperience.length > 0 ? (
            <div className="timeline-items">
              {workExperience.slice(0, 3).map((exp, index) => (
                <div key={index} className="timeline-item-card">
                  <div className="timeline-content-card">
                    <div className="timeline-header">
                      <div>
                        <h4 className="timeline-title">{exp.job_title}</h4>
                        <p className="timeline-subtitle">
                          <i className="fas fa-building"></i>
                          {exp.company}
                        </p>
                      </div>
                    </div>
                    <div className="timeline-meta">
                      <span className="timeline-meta-item">
                        <i className="fas fa-calendar"></i>
                        {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                        {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                      </span>
                      <span className="timeline-meta-item">
                        <i className="fas fa-map-marker-alt"></i>
                        {exp.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {workExperience.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button 
                    className="view-all-btn"
                    onClick={() => dispatch(setActiveTab('experience'))}
                  >
                    View all {workExperience.length} experiences
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-content">
              <i className="fas fa-briefcase"></i>
              <h4>No Experience Added</h4>
              <p>Add your work experience to showcase your professional journey</p>
              <button 
                className="add-first-btn"
                onClick={() => dispatch(setActiveTab('experience'))}
              >
                Add Your First Experience
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Education Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">
            <i className="fas fa-graduation-cap"></i>
            Education
          </h3>
          <button 
            className="view-all-btn"
            onClick={() => dispatch(setActiveTab('education'))}
          >
            + Add More
          </button>
        </div>
        <div className="content-card-body">
          {education.length > 0 ? (
            <div className="timeline-items">
              {education.slice(0, 2).map((edu, index) => (
                <div key={index} className="timeline-item-card">
                  <div className="timeline-content-card">
                    <div className="timeline-header">
                      <div>
                        <h4 className="timeline-title">{edu.degree}</h4>
                        <p className="timeline-subtitle">
                          <i className="fas fa-university"></i>
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                    <div className="timeline-meta">
                      <span className="timeline-meta-item">
                        <i className="fas fa-book"></i>
                        {edu.field_of_study}
                      </span>
                      <span className="timeline-meta-item">
                        <i className="fas fa-calendar"></i>
                        {edu.start_date ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'N/A'} - 
                        {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}` : ' N/A')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-content">
              <i className="fas fa-graduation-cap"></i>
              <h4>No Education Added</h4>
              <p>Add your educational background</p>
              <button 
                className="add-first-btn"
                onClick={() => dispatch(setActiveTab('education'))}
              >
                Add Education
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skills Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">
            <i className="fas fa-tools"></i>
            Skills
          </h3>
          <button 
            className="view-all-btn"
            onClick={() => dispatch(setActiveTab('skills'))}
          >
            + Add More
          </button>
        </div>
        <div className="content-card-body">
          {skills.length > 0 ? (
            <div className="skills-preview">
              {skills.slice(0, 10).map((skill, index) => (
                <span key={index} className="skill-tag-preview">
                  {skill.skill_name}
                  {skill.is_verified && <i className="fas fa-certificate skill-verified"></i>}
                </span>
              ))}
              {skills.length > 10 && (
                <span className="skill-tag-preview" style={{ background: '#e2e8f0' }}>
                  +{skills.length - 10} more
                </span>
              )}
            </div>
          ) : (
            <div className="empty-content">
              <i className="fas fa-tools"></i>
              <h4>No Skills Added</h4>
              <p>Add your technical and professional skills</p>
              <button 
                className="add-first-btn"
                onClick={() => dispatch(setActiveTab('skills'))}
              >
                Add Skills
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-new">
        <h3 className="quick-actions-title">
          <i className="fas fa-bolt"></i>
          Quick Actions
        </h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-card"
              onClick={action.action}
            >
              <i className={action.icon}></i>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="profile-completion-new">
        <div className="completion-header">
          <h3 className="completion-title">
            <i className="fas fa-tasks"></i>
            Profile Completion
          </h3>
        </div>
        <div className="completion-bar">
          <div 
            className="completion-fill" 
            style={{ width: `${calculateProfileCompletion()}%` }}
          ></div>
        </div>
        <div className="completion-percentage">
          {calculateProfileCompletion()}% Complete
        </div>
        <div className="completion-tips">
          {!profile.name && (
            <div className="completion-tip">
              <i className="fas fa-exclamation-circle"></i>
              Upload at least one resume
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;