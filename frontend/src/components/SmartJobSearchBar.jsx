import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Briefcase, Building, Hash, Clock, X } from 'lucide-react';

const SmartJobSearchBar = ({ onSearch, className = "" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
// Import your Supabase client

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jobSearchRecentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        performSearch(searchQuery);
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Main search function using your existing APIs
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    const suggestions = [];

    try {
      // Use your existing /api/jobs endpoint for comprehensive search
      const jobsResponse = await fetch(`${API_BASE_URL}/jobs?search=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (!jobsResponse.ok) {
        throw new Error(`Jobs API error: ${jobsResponse.status}`);
      }
      
      const jobsData = await jobsResponse.json();
      const jobs = jobsData.jobs || [];

      // Extract unique suggestions from jobs data
      const jobTitles = new Set();
      const companies = new Set();
      const locations = new Set();
      const categories = new Set();

      jobs.forEach(job => {
        // Job titles
        if (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          jobTitles.add(job.title);
        }
        
        // Companies
        if (job.companies?.name && job.companies.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          companies.add(job.companies.name);
        }
        
        // Locations
        if (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) {
          locations.add(job.location);
        }
        
        // Categories
        if (job.categories?.name && job.categories.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          categories.add(job.categories.name);
        }
      });

      // Convert to suggestion format with confidence scoring
      Array.from(jobTitles).slice(0, 3).forEach(title => {
        const matchingJobs = jobs.filter(job => job.title === title);
        suggestions.push({
          id: `job-title-${title}`,
          label: title,
          sublabel: `${matchingJobs.length} job${matchingJobs.length !== 1 ? 's' : ''} available`,
          type: 'job-title',
          icon: Briefcase,
          confidence: calculateTextConfidence(title, searchQuery),
          data: { title, count: matchingJobs.length }
        });
      });

      Array.from(companies).slice(0, 3).forEach(company => {
        const matchingJobs = jobs.filter(job => job.companies?.name === company);
        suggestions.push({
          id: `company-${company}`,
          label: company,
          sublabel: `${matchingJobs.length} open position${matchingJobs.length !== 1 ? 's' : ''}`,
          type: 'company',
          icon: Building,
          confidence: calculateTextConfidence(company, searchQuery),
          data: { company, count: matchingJobs.length }
        });
      });

      Array.from(locations).slice(0, 3).forEach(location => {
        const matchingJobs = jobs.filter(job => job.location === location);
        suggestions.push({
          id: `location-${location}`,
          label: location,
          sublabel: `${matchingJobs.length} job${matchingJobs.length !== 1 ? 's' : ''} in this location`,
          type: 'location',
          icon: MapPin,
          confidence: calculateTextConfidence(location, searchQuery),
          data: { location, count: matchingJobs.length }
        });
      });

      Array.from(categories).slice(0, 2).forEach(category => {
        suggestions.push({
          id: `category-${category}`,
          label: category,
          sublabel: 'Job Category',
          type: 'category',
          icon: Hash,
          confidence: calculateTextConfidence(category, searchQuery),
          data: { category }
        });
      });

      // If we found specific jobs, add top matches
      const topJobs = jobs.slice(0, 2);
      topJobs.forEach(job => {
        suggestions.push({
          id: `job-${job.id}`,
          label: job.title,
          sublabel: `at ${job.companies?.name || 'Company'} • ${job.location || 'Location TBD'}`,
          type: 'job',
          icon: Briefcase,
          confidence: calculateJobConfidence(job, searchQuery),
          data: job
        });
      });

      // Sort by confidence and limit results
      const sortedSuggestions = suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8);

      setSuggestions(sortedSuggestions);

    } catch (error) {
      console.error('Search error:', error);
      setError('Search temporarily unavailable');
      setSuggestions([]);
      
      // Fallback: create basic suggestions from query
      if (searchQuery.length > 2) {
        setSuggestions([
          {
            id: `fallback-${searchQuery}`,
            label: searchQuery,
            sublabel: 'Search for this term',
            type: 'search',
            icon: Search,
            confidence: 0.5,
            data: { query: searchQuery }
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate confidence score for text matching
  const calculateTextConfidence = (text, query) => {
    if (!text || !query) return 0;
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    if (textLower === queryLower) return 1.0;
    if (textLower.startsWith(queryLower)) return 0.9;
    if (textLower.includes(queryLower)) return 0.7;
    if (fuzzyMatch(textLower, queryLower)) return 0.5;
    
    return 0.1;
  };

  // Calculate confidence for job matches
  const calculateJobConfidence = (job, query) => {
    const titleMatch = calculateTextConfidence(job.title, query);
    const companyMatch = job.companies?.name ? calculateTextConfidence(job.companies.name, query) : 0;
    const locationMatch = job.location ? calculateTextConfidence(job.location, query) : 0;
    
    return Math.max(titleMatch, companyMatch * 0.8, locationMatch * 0.6);
  };

  // Simple fuzzy matching
  const fuzzyMatch = (text, query) => {
    if (query.length < 2) return false;
    
    let textIndex = 0;
    let queryIndex = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    return queryIndex === query.length;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setError(null);
    
    if (value.trim()) {
      setIsLoading(true);
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    setQuery(suggestion.label);
    setIsExpanded(false);
    
    // Save to recent searches
    const newRecentSearches = [
      suggestion,
      ...recentSearches.filter(s => s.id !== suggestion.id)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('jobSearchRecentSearches', JSON.stringify(newRecentSearches));
    
    // Call onSearch callback
    if (onSearch) {
      onSearch({
        query: suggestion.label,
        type: suggestion.type,
        data: suggestion.data
      });
    }
  };

  // Handle search execution
  const handleSearch = () => {
    if (query.trim()) {
      setIsExpanded(false);
      
      if (onSearch) {
        onSearch({
          query: query.trim(),
          type: 'search',
          data: { query: query.trim() }
        });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSelectedIndex(-1);
    }
  };

  // Handle click to expand search
  const handleSearchBarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Search bar clicked!');
    setIsExpanded(true);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSelectedIndex(-1);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={searchRef} className={`smart-search-container ${className}`}>
      {/* Compact header search - FIXED CLICK HANDLING */}
      <div 
        className="header-search-compact"
        onClick={handleSearchBarClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.13)',
          borderRadius: '25px',
          padding: '8px 16px',
          margin: '0 20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          minWidth: '200px',
          flex: 1,
          maxWidth: '400px',
          zIndex: 1000,
          position: 'relative'
        }}
      >
        <Search size={16} color="#666" style={{ marginRight: '8px', pointerEvents: 'none' }} />
        <span style={{ 
          color: '#666', 
          fontSize: '14px', 
          fontWeight: '500',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {query || 'Search jobs, companies, skills...'}
        </span>
        {isLoading && (
          <div style={{
            marginLeft: 'auto',
            width: '16px',
            height: '16px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #666',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            pointerEvents: 'none'
          }} />
        )}
      </div>

      {/* Expanded search overlay */}
      {isExpanded && (
        <div 
          className="search-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '100px'
          }}
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="search-content"
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '70vh',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                color: '#6c757d',
                fontSize: '20px'
              }}
            >
              ×
            </button>

            {/* Search input */}
            <div style={{ padding: '24px 24px 16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '2px solid #e9ecef'
              }}>
                <Search size={20} color="#6c757d" style={{ marginRight: '12px' }} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills, locations..."
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  autoFocus
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '16px',
                    width: '100%',
                    color: '#212529'
                  }}
                />
                {isLoading && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #e9ecef',
                    borderTop: '2px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '0 24px',
                color: '#dc3545',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '16px',
                background: 'rgba(220, 53, 69, 0.1)',
                margin: '0 24px 16px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(220, 53, 69, 0.2)'
              }}>
                {error}
              </div>
            )}

            {/* Suggestions */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {/* Recent searches */}
              {!query.trim() && recentSearches.length > 0 && (
                <div style={{ padding: '0 24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0 8px',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Recent Searches
                    </h4>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('jobSearchRecentSearches');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 0',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Clock size={16} color="#6c757d" style={{ marginRight: '12px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: '#212529' }}>{item.label}</div>
                        {item.sublabel && (
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>{item.sublabel}</div>
                        )}
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: '#6c757d',
                        background: '#e9ecef',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic suggestions */}
              {query.trim() && suggestions.length > 0 && (
                <div style={{ padding: '0 24px' }}>
                  <div style={{
                    padding: '16px 0 8px',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Suggestions
                    </h4>
                  </div>
                  {suggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 0',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          background: index === selectedIndex ? '#e7f3ff' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (index !== selectedIndex) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== selectedIndex) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <IconComponent size={16} color="#007bff" style={{ marginRight: '12px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', color: '#212529' }}>{suggestion.label}</div>
                          {suggestion.sublabel && (
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>{suggestion.sublabel}</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            color: '#6c757d',
                            background: '#e9ecef',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {suggestion.type}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            color: '#28a745',
                            fontWeight: '500',
                            background: 'rgba(40, 167, 69, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}>
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results */}
              {query.trim() && suggestions.length === 0 && !isLoading && !error && (
                <div style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <Search size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
                  <div style={{ fontWeight: '500', marginBottom: '8px', fontSize: '16px' }}>No suggestions found</div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    Try searching for job titles, companies, or locations
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SmartJobSearchBar;
