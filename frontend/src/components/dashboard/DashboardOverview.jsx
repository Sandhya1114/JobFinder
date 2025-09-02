// Enhanced DashboardOverview.jsx - LinkedIn-inspired Professional Design
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

  // Helper function to get recent activity - FIXED SORTING ISSUE
  const getRecentActivity = () => {
    const activities = [];
    
    if (workExperience.length > 0) {
      const sortedExperience = [...workExperience].sort((a, b) => 
        new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date)
      );
      const latest = sortedExperience[0];
      activities.push({
        type: 'experience',
        icon: 'fas fa-rocket',
        title: `Added experience at ${latest.company}`,
        subtitle: latest.job_title,
        date: latest.created_at || latest.start_date,
        color: '#0066cc'
      });
    }

    if (education.length > 0) {
      const sortedEducation = [...education].sort((a, b) => 
        new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date)
      );
      const latest = sortedEducation[0];
      activities.push({
        type: 'education',
        icon: 'fas fa-user-graduate',
        title: `Added education from ${latest.institution}`,
        subtitle: latest.degree,
        date: latest.created_at || latest.start_date,
        color: '#0066cc'
      });
    }

    if (resumes.length > 0) {
      const sortedResumes = [...resumes].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      const latest = sortedResumes[0];
      activities.push({
        type: 'resume',
        icon: 'fas fa-file-contract',
        title: `Uploaded resume`,
        subtitle: latest.title,
        date: latest.created_at,
        color: '#0066cc'
      });
    }

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  // Get current position
  const getCurrentPosition = () => {
    if (workExperience.length === 0) return null;
    const currentJob = workExperience.find(exp => exp.is_current) || workExperience[0];
    return currentJob;
  };

  const currentPosition = getCurrentPosition();

  return (
    <div className="dashboard-overview">
      {/* LinkedIn-style Profile Header */}
      <div className="linkedin-profile-header">
        {/* Cover Photo Area */}
        <div className="profile-cover">
          <div className="cover-gradient"></div>
        </div>
        
        {/* Profile Content */}
        <div className="profile-main-content">
          <div className="profile-info-section">
            {/* Avatar and Basic Info */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-linkedin">
                <div className="avatar-inner-linkedin">
                  {getUserInitials()}
                </div>
                <div className="avatar-status-indicator"></div>
              </div>
              <div className="profile-basic-info">
                <h3 className="profile-name-linkedin">
                  {profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Your Name'}
                </h3>
                {currentPosition && (
                  <p className="profile-headline">
                    {currentPosition.job_title} at {currentPosition.company}
                  </p>
                )}
                <div className="profile-location-info">
                  {(profile.location || profile.phone || profile.email) && (
                    <div className="location-details">
                      {profile.location && (
                        <span className="location-item">
                          <i className="fas fa-map-marker-alt"></i>
                          {profile.location}
                        </span>
                      )}
                      {profile.email && (
                        <span className="contact-item">
                          <i className="fas fa-envelope"></i>
                          Contact info
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="profile-connections">
                  <span className="connections-count">
                    <strong>{skills.length + education.length + workExperience.length}</strong> profile sections completed
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions-linkedin">
              <button 
                className="btn-primary-linkedin"
                onClick={() => dispatch(setActiveTab('profile'))}
              >
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
              <button 
                className="btn-secondary-linkedin"
                onClick={() => dispatch(setActiveTab('resumes'))}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                Add Resume
              </button>
              {/* <button className="btn-secondary-linkedin">
                <i className="fas fa-share-alt"></i>
                Share
              </button>
              <button className="btn-icon-linkedin">
                <i className="fas fa-ellipsis-h"></i>
              </button> */}
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="profile-completion-card">
            <div className="completion-header">
              <h3>Complete your profile</h3>
              <span className="completion-percentage">{calculateProfileCompletion()}% completed</span>
            </div>
            <div className="completion-progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateProfileCompletion()}%` }}
              ></div>
            </div>
            <p className="completion-text">
              Add {6 - Math.ceil((calculateProfileCompletion() / 100) * 6)} more sections to boost your visibility
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-linkedin">
        {[
          {
            title: 'Work Experience',
            count: workExperience.length,
            icon: 'fas fa-briefcase',
            color: '#0066cc',
            action: () => dispatch(setActiveTab('experience'))
          },
          {
            title: 'Education',
            count: education.length,
            icon: 'fas fa-graduation-cap',
            color: '#0066cc',
            action: () => dispatch(setActiveTab('education'))
          },
          {
            title: 'Skills',
            count: skills.length,
            icon: 'fas fa-brain',
            color: '#0066cc',
            action: () => dispatch(setActiveTab('skills'))
          },
          {
            title: 'Resumes',
            count: resumes.length,
            icon: 'fas fa-file-alt',
            color: '#0066cc',
            action: () => dispatch(setActiveTab('resumes'))
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="stat-card-linkedin"
            onClick={stat.action}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
            <div className="stat-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid-linkedin">
        {/* Left Column */}
        <div className="content-left">
          {/* About Section */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>About</h2>
              <button 
                className="edit-btn"
                onClick={() => dispatch(setActiveTab('profile'))}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
            <div className="card-content">
              {profile.about ? (
                <p className="about-text">{profile.about}</p>
              ) : (
                <div className="empty-state">
                  <p>Share your story and let others know more about you</p>
                  <button 
                    className="add-about-btn"
                    onClick={() => dispatch(setActiveTab('profile'))}
                  >
                    Add about section
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Experience</h2>
              <button 
                className="edit-btn"
                onClick={() => dispatch(setActiveTab('experience'))}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="card-content">
              {workExperience.length > 0 ? (
                <div className="experience-list">
                  {workExperience.slice(0, 3).map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="company-logo">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="experience-details">
                        <h3>{exp.job_title}</h3>
                        <p className="company-name">{exp.company}</p>
                        <p className="duration">
                          {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                          {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                        </p>
                        <p className="location">{exp.location}</p>
                        {exp.is_current && (
                          <span className="current-badge">Current</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {workExperience.length > 3 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => dispatch(setActiveTab('experience'))}
                    >
                      Show all {workExperience.length} experiences <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Show your professional journey</p>
                  <button 
                    className="add-experience-btn"
                    onClick={() => dispatch(setActiveTab('experience'))}
                  >
                    Add experience
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Education</h2>
              <button 
                className="edit-btn"
                onClick={() => dispatch(setActiveTab('education'))}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="card-content">
              {education.length > 0 ? (
                <div className="education-list">
                  {education.slice(0, 3).map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="school-logo">
                        <i className="fas fa-university"></i>
                      </div>
                      <div className="education-details">
                        <h3>{edu.institution}</h3>
                        <p className="degree">{edu.degree}</p>
                        <p className="field">{edu.field_of_study}</p>
                        <p className="duration">
                          {edu.start_date ? new Date(edu.start_date).getFullYear() : 'N/A'} - 
                          {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).getFullYear()}` : ' N/A')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {education.length > 3 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => dispatch(setActiveTab('education'))}
                    >
                      Show all {education.length} education <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Add your educational background</p>
                  <button 
                    className="add-education-btn"
                    onClick={() => dispatch(setActiveTab('education'))}
                  >
                    Add education
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Skills</h2>
              <button 
                className="edit-btn"
                onClick={() => dispatch(setActiveTab('skills'))}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="card-content">
              {skills.length > 0 ? (
                <div className="skills-section">
                  <div className="skills-grid">
                    {skills.slice(0, 6).map((skill, index) => (
                      <div key={index} className="skill-badge-linkedin">
                        <span>{skill.skill_name}</span>
                        {skill.is_verified && <i className="fas fa-certificate verified"></i>}
                      </div>
                    ))}
                  </div>
                  {skills.length > 6 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => dispatch(setActiveTab('skills'))}
                    >
                      Show all {skills.length} skills <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Add skills to showcase your expertise</p>
                  <button 
                    className="add-skills-btn"
                    onClick={() => dispatch(setActiveTab('skills'))}
                  >
                    Add skills
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Resume Section */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Resumes</h2>
              <button 
                className="edit-btn"
                onClick={() => dispatch(setActiveTab('resumes'))}
              >
                <i className="fas fa-cloud-upload-alt"></i>
              </button>
            </div>
            <div className="card-content">
              {resumes.length > 0 ? (
                <div className="resumes-list">
                  {resumes.slice(0, 3).map((resume, index) => (
                    <div key={index} className="resume-item-linkedin">
                      <div className="resume-icon">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className="resume-details">
                        <h4>{resume.title}</h4>
                        <p className="upload-date">
                          Uploaded {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                        {resume.is_primary && (
                          <span className="primary-badge">Primary</span>
                        )}
                      </div>
                      <button 
                        className="view-resume-btn"
                        onClick={() => window.open(resume.file_url, '_blank')}
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Upload your resume to showcase your qualifications</p>
                  <button 
                    className="add-resume-btn"
                    onClick={() => dispatch(setActiveTab('resumes'))}
                  >
                    Upload resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="card-content">
              {getRecentActivity().length > 0 ? (
                <div className="activity-list-linkedin">
                  {getRecentActivity().map((activity, index) => (
                    <div key={index} className="activity-item-linkedin">
                      <div className="activity-icon" style={{ color: activity.color }}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-details">
                        <p className="activity-title">{activity.title}</p>
                        <p className="activity-subtitle">{activity.subtitle}</p>
                        <span className="activity-date">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state small">
                  <p>No recent activity to show</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card-linkedin">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="card-content">
              <div className="quick-actions-list">
                <button 
                  className="quick-action-item"
                  onClick={() => dispatch(setActiveTab('profile'))}
                >
                  <i className="fas fa-user-edit"></i>
                  <span>Update Profile</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <button 
                  className="quick-action-item"
                  onClick={() => dispatch(setActiveTab('skills'))}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Add Skills</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <button 
                  className="quick-action-item"
                  onClick={() => dispatch(setActiveTab('experience'))}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Add Experience</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <button 
                  className="quick-action-item"
                  onClick={() => dispatch(setActiveTab('resumes'))}
                >
                  <i className="fas fa-upload"></i>
                  <span>Upload Resume</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;