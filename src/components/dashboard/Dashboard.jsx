
// // components/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboardData, markMessageRead } from '../../redux/dashboardSlice';
// import { fetchProfile } from '../../redux/profileSlice';
// import './Dashboard.css';

// import WelcomeSection from './WelcomeSection';
// import ApplicationStats from './ApplicationStats';
// import SavedJobs from './SavedJobs';
// // import Messages from './Messages';
// import ResumeProfile from './ResumeProfile';
// // import RecentActivity from './RecentActivity';
// // import UpcomingInterviews from './UpcomingInterviews';

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);

//   const {
//     applications = [],
//     messages = [],
//     interviews = [],
//     recentActivity = [],
//   } = useSelector((state) => state.dashboard || {});

//   const profile = useSelector((state) => state.profile);

//   useEffect(() => {
//     dispatch(fetchDashboardData());
//     dispatch(fetchProfile()); // Supabase user info
    
//     // Simulate loading animation
//     setTimeout(() => setIsLoading(false), 800);
//   }, [dispatch]);

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner">
//           <div className="spinner-dot"></div>
//           <div className="spinner-dot"></div>
//           <div className="spinner-dot"></div>
//         </div>
//         <p className="loading-text">Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">Dashboard</h1>
//         <div className="dashboard-subtitle">Manage your job search journey</div>
//       </div>
      
//       <div className="dashboard-content">
//         <WelcomeSection profile={profile} />
//         <ApplicationStats applications={applications} />
//         <SavedJobs />
//         {/* <UpcomingInterviews interviews={interviews} /> */}
//         {/* <Messages messages={messages} onRead={(id) => dispatch(markMessageRead(id))} /> */}
//         <ResumeProfile profile={profile} />
//         {/* <RecentActivity activity={recentActivity} /> */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// Dashboard.jsx
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// // import { setActiveTab, fetchDashboardStats } from '../redux/store/dashboardSlice';
// import ProfileSection from './ProfileSection';
// import SavedJobsSection from './SavedJobsSection';
// import EducationSection from './EducationSection';
// import SkillsSection from './SkillsSection';
// import WorkExperienceSection from './WorkExperienceSection';
// import ResumesSection from './ResumesSection';
// import DashboardOverview from './DashboardOverview';
// import './Dashboard.css';
// import { setActiveTab, fetchDashboardStats} from '../../redux/dashboardSlice';

// const Dashboard = ({ user, onSignOut }) => {
//   const dispatch = useDispatch();
//   const { activeTab, stats, loading, error } = useSelector(state => state.dashboard);

//   useEffect(() => {
//     dispatch(fetchDashboardStats());
//   }, [dispatch]);

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
//     { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
//     { id: 'saved-jobs', label: 'Saved Jobs', icon: 'fas fa-bookmark' },
//     { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
//     { id: 'skills', label: 'Skills', icon: 'fas fa-tools' },
//     { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
//     { id: 'resumes', label: 'Resumes', icon: 'fas fa-file-alt' }
//   ];

//   const renderActiveSection = () => {
//     switch (activeTab) {
//       case 'overview':
//         return <DashboardOverview stats={stats} />;
//       case 'profile':
//         return <ProfileSection />;
//       case 'saved-jobs':
//         return <SavedJobsSection />;
//       case 'education':
//         return <EducationSection />;
//       case 'skills':
//         return <SkillsSection />;
//       case 'experience':
//         return <WorkExperienceSection />;
//       case 'resumes':
//         return <ResumesSection />;
//       default:
//         return <DashboardOverview stats={stats} />;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       {/* <header className="dashboard-header">
//         <div className="header-content">
//           <div className="header-title">
//             <h1>
//               <i className="fas fa-tachometer-alt"></i>
//               Dashboard
//             </h1>
//             <p>Welcome back, {user?.name || 'User'}!</p>
//           </div>
//           <button className="sign-out-btn" onClick={onSignOut}>
//             <i className="fas fa-sign-out-alt"></i>
//             Sign Out
//           </button>
//         </div>
//       </header> */}

//       <div className="dashboard-layout">
//         {/* Sidebar Navigation */}
//         <nav className="dashboard-sidebar">
//           <div className="nav-tabs">
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
//                 onClick={() => dispatch(setActiveTab(tab.id))}
//               >
//                 <i className={`tab-icon ${tab.icon}`}></i>
//                 <span className="tab-label">{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="dashboard-content">
//           {error && (
//             <div className="error-banner">
//               <span>
//                 <i className="fas fa-exclamation-triangle"></i>
//                 {error}
//               </span>
//               <button onClick={() => dispatch(clearError())}>
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//           )}
          
//           {loading ? (
//             <div className="loading-spinner">
//               <div className="spinner"></div>
//               <p>Loading dashboard...</p>
//             </div>
//           ) : (
//             renderActiveSection()
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
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
    if (!user) {
      navigate('/auth'); // Redirect to auth page if not logged in
    } else {
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
      <header className="dashboard-header">
        <h1>Welcome back, {user?.email || 'User '}!</h1>
        {/* <button onClick={handleSignOut}>Sign Out</button> */}
      </header>
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
