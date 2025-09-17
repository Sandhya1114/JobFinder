import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchQuery, setSelectedExperience, setSelectedLocation, setSelectedCompany, setSelectedCategory } from '../redux/store';
import { api } from '../services/api';

const SmartSearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { jobs, categories, companies } = useSelector((state) => state.jobs);
  
  const [query, setQuery] = useState('');
  const [experienceValue, setExperienceValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });
  
  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const suggestionRefs = useRef([]);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Experience levels from your JobList component
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];

  // Extract unique data from jobs
  const jobData = useMemo(() => {
    const locations = new Set();
    const jobTitles = new Set();
    const skills = new Set();
    const companyNames = new Set();
    const categoryNames = new Set();

    // Extract from jobs array
    jobs.forEach(job => {
      // Locations
      if (job.location) {
        const locationParts = job.location.split(',').map(l => l.trim());
        locationParts.forEach(part => {
          if (part && part.length > 2) {
            locations.add(part);
          }
        });
      }

      // Job titles
      if (job.title) {
        jobTitles.add(job.title);
        
        // Extract common job keywords
        const titleWords = job.title.toLowerCase().split(/[\s\-_]+/);
        titleWords.forEach(word => {
          if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
            skills.add(word.charAt(0).toUpperCase() + word.slice(1));
          }
        });
      }

      // Extract skills from description
      if (job.description) {
        const commonSkills = [
          'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker',
          'Kubernetes', 'MongoDB', 'PostgreSQL', 'Java', 'C++', 'Angular', 'Vue',
          'React Native', 'Flutter', 'Swift', 'Kotlin', 'Go', 'Rust', 'PHP',
          'Ruby', 'Django', 'Flask', 'Express', 'Spring', 'Laravel', 'Git',
          'Jenkins', 'Terraform', 'GraphQL', 'REST API', 'MySQL', 'Redis',
          'Elasticsearch', 'Kafka', 'RabbitMQ', 'Microservices', 'Machine Learning',
          'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI', 'Figma',
          'Sketch', 'Adobe', 'Photoshop', 'Illustrator'
        ];
        
        const descLower = job.description.toLowerCase();
        commonSkills.forEach(skill => {
          if (descLower.includes(skill.toLowerCase())) {
            skills.add(skill);
          }
        });
      }
    });

    // Add companies and categories from Redux state
    companies.forEach(company => {
      if (company.name) {
        companyNames.add(company.name);
      }
    });

    categories.forEach(category => {
      if (category.name) {
        categoryNames.add(category.name);
      }
    });

    return {
      locations: Array.from(locations).map(loc => ({ 
        label: loc, 
        type: 'location', 
        category: 'Location',
        icon: '📍'
      })),
      jobTitles: Array.from(jobTitles).map(title => ({ 
        label: title, 
        type: 'job', 
        category: 'Job Title',
        icon: '💼'
      })),
      skills: Array.from(skills).map(skill => ({ 
        label: skill, 
        type: 'skill', 
        category: 'Skill',
        icon: '🔧'
      })),
      companies: Array.from(companyNames).map(company => ({ 
        label: company, 
        type: 'company', 
        category: 'Company',
        icon: '🏢'
      })),
      categories: Array.from(categoryNames).map(category => ({ 
        label: category, 
        type: 'category', 
        category: 'Industry',
        icon: '🏭'
      })),
      experience: experienceOptions.map(exp => ({
        label: exp,
        type: 'experience',
        category: 'Experience',
        icon: '📈'
      }))
    };
  }, [jobs, companies, categories]);

  // Fuzzy matching function with typo tolerance
  const fuzzyMatch = useCallback((text, query) => {
    if (!query || !text) return 0;
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match
    if (textLower === queryLower) return 1.0;
    
    // Starts with match
    if (textLower.startsWith(queryLower)) return 0.9;
    
    // Contains match
    if (textLower.includes(queryLower)) return 0.8;
    
    // Word boundary match
    const words = textLower.split(/\s+/);
    const queryWords = queryLower.split(/\s+/);
    
    let wordMatchScore = 0;
    queryWords.forEach(qWord => {
      words.forEach(tWord => {
        if (tWord.startsWith(qWord) && qWord.length >= 2) {
          wordMatchScore += 0.7;
        }
      });
    });
    
    if (wordMatchScore > 0) return Math.min(wordMatchScore / queryWords.length, 0.85);
    
    // Character similarity (Levenshtein-like)
    let matches = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        matches++;
        queryIndex++;
      }
    }
    
    const similarity = queryIndex === queryLower.length ? matches / Math.max(textLower.length, queryLower.length) : 0;
    return similarity > 0.4 ? similarity * 0.6 : 0;
  }, []);

  // Generate suggestions
  const generateSuggestions = useCallback(async (searchQuery, fieldType) => {
    if (!searchQuery || searchQuery.length < 1) {
      // Show recent searches and popular suggestions for main search
      if (fieldType === 'search') {
        const recentSuggestions = searchHistory.slice(-3).map(item => ({
          ...item,
          isRecent: true,
          score: 1.0
        }));
        
        const popularSuggestions = [
          ...jobData.jobTitles.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
          ...jobData.companies.slice(0, 2).map(item => ({ ...item, isPopular: true, score: 0.9 })),
          ...jobData.skills.slice(0, 2).map(item => ({ ...item, isPopular: true, score: 0.9 }))
        ];
        
        return [...recentSuggestions, ...popularSuggestions].slice(0, 8);
      }
      return [];
    }

    const allSuggestions = [];
    const query = searchQuery.trim();
    
    // Filter suggestions based on field type
    let relevantData = [];
    if (fieldType === 'location') {
      relevantData = jobData.locations;
    } else if (fieldType === 'search') {
      relevantData = [
        ...jobData.jobTitles,
        ...jobData.skills,
        ...jobData.companies,
        ...jobData.categories
      ];
    }
    
    // Search in relevant categories
    relevantData.forEach(item => {
      const score = fuzzyMatch(item.label, query);
      if (score > 0.3) {
        allSuggestions.push({
          ...item,
          score
        });
      }
    });
    
    // If we have few results, try to search through job descriptions for main search
    if (allSuggestions.length < 5 && query.length >= 3 && fieldType === 'search') {
      jobs.slice(0, 50).forEach(job => {
        if (job.description) {
          const descScore = fuzzyMatch(job.description, query);
          if (descScore > 0.4) {
            allSuggestions.push({
              label: job.title,
              type: 'job',
              category: 'Related Job',
              icon: '🔍',
              score: descScore * 0.7,
              description: job.description.substring(0, 100) + '...'
            });
          }
        }
      });
    }
    
    // Sort by score and limit results
    return allSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .filter(item => item.score > 0.3);
  }, [jobData, fuzzyMatch, searchHistory, jobs]);

  // Debounced suggestion fetching
  const debouncedFetchSuggestions = useCallback((query, fieldType) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const newSuggestions = await generateSuggestions(query, fieldType);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [generateSuggestions]);

  // Handle input changes
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setActiveSuggestionField('search');
    
    if (value.length >= 0) {
      debouncedFetchSuggestions(value, 'search');
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  }, [debouncedFetchSuggestions]);

  const handleLocationInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocationValue(value);
    setSelectedIndex(-1);
    setActiveSuggestionField('location');
    
    if (value.length >= 1) {
      debouncedFetchSuggestions(value, 'location');
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  }, [debouncedFetchSuggestions]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
    if (activeSuggestionField === 'location') {
      setLocationValue(suggestion.label);
    } else {
      setQuery(suggestion.label);
    }

    const searchItem = {
      label: suggestion.label,
      type: suggestion.type,
      category: suggestion.category,
      icon: suggestion.icon,
      timestamp: Date.now()
    };

    // Add to search history
    const newHistory = [
      searchItem,
      ...searchHistory.filter(item => item.label !== suggestion.label)
    ].slice(0, 10);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  }, [searchHistory, activeSuggestionField]);

  // Handle search execution
  const handleSearch = useCallback(() => {
    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // Apply the appropriate filters
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
    }

    if (experienceValue) {
      dispatch(setSelectedExperience([experienceValue]));
    }

    if (locationValue.trim()) {
      dispatch(setSelectedLocation([locationValue.trim()]));
    }

    setIsOpen(false);
    setSuggestions([]);
    
    if (onSearch) {
      onSearch({ 
        query: query.trim(), 
        experience: experienceValue,
        location: locationValue.trim()
      });
    }
  }, [query, experienceValue, locationValue, location.pathname, navigate, dispatch, onSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && (query.trim() || locationValue.trim())) {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, selectedIndex, query, locationValue, handleSuggestionSelect, handleSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const formatSuggestionText = (suggestion) => {
    if (suggestion.isRecent) {
      return (
        <div className="suggestion-content recent">
          <span className="suggestion-icon">🕒</span>
          <div className="suggestion-text">
            <div className="suggestion-label">{suggestion.label}</div>
            <div className="suggestion-meta">Recent search</div>
          </div>
        </div>
      );
    }

    if (suggestion.isPopular) {
      return (
        <div className="suggestion-content popular">
          <span className="suggestion-icon">{suggestion.icon}</span>
          <div className="suggestion-text">
            <div className="suggestion-label">{suggestion.label}</div>
            <div className="suggestion-meta">Popular {suggestion.category.toLowerCase()}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="suggestion-content">
        <span className="suggestion-icon">{suggestion.icon}</span>
        <div className="suggestion-text">
          <div className="suggestion-label">{suggestion.label}</div>
          <div className="suggestion-meta">{suggestion.category}</div>
          {suggestion.description && (
            <div className="suggestion-description">{suggestion.description}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="smart-search-container">
      <div className="search-input-wrapper">
        {/* Search Icon */}
        <div className="search-icon">
          {isLoading ? (
            <div className="search-spinner"></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          )}
        </div>
        
        {/* Skills/Jobs Input */}
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setActiveSuggestionField('search');
            debouncedFetchSuggestions(query, 'search');
            setIsOpen(true);
          }}
          placeholder="Enter skills / designations / companies"
          className="search-input"
        />

        {/* Experience Dropdown */}
        <div className="experience-section">
          <select 
            className="experience-dropdown"
            value={experienceValue}
            onChange={(e) => setExperienceValue(e.target.value)}
          >
            <option value="">Select experience</option>
            {experienceOptions.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="location-section">
          <input
            ref={locationInputRef}
            type="text"
            value={locationValue}
            onChange={handleLocationInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setActiveSuggestionField('location');
              if (locationValue) {
                debouncedFetchSuggestions(locationValue, 'location');
                setIsOpen(true);
              }
            }}
            className="location-input"
            placeholder="Enter location"
          />
        </div>

        {/* Search Button */}
        <button 
          className="search-button" 
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="suggestions-dropdown">
          {suggestions.length === 0 && !isLoading && (query.length > 0 || locationValue.length > 0) && (
            <div className="no-suggestions">
              <span className="no-suggestions-icon">🔍</span>
              <div className="no-suggestions-text">
                <div>No suggestions found</div>
                <div className="no-suggestions-tip">Try searching for job titles, skills, or companies</div>
              </div>
            </div>
          )}
          
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.label}-${index}`}
              ref={el => suggestionRefs.current[index] = el}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {formatSuggestionText(suggestion)}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .smart-search-container {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e1e5e9;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
        }

        .search-input-wrapper:focus-within {
          border-color: #4285F4;
          box-shadow: 0 6px 25px rgba(66, 133, 244, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #4285F4;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .search-input {
          flex: 2;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 18px 20px 18px 50px;
          background: transparent;
          color: #333;
          font-weight: 400;
        }

        .search-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .experience-section {
          position: relative;
          border-left: 1px solid #e1e5e9;
          min-width: 180px;
        }

        .experience-dropdown {
          border: none;
          outline: none;
          font-size: 15px;
          padding: 18px 40px 18px 20px;
          background: transparent;
          color: #666;
          cursor: pointer;
          width: 100%;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 15px center;
          background-repeat: no-repeat;
          background-size: 16px;
        }

        .experience-dropdown:focus {
          color: #333;
        }

        .location-section {
          position: relative;
          border-left: 1px solid #e1e5e9;
          min-width: 180px;
        }

        .location-input {
          border: none;
          outline: none;
          font-size: 15px;
          padding: 18px 20px;
          background: transparent;
          color: #333;
          width: 100%;
        }

        .location-input::placeholder {
          color: #999;
        }

        .search-button {
          background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
          color: white;
          border: none;
          padding: 18px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 0 23px 23px 0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .search-button:hover {
          background: linear-gradient(135deg, #3367D6 0%, #2E7D32 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
        }

        .search-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(66, 133, 244, 0.2);
          border-top: 2px solid #4285F4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border: 1px solid #e1e5e9;
          border-radius: 15px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
          border-bottom: 1px solid #f5f5f5;
          transition: all 0.2s ease;
          position: relative;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          border-left: 3px solid #4285F4;
        }

        .suggestion-content {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          width: 100%;
        }

        .suggestion-content.popular .suggestion-label {
          color: #059669;
          font-weight: 600;
        }

        .suggestion-icon {
          font-size: 18px;
          line-height: 1;
          margin-top: 2px;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .suggestion-text {
          flex: 1;
          min-width: 0;
        }

        .suggestion-label {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 4px;
          line-height: 1.3;
          font-size: 15px;
        }

        .suggestion-meta {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .suggestion-description {
          font-size: 13px;
          color: #666;
          margin-top: 4px;
          line-height: 1.4;
        }

        .no-suggestions {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 30px 20px;
          color: #666;
          text-align: center;
          justify-content: center;
        }

        .no-suggestions-icon {
          font-size: 32px;
          opacity: 0.5;
        }

        .no-suggestions-text div:first-child {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .no-suggestions-tip {
          font-size: 14px;
          color: #666;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-input-wrapper {
            flex-direction: column;
            border-radius: 15px;
          }
          
          .search-input {
            padding: 16px 20px 16px 50px;
            font-size: 16px;
            border-bottom: 1px solid #e1e5e9;
          }
          
          .experience-section,
          .location-section {
            border-left: none;
            border-top: 1px solid #e1e5e9;
            width: 100%;
            min-width: unset;
          }
          
          .experience-dropdown,
          .location-input {
            padding: 16px 40px 16px 20px;
            font-size: 16px;
          }
          
          .search-button {
            border-radius: 0 0 13px 13px;
            width: 100%;
            padding: 16px 32px;
          }
          
          .search-icon {
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSearchBar;