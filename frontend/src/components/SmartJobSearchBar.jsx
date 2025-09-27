import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory, setCurrentPage } from '../redux/store';
import './SmartSearchBar.css'; // Import the CSS file

const SmartSearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { jobs, categories, companies, filters } = useSelector((state) => state.jobs);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchValues, setSearchValues] = useState({
    jobSearch: '',
    experience: '',
    location: ''
  });
  const [suggestions, setSuggestions] = useState({
    jobSearch: [],
    experience: [],
    location: []
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRefs = {
    jobSearch: useRef(null),
    experience: useRef(null),
    location: useRef(null),
    overlay: useRef(null)
  };
  
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

  // FIXED: More precise search-to-filter mapping function
  const getRelatedFiltersFromSearch = useCallback((searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return { categories: [], companies: [] };
    
    const term = searchTerm.toLowerCase().trim();
    const relatedCategories = [];
    const relatedCompanies = [];
    
    console.log('SmartSearchBar: Analyzing search term:', term);
    
    // More precise category matching - only select the BEST match, not all matches
    const categoryMatches = [];
    
    categories.forEach(category => {
      const categoryName = category.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      // Exact match gets highest priority
      if (categoryName === term) {
        score = 100;
        matchType = 'exact';
      }
      // Exact phrase match (e.g., "software engineer" matches "Software Engineering")
      else if (term.includes('software') && term.includes('engineer') && categoryName.includes('software') && categoryName.includes('engineering')) {
        score = 90;
        matchType = 'phrase';
      }
      // Direct contains match
      else if (categoryName.includes(term)) {
        score = 80;
        matchType = 'contains';
      }
      // Term contains category (but only for longer category names to avoid too broad matches)
      else if (term.includes(categoryName) && categoryName.length > 5) {
        score = 70;
        matchType = 'reverse_contains';
      }
      // Specific keyword mappings - only very specific matches
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
    
    // Sort by score and only take the TOP 1-2 matches to avoid selecting too many
    const topCategoryMatches = categoryMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 2) // Maximum 2 categories
      .filter(match => match.score >= 70); // Only high-confidence matches
    
    topCategoryMatches.forEach(match => {
      console.log(`SmartSearchBar: Selected category: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCategories.push(match.id);
    });
    
    // Company matching - more precise
    const companyMatches = [];
    
    companies.forEach(company => {
      const companyName = company.name.toLowerCase();
      let score = 0;
      let matchType = '';
      
      // Exact match
      if (companyName === term) {
        score = 100;
        matchType = 'exact';
      }
      // Contains search term
      else if (companyName.includes(term) && term.length > 2) {
        score = 90;
        matchType = 'contains';
      }
      // Search term contains company name (for well-known companies)
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
    
    // Only take the TOP 1 company match
    const topCompanyMatches = companyMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, 1) // Maximum 1 company
      .filter(match => match.score >= 85); // Only very high-confidence matches
    
    topCompanyMatches.forEach(match => {
      console.log(`SmartSearchBar: Selected company: ${match.name} (score: ${match.score}, type: ${match.matchType})`);
      relatedCompanies.push(match.id);
    });
    
    console.log('SmartSearchBar: Final selection - Categories:', relatedCategories.length, 'Companies:', relatedCompanies.length);
    
    return { categories: relatedCategories, companies: relatedCompanies };
  }, [categories, companies]);

  // FIXED: Sync local search values with Redux filters when they change
  useEffect(() => {
    setSearchValues(prev => ({
      ...prev,
      jobSearch: filters.searchQuery || '',
      location: filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '',
      experience: filters.selectedExperience?.length > 0 ? 
        experienceOptions.find(exp => exp.value === filters.selectedExperience[0])?.label || filters.selectedExperience[0] : ''
    }));
  }, [filters.searchQuery, filters.selectedLocation, filters.selectedExperience]);

  // Extract search data from jobs
  const searchData = useMemo(() => {
    const jobTitles = new Set();
    const locations = new Set();
    const companyNames = new Set();
    const skills = new Set();

    // Add some default popular job roles and skills
    const defaultJobRoles = [
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'Software Engineer', 'Web Developer', 'Mobile Developer',
      'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
      'Product Manager', 'UI/UX Designer', 'Business Analyst',
      'Quality Assurance Engineer', 'Database Administrator',
      'Cloud Architect', 'Cybersecurity Specialist'
    ];

    const defaultSkills = [
      'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
      'Java', 'Angular', 'Vue', 'PHP', 'Ruby', 'Go', 'MongoDB', 'PostgreSQL',
      'MySQL', 'Git', 'Jenkins', 'Kubernetes', 'Machine Learning', 'AI',
      'Data Science', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'iOS', 'Android',
      'HTML', 'CSS', 'SQL', 'REST API', 'GraphQL', 'Firebase', 'Redis'
    ];

    // Add default job roles
    defaultJobRoles.forEach(role => jobTitles.add(role));
    defaultSkills.forEach(skill => skills.add(skill));

    jobs.forEach(job => {
      // Extract job titles
      if (job.title) {
        jobTitles.add(job.title);
        // Also add variations of the job title
        const titleWords = job.title.split(' ');
        titleWords.forEach(word => {
          if (word.length > 2) {
            jobTitles.add(word);
          }
        });
      }

      // Extract locations
      if (job.location) {
        const locationParts = job.location.split(',').map(l => l.trim());
        locationParts.forEach(part => {
          if (part && part.length > 2) {
            locations.add(part);
          }
        });
        
        // Add "Remote" if mentioned
        if (job.location.toLowerCase().includes('remote')) {
          locations.add('Remote');
        }
      }

      // Extract company names
      if (job.companies?.name) {
        companyNames.add(job.companies.name);
      } else if (job.company?.name) {
        companyNames.add(job.company.name);
      }

      // Extract skills from description
      if (job.description) {
        const descLower = job.description.toLowerCase();
        defaultSkills.forEach(skill => {
          if (descLower.includes(skill.toLowerCase())) {
            skills.add(skill);
          }
        });
        
        // Extract common tech terms from description
        const techTerms = job.description.match(/\b[A-Z][a-z]*(?:\.[a-z]+|\+\+|#|\s+[A-Z][a-z]*)*\b/g) || [];
        techTerms.forEach(term => {
          if (term.length > 2 && term.length < 20) {
            skills.add(term);
          }
        });
      }
    });

    // Add companies from companies array
    companies.forEach(company => {
      if (company.name) {
        companyNames.add(company.name);
      }
    });

    // Add some default popular locations
    const defaultLocations = [
      'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago',
      'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta',
      'London', 'Berlin', 'Amsterdam', 'Toronto', 'Mumbai',
      'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'
    ];
    defaultLocations.forEach(loc => locations.add(loc));

    return {
      jobTitles: Array.from(jobTitles).sort(),
      locations: Array.from(locations).sort(),
      companies: Array.from(companyNames).sort(),
      skills: Array.from(skills).sort()
    };
  }, [jobs, companies]);

  // Improved fuzzy search function
  const fuzzySearch = useCallback((items, query, limit = 8) => {
    if (!query || query.length < 1) return items.slice(0, limit);
    
    const queryLower = query.toLowerCase().trim();
    
    return items
      .map(item => {
        const itemLower = item.toLowerCase();
        let score = 0;
        
        // Exact match
        if (itemLower === queryLower) score = 100;
        // Starts with query
        else if (itemLower.startsWith(queryLower)) score = 90;
        // Contains query at word boundary
        else if (new RegExp(`\\b${queryLower}`, 'i').test(item)) score = 80;
        // Contains query anywhere
        else if (itemLower.includes(queryLower)) score = 70;
        // Fuzzy matching - check if all characters of query exist in order
        else {
          let queryIndex = 0;
          for (let i = 0; i < itemLower.length && queryIndex < queryLower.length; i++) {
            if (itemLower[i] === queryLower[queryIndex]) {
              queryIndex++;
            }
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

  // Generate suggestions with improved logic
  const generateSuggestions = useCallback((type, query) => {
    switch (type) {
      case 'jobSearch': {
        const jobSuggestions = [];
        const queryLower = query.toLowerCase().trim();
        
        if (queryLower.length === 0) {
          // Show popular job roles when no query
          jobSuggestions.push(
            ...searchData.jobTitles.slice(0, 5),
            ...searchData.skills.slice(0, 3)
          );
        } else {
          // Search in job titles first (higher priority)
          const titleMatches = fuzzySearch(searchData.jobTitles, query, 4);
          const skillMatches = fuzzySearch(searchData.skills, query, 2);
          const companyMatches = fuzzySearch(searchData.companies, query, 2);
          
          jobSuggestions.push(...titleMatches, ...skillMatches, ...companyMatches);
        }
        
        // Remove duplicates and limit results
        return [...new Set(jobSuggestions)].slice(0, 8);
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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      const newSuggestions = generateSuggestions(type, query);
      setSuggestions(prev => ({
        ...prev,
        [type]: newSuggestions
      }));
    }, 150); // Reduced debounce time for better responsiveness
  }, [generateSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((type, value) => {
    setSearchValues(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Always update suggestions for all types
    updateSuggestions(type, value);
  }, [updateSuggestions]);

  // Handle dropdown focus
  const handleDropdownFocus = useCallback((type) => {
    setActiveDropdown(type);
    // Generate initial suggestions when focused
    updateSuggestions(type, searchValues[type]);
  }, [searchValues, updateSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((type, value) => {
    if (type === 'experience') {
      const exp = experienceOptions.find(e => e.label === value || e.value === value);
      setSearchValues(prev => ({
        ...prev,
        experience: exp ? exp.label : value
      }));
    } else {
      setSearchValues(prev => ({
        ...prev,
        [type]: value
      }));
    }
    setActiveDropdown(null);
  }, []);

  // FIXED: Enhanced handleSearch with search-to-filter mapping and modal closing
  const handleSearch = useCallback(() => {
    setIsLoading(true);
    
    const { jobSearch, experience, location } = searchValues;

    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // If all inputs are blank, clear all search filters
    if (!jobSearch.trim() && !experience && !location.trim()) {
      dispatch(setSearchQuery(''));
      dispatch(setSelectedExperience([]));
      dispatch(setSelectedLocation([]));
    } else {
      // Apply search query
      if (jobSearch.trim()) {
        dispatch(setSearchQuery(jobSearch.trim()));
        
        // ENHANCED: Apply smart filter mapping when searching
        console.log('SmartSearchBar: Applying search-to-filter mapping for:', jobSearch.trim());
        const relatedFilters = getRelatedFiltersFromSearch(jobSearch.trim());
        
        // Auto-apply related category filters
        if (relatedFilters.categories.length > 0) {
          console.log('SmartSearchBar: Auto-applying category filters:', relatedFilters.categories.map(id => 
            categories.find(cat => cat.id === id)?.name || id
          ));
          
          const currentCategories = filters.selectedCategory || [];
          const newCategories = [...new Set([...currentCategories, ...relatedFilters.categories])];
          dispatch(setSelectedCategory(newCategories));
        }
        
        // Auto-apply related company filters
        if (relatedFilters.companies.length > 0) {
          console.log('SmartSearchBar: Auto-applying company filters:', relatedFilters.companies.map(id => 
            companies.find(comp => comp.id === id)?.name || id
          ));
          
          const currentCompanies = filters.selectedCompany || [];
          const newCompanies = [...new Set([...currentCompanies, ...relatedFilters.companies])];
          dispatch(setSelectedCompany(newCompanies));
        }
      } else {
        dispatch(setSearchQuery(''));
      }

      // Handle experience filter
      if (experience) {
        const exp = experienceOptions.find(e => e.label === experience);
        const currentExperience = filters.selectedExperience || [];
        const newExperience = exp ? exp.value : experience;
        
        if (!currentExperience.includes(newExperience)) {
          dispatch(setSelectedExperience([...currentExperience, newExperience]));
        }
      }

      // Handle location filter  
      if (location.trim()) {
        const currentLocations = filters.selectedLocation || [];
        const newLocation = location.trim();
        
        if (!currentLocations.includes(newLocation)) {
          dispatch(setSelectedLocation([...currentLocations, newLocation]));
        }
      }
    }

    // Reset to first page when searching
    dispatch(setCurrentPage(1));

    // FIXED: Close the search modal/overlay
    setTimeout(() => {
      setIsExpanded(false);
      setActiveDropdown(null);
      setIsLoading(false);
    }, 500);

    if (onSearch) {
      onSearch({ jobSearch, experience, location });
    }
  }, [
    searchValues, 
    dispatch, 
    navigate, 
    location.pathname, 
    onSearch, 
    filters.selectedExperience, 
    filters.selectedLocation, 
    filters.selectedCategory, 
    filters.selectedCompany,
    getRelatedFiltersFromSearch,
    categories,
    companies
  ]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setActiveDropdown(null);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRefs.overlay.current && !searchRefs.overlay.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle enter key in search
  const handleKeyDown = useCallback((e, type) => {
    if (e.key === 'Enter') {
      if (type === 'jobSearch' || (type === 'location' && !activeDropdown)) {
        handleSearch();
      }
    }
  }, [handleSearch, activeDropdown]);

  return (
    <>
      {/* Compact Search Button */}
      <div className="search-compact-btn" onClick={() => setIsExpanded(true)}>
        <i className="fas fa-search"></i>
      </div>

      {/* Search Overlay Modal */}
      {isExpanded && (
        <div className="search-overlay-modal">
          <div className="search-overlay-backdrop" onClick={() => setIsExpanded(false)} />
          
          <div ref={searchRefs.overlay} className="search-overlay-content">
            <div className="search-modal-header">
              <h3>Find your dream job</h3>
              <button 
                className="search-close-btn"
                onClick={() => setIsExpanded(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="search-form-container">
              {/* Job Search Input */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-input-icon"></i>
                  <input
                    ref={searchRefs.jobSearch}
                    type="text"
                    placeholder="Enter skills / designations / companies"
                    value={searchValues.jobSearch}
                    onChange={(e) => handleInputChange('jobSearch', e.target.value)}
                    onFocus={() => handleDropdownFocus('jobSearch')}
                    onKeyDown={(e) => handleKeyDown(e, 'jobSearch')}
                    className="search-input"
                  />
                </div>
                
                {/* Job Search Suggestions */}
                {activeDropdown === 'jobSearch' && suggestions.jobSearch && suggestions.jobSearch.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.jobSearch.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('jobSearch', suggestion)}
                      >
                        <i className="fas fa-briefcase suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-separator"></div>

              {/* Experience Dropdown */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-user-tie search-input-icon"></i>
                  <input
                    ref={searchRefs.experience}
                    type="text"
                    placeholder="Select experience"
                    value={searchValues.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    onFocus={() => handleDropdownFocus('experience')}
                    className="search-input"
                    readOnly
                  />
                  <i className="fas fa-chevron-down dropdown-arrow"></i>
                </div>
                
                {/* Experience Suggestions */}
                {activeDropdown === 'experience' && (
                  <div className="suggestions-dropdown">
                    {suggestions.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('experience', exp.label || exp)}
                      >
                        <i className="fas fa-chart-line suggestion-icon"></i>
                        <span>{exp.label || exp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-separator"></div>

              {/* Location Input */}
              <div className="search-field-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-map-marker-alt search-input-icon"></i>
                  <input
                    ref={searchRefs.location}
                    type="text"
                    placeholder="Enter location"
                    value={searchValues.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onFocus={() => handleDropdownFocus('location')}
                    onKeyDown={(e) => handleKeyDown(e, 'location')}
                    className="search-input"
                  />
                </div>
                
                {/* Location Suggestions */}
                {activeDropdown === 'location' && suggestions.location.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.location.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick('location', suggestion)}
                      >
                        <i className="fas fa-map-marker-alt suggestion-icon"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                className={`search-submit-btn ${isLoading ? 'loading' : ''}`}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {!isLoading && <i className="fas fa-search"></i>}
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Current filters display */}
            {(filters.searchQuery || (filters.selectedCategory && filters.selectedCategory.length > 0) || 
              (filters.selectedExperience && filters.selectedExperience.length > 0) || 
              (filters.selectedLocation && filters.selectedLocation.length > 0) ||
              (filters.selectedCompany && filters.selectedCompany.length > 0)) && (
              <div className="current-filters-display">
                <div className="current-filters-header">
                  <h4>Current Active Filters:</h4>
                </div>
                <div className="active-filters-list">
                  {filters.searchQuery && (
                    <span className="filter-tag search-tag">
                      <i className="fas fa-search"></i>
                      {filters.searchQuery}
                    </span>
                  )}
                  {filters.selectedCategory?.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return category ? (
                      <span key={catId} className="filter-tag category-tag">
                        <i className="fas fa-industry"></i>
                        {category.name}
                      </span>
                    ) : null;
                  })}
                  {filters.selectedExperience?.map(exp => (
                    <span key={exp} className="filter-tag experience-tag">
                      <i className="fas fa-user-tie"></i>
                      {exp}
                    </span>
                  ))}
                  {filters.selectedLocation?.map(loc => (
                    <span key={loc} className="filter-tag location-tag">
                      <i className="fas fa-map-marker-alt"></i>
                      {loc}
                    </span>
                  ))}
                  {filters.selectedCompany?.map(compId => {
                    const company = companies.find(c => c.id === compId);
                    return company ? (
                      <span key={compId} className="filter-tag company-tag">
                        <i className="fas fa-building"></i>
                        {company.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="filters-note">
                  <i className="fas fa-info-circle"></i>
                  Search terms will automatically add matching filters
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SmartSearchBar;