import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from "react-router-dom";
import ProfileSection from './ProfileSection';
import SavedJobsSection from './SavedJobsSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import WorkExperienceSection from './WorkExperienceSection';
import ResumesSection from './ResumesSection';
import DashboardOverview from './DashboardOverview';
import './Dashboard.css';
import { setActiveTab, fetchDashboardStats } from '../../redux/dashboardSlice';

const Dashboard = ({ user, onSignOut }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTab, stats, loading, error } = useSelector(state => state.dashboard);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-section')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
    { id: 'education', label: 'Education', icon: 'fas fa-user-graduate' },
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

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  };

  return (
    <div className="dashboard-container">
      
      {/* Modern Fixed Header */}
      {/* <div className="dashboard-header">
        <div className="header-welcome">
          <h1>Welcome back, {getDisplayName().split(' ')[0]}!</h1>
        </div>
        
        <div className="header-right"> */}
          {/* Modern Search Jobs Button */}
          {/* <Link to="/jobs" className="search-jobs-btn">
            <i className="fas fa-search"></i>
            <span>Search Jobs</span>
          </Link> */}
          
          {/* Profile Section with Dropdown */}
          {/* <div className="profile-section">
            <div className="profile-avatar" onClick={toggleDropdown}>
              {getUserInitials()}
            </div> */}
{/*             
            {dropdownOpen && (
              <div className="dropdown">
                <div className="user-email">
                  {user?.email || user?.user_metadata?.email || 'user@example.com'}
                </div>
                <button onClick={handleSignOut} className='signoutdashboard'>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div> */}

      <div className="dashboard-layout">
        {/* Sidebar with Logo and Navigation */}
        <nav className="dashboard-sidebar">
          {/* Logo in Sidebar */}
          <div className="sidebar-logo">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h3>
                HIRE<span>PATH</span>
              </h3>
            </Link>
          </div>
          
          {/* Navigation Tabs */}
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

        {/* Main Content */}
        <main className="dashboard-content">
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => window.location.reload()}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            renderActiveSection()
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;