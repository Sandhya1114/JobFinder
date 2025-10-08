import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  setSearchQuery, 
  setSelectedExperience, 
  setSelectedLocation, 
  setSelectedCategory,
  setSelectedCompany,
  setCurrentPage 
} from "../redux/store";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Get data from Redux store
  const { jobs, categories, companies } = useSelector((state) => state.jobs);
  
  const [searchInput, setSearchInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [suggestions, setSuggestions] = useState({
    search: [],
    experience: [],
    location: []
  });
  
  // Refs for click outside handling
  const searchRef = useRef(null);
  const experienceRef = useRef(null);
  const locationRef = useRef(null);
  const debounceRef = useRef(null);

  // Experience options
  const experienceOptions = [
    { label: 'Fresher (less than 1 year)', value: 'Fresher' },
    { label: '1 year', value: '1 yr' },
    { label: '2 years', value: '2 yrs' },
    { label: '3 years', value: '3 yrs' },
    { label: '4 years', value: '4 yrs' },
    { label: '5 years', value: '5 yrs' },
    { label: 'Mid-level', value: 'Mid-level' },
    { label: 'Senior', value: 'Senior' }
  ];

  // Sync with URL parameters on mount
  useEffect(() => {
    const searchFromURL = searchParams.get('search') || '';
    const experienceFromURL = searchParams.get('experience') || '';
    const locationFromURL = searchParams.get('location') || '';
    
    if (searchFromURL) setSearchInput(searchFromURL);
    if (experienceFromURL) {
      const exp = experienceOptions.find(e => e.value === experienceFromURL);
      setExperienceInput(exp ? exp.label : experienceFromURL);
    }
    if (locationFromURL) setLocationInput(locationFromURL);
  }, [searchParams]);

  // Extract search data from backend (jobs, categories, companies)
  const searchData = useMemo(() => {
    const jobTitles = new Set();
    const locations = new Set();
    const companyNames = new Set();
    const skills = new Set();
    const categoryNames = new Set();

    // Extract from jobs
    jobs.forEach(job => {
      if (job.title) {
        jobTitles.add(job.title);
        const titleWords = job.title.split(' ');
        titleWords.forEach(word => {
          if (word.length > 2) jobTitles.add(word);
        });
      }

      if (job.location) {
        const locationParts = job.location.split(',').map(l => l.trim());
        locationParts.forEach(part => {
          if (part && part.length > 2) locations.add(part);
        });
        if (job.location.toLowerCase().includes('remote')) {
          locations.add('Remote');
        }
      }

      if (job.companies?.name) companyNames.add(job.companies.name);
      else if (job.company?.name) companyNames.add(job.company.name);

      if (job.description) {
        const commonSkills = ['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Java', 'Angular', 'Vue'];
        const descLower = job.description.toLowerCase();
        commonSkills.forEach(skill => {
          if (descLower.includes(skill.toLowerCase())) skills.add(skill);
        });
      }
    });

    // Extract from categories
    categories.forEach(category => {
      if (category.name) categoryNames.add(category.name);
    });

    // Extract from companies
    companies.forEach(company => {
      if (company.name) companyNames.add(company.name);
    });

    return {
      jobTitles: Array.from(jobTitles).sort(),
      locations: Array.from(locations).sort(),
      companies: Array.from(companyNames).sort(),
      skills: Array.from(skills).sort(),
      categories: Array.from(categoryNames).sort()
    };
  }, [jobs, categories, companies]);

  // Fuzzy search function
  const fuzzySearch = useCallback((items, query, limit = 8) => {
    if (!query || query.length < 1) return items.slice(0, limit);
    
    const queryLower = query.toLowerCase().trim();
    
    return items
      .map(item => {
        const itemLower = item.toLowerCase();
        let score = 0;
        
        if (itemLower === queryLower) score = 100;
        else if (itemLower.startsWith(queryLower)) score = 90;
        else if (new RegExp(`\\b${queryLower}`, 'i').test(item)) score = 80;
        else if (itemLower.includes(queryLower)) score = 70;
        else {
          let queryIndex = 0;
          for (let i = 0; i < itemLower.length && queryIndex < queryLower.length; i++) {
            if (itemLower[i] === queryLower[queryIndex]) queryIndex++;
          }
          if (queryIndex === queryLower.length) score = 50;
        }
        
        return score > 0 ? { item, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item);
  }, []);

  // Generate suggestions from backend data
  const generateSuggestions = useCallback((type, query) => {
    switch (type) {
      case 'search': {
        const searchSuggestions = [];
        const queryLower = query.toLowerCase().trim();
        
        if (queryLower.length === 0) {
          searchSuggestions.push(
            ...searchData.jobTitles.slice(0, 3),
            ...searchData.categories.slice(0, 2),
            ...searchData.companies.slice(0, 3)
          );
        } else {
          const titleMatches = fuzzySearch(searchData.jobTitles, query, 3);
          const categoryMatches = fuzzySearch(searchData.categories, query, 2);
          const companyMatches = fuzzySearch(searchData.companies, query, 2);
          const skillMatches = fuzzySearch(searchData.skills, query, 1);
          
          searchSuggestions.push(...titleMatches, ...categoryMatches, ...companyMatches, ...skillMatches);
        }
        
        return [...new Set(searchSuggestions)].slice(0, 8);
      }
      
      case 'location': {
        if (!query || query.length === 0) {
          return searchData.locations.slice(0, 8);
        }
        return fuzzySearch(searchData.locations, query, 8);
      }
      
      case 'experience': {
        if (!query || query.length === 0) {
          return experienceOptions;
        }
        return experienceOptions.filter(exp => 
          exp.label.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
      }
      
      default:
        return [];
    }
  }, [searchData, fuzzySearch]);

  // Debounced suggestion update
  const updateSuggestions = useCallback((type, query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      const newSuggestions = generateSuggestions(type, query);
      setSuggestions(prev => ({
        ...prev,
        [type]: newSuggestions
      }));
    }, 150);
  }, [generateSuggestions]);

  // Smart filter mapping from search term
  const getRelatedFiltersFromSearch = useCallback((searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return { categories: [], companies: [] };
    
    const term = searchTerm.toLowerCase().trim();
    const relatedCategories = [];
    const relatedCompanies = [];
    
    console.log('Hero: Analyzing search term:', term);
    
    // Match categories
    const categoryMatches = [];
    categories.forEach(category => {
      const categoryName = category.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      if (categoryName === term) {
        score = 100;
        matchType = 'exact';
      }
      else if (term.includes('software') && term.includes('engineer') && categoryName.includes('software') && categoryName.includes('engineering')) {
        score = 90;
        matchType = 'phrase';
      }
      else if (categoryName.includes(term)) {
        score = 80;
        matchType = 'contains';
      }
      else if (term.includes(categoryName) && categoryName.length > 5) {
        score = 70;
        matchType = 'reverse_contains';
      }
      else if (
        (term === 'software engineer' && categoryName === 'software engineering') ||
        (term === 'data scientist' && categoryName === 'data science') ||
        (term === 'web developer' && categoryName === 'web development') ||
        (term === 'mobile developer' && categoryName === 'mobile development') ||
        (term === 'frontend developer' && categoryName === 'frontend development') ||
        (term === 'backend developer' && categoryName === 'backend development') ||
        (term === 'devops engineer' && categoryName === 'devops') ||
        (term === 'ui designer' && categoryName === 'ui/ux design') ||
        (term === 'ux designer' && categoryName === 'ui/ux design')
      ) {
        score = 85;
        matchType = 'specific';
      }
      
      if (score > 0) {
        categoryMatches.push({ 
          id: category.id, 
          name: category.name, 
          score, 
          matchType 
        });
      }
    });
    
    const topCategoryMatches = categoryMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .filter(match => match.score >= 70);
    
    topCategoryMatches.forEach(match => {
      console.log(`Hero: Selected category: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCategories.push(match.id);
    });
    
    // Match companies
    const companyMatches = [];
    companies.forEach(company => {
      const companyName = company.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      if (companyName === term) {
        score = 100;
        matchType = 'exact';
      }
      else if (companyName.includes(term) && term.length > 2) {
        score = 90;
        matchType = 'contains';
      }
      else if (term.includes(companyName) && companyName.length > 3) {
        score = 85;
        matchType = 'reverse_contains';
      }
      
      if (score > 0) {
        companyMatches.push({ 
          id: company.id, 
          name: company.name, 
          score, 
          matchType 
        });
      }
    });
    
    const topCompanyMatches = companyMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .filter(match => match.score >= 85);
    
    topCompanyMatches.forEach(match => {
      console.log(`Hero: Selected company: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCompanies.push(match.id);
    });
    
    console.log('Hero: Final selection - Categories:', relatedCategories.length, 'Companies:', relatedCompanies.length);
    
    return { categories: relatedCategories, companies: relatedCompanies };
  }, [categories, companies]);

  // Handle input changes
  const handleInputChange = useCallback((type, value) => {
    switch (type) {
      case 'search':
        setSearchInput(value);
        updateSuggestions('search', value);
        break;
      case 'experience':
        setExperienceInput(value);
        break;
      case 'location':
        setLocationInput(value);
        updateSuggestions('location', value);
        break;
    }
  }, [updateSuggestions]);

  // Handle dropdown focus
  const handleFocus = useCallback((type) => {
    setActiveDropdown(type);
    switch (type) {
      case 'search':
        updateSuggestions('search', searchInput);
        break;
      case 'experience':
        setSuggestions(prev => ({ ...prev, experience: experienceOptions }));
        break;
      case 'location':
        updateSuggestions('location', locationInput);
        break;
    }
  }, [searchInput, locationInput, updateSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((type, value) => {
    if (type === 'experience') {
      const exp = experienceOptions.find(e => e.label === value || e.value === value);
      setExperienceInput(exp ? exp.label : value);
    } else if (type === 'search') {
      setSearchInput(value);
    } else if (type === 'location') {
      setLocationInput(value);
    }
    setActiveDropdown(null);
  }, []);

  // ENHANCED: Search handler with smart filter mapping and URL parameter sync
  const handleSearch = useCallback(() => {
    // Build URL parameters
    const params = new URLSearchParams();
    
    // Add search query
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
      dispatch(setSearchQuery(searchInput.trim()));
      
      // Apply smart filter mapping
      const relatedFilters = getRelatedFiltersFromSearch(searchInput.trim());
      
      if (relatedFilters.categories.length > 0) {
        dispatch(setSelectedCategory(relatedFilters.categories));
        params.set('categories', relatedFilters.categories.join(','));
      }
      
      if (relatedFilters.companies.length > 0) {
        dispatch(setSelectedCompany(relatedFilters.companies));
        params.set('companies', relatedFilters.companies.join(','));
      }
    } else {
      dispatch(setSearchQuery(''));
    }

    // Apply experience filter
    if (experienceInput) {
      const exp = experienceOptions.find(e => e.label === experienceInput);
      const expValue = exp ? exp.value : experienceInput;
      dispatch(setSelectedExperience([expValue]));
      params.set('experience', expValue);
    } else {
      dispatch(setSelectedExperience([]));
    }

    // Apply location filter
    if (locationInput.trim()) {
      dispatch(setSelectedLocation([locationInput.trim()]));
      params.set('location', locationInput.trim());
    } else {
      dispatch(setSelectedLocation([]));
    }

    // Reset to first page
    dispatch(setCurrentPage(1));
    params.set('page', '1');

    // Navigate to jobs page with URL parameters
    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    navigate(url);

    // Close dropdowns
    setActiveDropdown(null);
  }, [searchInput, experienceInput, locationInput, dispatch, navigate, getRelatedFiltersFromSearch]);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        experienceRef.current && !experienceRef.current.contains(event.target) &&
        locationRef.current && !locationRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {/* Enhanced Search Bar with Suggestions */}
          <div className="search-wrapper">
            <div className="search-container">
              
              {/* Job Search Input */}
              <div className="input-field hero-input-wrapper" ref={searchRef}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  value={searchInput}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  onFocus={() => handleFocus('search')}
                  onKeyPress={handleKeyPress}
                />
                
                {/* Search Suggestions Dropdown */}
                {activeDropdown === 'search' && suggestions.search.length > 0 && (
                  <div className="hero-suggestions-dropdown">
                    {suggestions.search.map((suggestion, index) => (
                      <div
                        key={index}
                        className="hero-suggestion-item"
                        onClick={() => handleSuggestionClick('search', suggestion)}
                      >
                        <i className="fas fa-search hero-suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="separator"></div>
              
              {/* Experience Dropdown */}
              <div className="select-field hero-input-wrapper" ref={experienceRef}>
                <select
                  value={experienceInput}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  onFocus={() => handleFocus('experience')}
                >
                  <option value="">Select experience</option>
                  {experienceOptions.map((exp, index) => (
                    <option key={index} value={exp.label}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="separator"></div>
              
              {/* Location Input */}
              <div className="input-field hero-input-wrapper" ref={locationRef}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  onFocus={() => handleFocus('location')}
                  onKeyPress={handleKeyPress}
                />
                
                {/* Location Suggestions Dropdown */}
                {activeDropdown === 'location' && suggestions.location.length > 0 && (
                  <div className="hero-suggestions-dropdown">
                    {suggestions.location.map((suggestion, index) => (
                      <div
                        key={index}
                        className="hero-suggestion-item"
                        onClick={() => handleSuggestionClick('location', suggestion)}
                      >
                        <i className="fas fa-map-marker-alt hero-suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Job Cards */}
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