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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
    { id: 'overview', label: 'Dashboard', icon: 'fas fa-chart-pie' },
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
    <div className="modern-dashboard">
      {/* Modern Sidebar */}
      <nav className={`modern-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          {!sidebarCollapsed && (
            <Link to="/" className="brand-text">
              HIRE<span>PATH</span>
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => dispatch(setActiveTab(tab.id))}
            >
             
              {!sidebarCollapsed && (
                <span className="nav-label">{tab.label}</span>
              )}
               <div className="nav-icon">
                <i className={tab.icon}></i>
              </div>
              {activeTab === tab.id && <div className="active-indicator"></div>}
            </div>
          ))}
        </div>

        {/* Sidebar Toggle */}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Modern Header */}
        <header className="modern-header">
          {/* Left Section */}
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="fas fa-chevron-right"></i>
              <span className="breadcrumb-current">
                {tabs.find(tab => tab.id === activeTab)?.label || 'Overview'}
              </span>
            </div>
          </div>

          {/* Center Section */}
          {/* <div className="header-center">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="search-input"
              />
            </div>
          </div> */}

          {/* Right Section */}
          <div className="header-right">
            {/* Quick Actions */}
            <div className="header-actions">
              <Link to="/jobs" className="action-btn search-jobs">
                <i className="fas fa-search"></i>
                <span>Search Jobs</span>
              </Link>
              
              <button className="action-btn notification">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
            </div>

            {/* User Profile */}
            <div className="user-profile" onClick={toggleDropdown}>
              <div className="user-info">
                <span className="user-name">{getDisplayName().split(' ')[0]}</span>
                {/* <span className="user-role">Frontend Developer</span> */}
              </div>
              <div className="user-avatar">
                {getUserInitials()}
              </div>
              <i className="fas fa-chevron-down dropdown-arrow"></i>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {getUserInitials()}
                    </div>
                    <div className="dropdown-info">
                      <h4>{getDisplayName()}</h4>
                      <p>{user?.email || user?.user_metadata?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <a href="#" className="dropdown-item">
                      <i className="fas fa-user"></i>
                      <span>My Profile</span>
                    </a>
                    <a href="#" className="dropdown-item">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </a>
                    <a href="#" className="dropdown-item">
                      <i className="fas fa-question-circle"></i>
                      <span>Help & Support</span>
                    </a>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleSignOut} className="dropdown-item logout">
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {error && (
            <div className="error-banner">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
              <button onClick={() => window.location.reload()}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <div className="content-wrapper">
              {renderActiveSection()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;