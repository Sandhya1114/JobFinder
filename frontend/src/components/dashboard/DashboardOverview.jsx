// Enhanced DashboardOverview.jsx - Fixed sorting issue + Modern animations
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
      icon: 'fas fa-brain',
      color: '#d69e2e',
      gradient: 'linear-gradient(135deg, #f6ad55 0%, #d69e2e 100%)',
      className: 'skills',
      action: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Education',
      count: education.length,
      icon: 'fas fa-user-graduate',
      color: '#9f7aea',
      gradient: 'linear-gradient(135deg, #b794f6 0%, #9f7aea 100%)',
      className: 'education',
      action: () => dispatch(setActiveTab('education'))
    },
    {
      title: 'Experience',
      count: workExperience.length,
      icon: 'fas fa-rocket',
      color: '#e53e3e',
      gradient: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
      className: 'experience',
      action: () => dispatch(setActiveTab('experience'))
    },
    {
      title: 'Resumes',
      count: resumes.length,
      icon: 'fas fa-file-contract',
      color: '#38a169',
      gradient: 'linear-gradient(135deg, #68d391 0%, #38a169 100%)',
      className: 'resumes',
      action: () => dispatch(setActiveTab('resumes'))
    },
    {
      title: 'Saved Jobs',
      count: stats.savedJobs || 0,
      icon: 'fas fa-heart',
      color: '#3182ce',
      gradient: 'linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)',
      className: 'saved-jobs',
      action: () => dispatch(setActiveTab('saved-jobs'))
    }
  ];

  const quickActions = [
    { icon: 'fas fa-user-cog', label: 'Update Profile', action: () => dispatch(setActiveTab('profile')), color: '#4299e1' },
    { icon: 'fas fa-plus-circle', label: 'Add Skills', action: () => dispatch(setActiveTab('skills')), color: '#d69e2e' },
    { icon: 'fas fa-briefcase', label: 'Add Experience', action: () => dispatch(setActiveTab('experience')), color: '#e53e3e' },
    { icon: 'fas fa-cloud-upload-alt', label: 'Upload Resume', action: () => dispatch(setActiveTab('resumes')), color: '#38a169' }
  ];

  // Helper function to get recent activity - FIXED SORTING ISSUE
  const getRecentActivity = () => {
    const activities = [];
    
    // Recent work experience - Create new array before sorting
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
        color: '#e53e3e'
      });
    }

    // Recent education - Create new array before sorting
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
        color: '#9f7aea'
      });
    }

    // Recent resumes - Create new array before sorting
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
        color: '#38a169'
      });
    }

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  return (
    <div className="dashboard-overview">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            <div className="avatar-inner">
              {getUserInitials()}
            </div>
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
                    <i className="fas fa-phone-alt"></i>
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

      {/* Stats Overview - Keep this section as it is since you like it */}
      <div className="stats-overview">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`stat-card-modern ${stat.className}`}
            onClick={stat.action}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-card-background" style={{ background: stat.gradient }}></div>
            <div className="stat-header">
              <div 
                className="stat-icon-modern"
                style={{ background: stat.gradient }}
              >
                <i className={stat.icon}></i>
              </div>
              <div className="stat-count-modern">{stat.count}</div>
            </div>
            <div className="stat-label-modern">{stat.title}</div>
            <div className="stat-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Work Experience Card - Enhanced */}
          <div className="content-card modern-card experience-card" style={{ animationDelay: '0.1s' }}>
            <div className="content-card-header">
              <h3 className="content-card-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)' }}>
                  <i className="fas fa-rocket"></i>
                </div>
                <div>
                  <span>Work Experience</span>
                  <small>{workExperience.length} position{workExperience.length !== 1 ? 's' : ''}</small>
                </div>
              </h3>
              <button 
                className="view-all-btn modern pulse-btn"
                onClick={() => dispatch(setActiveTab('experience'))}
              >
                <i className="fas fa-plus-circle"></i>
                Add More
              </button>
            </div>
            <div className="content-card-body">
              {workExperience.length > 0 ? (
                <div className="timeline-preview enhanced">
                  {workExperience.slice(0, 3).map((exp, index) => (
                    <div key={index} className="timeline-item-enhanced" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                      <div className="timeline-marker-enhanced">
                        <div className="marker-dot-enhanced">
                          <i className="fas fa-building"></i>
                        </div>
                        {index < workExperience.slice(0, 3).length - 1 && <div className="marker-line-enhanced"></div>}
                      </div>
                      <div className="timeline-content-enhanced">
                        <div className="experience-card-inner">
                          <div className="timeline-header">
                            <h4 className="timeline-title gradient-text">{exp.job_title}</h4>
                            <div className="timeline-company">
                              <i className="fas fa-building"></i>
                              <span>{exp.company}</span>
                            </div>
                          </div>
                          <div className="timeline-meta">
                            <span className="timeline-meta-item">
                              <i className="fas fa-calendar-alt"></i>
                              {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                              {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                            </span>
                            <span className="timeline-meta-item">
                              <i className="fas fa-map-marker-alt"></i>
                              {exp.location}
                            </span>
                            {exp.is_current && (
                              <span className="current-indicator pulse-indicator">
                                <div className="pulse-dot"></div>
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {workExperience.length > 3 && (
                    <div className="view-more-indicator">
                      <button 
                        className="view-more-btn gradient-btn"
                        onClick={() => dispatch(setActiveTab('experience'))}
                      >
                        <i className="fas fa-chevron-down"></i>
                        View all {workExperience.length} experiences
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-content modern enhanced">
                  <div className="empty-icon floating">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h4>No Experience Added</h4>
                  <p>Add your work experience to showcase your professional journey</p>
                  <button 
                    className="add-first-btn modern gradient-btn"
                    onClick={() => dispatch(setActiveTab('experience'))}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Add Your First Experience
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Education Card - Enhanced */}
          <div className="content-card modern-card education-card" style={{ animationDelay: '0.2s' }}>
            <div className="content-card-header">
              <h3 className="content-card-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #b794f6 0%, #9f7aea 100%)' }}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <span>Education</span>
                  <small>{education.length} degree{education.length !== 1 ? 's' : ''}</small>
                </div>
              </h3>
              <button 
                className="view-all-btn modern pulse-btn"
                onClick={() => dispatch(setActiveTab('education'))}
              >
                <i className="fas fa-plus-circle"></i>
                Add More
              </button>
            </div>
            <div className="content-card-body">
              {education.length > 0 ? (
                <div className="education-grid enhanced">
                  {education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="education-item-enhanced" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <div className="education-icon-enhanced">
                        <i className="fas fa-university"></i>
                      </div>
                      <div className="education-details">
                        <h4 className="education-degree gradient-text">{edu.degree}</h4>
                        <p className="education-institution">{edu.institution}</p>
                        <div className="education-meta">
                          <span className="field-of-study">
                            <i className="fas fa-book-open"></i>
                            {edu.field_of_study}
                          </span>
                          <span className="education-period">
                            <i className="fas fa-calendar-alt"></i>
                            {edu.start_date ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'N/A'} - 
                            {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}` : ' N/A')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {education.length > 2 && (
                    <div className="view-more-compact">
                      <button onClick={() => dispatch(setActiveTab('education'))} className="gradient-btn">
                        <i className="fas fa-plus"></i>
                        +{education.length - 2} more
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-content modern enhanced">
                  <div className="empty-icon floating">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <h4>No Education Added</h4>
                  <p>Add your educational background</p>
                  <button 
                    className="add-first-btn modern gradient-btn"
                    onClick={() => dispatch(setActiveTab('education'))}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Add Education
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Card - Enhanced */}
          <div className="content-card modern-card skills-card" style={{ animationDelay: '0.3s' }}>
            <div className="content-card-header">
              <h3 className="content-card-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #f6ad55 0%, #d69e2e 100%)' }}>
                  <i className="fas fa-brain"></i>
                </div>
                <div>
                  <span>Skills & Expertise</span>
                  <small>{skills.length} skill{skills.length !== 1 ? 's' : ''}</small>
                </div>
              </h3>
              <button 
                className="view-all-btn modern pulse-btn"
                onClick={() => dispatch(setActiveTab('skills'))}
              >
                <i className="fas fa-plus-circle"></i>
                Add More
              </button>
            </div>
            <div className="content-card-body">
              {skills.length > 0 ? (
                <div className="skills-modern-preview enhanced">
                  <div className="skills-categories">
                    {Object.entries(groupSkillsByCategory()).slice(0, 3).map(([category, categorySkills], index) => (
                      <div key={category} className="skill-category-preview enhanced" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                        <h5 className="category-name gradient-text">
                          <i className="fas fa-layer-group"></i>
                          {category}
                        </h5>
                        <div className="category-skills">
                          {categorySkills.slice(0, 4).map((skill, skillIndex) => (
                            <span key={skillIndex} className="skill-tag-enhanced">
                              <i className="fas fa-code"></i>
                              {skill.skill_name}
                              {skill.is_verified && <i className="fas fa-certificate skill-verified pulse"></i>}
                            </span>
                          ))}
                          {categorySkills.length > 4 && (
                            <span className="skill-tag-more gradient">+{categorySkills.length - 4}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-content modern enhanced">
                  <div className="empty-icon floating">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h4>No Skills Added</h4>
                  <p>Add your technical and professional skills</p>
                  <button 
                    className="add-first-btn modern gradient-btn"
                    onClick={() => dispatch(setActiveTab('skills'))}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Add Skills
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Profile Completion Card - Enhanced */}
          <div className="content-card modern-card completion-card enhanced" style={{ animationDelay: '0.1s' }}>
            <div className="completion-header">
              <h3 className="completion-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' }}>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                  <span>Profile Completion</span>
                  <small>Boost your visibility</small>
                </div>
              </h3>
            </div>
            <div className="completion-content">
              <div className="completion-circle enhanced">
                <div className="circle-progress animated" style={{ '--progress': calculateProfileCompletion() }}>
                  <div className="circle-inner">
                    <span className="completion-percentage">{calculateProfileCompletion()}%</span>
                    <small>Complete</small>
                  </div>
                </div>
              </div>
              <div className="completion-details">
                <div className="completion-items">
                  <div className={`completion-item ${profile.name ? 'completed' : ''}`}>
                    <i className={profile.name ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                    <span>Basic Info</span>
                  </div>
                  <div className={`completion-item ${workExperience.length > 0 ? 'completed' : ''}`}>
                    <i className={workExperience.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                    <span>Work Experience</span>
                  </div>
                  <div className={`completion-item ${education.length > 0 ? 'completed' : ''}`}>
                    <i className={education.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                    <span>Education</span>
                  </div>
                  <div className={`completion-item ${skills.length > 0 ? 'completed' : ''}`}>
                    <i className={skills.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                    <span>Skills</span>
                  </div>
                  <div className={`completion-item ${resumes.length > 0 ? 'completed' : ''}`}>
                    <i className={resumes.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                    <span>Resume</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumes Card - Enhanced */}
          <div className="content-card modern-card resumes-card" style={{ animationDelay: '0.2s' }}>
            <div className="content-card-header">
              <h3 className="content-card-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #68d391 0%, #38a169 100%)' }}>
                  <i className="fas fa-file-contract"></i>
                </div>
                <div>
                  <span>Resume Library</span>
                  <small>{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</small>
                </div>
              </h3>
              <button 
                className="view-all-btn modern pulse-btn"
                onClick={() => dispatch(setActiveTab('resumes'))}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                Upload
              </button>
            </div>
            <div className="content-card-body">
              {resumes.length > 0 ? (
                <div className="resumes-preview enhanced">
                  {resumes.slice(0, 3).map((resume, index) => (
                    <div key={index} className="resume-item-enhanced" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <div className="resume-icon-enhanced">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className="resume-info-preview">
                        <h5 className="gradient-text">{resume.title}</h5>
                        <div className="resume-meta-preview">
                          <span>
                            <i className="fas fa-calendar-alt"></i>
                            {new Date(resume.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          {resume.is_primary && (
                            <span className="primary-tag pulse">
                              <i className="fas fa-star"></i>
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="resume-view-btn gradient-btn" onClick={() => window.open(resume.file_url, '_blank')}>
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-content modern enhanced">
                  <div className="empty-icon floating">
                    <i className="fas fa-file-contract"></i>
                  </div>
                  <h4>No Resumes Uploaded</h4>
                  <p>Upload your resume to apply for jobs</p>
                  <button 
                    className="add-first-btn modern gradient-btn"
                    onClick={() => dispatch(setActiveTab('resumes'))}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Card - Enhanced */}
          <div className="content-card modern-card activity-card" style={{ animationDelay: '0.3s' }}>
            <div className="content-card-header">
              <h3 className="content-card-title">
                <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)' }}>
                  <i className="fas fa-history"></i>
                </div>
                <div>
                  <span>Recent Activity</span>
                  <small>Latest updates</small>
                </div>
              </h3>
            </div>
            <div className="content-card-body">
              {getRecentActivity().length > 0 ? (
                <div className="activity-list enhanced">
                  {getRecentActivity().map((activity, index) => (
                    <div key={index} className="activity-item enhanced" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                      <div className="activity-icon floating-mini" style={{ backgroundColor: activity.color }}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-content">
                        <p className="activity-title gradient-text">{activity.title}</p>
                        <p className="activity-subtitle">{activity.subtitle}</p>
                        <span className="activity-date">
                          <i className="fas fa-clock"></i>
                          {new Date(activity.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-content modern enhanced small">
                  <div className="empty-icon floating">
                    <i className="fas fa-history"></i>
                  </div>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="quick-actions-modern enhanced" style={{ animationDelay: '0.4s' }}>
        <h3 className="quick-actions-title">
          <div className="title-icon floating-icon" style={{ background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)' }}>
            <i className="fas fa-bolt"></i>
          </div>
          Quick Actions
        </h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-card modern enhanced"
              onClick={action.action}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="action-icon floating-mini" style={{ backgroundColor: action.color }}>
                <i className={action.icon}></i>
              </div>
              <span>{action.label}</span>
              <div className="action-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;