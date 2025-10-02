import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AllFilters.css';

const AllFilters = () => {
  const navigate = useNavigate();
  const { filterType } = useParams();
  const location = useLocation();
  const { categories, companies, jobs } = useSelector((state) => state.jobs);
  const [allFilterOptions, setAllFilterOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced icon mapping
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
    let filters = [];

    switch (filterType) {
      case 'location':
        const uniqueLocations = extractUniqueValues('location');
        const sortedLocations = uniqueLocations.sort((a, b) => {
          if (a.toLowerCase().includes('remote')) return -1;
          if (b.toLowerCase().includes('remote')) return 1;
          return a.localeCompare(b);
        });

        filters = sortedLocations.map(location => ({
          id: `location-${location.toLowerCase().replace(/[\s,]+/g, '-')}`,
          icon: getIcon(location, 'location'),
          label: location,
          filterType: 'location',
          filterValue: location
        }));
        break;

      case 'experience':
        const uniqueExperience = extractUniqueValues('experience');
        filters = uniqueExperience.map(exp => ({
          id: `experience-${exp.toLowerCase().replace(/\s+/g, '-')}`,
          icon: getIcon(exp, 'experience'),
          label: exp,
          filterType: 'experience',
          filterValue: exp
        }));
        break;

      case 'type':
        const uniqueTypes = extractUniqueValues('type');
        filters = uniqueTypes.map(type => ({
          id: `type-${type.toLowerCase().replace(/\s+/g, '-')}`,
          icon: getIcon(type, 'type'),
          label: type,
          filterType: 'type',
          filterValue: type
        }));
        break;

      case 'category':
        if (categories && categories.length > 0) {
          filters = categories.map(category => ({
            id: `category-${category.id}`,
            icon: getIcon(category.name, 'category'),
            label: category.name,
            filterType: 'category',
            filterValue: category.id,
            actualName: category.name
          }));
        }
        break;

      case 'company':
        if (companies && companies.length > 0) {
          filters = companies.map(company => ({
            id: `company-${company.id}`,
            icon: getIcon(company.name, 'company'),
            label: company.name,
            filterType: 'company',
            filterValue: company.id,
            actualName: company.name
          }));
        }
        break;

      default:
        break;
    }

    setAllFilterOptions(filters);
  }, [filterType, categories, companies, jobs]);

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

  const getPageTitle = () => {
    const titles = {
      location: 'All Work Locations',
      experience: 'All Experience Levels',
      type: 'All Job Types',
      category: 'All Categories',
      company: 'All Companies'
    };
    return titles[filterType] || 'All Filters';
  };

  const getPageIcon = () => {
    const icons = {
      location: 'fa-map-marker-alt',
      experience: 'fa-user-tie',
      type: 'fa-briefcase',
      category: 'fa-layer-group',
      company: 'fa-building'
    };
    return icons[filterType] || 'fa-filter';
  };

  const filteredOptions = allFilterOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="allFiltersContainer">
      <div className="allFiltersHeader">
        <button className="backButton" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <div className='allFiltersHeaderContentsearchContainer'>
        <div className="allFiltersHeaderContent">
          <div className="allFiltersHeaderIcon">
            <i className={`fa ${getPageIcon()}`}></i>
          </div>
          <div>
            <h1>{getPageTitle()}</h1>
            <p>{filteredOptions.length} options available</p>
          </div>
        </div>

        <div className="searchContainer">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder={`Search ${filterType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />
          {searchQuery && (
            <button 
              className="clearSearch" 
              onClick={() => setSearchQuery('')}
            >
              <i className="fa fa-times"></i>
            </button>
          )}
        </div>
        </div>
      </div>

      <div className="allFiltersGrid">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              key={option.id}
              className="allFilterCard"
              onClick={() => handleFilterClick(option)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFilterClick(option);
                }
              }}
            >
              <div className="allFilterIcon">
                <i className={`fa ${option.icon}`}></i>
              </div>
              <div className="allFilterLabel">{option.label}</div>
              <div className="allFilterArrow">
                <i className="fa fa-arrow-right"></i>
              </div>
            </div>
          ))
        ) : (
          <div className="noResultsMessage">
            <i className="fa fa-search"></i>
            <p>No results found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="clearSearchBtn">
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFilters;