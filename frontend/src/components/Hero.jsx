import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchQuery, setSelectedExperience, setSelectedLocation, clearFilters } from "../redux/store";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchInput, setSearchInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleSearch = () => {
    dispatch(clearFilters());
    
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
    }
    
    if (experienceInput) {
      dispatch(setSelectedExperience([experienceInput]));
    }
    
    if (locationInput.trim()) {
      dispatch(setSelectedLocation([locationInput.trim()]));
    }

    navigate('/jobs');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        
        {/* Left Side */}
        <div className="hero-content">
          <h1 className="hero-title">
            Find your dream job now
          </h1>
          
          <p className="hero-subtitle">
            5 lakh+ jobs for you to explore
          </p>
          
          {/* Search Bar */}
          <div className="search-wrapper">
            <div className="search-container">
              <div className="input-field">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <div className="separator"></div>
              
              <div className="select-field">
                <select
                  value={experienceInput}
                  onChange={(e) => setExperienceInput(e.target.value)}
                >
                  <option value="">Select experience</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-7 years">5-7 years</option>
                  <option value="7-10 years">7-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              
              <div className="separator"></div>
              
              <div className="input-field">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Enhanced Job Cards */}
        <div className="hero-visual">
          <div className="cards-stack">
            
            {/* Google Job Card */}
            <div className="job-card card-1">
              <div className="card-logo">
                <img src="https://logo.clearbit.com/google.com" alt="Google" />
              </div>
              <div className="card-content">
                <div className="job-title">Senior Software Engineer</div>
                <div className="company-name">Google • Mountain View, CA</div>
                <div className="job-type">Full-time</div>
              </div>
              <div className="card-menu">⋮</div>
            </div>
            
            {/* Microsoft Job Card */}
            <div className="job-card card-2">
              <div className="card-logo">
                <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" />
              </div>
              <div className="card-content">
                <div className="job-title">Product Manager</div>
                <div className="company-name">Microsoft • Seattle, WA</div>
                <div className="job-type">Full-time</div>
              </div>
              <div className="card-menu">⋮</div>
            </div>
            
            {/* Amazon Job Card */}
            <div className="job-card card-3">
              <div className="card-logo">
                <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" />
              </div>
              <div className="card-content">
                <div className="job-title">Data Scientist</div>
                <div className="company-name">Amazon • Austin, TX</div>
                <div className="job-type">Full-time</div>
              </div>
              <div className="card-menu">⋮</div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default Hero;