// import React from 'react';
// import './AboutUs.css';

// const AboutUs = () => {
//   return (
//     <div className="about-container">
//       {/* Hero Section */}
//       <div className="heroSection">
//         <div className="glass-hero-content">
//           <h1>About JobFinder </h1>
//           <p>Your Ultimate Job Search Companion</p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="glass-grid">
//         {/* Feature 1 */}
//         <div className="glass-card">
//           {/* <div className="feature-icon">
//             <img src="./job.jpg" alt="Magnifying glass icon with advanced filters visualization representing powerful search capabilities" />
//           </div> */}
//           <h3>Powerful Search Filters</h3>
//           <p>
//             Find your dream job with our advanced filtering system. Narrow down by:
//             <ul>
//               <li>Salary range</li>
//               <li>Job type (Full-time, Part-time, Remote)</li>
//               <li>Experience level</li>
//               <li>Company size</li>
//               <li>Location preferences</li>
//             </ul>
//           </p>
//         </div>

//         {/* Feature 2 */}
//         <div className="glass-card">
//           {/* <div className="feature-icon">
//             <img src="https://placehold.co/100x100" alt="Bookmark icon with document symbol representing job saving functionality" />
//           </div> */}
//           <h3>Save & Track Jobs</h3>
//           <p>
//             Our platform allows you to:
//             <ul>
//               <li>Save interesting jobs for later review</li>
//               <li>Organize saved jobs in custom folders</li>
//               <li>Set reminders for application deadlines</li>
//               <li>Track your application progress</li>
//             </ul>
//           </p>
//         </div>

//         {/* Feature 3 */}
//         <div className="glass-card">
//           {/* <div className="feature-icon">
//             <img src="https://placehold.co/100x100" alt="Lightning bolt with document symbol representing quick apply feature" />
//           </div> */}
//           <h3>1-Click Apply</h3>
//           <p>
//             Streamline your applications with:
//             <ul>
//               <li>Quick apply with pre-filled information</li>
//               <li>Application status tracking</li>
//               <li>Employer response analytics</li>
//               <li>Resume version selection</li>
//             </ul>
//           </p>
//         </div>
//         {/* Feature 1 */}
//         <div className="glass-card">
//           {/* <div className="feature-icon">
//             <img src="https://placehold.co/100x100" alt="Magnifying glass icon with advanced filters visualization representing powerful search capabilities" />
//           </div> */}
//           <h3>Powerful Search Filters</h3>
//           <p>
//             Find your dream job with our advanced filtering system. Narrow down by:
//             <ul>
//               <li>Salary range</li>
//               <li>Job type (Full-time, Part-time, Remote)</li>
//               <li>Experience level</li>
//               <li>Company size</li>
//               <li>Location preferences</li>
//             </ul>
//           </p>
//         </div>
//         {/* Feature 4 */}
//         <div className="glass-card">
//           {/* <div className="feature-icon">
//             <img src="https://placehold.co/100x100" alt="Globe with search interface representing multi-site job search" />
//           </div> */}
//           <h3>Multi-Site Search</h3>
//           <p>
//             We aggregate opportunities from:
//             <ul>
//               <li>Top job boards</li>
//               <li>Company career pages</li>
//               <li>Startup hiring platforms</li>
//               <li>Freelance marketplaces</li>
//               <li>Government job portals</li>
//             </ul>
//           </p>
//         </div>
//       </div>
    
//       {/* Team Section */}
//       <div className="team-section">
//         <h2>Meet Our Team</h2>
//         <div className="team-grid">
//           <div className="team-member glass-card">
//             {/* <img src="https://placehold.co/200x200" alt="Professional portrait of Sarah Johnson, CEO with dark brown hair in business attire smiling confidently" /> */}
//             <h3>Mr. Rahul Rajput</h3>
//             <p>CEO & Founder</p>
//           </div>
//           <div className="team-member glass-card">
//             {/* <img src="https://placehold.co/200x200" alt="Professional portrait of Michael Chen, CTO with glasses and short black hair in a tech company t-shirt" /> */}
//             <h3>Mr. Rahul Rajput</h3>
//             <p>CTO</p>
//           </div>
//           <div className="team-member glass-card">
//             {/* <img src="https://placehold.co/200x200" alt="Professional portrait of David Rodriguez, Product Lead with beard and casual blazer standing in office environment" /> */}
//             <h3>Mr. Rahul Rajput </h3>
//             <p>Product Lead</p>
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="steps-section glass-card">
//         <h2>How JobPortal Pro Works</h2>
//         <div className="step">
//           <div className="step-number">1</div>
//           <div className="step-content">
//             <h3>Create Your Profile</h3>
//             <p>Set up your professional profile with skills, experience, and preferences</p>
//           </div>
//         </div>
//         <div className="step">
//           <div className="step-number">2</div>
//           <div className="step-content">
//             <h3>Customize Your Search</h3>
//             <p>Use our advanced filters to find exactly what you're looking for</p>
//           </div>
//         </div>
//         <div className="step">
//           <div className="step-number">3</div>
//           <div className="step-content">
//             <h3>Save & Apply</h3>
//             <p>Bookmark jobs or apply directly with one click</p>
//           </div>
//         </div>
//         <div className="step">
//           <div className="step-number">4</div>
//           <div className="step-content">
//             <h3>Track & Manage</h3>
//             <p>Monitor your applications and interview progress all in one place</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;
import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Animate hero section on load
    setTimeout(() => setHeroVisible(true), 100);
    
    // Animate cards with staggered effect
    setTimeout(() => {
      const cardElements = document.querySelectorAll('.glass-card');
      cardElements.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, 150 * index);
      });
    }, 300);
  }, []);

  const features = [
    {
      icon: "fa fa-search",
      title: "Powerful Search Filters",
      description: "Find your dream job with our advanced filtering system. Narrow down by:",
      list: ["Salary range", "Job type (Full-time, Part-time, Remote)", "Experience level", "Company size", "Location preferences"]
    },
    {
      icon: "fa fa-bookmark",
      title: "Save & Track Jobs",
      description: "Our platform allows you to:",
      list: ["Save interesting jobs for later review", "Organize saved jobs in custom folders", "Set reminders for application deadlines", "Track your application progress"]
    },
    {
      icon: "fa fa-bolt",
      title: "1-Click Apply",
      description: "Streamline your applications with:",
      list: ["Quick apply with pre-filled information", "Application status tracking", "Employer response analytics", "Resume version selection"]
    },
    {
      icon: "fa fa-globe",
      title: "Multi-Site Search",
      description: "We aggregate opportunities from:",
      list: ["Top job boards", "Company career pages", "Startup hiring platforms", "Freelance marketplaces", "Government job portals"]
    },
    {
      icon: "fa fa-robot",
      title: "AI-Powered Matching",
      description: "Let our intelligent system work for you:",
      list: ["Smart job recommendations based on your profile", "Skill gap analysis and suggestions", "Automatic job alerts for perfect matches", "Industry insights and trends", "Personalized career path guidance"]
    },
    {
      icon: "fa fa-chart-bar",
      title: "Analytics Dashboard",
      description: "Get insights into your job search:",
      list: ["Application success rates", "Interview conversion metrics", "Market salary benchmarks", "Profile view statistics", "Industry demand analytics"]
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Jobs", icon: "fa fa-briefcase" },
    { number: "10K+", label: "Companies", icon: "fa fa-building" },
    { number: "100K+", label: "Job Seekers", icon: "fa fa-users" },
    { number: "95%", label: "Success Rate", icon: "fa fa-bullseye" }
  ];

  const teamMembers = [
    { name: "Mr. xyz", role: "CEO & Founder", specialty: "Visionary Leadership", initial: "M"},
    { name: "Mr. xyz", role: "CTO", specialty: "Tech Innovation", initial: "M" },
    { name: "Mr. xyz", role: "Product Lead", specialty: "User Experience", initial: "M" },
    { name: "Mr. xyz", role: "Head of Marketing", specialty: "Growth Strategy", initial: "M" }
  ];

  const steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Set up your professional profile with skills, experience, and career preferences. Our AI analyzes your background to provide personalized recommendations."
    },
    {
      step: 2,
      title: "Discover Opportunities",
      description: "Browse through thousands of curated job listings or let our intelligent matching system find perfect opportunities for you automatically."
    },
    {
      step: 3,
      title: "Apply with Confidence",
      description: "Use our one-click apply feature or customize your applications. Track everything in your personal dashboard with real-time updates."
    },
    {
      step: 4,
      title: "Land Your Dream Job",
      description: "Get interview tips, salary insights, and career guidance. We support you throughout the entire hiring process until you succeed."
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className={`heroSection ${heroVisible ? 'hero-visible' : ''}`}>
        <div className="glass-hero-content">
          <h1 className="hero-title">About JobFinder</h1>
          <p className="hero-subtitle">Your Ultimate Job Search Companion</p>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" style={{animationDelay: `${index * 0.2}s`}}>
                <i className={`stat-icon ${stat.icon}`}></i>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="glass-grid">
        {features.map((feature, index) => (
          <div key={index} className="glass-card feature-card">
            <i className={`feature-icon-large ${feature.icon}`}></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <ul>
              {feature.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="mission-section">
        <div className="glass-card mission-card">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            At JobFinder, we believe that finding the right job shouldn't be a full-time job itself. 
            Our mission is to democratize access to career opportunities by creating an intelligent, 
            user-friendly platform that connects talented individuals with their dream careers. 
            We're committed to transforming the job search experience through innovative technology, 
            personalized matching, and comprehensive career support.
          </p>
        </div>
      </div>

      {/* Company Values */}
      <div className="values-section">
        <h2 className="section-title">Our Values</h2>
        <div className="values-grid">
          <div className="glass-card value-card">
            <i className="value-icon fa fa-bullseye"></i>
            <h3>Excellence</h3>
            <p>We strive for excellence in everything we do, from our technology to our customer service.</p>
          </div>
          <div className="glass-card value-card">
            <i className="value-icon fa fa-handshake"></i>
            <h3>Integrity</h3>
            <p>We believe in honest, transparent relationships with our users and partners.</p>
          </div>
          <div className="glass-card value-card">
            <i className="value-icon fa fa-rocket"></i>
            <h3>Innovation</h3>
            <p>We continuously innovate to stay ahead of the curve and provide cutting-edge solutions.</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member glass-card">
              <div className="member-avatar">
                {member.initial}
              </div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-specialty">{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="steps-section glass-card">
        <h2>How JobFinder Works</h2>
        {steps.map((item, index) => (
          <div key={index} className="step">
            <div className="step-number">{item.step}</div>
            <div className="step-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="glass-card cta-card">
          <h2 className="cta-title">Ready to Find Your Dream Job?</h2>
          <p className="cta-description">
            Join thousands of professionals who have already found their perfect career match with JobFinder.
          </p>
          <button className="cta-button">
            <span>Get Started Today</span>
            <div className="button-shine"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;