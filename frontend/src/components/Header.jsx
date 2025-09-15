import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Header.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from "../supabaseClient";
import { 
  setSearchQuery, 
  setSelectedExperience, 
  setSelectedLocation 
} from '../redux/store';

// Smart Search Bar Component - Replace the old HeaderSearchBar
const SmartHeaderSearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filters } = useSelector((state) => state.jobs);
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync query with Redux filters
  useEffect(() => {
    setQuery(filters.searchQuery || '');
  }, [filters.searchQuery]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('headerRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        if (searchQuery.trim().length > 0) {
          performSearch(searchQuery);
        } else {
          setSuggestions([]);
        }
      }, 300);
    },
    []
  );

  // Main search function
  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    const suggestions = [];

    try {
      const [jobsRes, companiesRes, categoriesRes, locationsRes, jobTitlesRes] = await Promise.allSettled([
        searchJobs(searchQuery),
        searchCompanies(searchQuery),
        searchCategories(searchQuery),
        searchLocations(searchQuery),
        searchJobTitles(searchQuery)
      ]);

      // Process results (same as your smart search bar)
      if (jobsRes.status === 'fulfilled' && jobsRes.value) {
        jobsRes.value.forEach(job => {
          suggestions.push({
            id: `job-${job.id}`,
            label: job.title,
            sublabel: job.companies?.name || 'Unknown Company',
            type: 'job',
            confidence: calculateJobConfidence(job, searchQuery),
            data: job
          });
        });
      }

      if (companiesRes.status === 'fulfilled' && companiesRes.value) {
        companiesRes.value.forEach(company => {
          suggestions.push({
            id: `company-${company.id}`,
            label: company.name,
            sublabel: 'Company',
            type: 'company',
            confidence: calculateTextConfidence(company.name, searchQuery),
            data: company
          });
        });
      }

      if (categoriesRes.status === 'fulfilled' && categoriesRes.value) {
        categoriesRes.value.forEach(category => {
          suggestions.push({
            id: `category-${category.id}`,
            label: category.name,
            sublabel: 'Job Category',
            type: 'category',
            confidence: calculateTextConfidence(category.name, searchQuery),
            data: category
          });
        });
      }

      if (jobTitlesRes.status === 'fulfilled' && jobTitlesRes.value) {
        jobTitlesRes.value.forEach(title => {
          suggestions.push({
            id: `title-${title.name}`,
            label: title.name,
            sublabel: `Job Title (${title.count} jobs)`,
            type: 'job-title',
            confidence: title.confidence,
            data: { title: title.name, count: title.count }
          });
        });
      }

      if (locationsRes.status === 'fulfilled' && locationsRes.value) {
        locationsRes.value.forEach(location => {
          suggestions.push({
            id: `location-${location.name}`,
            label: location.name,
            sublabel: 'Location',
            type: 'location',
            confidence: location.confidence || calculateTextConfidence(location.name, searchQuery),
            data: location
          });
        });
      }

      const sortedSuggestions = suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8);

      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // API functions (same as smart search bar)
  const searchJobs = async (query) => {
    try {
      const response = await fetch(`/api/jobs?search=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error('Jobs search failed');
      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.error('Jobs search error:', error);
      return [];
    }
  };

  const searchCompanies = async (query) => {
    try {
      const response = await fetch(`/api/debug/companies?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Companies search failed');
      const data = await response.json();
      return data.matchingCompanies || [];
    } catch (error) {
      console.error('Companies search error:', error);
      return [];
    }
  };

  const searchCategories = async (query) => {
    try {
      const response = await fetch(`/api/categories`);
      if (!response.ok) throw new Error('Categories fetch failed');
      const data = await response.json();
      
      return (data.categories || []).filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        fuzzyMatch(category.name.toLowerCase(), query.toLowerCase())
      );
    } catch (error) {
      console.error('Categories search error:', error);
      return [];
    }
  };

  const searchJobTitles = async (query) => {
    try {
      const response = await fetch(`/api/jobs?limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch jobs for title extraction');
      
      const data = await response.json();
      const jobs = data.jobs || [];
      
      const titleCounts = {};
      jobs.forEach(job => {
        if (job.title && job.title.trim()) {
          const title = job.title.trim();
          titleCounts[title] = (titleCounts[title] || 0) + 1;
        }
      });
      
      const matchingTitles = Object.entries(titleCounts)
        .filter(([title]) =>
          title.toLowerCase().includes(query.toLowerCase()) ||
          fuzzyMatch(title.toLowerCase(), query.toLowerCase())
        )
        .map(([title, count]) => ({
          name: title,
          count,
          confidence: calculateTextConfidence(title, query)
        }))
        .sort((a, b) => {
          if (Math.abs(a.confidence - b.confidence) < 0.1) {
            return b.count - a.count;
          }
          return b.confidence - a.confidence;
        })
        .slice(0, 5);
      
      return matchingTitles;
    } catch (error) {
      console.error('Job titles search error:', error);
      return [];
    }
  };

  const searchLocations = async (query) => {
    try {
      const response = await fetch(`/api/jobs?limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch jobs for location extraction');
      
      const data = await response.json();
      const jobs = data.jobs || [];
      
      const locationSet = new Set();
      jobs.forEach(job => {
        if (job.location && job.location.trim()) {
          locationSet.add(job.location.trim());
        }
      });
      
      const uniqueLocations = Array.from(locationSet)
        .filter(location =>
          location.toLowerCase().includes(query.toLowerCase()) ||
          fuzzyMatch(location.toLowerCase(), query.toLowerCase())
        )
        .map(location => ({
          name: location,
          type: 'city',
          confidence: calculateTextConfidence(location, query)
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
      
      return uniqueLocations;
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  };

  // Helper functions
  const calculateJobConfidence = (job, query) => {
    const titleMatch = calculateTextConfidence(job.title, query);
    const companyMatch = job.companies?.name ? calculateTextConfidence(job.companies.name, query) : 0;
    const locationMatch = job.location ? calculateTextConfidence(job.location, query) : 0;
    
    return Math.max(titleMatch, companyMatch * 0.8, locationMatch * 0.6);
  };

  const calculateTextConfidence = (text, query) => {
    if (!text || !query) return 0;
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    if (textLower === queryLower) return 1.0;
    if (textLower.startsWith(queryLower)) return 0.9;
    if (textLower.includes(queryLower)) return 0.7;
    if (fuzzyMatch(textLower, queryLower)) return 0.5;
    
    return 0;
  };

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

  // Event handlers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.label);
    setIsExpanded(false);
    
    // Navigate to jobs page if not already there
    if (location.pathname !== '/jobs') {
      navigate('/jobs');
    }

    // Handle different suggestion types
    switch (suggestion.type) {
      case 'job':
      case 'job-title':
        dispatch(setSearchQuery(suggestion.label));
        break;
      case 'company':
        dispatch(setSearchQuery(suggestion.label));
        break;
      case 'category':
        dispatch(setSearchQuery(suggestion.label));
        break;
      case 'location':
        dispatch(setSelectedLocation([suggestion.label]));
        break;
      default:
        dispatch(setSearchQuery(suggestion.label));
    }

    // Save to recent searches
    const newRecentSearches = [suggestion, ...recentSearches.filter(s => s.id !== suggestion.id)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('headerRecentSearches', JSON.stringify(newRecentSearches));
    
    if (onSearch) {
      onSearch({ query: suggestion.label, type: suggestion.type });
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsExpanded(false);
      
      if (location.pathname !== '/jobs') {
        navigate('/jobs');
      }
      
      dispatch(setSearchQuery(query.trim()));
      
      if (onSearch) {
        onSearch({ query: query.trim(), type: 'search' });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSelectedIndex(-1);
    }
  };

  const getDisplayText = () => {
    if (query) return query;
    return 'Search jobs, skills, companies...';
  };

  // Close on click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSelectedIndex(-1);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  return (
    <div ref={searchRef} className="header-search-container">
      {/* Compact search bar in header */}
      <div className="header-search-compact" onClick={() => setIsExpanded(true)}>
        <i className="fa fa-search search-icon"></i>
        <span className="search-placeholder">
          {getDisplayText()}
        </span>
      </div>

      {/* Expanded search overlay with smart suggestions */}
      <div className={`search-overlay ${isExpanded ? 'active' : ''}`} onClick={() => setIsExpanded(false)}>
        <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
          <div className="search-bar">
            <div className="search-field">
              <span className="icon"><i className="fa fa-search"></i></span>
              <input
                type="text"
                placeholder="Search jobs, companies, skills, locations..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              {isLoading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* Smart Suggestions */}
          {(suggestions.length > 0 || recentSearches.length > 0) && (
            <div className="smart-suggestions">
              {/* Recent Searches */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <span>Recent Searches</span>
                    <button 
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('headerRecentSearches');
                      }}
                      className="clear-btn"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      className="suggestion-item"
                    >
                      <div className="suggestion-content">
                        <div className="suggestion-label">{item.label}</div>
                        {item.sublabel && <div className="suggestion-sublabel">{item.sublabel}</div>}
                      </div>
                      <div className="suggestion-type">{item.type}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Suggestions */}
              {query.trim() && suggestions.length > 0 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <span>Suggestions</span>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                    >
                      <div className="suggestion-content">
                        <div className="suggestion-label">{suggestion.label}</div>
                        {suggestion.sublabel && <div className="suggestion-sublabel">{suggestion.sublabel}</div>}
                      </div>
                      <div className="suggestion-meta">
                        <span className="suggestion-type">{suggestion.type}</span>
                        <span className="confidence-score">{Math.round(suggestion.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Your existing Header component - just replace the HeaderSearchBar with SmartHeaderSearchBar
export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);

  // Determine if this is jobs page
  const isJobsPage = location.pathname === "/jobs";

  // Function to check if a path is active
  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Handle search from header
  const handleHeaderSearch = ({ query, type }) => {
    console.log('Header search completed:', { query, type });
  };

  // ... rest of your existing Header component code remains the same ...

  // In the JSX, replace HeaderSearchBar with SmartHeaderSearchBar:
  return (
    <header
      className={`${!isJobsPage ? "sticky" : "non-sticky"} ${
        isShrunk ? "shrink" : ""
      } ${isJobsPage ? "jobs-page" : ""}`}
    >
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>
              HIRE<span>PATH</span>
            </h3>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="header-options desktop-nav">
          <div>
            <Link 
              to="/" 
              className={isActiveLink("/") ? "active" : ""}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={isActiveLink("/jobs") ? "active" : ""}
            >
              Jobs
            </Link>
            <Link 
              to="/about" 
              className={isActiveLink("/about") ? "active" : ""}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={isActiveLink("/contact") ? "active" : ""}
            >
              Contact Us
            </Link>
          </div>
          
          {/* Smart Header Search Bar - only show on jobs page */}
          {isJobsPage && (
            <SmartHeaderSearchBar onSearch={handleHeaderSearch} />
          )}
        </div>

  
        {/* Desktop User Account */}
        <div className="accounts-btn desktop-account" ref={userMenuRef}>
          {user ? (
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="user-menu">
                  <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/auth")}>Sign In / Sign Up</button>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
      >
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <h3>
                HIRE<span>PATH</span>
              </h3>
            </div>
            <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-times"></i>
            </div>
          </div>

          <div className="mobile-nav-links">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-home"></i>
              </span>
              <span className="nav-text">Home</span>
            </Link>
            <Link 
              to="/jobs" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/jobs") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-briefcase"></i>
              </span>
              <span className="nav-text">Jobs</span>
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/about") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-info-circle"></i>
              </span>
              <span className="nav-text">About</span>
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActiveLink("/contact") ? "active" : ""}
            >
              <span className="nav-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="nav-text">Contact Us</span>
            </Link>
          </div>

          <div className="mobile-account">
            {user ? (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="user-email">{user.email}</div>
                <div className="mobile-user-actions">
                  <button onClick={() => handleNavigation("/dashboard")}>
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </button>
                  <button onClick={handleSignOut}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="auth-btn"
                onClick={() => handleNavigation("/auth")}
              >
                <i className="fas fa-user-lock"></i>
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}