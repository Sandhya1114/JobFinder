import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './QuickFilters.css';

const QuickFilters = () => {
  const navigate = useNavigate();
  const { categories, companies, jobs } = useSelector((state) => state.jobs);
  const [quickFilterOptions, setQuickFilterOptions] = useState([]);

  // Enhanced icon mapping with Font Awesome icons
  const iconMap = {
    // Categories
    'technology': 'fa-laptop-code',
    'software': 'fa-code',
    'it': 'fa-server',
    'data science': 'fa-chart-line',
    'analytics': 'fa-chart-bar',
    'engineering': 'fa-cogs',
    'marketing': 'fa-bullhorn',
    'sales': 'fa-handshake',
    'hr': 'fa-users',
    'human resources': 'fa-user-tie',
    'finance': 'fa-dollar-sign',
    'design': 'fa-palette',
    'healthcare': 'fa-heartbeat',
    'education': 'fa-graduation-cap',
    'management': 'fa-tasks',
    'customer service': 'fa-headset',
    'project management': 'fa-project-diagram',
    'accounting': 'fa-calculator',
    'legal': 'fa-gavel',
    'operations': 'fa-cog',
    'product': 'fa-box',
    'quality': 'fa-check-circle',
    'research': 'fa-flask',
    'consulting': 'fa-handshake',
    'startup': 'fa-rocket',
    'mnc': 'fa-building',
    // Experience levels
    'fresher': 'fa-user-graduate',
    'entry level': 'fa-user-plus',
    'entry-level': 'fa-user-plus',
    'mid-level': 'fa-user-check',
    'mid level': 'fa-user-check',
    'senior': 'fa-user-tie',
    // Job types
    'full-time': 'fa-clock',
    'full time': 'fa-clock',
    'part-time': 'fa-hourglass-half',
    'part time': 'fa-hourglass-half',
    'contract': 'fa-file-contract',
    'freelance': 'fa-laptop',
    'internship': 'fa-user-graduate',
    // Locations
    'remote': 'fa-home',
    // Default
    'default': 'fa-briefcase'
  };

  const getIcon = (name, type) => {
    const lowerName = name.toLowerCase();
    
    // Check for matches in icon map
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    
    // Return type-specific defaults
    if (type === 'company') return 'fa-building';
    if (type === 'category') return 'fa-briefcase';
    if (type === 'location') return 'fa-map-marker-alt';
    if (type === 'experience') return 'fa-user';
    if (type === 'type') return 'fa-calendar';
    
    return iconMap.default;
  };

  // Extract unique values from jobs data
  const extractUniqueValues = (field) => {
    if (!jobs || jobs.length === 0) return [];
    
    const uniqueSet = new Set();
    jobs.forEach(job => {
      if (job[field] && job[field].trim()) {
        uniqueSet.add(job[field].trim());
      }
    });
    
    return Array.from(uniqueSet).sort();
  };

  useEffect(() => {
    const filters = [];

    // Extract unique locations from jobs
    const uniqueLocations = extractUniqueValues('location');
    if (uniqueLocations.length > 0) {
      // Prioritize Remote if it exists
      const sortedLocations = uniqueLocations.sort((a, b) => {
        if (a.toLowerCase().includes('remote')) return -1;
        if (b.toLowerCase().includes('remote')) return 1;
        return a.localeCompare(b);
      });

      sortedLocations.forEach(location => {
        filters.push({
          id: `location-${location.toLowerCase().replace(/[\s,]+/g, '-')}`,
          icon: getIcon(location, 'location'),
          label: location,
          filterType: 'location',
          filterValue: location
        });
      });
    }

    // Extract unique experience levels from jobs
    const uniqueExperience = extractUniqueValues('experience');
    if (uniqueExperience.length > 0) {
      uniqueExperience.forEach(exp => {
        filters.push({
          id: `experience-${exp.toLowerCase().replace(/\s+/g, '-')}`,
          icon: getIcon(exp, 'experience'),
          label: exp,
          filterType: 'experience',
          filterValue: exp
        });
      });
    }

    // Extract unique job types from jobs
    const uniqueTypes = extractUniqueValues('type');
    if (uniqueTypes.length > 0) {
      uniqueTypes.forEach(type => {
        filters.push({
          id: `type-${type.toLowerCase().replace(/\s+/g, '-')}`,
          icon: getIcon(type, 'type'),
          label: type,
          filterType: 'type',
          filterValue: type
        });
      });
    }

    // Add ALL categories from database
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        filters.push({
          id: `category-${category.id}`,
          icon: getIcon(category.name, 'category'),
          label: category.name,
          filterType: 'category',
          filterValue: category.id,
          actualName: category.name
        });
      });
    }

    // Add ALL companies from database
    if (companies && companies.length > 0) {
      companies.forEach(company => {
        filters.push({
          id: `company-${company.id}`,
          icon: getIcon(company.name, 'company'),
          label: company.name,
          filterType: 'company',
          filterValue: company.id,
          actualName: company.name
        });
      });
    }

    setQuickFilterOptions(filters);
  }, [categories, companies, jobs]);

  const handleFilterClick = (option) => {
    // Build URL with query parameters based on filter type
    const params = new URLSearchParams();
    
    switch (option.filterType) {
      case 'location':
        params.set('location', option.filterValue);
        break;
      case 'company':
        params.set('companies', option.filterValue);
        break;
      case 'experience':
        params.set('experience', option.filterValue);
        break;
      case 'category':
        params.set('categories', option.filterValue);
        break;
      case 'type':
        params.set('type', option.filterValue);
        break;
      default:
        break;
    }

    // Navigate to jobs page with the filter parameters
    navigate(`/jobs?${params.toString()}`);
  };

 
  
  const groupedFilters = {
    location: quickFilterOptions.filter(f => f.filterType === 'location'),
    experience: quickFilterOptions.filter(f => f.filterType === 'experience'),
    type: quickFilterOptions.filter(f => f.filterType === 'type'),
    category: quickFilterOptions.filter(f => f.filterType === 'category'),
    company: quickFilterOptions.filter(f => f.filterType === 'company')
  };

  if (quickFilterOptions.length === 0) {
    return (
      <div className="homeQuickFiltersContainer">
        <div className="homeQuickFiltersHeader">
          <h2>Quick Job Filters</h2>
          <p className="homeLoadingMessage">Loading filters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homeQuickFiltersContainer">
      <div className="homeQuickFiltersHeader">
        <h2>Quick Job Filters</h2>
        <p>Find your perfect job with one click</p>
      </div>

      {/* Location Filters */}
      {groupedFilters.location.length > 0 && (
        <div className="homeFilterSection">
          <h3 className="homeFilterSectionTitle">
            <i className="fa fa-map-marker-alt"></i> Work Location
          </h3>
          <div className="homeQuickFiltersGrid">
            {groupedFilters.location.map((option) => (
              <div
                key={option.id}
                className="homeQuickFilterCard"
                onClick={() => handleFilterClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFilterClick(option);
                  }
                }}
              >
                <div className="homeFilterIcon">
                  <i className={`fa ${option.icon}`}></i>
                </div>
                <div className="homeFilterLabel">{option.label}</div>
                <div className="homeFilterArrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level Filters */}
      {groupedFilters.experience.length > 0 && (
        <div className="homeFilterSection">
          <h3 className="homeFilterSectionTitle">
            <i className="fa fa-user-tie"></i> Experience Level
          </h3>
          <div className="homeQuickFiltersGrid">
            {groupedFilters.experience.map((option) => (
              <div
                key={option.id}
                className="homeQuickFilterCard"
                onClick={() => handleFilterClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFilterClick(option);
                  }
                }}
              >
                <div className="homeFilterIcon">
                  <i className={`fa ${option.icon}`}></i>
                </div>
                <div className="homeFilterLabel">{option.label}</div>
                <div className="homeFilterArrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Type Filters */}
      {groupedFilters.type.length > 0 && (
        <div className="homeFilterSection">
          <h3 className="homeFilterSectionTitle">
            <i className="fa fa-briefcase"></i> Job Type
          </h3>
          <div className="homeQuickFiltersGrid">
            {groupedFilters.type.map((option) => (
              <div
                key={option.id}
                className="homeQuickFilterCard"
                onClick={() => handleFilterClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFilterClick(option);
                  }
                }}
              >
                <div className="homeFilterIcon">
                  <i className={`fa ${option.icon}`}></i>
                </div>
                <div className="homeFilterLabel">{option.label}</div>
                <div className="homeFilterArrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      {groupedFilters.category.length > 0 && (
        <div className="homeFilterSection">
          <h3 className="homeFilterSectionTitle">
            <i className="fa fa-layer-group"></i> Browse by Category
          </h3>
          <div className="homeQuickFiltersGrid">
            {groupedFilters.category.map((option) => (
              <div
                key={option.id}
                className="homeQuickFilterCard"
                onClick={() => handleFilterClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFilterClick(option);
                  }
                }}
              >
                <div className="homeFilterIcon">
                  <i className={`fa ${option.icon}`}></i>
                </div>
                <div className="homeFilterLabel">{option.label}</div>
                <div className="homeFilterArrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Filters */}
      {groupedFilters.company.length > 0 && (
        <div className="homeFilterSection">
          <h3 className="homeFilterSectionTitle">
            <i className="fa fa-building"></i> Browse by Company
          </h3>
          <div className="homeQuickFiltersGrid">
            {groupedFilters.company.map((option) => (
              <div
                key={option.id}
                className="homeQuickFilterCard"
                onClick={() => handleFilterClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFilterClick(option);
                  }
                }}
              >
                <div className="homeFilterIcon">
                  <i className={`fa ${option.icon}`}></i>
                </div>
                <div className="homeFilterLabel">{option.label}</div>
                <div className="homeFilterArrow">
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickFilters;
