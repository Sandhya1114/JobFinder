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
  const [hoveredImage, setHoveredImage] = useState(null);

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

  // Image data - update these paths to match your public folder structure
  const images = [
    { id: 1, src: "./laptop.jpg", alt: "Professional 1" },
    { id: 2, src: "/jobs.jpg", alt: "Professional 2" },
    { id: 3, src: "/hands.jpg", alt: "Professional 3" },
    { id: 4, src: "/static.jpg", alt: "Professional 4" },
    { id: 5, src: "/growth.jpg", alt: "Professional 5" },
    { id: 6, src: "/dicus.jpg", alt: "Professional 6" }
  ];

  return (
    <section className="hero-section">
      {/* Circular Background Pattern */}
      <div className="hero-background">
        <div className="circle-element circle-1"></div>
        <div className="circle-element circle-2"></div>
        <div className="circle-element circle-3"></div>
        <div className="circle-element circle-4"></div>
        <div className="circle-element circle-5"></div>
        <div className="circle-element circle-6"></div>
      </div>

      <div className="hero-content">
        {/* Left Side - Text and Search */}
        <div className="hero-left">
          <div className="hero-heading">
            <h1>
              Find your <span className="highlight">dream job</span> now
            </h1>
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
            
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Right Side - Animated Images */}
        <div className="hero-right">
          <div className="images-container">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`image-wrapper image-${index + 1} ${
                  hoveredImage === image.id ? 'hovered' : ''
                } ${hoveredImage && hoveredImage !== image.id ? 'blurred' : ''}`}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.target.src = `https://via.placeholder.com/200x250/059669/ffffff?text=Person+${index + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;