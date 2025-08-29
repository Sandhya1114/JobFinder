// Enhanced DashboardOverview.jsx - Modern, Stylish, and Animated
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/dashboardSlice';
import { useEffect, useState } from 'react';
import { fetchProfile } from '../../redux/profileSlice';
import { fetchEducation } from '../../redux/educationSlice';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchWorkExperience } from '../../redux/workExperienceSlice';
import { fetchResumes } from '../../redux/resumesSlice';
import './DashboardOverview.css';

const DashboardOverview = ({ stats }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCounts, setAnimatedCounts] = useState({});
  
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
    setIsVisible(true);
  }, [dispatch]);

  // Animate counters
  useEffect(() => {
    const counters = {
      skills: skills.length,
      education: education.length,
      experience: workExperience.length,
      resumes: resumes.length,
      savedJobs: stats.savedJobs || 0
    };

    Object.keys(counters).forEach(key => {
      const targetValue = counters[key];
      let currentValue = 0;
      const increment = Math.ceil(targetValue / 30);
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        setAnimatedCounts(prev => ({ ...prev, [key]: currentValue }));
      }, 50);
    });
  }, [skills, education, workExperience, resumes, stats]);

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
      count: animatedCounts.skills || 0,
      icon: 'fas fa-tools',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      className: 'skills',
      action: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Education',
      count: animatedCounts.education || 0,
      icon: 'fas fa-graduation-cap',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      className: 'education',
      action: () => dispatch(setActiveTab('education'))
    },
    {
      title: 'Experience',
      count: animatedCounts.experience || 0,
      icon: 'fas fa-briefcase',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      className: 'experience',
      action: () => dispatch(setActiveTab('experience'))
    },
    {
      title: 'Resumes',
      count: animatedCounts.resumes || 0,
      icon: 'fas fa-file-alt',
      color: '#43e97b',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      className: 'resumes',
      action: () => dispatch(setActiveTab('resumes'))
    },
    {
      title: 'Saved Jobs',
      count: animatedCounts.savedJobs || 0,
      icon: 'fas fa-bookmark',
      color: '#fa709a',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      className: 'saved-jobs',
      action: () => dispatch(setActiveTab('saved-jobs'))
    }
  ];

  const quickActions = [
    { icon: 'fas fa-user-edit', label: 'Update Profile', action: () => dispatch(setActiveTab('profile')), color: '#667eea' },
    { icon: 'fas fa-plus', label: 'Add Skills', action: () => dispatch(setActiveTab('skills')), color: '#f093fb' },
    { icon: 'fas fa-briefcase', label: 'Add Experience', action: () => dispatch(setActiveTab('experience')), color: '#4facfe' },
    { icon: 'fas fa-upload', label: 'Upload Resume', action: () => dispatch(setActiveTab('resumes')), color: '#43e97b' }
  ];

  const getLatestWorkExperience = () => {
    return workExperience
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .slice(0, 3);
  };

  const getLatestEducation = () => {
    return education
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .slice(0, 2);
  };

  const getSkillCategories = () => {
    const grouped = groupSkillsByCategory();
    return Object.entries(grouped).slice(0, 4);
  };

  const getRecentResumes = () => {
    return resumes
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  };

  return (
    <div className={`dashboard-overview ${isVisible ? 'animate-in' : ''}`}>
      
      {/* Welcome Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome back, {profile.name || user?.user_metadata?.full_name || 'there'}!
            </h1>
            <p className="hero-subtitle">
              Your career journey continues here. Let's make today productive.
            </p>
          </div>
          <div className="hero-avatar">
            <div className="profile-avatar-hero">
              {getUserInitials()}
            </div>
            <div className="hero-pulse"></div>
          </div>
        </div>
      </div>

      {/* Interactive Stats Cards */}
      <div className="stats-overview-modern">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`stat-card-modern ${stat.className}`}
            onClick={stat.action}
            style={{ 
              '--delay': `${index * 0.1}s`,
              '--gradient': stat.gradient
            }}
          >
            <div className="stat-card-background"></div>
            <div className="stat-card-content">
              <div className="stat-icon-modern">
                <i className={stat.icon}></i>
              </div>
              <div className="stat-info">
                <div className="stat-count-modern">{stat.count}</div>
                <div className="stat-label-modern">{stat.title}</div>
              </div>
            </div>
            <div className="stat-card-glow"></div>
          </div>
        ))}
      </div>

      {/* Profile Completion with Animation */}
      <div className="profile-completion-modern">
        <div className="completion-header">
          <h3 className="completion-title">
            <i className="fas fa-chart-line"></i>
            Profile Strength
          </h3>
          <div className="completion-score">
            <span className="score-number">{calculateProfileCompletion()}</span>
            <span className="score-label">% Complete</span>
          </div>
        </div>
        <div className="completion-bar-modern">
          <div 
            className="completion-fill-modern" 
            style={{ 
              width: `${calculateProfileCompletion()}%`,
              '--completion': `${calculateProfileCompletion()}%`
            }}
          ></div>
        </div>
        <div className="completion-sections">
          <div className={`section-indicator ${profile.name && profile.email ? 'complete' : ''}`}>
            <i className="fas fa-user"></i>
            <span>Basic Info</span>
          </div>
          <div className={`section-indicator ${education.length > 0 ? 'complete' : ''}`}>
            <i className="fas fa-graduation-cap"></i>
            <span>Education</span>
          </div>
          <div className={`section-indicator ${skills.length > 0 ? 'complete' : ''}`}>
            <i className="fas fa-tools"></i>
            <span>Skills</span>
          </div>
          <div className={`section-indicator ${workExperience.length > 0 ? 'complete' : ''}`}>
            <i className="fas fa-briefcase"></i>
            <span>Experience</span>
          </div>
          <div className={`section-indicator ${resumes.length > 0 ? 'complete' : ''}`}>
            <i className="fas fa-file-alt"></i>
            <span>Resume</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="overview-grid">
        
        {/* Profile Summary Card */}
        <div className="overview-card profile-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-user-circle"></i>
              Profile Summary
            </h3>
            <button 
              className="card-action-btn"
              onClick={() => dispatch(setActiveTab('profile'))}
            >
              <i className="fas fa-edit"></i>
              Edit
            </button>
          </div>
          <div className="card-content">
            {profile.name || profile.email ? (
              <div className="profile-summary">
                <div className="profile-basic">
                  <div className="profile-avatar-small">
                    {getUserInitials()}
                  </div>
                  <div className="profile-details">
                    <h4>{profile.name || 'Name not set'}</h4>
                    <p className="profile-email-small">
                      <i className="fas fa-envelope"></i>
                      {profile.email || user?.email || 'Email not set'}
                    </p>
                    {profile.location && (
                      <p className="profile-location-small">
                        <i className="fas fa-map-marker-alt"></i>
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>
                {profile.about && (
                  <div className="profile-about-preview">
                    <p>{profile.about.substring(0, 120)}...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-preview">
                <i className="fas fa-user-plus"></i>
                <p>Complete your profile to get started</p>
                <button 
                  className="setup-btn"
                  onClick={() => dispatch(setActiveTab('profile'))}
                >
                  Setup Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Latest Work Experience */}
        <div className="overview-card experience-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-briefcase"></i>
              Recent Experience
            </h3>
            <button 
              className="card-action-btn"
              onClick={() => dispatch(setActiveTab('experience'))}
            >
              <i className="fas fa-plus"></i>
              Add More
            </button>
          </div>
          <div className="card-content">
            {workExperience.length > 0 ? (
              <div className="experience-preview">
                {getLatestWorkExperience().map((exp, index) => (
                  <div key={index} className="experience-item-preview">
                    <div className="experience-timeline-dot"></div>
                    <div className="experience-details">
                      <h4 className="experience-title">{exp.job_title}</h4>
                      <p className="experience-company">
                        <i className="fas fa-building"></i>
                        {exp.company}
                      </p>
                      <div className="experience-meta">
                        <span className="experience-dates">
                          <i className="fas fa-calendar"></i>
                          {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                          {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                        </span>
                        {exp.is_current && (
                          <span className="current-indicator">
                            <i className="fas fa-circle"></i>
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {workExperience.length > 3 && (
                  <div className="view-more-indicator">
                    <span>+{workExperience.length - 3} more experiences</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-preview">
                <i className="fas fa-briefcase"></i>
                <p>Add your work experience</p>
                <button 
                  className="setup-btn"
                  onClick={() => dispatch(setActiveTab('experience'))}
                >
                  Add Experience
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Education Overview */}
        <div className="overview-card education-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-graduation-cap"></i>
              Education
            </h3>
            <button 
              className="card-action-btn"
              onClick={() => dispatch(setActiveTab('education'))}
            >
              <i className="fas fa-plus"></i>
              Add More
            </button>
          </div>
          <div className="card-content">
            {education.length > 0 ? (
              <div className="education-preview">
                {getLatestEducation().map((edu, index) => (
                  <div key={index} className="education-item-preview">
                    <div className="education-icon">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="education-details">
                      <h4 className="education-degree">{edu.degree}</h4>
                      <p className="education-institution">{edu.institution}</p>
                      <p className="education-field">{edu.field_of_study}</p>
                      <div className="education-dates">
                        <i className="fas fa-calendar"></i>
                        {edu.start_date ? new Date(edu.start_date).getFullYear() : 'N/A'} - 
                        {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).getFullYear()}` : ' N/A')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-preview">
                <i className="fas fa-graduation-cap"></i>
                <p>Add your educational background</p>
                <button 
                  className="setup-btn"
                  onClick={() => dispatch(setActiveTab('education'))}
                >
                  Add Education
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Skills Overview */}
        <div className="overview-card skills-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-tools"></i>
              Skills Portfolio
            </h3>
            <button 
              className="card-action-btn"
              onClick={() => dispatch(setActiveTab('skills'))}
            >
              <i className="fas fa-plus"></i>
              Add Skills
            </button>
          </div>
          <div className="card-content">
            {skills.length > 0 ? (
              <div className="skills-preview-modern">
                {getSkillCategories().map(([category, categorySkills]) => (
                  <div key={category} className="skill-category-preview">
                    <div className="category-header">
                      <h4 className="category-name">{category}</h4>
                      <span className="category-count">{categorySkills.length}</span>
                    </div>
                    <div className="skills-tags-preview">
                      {categorySkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag-modern">
                          {skill.skill_name}
                          {skill.is_verified && (
                            <i className="fas fa-certificate skill-verified"></i>
                          )}
                        </span>
                      ))}
                      {categorySkills.length > 3 && (
                        <span className="skill-tag-modern more-indicator">
                          +{categorySkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-preview">
                <i className="fas fa-tools"></i>
                <p>Showcase your skills and expertise</p>
                <button 
                  className="setup-btn"
                  onClick={() => dispatch(setActiveTab('skills'))}
                >
                  Add Skills
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resumes Overview */}
        <div className="overview-card resumes-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-file-alt"></i>
              Resume Library
            </h3>
            <button 
              className="card-action-btn"
              onClick={() => dispatch(setActiveTab('resumes'))}
            >
              <i className="fas fa-upload"></i>
              Upload
            </button>
          </div>
          <div className="card-content">
            {resumes.length > 0 ? (
              <div className="resumes-preview">
                {getRecentResumes().map((resume, index) => (
                  <div key={index} className="resume-item-preview">
                    <div className="resume-icon-preview">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="resume-details-preview">
                      <h4 className="resume-title-preview">
                        {resume.title}
                        {resume.is_primary && (
                          <span className="primary-indicator">
                            <i className="fas fa-star"></i>
                          </span>
                        )}
                      </h4>
                      <p className="resume-date-preview">
                        <i className="fas fa-clock"></i>
                        {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      className="resume-view-btn"
                      onClick={() => window.open(resume.file_url, '_blank')}
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-preview">
                <i className="fas fa-file-upload"></i>
                <p>Upload your resumes for quick job applications</p>
                <button 
                  className="setup-btn"
                  onClick={() => dispatch(setActiveTab('resumes'))}
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="overview-card quick-actions-overview">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
          </div>
          <div className="card-content">
            <div className="quick-actions-grid-modern">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn-modern"
                  onClick={action.action}
                  style={{ '--action-color': action.color }}
                >
                  <div className="action-icon">
                    <i className={action.icon}></i>
                  </div>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="overview-card activity-overview">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-clock"></i>
            Recent Activity
          </h3>
        </div>
        <div className="card-content">
          <div className="activity-timeline">
            {/* Show recent additions/updates */}
            {workExperience.length > 0 && (
              <div className="activity-item">
                <div className="activity-icon work">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="activity-content">
                  <p>Added work experience: <strong>{workExperience[0].job_title}</strong></p>
                  <span className="activity-time">Recently added</span>
                </div>
              </div>
            )}
            {education.length > 0 && (
              <div className="activity-item">
                <div className="activity-icon education">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="activity-content">
                  <p>Added education: <strong>{education[0].degree}</strong></p>
                  <span className="activity-time">Recently added</span>
                </div>
              </div>
            )}
            {skills.length > 0 && (
              <div className="activity-item">
                <div className="activity-icon skills">
                  <i className="fas fa-tools"></i>
                </div>
                <div className="activity-content">
                  <p>Added <strong>{skills.length}</strong> skills to portfolio</p>
                  <span className="activity-time">Recently updated</span>
                </div>
              </div>
            )}
            {(!workExperience.length && !education.length && !skills.length) && (
              <div className="empty-activity">
                <i className="fas fa-plus-circle"></i>
                <p>Start building your profile to see activity here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;