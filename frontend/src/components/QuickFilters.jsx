import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './QuickFilters.css';

const QuickFilters = () => {
  const navigate = useNavigate();
  const { categories, companies, jobs } = useSelector((state) => state.jobs);
  const [quickFilterOptions, setQuickFilterOptions] = useState([]);

  // Initial items to show for each section
  const INITIAL_ITEMS = {
    location: 6,
    experience: 4,
    type: 4,
    category: 8,
    company: 8
  };

  // Enhanced icon mapping with Font Awesome icons
  const iconMap = {
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
    'fresher': 'fa-user-graduate',
    'entry level': 'fa-user-plus',
    'entry-level': 'fa-user-plus',
    'mid-level': 'fa-user-check',
    'mid level': 'fa-user-check',
    'senior': 'fa-user-tie',
    'full-time': 'fa-clock',
    'full time': 'fa-clock',
    'part-time': 'fa-hourglass-half',
    'part time': 'fa-hourglass-half',
    'contract': 'fa-file-contract',
    'freelance': 'fa-laptop',
    'internship': 'fa-user-graduate',
    'remote': 'fa-home',
    'default': 'fa-briefcase'
  };

  const getIcon = (name, type) => {
    const lowerName = name.toLowerCase();
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    
    if (type === 'company') return 'fa-building';
    if (type === 'category') return 'fa-briefcase';
    if (type === 'location') return 'fa-map-marker-alt';
    if (type === 'experience') return 'fa-user';
    if (type === 'type') return 'fa-calendar';
    
    return iconMap.default;
  };

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

    const uniqueLocations = extractUniqueValues('location');
    if (uniqueLocations.length > 0) {
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

    navigate(`/jobs?${params.toString()}`);
  };

  const handleViewMore = (filterType) => {
    navigate(`/filters/${filterType}`);
  };

  const groupedFilters = {
    location: quickFilterOptions.filter(f => f.filterType === 'location'),
    experience: quickFilterOptions.filter(f => f.filterType === 'experience'),
    type: quickFilterOptions.filter(f => f.filterType === 'type'),
    category: quickFilterOptions.filter(f => f.filterType === 'category'),
    company: quickFilterOptions.filter(f => f.filterType === 'company')
  };

  const renderFilterSection = (sectionType, title, icon, filters) => {
    if (filters.length === 0) return null;

    const visibleFilters = filters.slice(0, INITIAL_ITEMS[sectionType]);
    const hasMore = filters.length > INITIAL_ITEMS[sectionType];

    return (
      <div className="homeFilterSection">
        <h3 className="homeFilterSectionTitle">
          <i className={`fa ${icon}`}></i> {title}
        </h3>
        <div className="homeQuickFiltersGrid">
          {visibleFilters.map((option) => (
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
        {hasMore && (
          <div className="homeViewMoreContainer">
            <button 
              className="homeViewMoreBtn"
              onClick={() => handleViewMore(sectionType)}
            >
              <span>View All {title}</span>
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    );
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

      {renderFilterSection('location', 'Work Location', 'fa-map-marker-alt', groupedFilters.location)}
      {renderFilterSection('experience', 'Experience Level', 'fa-user-tie', groupedFilters.experience)}
      {renderFilterSection('type', 'Job Type', 'fa-briefcase', groupedFilters.type)}
      {renderFilterSection('category', 'Browse by Category', 'fa-layer-group', groupedFilters.category)}
      {renderFilterSection('company', 'Browse by Company', 'fa-building', groupedFilters.company)}
    </div>
  );
};

export default QuickFilters;