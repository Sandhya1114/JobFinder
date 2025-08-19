// DashboardOverview.jsx
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../../redux/dashboardSlice';
// import { setActiveTab } from '../store/dashboardSlice';

const DashboardOverview = ({ stats }) => {
  const dispatch = useDispatch();

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
      count: stats.totalSkills,
      icon: 'fas fa-tools',
      color: '#d69e2e',
      action: () => dispatch(setActiveTab('skills'))
    },
    {
      title: 'Education',
      count: stats.totalEducation,
      icon: 'fas fa-graduation-cap',
      color: '#9f7aea',
      action: () => dispatch(setActiveTab('education'))
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
    }
  ];

  return (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h2>
          <i className="fas fa-home"></i>
          Dashboard Overview
        </h2>
        <p>Here's a summary of your job search progress and profile completion.</p>
      </div>

      {/* Stats Grid */}
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
              <p>Your profile has {stats.totalSkills} skills listed</p>
              <span className="activity-time">Keep adding more to stand out</span>
            </div>
          </div>
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
              style={{ width: `${Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}%` }}
            ></div>
          </div>
          <p>
            {Math.min((stats.totalSkills > 0 ? 25 : 0) + (stats.totalEducation > 0 ? 25 : 0) + 50, 100)}% Complete
          </p>
        </div>
        <div className="completion-tips">
          {stats.totalSkills === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Add your skills to increase your profile visibility
            </div>
          )}
          {stats.totalEducation === 0 && (
            <div className="tip-item">
              <i className="fas fa-exclamation-circle"></i>
              Add your education background
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;