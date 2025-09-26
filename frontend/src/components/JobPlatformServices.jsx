import React from 'react';
import { Search, BarChart3, Filter } from 'lucide-react';
import './JobPlatformServices.css';

const JobPlatformServices = () => {
  return (
    <div className="job-platform-container">
      <div className="services-wrapper">
        {/* Left side - Simple Clean Mockups */}
        <div className="mockups-section">
          {/* Main laptop mockup */}
          <div className="main-mockup">
            <div className="laptop-frame">
              <div className="laptop-screen">
                <div className="screen-header"></div>
                <div className="job-bars">
                  <div className="job-bar long"></div>
                  <div className="job-bar medium"></div>
                  <div className="job-bar short"></div>
                </div>
              </div>
            </div>
            {/* Search icon circle */}
            <div className="floating-icon">
              <Search size={18} />
            </div>
          </div>
          
          {/* Dashboard mockup */}
          <div className="dashboard-mockup">
            <div className="dashboard-frame">
              <div className="dashboard-charts">
                <div className="chart-bar"></div>
                <div className="chart-bar"></div>
                <div className="chart-square"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="content-section">
          <div className="header-section">
            
            <h1>How Our Job Platform Works.</h1>
            
          </div>

          <div className="features-list">
            {/* <span className="features-badge">FEATURES</span> */}
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>Search Jobs You Want</h3>
                <p>Find jobs where talent meets opportunity. It takes just a few clicks to search by role, location, or company - all in one smooth experience.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Dashboard and Analytics</h3>
                <p>Track your job applications with our comprehensive dashboard. Monitor application status, interview schedules, and career progress in real-time.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Filter Jobs Precisely</h3>
                <p>Use advanced filters to find your perfect match. Filter by salary range, experience level, company size, work type, and much more to discover your ideal opportunity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPlatformServices;