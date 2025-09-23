import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchQuery, setSelectedExperience, setSelectedLocation, clearFilters } from "../redux/store";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
      
  // Local state for form inputs
  const [searchInput, setSearchInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleSearch = () => {
    // Clear any existing filters first to ensure fresh search
    dispatch(clearFilters());
            
    // Then apply the new search parameters
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
    }
            
    if (experienceInput) {
      dispatch(setSelectedExperience([experienceInput]));
    }
            
    if (locationInput.trim()) {
      dispatch(setSelectedLocation([locationInput.trim()]));
    }

    // Navigate to jobs page
    navigate('/jobs');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="hero-section">
      {/* Structured Geometric Background */}
      <div className="geometric-bg">
        <div className="shape-container">
          {/* Large Background Shapes - Main Structure */}
          <div className="shape shape-large shape-white shape-1"></div>
          <div className="shape shape-large shape-green shape-2"></div>
          <div className="shape shape-large shape-white shape-3"></div>
          <div className="shape shape-large shape-green shape-4"></div>
          <div className="shape shape-large shape-white shape-5"></div>
          
          {/* Medium Interlocking Shapes */}
          <div className="shape shape-medium shape-white shape-6"></div>
          <div className="shape shape-medium shape-green shape-7"></div>
          <div className="shape shape-medium shape-white shape-8"></div>
          <div className="shape shape-medium shape-green shape-9"></div>
          <div className="shape shape-medium shape-white shape-10"></div>
          <div className="shape shape-medium shape-green shape-11"></div>
          
          {/* Small Accent Shapes */}
          <div className="shape shape-small shape-white shape-12"></div>
          <div className="shape shape-small shape-green shape-13"></div>
          <div className="shape shape-small shape-white shape-14"></div>
          <div className="shape shape-small shape-green shape-15"></div>
          <div className="shape shape-small shape-white shape-16"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="hero-content">
        {/* Hero Heading */}
        <div className="hero-heading">
          <h1>
            Find your <span className="highlight">dream job</span> now
          </h1>
          <p>5 lakh+ jobs for you to explore</p>
        </div>

        {/* Search Container */}
        <div className="search-container">
          <div className="search-bar">
            {/* Search Input Field */}
            <div className="search-field">
              <span className="search-icon"></span>
              <input 
                type="text"
                placeholder="Enter skills / designations / companies"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
            </div>
            
            {/* Divider */}
            <div className="divider"></div>
            
            {/* Experience Dropdown */}
            <select 
              className="experience-dropdown"
              value={experienceInput}
              onChange={(e) => setExperienceInput(e.target.value)}
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="1 yr">1 year</option>
              <option value="2 yrs">2 years</option>
              <option value="3 yrs">3 years</option>
              <option value="4 yrs">4 years</option>
              <option value="5 yrs">5 years</option>
              <option value="Mid–Senior (4–8 years)">Mid–Senior (4–8 years)</option>
              <option value="Senior (10+ years)">Senior (10+ years)</option>
            </select>
            
            {/* Divider */}
            <div className="divider"></div>
            
            {/* Location Input */}
            <input 
              type="text"
              className="location-input"
              placeholder="Enter location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            
            {/* Search Button */}
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;