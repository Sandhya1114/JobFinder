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

  const {
    overview,
    recentJobs,
    categoryStats,
    userStats,
    mySavedJobs,
    myApplications,
    status,
    error,
    actionLoading
  } = useSelector((state) => state.dashboard);

  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Clear any existing errors
        dispatch(clearError());
        
        // Load all dashboard data
        await Promise.all([
          dispatch(fetchDashboardData()),
          dispatch(fetchProfile()),
          dispatch(fetchMySavedJobsAsync()),
          dispatch(fetchMyApplicationsAsync())
        ]);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        // Simulate loading animation
        setTimeout(() => setIsLoading(false), 800);
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

  // Show error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-subtitle" style={{ color: '#ff6b6b' }}>
            Error: {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              backgroundColor: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
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