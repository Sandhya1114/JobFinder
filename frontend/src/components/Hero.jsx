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
      <div class='center'>
        <div class='blob'></div>
        <div class='particle particle1'></div>
        <div class='particle particle2'></div>
        <div class='particle particle3'></div>
    </div>
      <div className="hero-heading">
        <h1>Find your dream job now</h1>
        <p>5 lakh+ jobs for you to explore</p>
      </div>
      <div className="search-bar">
        <div className="search-field">
          <span className="icon"></span>
          <input 
            type="text" 
            placeholder="Enter skills / designations / companies"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="divider" />
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
        <div className="divider" />
        <input 
          type="text" 
          className="location-input" 
          placeholder="Enter location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}

export default Hero;