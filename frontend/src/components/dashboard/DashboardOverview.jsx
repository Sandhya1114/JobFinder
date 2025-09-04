// Enhanced Purple Dashboard with Jobs, Education, Skills, Resume sections
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

  // Purple-style metric cards
  const metricsCards = [
    {
      title: 'Total Skills',
      value: skills.length,
      change: skills.length > 5 ? 'Advanced Level' : 'Growing',
      changeType: 'positive',
      icon: 'fas fa-brain',
      gradient: 'linear-gradient(135deg, #ffbf96 0%, #fe7096 100%)',
      color: '#ff9a9e',
      onClick: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Work Experience',
      value: workExperience.length,
      change: workExperience.some(exp => exp.is_current) ? 'Currently Working' : 'Available',
      changeType: workExperience.some(exp => exp.is_current) ? 'positive' : 'neutral',
      icon: 'fas fa-briefcase',
      gradient: 'linear-gradient(135deg, #90caf9 0%, #90caf9 100%)',
      color: '#a8edea',
      onClick: () => dispatch(setActiveTab('experience'))
    },
    {
      title: 'Education',
      value: education.length,
      change: education.some(edu => edu.is_current) ? 'In Progress' : 'Completed',
      changeType: 'positive',
      icon: 'fas fa-graduation-cap',
      gradient: 'linear-gradient(135deg, #cd84b8ff 0%, #fff7c2ff 100%)',
      color: '#d299c2',
      onClick: () => dispatch(setActiveTab('education'))
    },
    {
      title: 'Resume Library',
      value: resumes.length,
      change: resumes.some(r => r.is_primary) ? 'Primary Set' : 'Ready to Upload',
      changeType: 'positive',
      icon: 'fas fa-file-alt',
      gradient: 'linear-gradient(135deg, #84d9d2 0%, #07cdae 100%)',
      color: '#a8e6cf',
      onClick: () => dispatch(setActiveTab('resumes'))
    },
    {
      title: 'Saved Jobs',
      value: stats?.savedJobs || 0,
      change: 'Job Applications',
      changeType: 'neutral',
      icon: 'fas fa-bookmark',
      gradient: 'linear-gradient(135deg, #ffd93d 0%, #ff6b95 100%)',
      color: '#ffd93d',
      onClick: () => dispatch(setActiveTab('jobs'))
    }
  ];

  // Get recent activity
  const getRecentActivity = () => {
    const activities = [];
    
    if (workExperience.length > 0) {
      const sortedExperience = [...workExperience].sort((a, b) => 
        new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date)
      );
      const latest = sortedExperience[0];
      activities.push({
        assignee: profile.name || 'You',
        subject: `Started position at ${latest.company}`,
        status: latest.is_current ? 'ACTIVE' : 'DONE',
        lastUpdate: latest.created_at || latest.start_date,
        trackingId: `EXP-${latest.id || Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        avatar: getUserInitials()
      });
    }

    if (education.length > 0) {
      const sortedEducation = [...education].sort((a, b) => 
        new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date)
      );
      const latest = sortedEducation[0];
      activities.push({
        assignee: profile.name || 'You',
        subject: `Added ${latest.degree} from ${latest.institution}`,
        status: latest.is_current ? 'ONGOING' : 'DONE',
        lastUpdate: latest.created_at || latest.start_date,
        trackingId: `EDU-${latest.id || Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        avatar: getUserInitials()
      });
    }

    if (resumes.length > 0) {
      const sortedResumes = [...resumes].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      const latest = sortedResumes[0];
      activities.push({
        assignee: profile.name || 'You',
        subject: `Uploaded resume: ${latest.title}`,
        status: 'DONE',
        lastUpdate: latest.created_at,
        trackingId: `RES-${latest.id || Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        avatar: getUserInitials()
      });
    }

    if (skills.length > 0) {
      activities.push({
        assignee: profile.name || 'You',
        subject: `Profile has ${skills.length} skills listed`,
        status: 'ACTIVE',
        lastUpdate: new Date().toISOString(),
        trackingId: `SKL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        avatar: getUserInitials()
      });
    }

    return activities.slice(0, 6);
  };

  const getStatusClass = (status) => {
    switch (status.toUpperCase()) {
      case 'DONE': return 'status-done';
      case 'ACTIVE': return 'status-active';
      case 'ONGOING': return 'status-ongoing';
      case 'PENDING': return 'status-pending';
      default: return 'status-neutral';
    }
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentDate = new Date().getDate();

  return (
    <div className="purple-dashboard">
      {/* Header */}
      {/* <div className="purple-header">
        <div className="purple-header-left">
          <div className="purple-user-avatar">
            {getUserInitials()}
          </div>
          <div className="purple-user-info">
            <h2 className="purple-user-name">
              {profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Your Name'}
            </h2>
            <p className="purple-user-role">Profile Overview Dashboard</p>
          </div>
        </div>
        <div className="purple-header-right">
          <button className="purple-btn purple-btn-primary" onClick={() => dispatch(setActiveTab('profile'))}>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>
      </div> */}

      {/* Enhanced Metrics Cards Row */}
      <div className="purple-metrics-row">
        {metricsCards.map((metric, index) => (
          <div 
            key={index} 
            className="purple-metric-card clickable" 
            style={{ background: metric.gradient }}
            onClick={metric.onClick}
          >
            <div className="purple-metric-content">
              <div className="purple-metric-header">
                <h3 className="purple-metric-title">{metric.title}</h3>
                <div className="purple-metric-icon">
                  <i className={metric.icon}></i>
                </div>
              </div>
              <div className="purple-metric-value">{metric.value}</div>
              <div className={`purple-metric-change ${metric.changeType}`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="purple-content-grid">
        {/* Left Column - Activity Table */}
        <div className="purple-content-left">
          <div className="purple-card purple-activity-table">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Recent Profile Activity</h3>
              <span className="purple-activity-count">{getRecentActivity().length} updates</span>
            </div>
            <div className="purple-table-container">
              <table className="purple-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Activity</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecentActivity().map((activity, index) => (
                    <tr key={index}>
                      <td>
                        <div className="purple-assignee">
                          <div className="purple-assignee-avatar">{activity.avatar}</div>
                          <span>{activity.assignee}</span>
                        </div>
                      </td>
                      <td className="purple-subject">{activity.subject}</td>
                      <td>
                        <span className={`purple-status ${getStatusClass(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="purple-date">
                        {new Date(activity.lastUpdate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Skills Section */}
          <div className="purple-card purple-skills-section">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Skills Overview</h3>
              <button 
                className="purple-btn purple-btn-primary purple-btn-sm"
                onClick={() => dispatch(setActiveTab('skills'))}
              >
                <i className="fas fa-plus"></i>
                Add Skills
              </button>
            </div>
            <div className="purple-skills-content">
              {skills.length > 0 ? (
                <div className="purple-skills-categories">
                  {Object.entries(groupSkillsByCategory()).slice(0, 3).map(([category, categorySkills]) => (
                    <div key={category} className="purple-skill-category">
                      <h4 className="purple-category-title">{category}</h4>
                      <div className="purple-skills-list">
                        {categorySkills.slice(0, 6).map((skill, index) => (
                          <span key={index} className="purple-skill-tag">
                            {skill.skill_name}
                            {skill.is_verified && <i className="fas fa-check-circle"></i>}
                          </span>
                        ))}
                        {categorySkills.length > 6 && (
                          <span className="purple-skill-more">+{categorySkills.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="purple-empty-state">
                  <i className="fas fa-brain purple-empty-icon"></i>
                  <p>No skills added yet. Add your first skill to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="purple-card purple-education-section">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Education Background</h3>
              <button 
                className="purple-btn purple-btn-primary purple-btn-sm"
                onClick={() => dispatch(setActiveTab('education'))}
              >
                <i className="fas fa-plus"></i>
                Add Education
              </button>
            </div>
            <div className="purple-education-content">
              {education.length > 0 ? (
                <div className="purple-education-list">
                  {education.slice(0, 3).map((edu, index) => (
                    <div key={index} className="purple-education-item">
                      <div className="purple-education-icon">
                        <i className="fas fa-university"></i>
                      </div>
                      <div className="purple-education-details">
                        <h4 className="purple-education-degree">{edu.degree}</h4>
                        <p className="purple-education-institution">{edu.institution}</p>
                        <div className="purple-education-meta">
                          <span>{edu.field_of_study}</span>
                          <span className="purple-education-date">
                            {edu.start_date ? new Date(edu.start_date).getFullYear() : 'N/A'} - 
                            {edu.is_current ? ' Present' : (edu.end_date ? ` ${new Date(edu.end_date).getFullYear()}` : ' N/A')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {education.length > 3 && (
                    <div className="purple-view-more">
                      <button onClick={() => dispatch(setActiveTab('education'))}>
                        View all {education.length} education records
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="purple-empty-state">
                  <i className="fas fa-graduation-cap purple-empty-icon"></i>
                  <p>No education records added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="purple-content-right">
          {/* Profile Completion */}
          <div className="purple-card purple-completion">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Profile Completion</h3>
              <span className="purple-completion-percentage">{calculateProfileCompletion()}%</span>
            </div>
            <div className="purple-completion-content">
              <div className="purple-completion-circle">
                <div className="purple-circle-progress" style={{ '--progress': calculateProfileCompletion() }}>
                  <span className="purple-percentage">{calculateProfileCompletion()}%</span>
                </div>
              </div>
              <div className="purple-completion-items">
                <div className={`purple-completion-item ${profile.name ? 'completed' : ''}`}>
                  <i className={profile.name ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                  <span>Basic Information</span>
                </div>
                <div className={`purple-completion-item ${workExperience.length > 0 ? 'completed' : ''}`}>
                  <i className={workExperience.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                  <span>Work Experience</span>
                </div>
                <div className={`purple-completion-item ${education.length > 0 ? 'completed' : ''}`}>
                  <i className={education.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                  <span>Education</span>
                </div>
                <div className={`purple-completion-item ${skills.length > 0 ? 'completed' : ''}`}>
                  <i className={skills.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                  <span>Skills</span>
                </div>
                <div className={`purple-completion-item ${resumes.length > 0 ? 'completed' : ''}`}>
                  <i className={resumes.length > 0 ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                  <span>Resume</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Library */}
          <div className="purple-card purple-resume-section">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Resume Library</h3>
              <button 
                className="purple-btn purple-btn-primary purple-btn-sm"
                onClick={() => dispatch(setActiveTab('resumes'))}
              >
                <i className="fas fa-upload"></i>
                Upload
              </button>
            </div>
            <div className="purple-resume-content">
              {resumes.length > 0 ? (
                <div className="purple-resume-list">
                  {resumes.slice(0, 4).map((resume, index) => (
                    <div key={index} className="purple-resume-item">
                      <div className="purple-resume-icon">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className="purple-resume-details">
                        <h5 className="purple-resume-title">{resume.title}</h5>
                        <div className="purple-resume-meta">
                          <span className="purple-resume-date">
                            {new Date(resume.created_at).toLocaleDateString()}
                          </span>
                          {resume.is_primary && (
                            <span className="purple-primary-badge">Primary</span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="purple-resume-view"
                        onClick={() => window.open(resume.file_url, '_blank')}
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="purple-empty-state">
                  <i className="fas fa-file-alt purple-empty-icon"></i>
                  <p>No resumes uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="purple-card purple-experience-section">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Work Experience</h3>
              <button 
                className="purple-btn purple-btn-primary purple-btn-sm"
                onClick={() => dispatch(setActiveTab('experience'))}
              >
                <i className="fas fa-plus"></i>
                Add
              </button>
            </div>
            <div className="purple-experience-content">
              {workExperience.length > 0 ? (
                <div className="purple-experience-list">
                  {workExperience.slice(0, 3).map((exp, index) => (
                    <div key={index} className="purple-experience-item">
                      <div className="purple-experience-icon">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="purple-experience-details">
                        <h4 className="purple-experience-title">{exp.job_title}</h4>
                        <p className="purple-experience-company">{exp.company}</p>
                        <div className="purple-experience-meta">
                          <span className="purple-experience-date">
                            {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {exp.is_current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                          </span>
                          {exp.is_current && (
                            <span className="purple-current-badge">Current</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {workExperience.length > 3 && (
                    <div className="purple-view-more">
                      <button onClick={() => dispatch(setActiveTab('experience'))}>
                        View all {workExperience.length} positions
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="purple-empty-state">
                  <i className="fas fa-briefcase purple-empty-icon"></i>
                  <p>No work experience added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="purple-card purple-calendar">
            <div className="purple-calendar-header">
              <button className="purple-calendar-nav">❮</button>
              <h3 className="purple-calendar-title">{currentMonth}</h3>
              <button className="purple-calendar-nav">❯</button>
            </div>
            <div className="purple-calendar-grid">
              <div className="purple-calendar-days">
                <div className="purple-day-label">Su</div>
                <div className="purple-day-label">Mo</div>
                <div className="purple-day-label">Tu</div>
                <div className="purple-day-label">We</div>
                <div className="purple-day-label">Th</div>
                <div className="purple-day-label">Fr</div>
                <div className="purple-day-label">Sa</div>
              </div>
              <div className="purple-calendar-dates">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Adjust for month start
                  const isToday = day === currentDate;
                  const isCurrentMonth = day > 0 && day <= 30;
                  return (
                    <div
                      key={i}
                      className={`purple-calendar-date ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                    >
                      {isCurrentMonth ? day : ''}
                      {/* {day === 3 && <div className="purple-event-dot"></div>} */}
                      {/* {day === 15 && <div className="purple-event-dot"></div>}
                      {day === 28 && <div className="purple-event-dot"></div>} */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;