
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileSection from './ProfileSection';
import SavedJobsSection from './SavedJobsSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import WorkExperienceSection from './WorkExperienceSection';
import ResumesSection from './ResumesSection';
import DashboardOverview from './DashboardOverview';
import './Dashboard.css';
import { setActiveTab, fetchDashboardStats } from '../../redux/dashboardSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onSignOut }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTab, stats, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
  if (user === null) {
    navigate('/auth');
  } else if (user) {
    dispatch(fetchDashboardStats());
  }
}, [user, dispatch, navigate]);


  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: 'fas fa-bookmark' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-tools' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'resumes', label: 'Resumes', icon: 'fas fa-file-alt' }
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={stats} />;
      case 'profile':
        return <ProfileSection />;
      case 'saved-jobs':
        return <SavedJobsSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experience':
        return <WorkExperienceSection />;
      case 'resumes':
        return <ResumesSection />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      onSignOut();
    }
  };

  return (
    <div className="dashboard-container">
      {/* <div className="dashboard-header">
       <h1> Welcome back, {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Saloni Rana'}!</h1> */}
        {/* <h1>Welcome back, {user?.email || 'User '}!</h1> */}
        {/* <button onClick={handleSignOut}>Sign Out</button> */}
      {/* </div> */}
      <div className="dashboard-layout">
        <nav className="dashboard-sidebar">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab(tab.id))}
              >
                <i className={`tab-icon ${tab.icon}`}></i>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
        <main className="dashboard-content">
          {error && <div className="error-banner">{error}</div>}
          {loading ? (
            <div className="loading-spinner">Loading dashboard...</div>
          ) : (
            renderActiveSection()
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
