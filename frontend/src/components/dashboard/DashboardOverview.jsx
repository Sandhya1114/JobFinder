// Purple-Style DashboardOverview.jsx - Matching Purple dashboard design
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

  // Purple-style metric cards (matching the colorful cards in reference)
  const metricsCards = [
    {
      title: 'Total Skills',
      value: skills.length,
      change: skills.length > 5 ? 'Advanced' : 'Growing',
      changeType: 'positive',
      icon: 'fas fa-brain',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      color: '#ff9a9e'
    },
    {
      title: 'Work Experience',
      value: `${workExperience.length} Job${workExperience.length !== 1 ? 's' : ''}`,
      change: workExperience.some(exp => exp.is_current) ? 'Currently Working' : 'Available',
      changeType: workExperience.some(exp => exp.is_current) ? 'positive' : 'neutral',
      icon: 'fas fa-briefcase',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      color: '#a8edea'
    },
    {
      title: 'Education',
      value: education.length,
      change: education.some(edu => edu.is_current) ? 'In Progress' : 'Completed',
      changeType: 'positive',
      icon: 'fas fa-graduation-cap',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      color: '#d299c2'
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

    return activities.slice(0, 4);
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
      <div className="purple-header">
        <div className="purple-header-left">
          <div className="purple-user-avatar">
            {getUserInitials()}
          </div>
          <div className="purple-user-info">
            <h2 className="purple-user-name">
              {profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Your Name'}
            </h2>
            <p className="purple-user-role">Profile Overview</p>
          </div>
        </div>
        <div className="purple-header-right">
          <button className="purple-btn purple-btn-primary" onClick={() => dispatch(setActiveTab('profile'))}>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="purple-metrics-row">
        {metricsCards.map((metric, index) => (
          <div key={index} className="purple-metric-card" style={{ background: metric.gradient }}>
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
            </div>
            <div className="purple-table-container">
              <table className="purple-table">
                <thead>
                  <tr>
                    <th>Assignee</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Last Update</th>
                    {/* <th>Tracking ID</th> */}
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
                      {/* <td className="purple-tracking">{activity.trackingId}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      {day === 3 && <div className="purple-event-dot"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Sections */}
        <div className="purple-content-right">
          {/* Profile Completion */}
          <div className="purple-card purple-completion">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Profile Completion</h3>
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
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="purple-card purple-quick-stats">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Quick Stats</h3>
            </div>
            <div className="purple-stats-grid">
              <div className="purple-stat-item">
                <div className="purple-stat-icon" style={{ backgroundColor: '#ff9a9e' }}>
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="purple-stat-info">
                  <div className="purple-stat-value">{workExperience.length}</div>
                  <div className="purple-stat-label">Experience</div>
                </div>
              </div>
              <div className="purple-stat-item">
                <div className="purple-stat-icon" style={{ backgroundColor: '#a8edea' }}>
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="purple-stat-info">
                  <div className="purple-stat-value">{education.length}</div>
                  <div className="purple-stat-label">Education</div>
                </div>
              </div>
              <div className="purple-stat-item">
                <div className="purple-stat-icon" style={{ backgroundColor: '#d299c2' }}>
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="purple-stat-info">
                  <div className="purple-stat-value">{resumes.length}</div>
                  <div className="purple-stat-label">Resumes</div>
                </div>
              </div>
              <div className="purple-stat-item">
                <div className="purple-stat-icon" style={{ backgroundColor: '#ffd93d' }}>
                  <i className="fas fa-brain"></i>
                </div>
                <div className="purple-stat-info">
                  <div className="purple-stat-value">{skills.length}</div>
                  <div className="purple-stat-label">Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="purple-card purple-recent-updates">
            <div className="purple-card-header">
              <h3 className="purple-card-title">Recent Updates</h3>
              <span className="purple-update-date">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="purple-updates-grid">
              {skills.length > 0 && (
                <div className="purple-update-item" onClick={() => dispatch(setActiveTab('skills'))}>
                  <div className="purple-update-image skills-bg">
                    <i className="fas fa-brain"></i>
                  </div>
                </div>
              )}
              {workExperience.length > 0 && (
                <div className="purple-update-item" onClick={() => dispatch(setActiveTab('experience'))}>
                  <div className="purple-update-image experience-bg">
                    <i className="fas fa-briefcase"></i>
                  </div>
                </div>
              )}
              {education.length > 0 && (
                <div className="purple-update-item" onClick={() => dispatch(setActiveTab('education'))}>
                  <div className="purple-update-image education-bg">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                </div>
              )}
              {resumes.length > 0 && (
                <div className="purple-update-item" onClick={() => dispatch(setActiveTab('resumes'))}>
                  <div className="purple-update-image resumes-bg">
                    <i className="fas fa-file-alt"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;