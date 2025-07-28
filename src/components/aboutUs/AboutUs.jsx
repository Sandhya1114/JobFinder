import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="heroSection">
        <div className="glass-hero-content">
          <h1>About JobPortal Pro</h1>
          <p>Your Ultimate Job Search Companion</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-grid">
        {/* Feature 1 */}
        <div className="glass-card">
          <div className="feature-icon">
            <img src="https://placehold.co/100x100" alt="Magnifying glass icon with advanced filters visualization representing powerful search capabilities" />
          </div>
          <h3>Powerful Search Filters</h3>
          <p>
            Find your dream job with our advanced filtering system. Narrow down by:
            <ul>
              <li>Salary range</li>
              <li>Job type (Full-time, Part-time, Remote)</li>
              <li>Experience level</li>
              <li>Company size</li>
              <li>Location preferences</li>
            </ul>
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-card">
          <div className="feature-icon">
            <img src="https://placehold.co/100x100" alt="Bookmark icon with document symbol representing job saving functionality" />
          </div>
          <h3>Save & Track Jobs</h3>
          <p>
            Our platform allows you to:
            <ul>
              <li>Save interesting jobs for later review</li>
              <li>Organize saved jobs in custom folders</li>
              <li>Set reminders for application deadlines</li>
              <li>Track your application progress</li>
            </ul>
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-card">
          <div className="feature-icon">
            <img src="https://placehold.co/100x100" alt="Lightning bolt with document symbol representing quick apply feature" />
          </div>
          <h3>1-Click Apply</h3>
          <p>
            Streamline your applications with:
            <ul>
              <li>Quick apply with pre-filled information</li>
              <li>Application status tracking</li>
              <li>Employer response analytics</li>
              <li>Resume version selection</li>
            </ul>
          </p>
        </div>
        {/* Feature 1 */}
        <div className="glass-card">
          <div className="feature-icon">
            <img src="https://placehold.co/100x100" alt="Magnifying glass icon with advanced filters visualization representing powerful search capabilities" />
          </div>
          <h3>Powerful Search Filters</h3>
          <p>
            Find your dream job with our advanced filtering system. Narrow down by:
            <ul>
              <li>Salary range</li>
              <li>Job type (Full-time, Part-time, Remote)</li>
              <li>Experience level</li>
              <li>Company size</li>
              <li>Location preferences</li>
            </ul>
          </p>
        </div>
        {/* Feature 4 */}
        <div className="glass-card">
          <div className="feature-icon">
            <img src="https://placehold.co/100x100" alt="Globe with search interface representing multi-site job search" />
          </div>
          <h3>Multi-Site Search</h3>
          <p>
            We aggregate opportunities from:
            <ul>
              <li>Top job boards</li>
              <li>Company career pages</li>
              <li>Startup hiring platforms</li>
              <li>Freelance marketplaces</li>
              <li>Government job portals</li>
            </ul>
          </p>
        </div>
      </div>
    
      {/* Team Section */}
      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member glass-card">
            <img src="https://placehold.co/200x200" alt="Professional portrait of Sarah Johnson, CEO with dark brown hair in business attire smiling confidently" />
            <h3>Mr. Rahul Rajput</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member glass-card">
            <img src="https://placehold.co/200x200" alt="Professional portrait of Michael Chen, CTO with glasses and short black hair in a tech company t-shirt" />
            <h3>Mr. Rahul Rajput</h3>
            <p>CTO</p>
          </div>
          <div className="team-member glass-card">
            <img src="https://placehold.co/200x200" alt="Professional portrait of David Rodriguez, Product Lead with beard and casual blazer standing in office environment" />
            <h3>Mr. Rahul Rajput </h3>
            <p>Product Lead</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="steps-section glass-card">
        <h2>How JobPortal Pro Works</h2>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Create Your Profile</h3>
            <p>Set up your professional profile with skills, experience, and preferences</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Customize Your Search</h3>
            <p>Use our advanced filters to find exactly what you're looking for</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Save & Apply</h3>
            <p>Bookmark jobs or apply directly with one click</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Track & Manage</h3>
            <p>Monitor your applications and interview progress all in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
