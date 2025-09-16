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
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });
  
  const searchInputRef = useRef(null);
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
  const generateSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 1) {
      // Show recent searches and popular suggestions
      const recentSuggestions = searchHistory.slice(-3).map(item => ({
        ...item,
        isRecent: true,
        score: 1.0
      }));
      
      const popularSuggestions = [
        ...jobData.jobTitles.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
        ...jobData.companies.slice(0, 3).map(item => ({ ...item, isPopular: true, score: 0.9 })),
        ...jobData.locations.slice(0, 2).map(item => ({ ...item, isPopular: true, score: 0.9 }))
      ];
      
      return [...recentSuggestions, ...popularSuggestions].slice(0, 8);
    }

    const allSuggestions = [];
    const query = searchQuery.trim();
    
    // Search in all categories
    Object.values(jobData).flat().forEach(item => {
      const score = fuzzyMatch(item.label, query);
      if (score > 0.3) {
        allSuggestions.push({
          ...item,
          score
        });
      }
    });
    
    // If we have few results, try to search through job descriptions
    if (allSuggestions.length < 5 && query.length >= 3) {
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
  const debouncedFetchSuggestions = useCallback((query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const newSuggestions = await generateSuggestions(query);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [generateSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.length >= 0) {
      debouncedFetchSuggestions(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  }, [debouncedFetchSuggestions]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
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

    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // Apply the appropriate filter based on suggestion type
    switch (suggestion.type) {
      case 'location':
        dispatch(setSelectedLocation([suggestion.label]));
        break;
      case 'company':
        const company = companies.find(c => c.name === suggestion.label);
        if (company) {
          dispatch(setSelectedCompany([company.id]));
        }
        break;
      case 'category':
        const category = categories.find(c => c.name === suggestion.label);
        if (category) {
          dispatch(setSelectedCategory([category.id]));
        }
        break;
      case 'experience':
        dispatch(setSelectedExperience([suggestion.label]));
        break;
      case 'job':
      case 'skill':
      default:
        dispatch(setSearchQuery(suggestion.label));
        break;
    }

    setQuery(suggestion.label);
    setIsOpen(false);
    
    if (onSearch) {
      onSearch({ query: suggestion.label, type: suggestion.type });
    }
  }, [searchHistory, location.pathname, navigate, dispatch, companies, categories, onSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        // Direct search
        dispatch(setSearchQuery(query.trim()));
        if (location.pathname !== '/jobs') {
          navigate('/jobs');
        }
        setIsOpen(false);
        if (onSearch) {
          onSearch({ query: query.trim(), type: 'search' });
        }
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
        } else if (query.trim()) {
          dispatch(setSearchQuery(query.trim()));
          if (location.pathname !== '/jobs') {
            navigate('/jobs');
          }
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  }, [isOpen, suggestions, selectedIndex, query, handleSuggestionSelect, dispatch, location.pathname, navigate, onSearch]);

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

  // Initialize suggestions when component mounts
  useEffect(() => {
    if (searchInputRef.current === document.activeElement) {
      debouncedFetchSuggestions('');
    }
  }, [debouncedFetchSuggestions]);

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
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            debouncedFetchSuggestions(query);
            setIsOpen(true);
          }}
          placeholder="Search jobs, companies, skills, locations..."
          className="search-input"
        />
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
      </div>

      {isOpen && (
        <div className="suggestions-dropdown">
          {suggestions.length === 0 && !isLoading && query.length > 0 && (
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
          max-width: 500px;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 45px;
          border: 2px solid #e1e5e9;
          border-radius: 25px;
          font-size: 16px;
          background: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .search-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f4f6;
          border-top: 2px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: 4px;
        }

        .suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.15s ease;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background-color: #f8fafc;
        }

        .suggestion-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .suggestion-content.recent {
          opacity: 0.8;
        }

        .suggestion-content.popular .suggestion-label {
          color: #059669;
          font-weight: 500;
        }

        .suggestion-icon {
          font-size: 18px;
          line-height: 1;
          margin-top: 2px;
          min-width: 18px;
        }

        .suggestion-text {
          flex: 1;
          min-width: 0;
        }

        .suggestion-label {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .suggestion-meta {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .suggestion-description {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
          line-height: 1.4;
        }

        .no-suggestions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 16px;
          color: #6b7280;
        }

        .no-suggestions-icon {
          font-size: 24px;
          opacity: 0.5;
        }

        .no-suggestions-text div:first-child {
          font-weight: 500;
          color: #374151;
          margin-bottom: 2px;
        }

        .no-suggestions-tip {
          font-size: 13px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .search-input {
            font-size: 16px; /* Prevent zoom on iOS */
            padding: 10px 14px 10px 40px;
          }
          
          .suggestions-dropdown {
            max-height: 300px;
          }
          
          .suggestion-item {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSearchBar;