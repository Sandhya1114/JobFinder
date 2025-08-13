// // // components/Dashboard.jsx
// // import React, { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchDashboardData, markMessageRead } from '../../redux/dashboardSlice';
// // import { fetchProfile } from '../../redux/profileSlice';

// // import WelcomeSection from './WelcomeSection';
// // import ApplicationStats from './ApplicationStats';
// // import SavedJobs from './SavedJobs';
// // // import Messages from './Messages';
// // import ResumeProfile from './ResumeProfile';
// // // import RecentActivity from './RecentActivity';
// // // import UpcomingInterviews from './UpcomingInterviews';

// // const Dashboard = () => {
// //   const dispatch = useDispatch();

// //   const {
// //     applications = [],
// //     messages = [],
// //     interviews = [],
// //     recentActivity = [],
// //   } = useSelector((state) => state.dashboard || {});

// //   const profile = useSelector((state) => state.profile);

// //   useEffect(() => {
// //     dispatch(fetchDashboardData());
// //     dispatch(fetchProfile()); // Supabase user info
// //   }, [dispatch]);

// //   return (
// //     <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
// //       <h1>User Dashboard</h1>
// //       <WelcomeSection profile={profile} />
// //       <ApplicationStats applications={applications} />
// //       <SavedJobs />
// //       {/* <UpcomingInterviews interviews={interviews} /> */}
// //       {/* <Messages messages={messages} onRead={(id) => dispatch(markMessageRead(id))} /> */}
// //       <ResumeProfile profile={profile} />
// //       {/* <RecentActivity activity={recentActivity} /> */}
// //     </div>
// //   );
// // };

// // export default Dashboard;

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
// components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardData, 
  fetchMySavedJobsAsync, 
  fetchMyApplicationsAsync,
  clearError 
} from '../../redux/dashboardSlice';
import { fetchProfile } from '../../redux/profileSlice';
import './Dashboard.css';

import WelcomeSection from './WelcomeSection';
import ApplicationStats from './ApplicationStats';
import SavedJobs from './SavedJobs';
import ResumeProfile from './ResumeProfile';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const dashboard = useSelector((state) => state.dashboard);
  const profile = useSelector((state) => state.profile);

  const {
    overview = {},
    recentJobs = [],
    categoryStats = [],
    userStats = {},
    mySavedJobs = [],
    myApplications = [],
    status,
    error,
    actionLoading = {}
  } = dashboard;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data...');
        
        // Clear any existing errors
        dispatch(clearError());
        
        // Load all dashboard data
        const promises = [
          dispatch(fetchDashboardData()).unwrap(),
          dispatch(fetchProfile()).unwrap(),
          dispatch(fetchMySavedJobsAsync()).unwrap(),
          dispatch(fetchMyApplicationsAsync()).unwrap()
        ];

        await Promise.allSettled(promises);
        console.log('Dashboard data loaded successfully');
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        // Add a slight delay for better UX
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  // Show loading screen
  if (isLoading || status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  // Show error state with retry option
  if (status === 'failed' && error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="error-state">
            <div className="error-message">
              <h3>⚠️ Something went wrong</h3>
              <p>Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-subtitle">Manage your job search journey</div>
      </div>
      
      {/* Show non-critical errors as notifications */}
      {error && status !== 'failed' && (
        <div className="error-notification">
          <span>⚠️ {error}</span>
          <button onClick={() => dispatch(clearError())} className="dismiss-error">×</button>
        </div>
      )}
      
      <div className="dashboard-content">
        <WelcomeSection 
          profile={profile} 
          overview={overview}
          recentJobs={recentJobs.slice(0, 3)}
        />
        
        <ApplicationStats 
          applications={myApplications} 
          userStats={userStats}
          isLoading={actionLoading.applying}
        />
        
        <SavedJobs 
          savedJobs={mySavedJobs} 
          isLoading={actionLoading.saving}
        />
        
        <ResumeProfile 
          profile={profile} 
          isUploading={actionLoading.uploading}
          isUpdating={actionLoading.updating}
        />
      </div>
    </div>
  );
};

export default Dashboard;