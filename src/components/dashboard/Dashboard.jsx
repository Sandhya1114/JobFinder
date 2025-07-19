import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, applyToJob, markMessageRead } from './redux/dashboardSlice';
import { fetchProfile } from './redux/profileSlice';

import WelcomeSection from './WelcomeSection';
import ApplicationStats from './ApplicationOverview';
import SavedJobs from './SavedJobs';
import UpcomingInterviews from './UpcomingInterviews';
import Messages from './Messages';
import ResumeProfile from './ResumeProfile';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { applications, savedJobs, messages, interviews, recentActivity } = useSelector(state => state.dashboard);
  const profile = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        <h1>User Dashboard</h1>
      <WelcomeSection profile={profile} />
      <ApplicationStats applications={applications} />
      <SavedJobs savedJobs={savedJobs} onApply={(id) => dispatch(applyToJob(id))} />
      <UpcomingInterviews interviews={interviews} />
      <Messages messages={messages} onRead={(id) => dispatch(markMessageRead(id))} />
      <ResumeProfile profile={profile} />
      <RecentActivity activity={recentActivity} />
    </div>
  );
};

export default Dashboard;
