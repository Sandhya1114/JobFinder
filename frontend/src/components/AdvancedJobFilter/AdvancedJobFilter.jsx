// AdvancedJobFilter.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { advancedFilterApi } from '../../services/advancedFilterApi';
import {
  setFilterOptions,
  setFilterCounts,
  setFilteredJobs,
  toggleCategoryFilter,
  toggleCompanyFilter,
  toggleLocationFilter,
  toggleTypeFilter,
  toggleExperienceFilter,
  setSalaryRange,
  setFilterSearch,
  clearAllFilters,
  clearFilterType,
  setFilterPage,
  setFilterSorting,
  setFilterLoading,
  setFilterError,
  toggleFilterPanel,
  toggleExpandedSection
} from '../../redux/advancedFilterSlice'
import './AdvancedJobFilter.css';
// import { setFilterOptions } from '../../redux/advancedFilterSlice';


const AdvancedJobFilter = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const {
    filterOptions,
    filterCounts,
    filteredJobs,
    activeFilters,
    pagination,
    sorting,
    loading,
    error,
    ui
  } = useSelector(state => state.advancedFilter);

  const [localSearch, setLocalSearch] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: null, max: null });

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
    loadFilterCounts();
  }, []);

  // Fetch jobs when filters change
  useEffect(() => {
    if (filterOptions.categories.length > 0) {
      fetchFilteredJobs();
    }
  }, [
    activeFilters,
    pagination.currentPage,
    sorting
  ]);

  const loadFilterOptions = async () => {
    try {
      dispatch(setFilterLoading({ type: 'options', isLoading: true }));
      const data = await advancedFilterApi.fetchFilterOptions();
      dispatch(setFilterOptions(data));
    } catch (err) {
      dispatch(setFilterError(err.message));
    }
  };

  const loadFilterCounts = async () => {
    try {
      dispatch(setFilterLoading({ type: 'counts', isLoading: true }));
      const data = await advancedFilterApi.fetchFilterCounts();
      dispatch(setFilterCounts(data));
    } catch (err) {
      console.error('Error loading filter counts:', err);
    }
  };

  const fetchFilteredJobs = async () => {
    try {
      dispatch(setFilterLoading({ type: 'jobs', isLoading: true }));
      const data = await advancedFilterApi.fetchFilteredJobs({
        ...activeFilters,
        page: pagination.currentPage,
        limit: pagination.jobsPerPage,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder
      });
      dispatch(setFilteredJobs(data));
    } catch (err) {
      dispatch(setFilterError(err.message));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilterSearch(localSearch));
  };

  const handleSalaryApply = () => {
    dispatch(setSalaryRange(salaryRange));
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
    setLocalSearch('');
    setSalaryRange({ min: null, max: null });
  };

  const getActiveFilterCount = () => {
    return (
      activeFilters.categories.length +
      activeFilters.companies.length +
      activeFilters.locations.length +
      activeFilters.types.length +
      activeFilters.experienceLevels.length +
      (activeFilters.salaryMin || activeFilters.salaryMax ? 1 : 0) +
      (activeFilters.search ? 1 : 0)
    );
  };

  const renderFilterSection = (title, items, activeItems, toggleAction, countKey, sectionKey) => {
    const isExpanded = ui.expandedSections[sectionKey];
    
    return (
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => dispatch(toggleExpandedSection(sectionKey))}
        >
          <h3>{title}</h3>
          <div className="filter-section-controls">
            {activeItems.length > 0 && (
              <span className="active-count">{activeItems.length}</span>
            )}
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="filter-options">
            {items.map(item => {
              const itemId = item.id || item.value;
              const isActive = activeItems.includes(itemId);
              const count = filterCounts[countKey]?.[itemId] || 0;
              
              return (
                <label key={itemId} className="filter-option">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => dispatch(toggleAction(itemId))}
                  />
                  <span className="filter-label">
                    <span className="filter-name">{item.name}</span>
                    {count > 0 && (
                      <span className="filter-count">({count})</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="advanced-job-filter">
      <div className="filter-container">
        {/* Filter Sidebar */}
        <aside className={`filter-sidebar ${ui.isFilterPanelOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <h2>Filters</h2>
            {getActiveFilterCount() > 0 && (
              <button 
                className="clear-all-btn"
                onClick={handleClearAll}
              >
                Clear All ({getActiveFilterCount()})
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="filter-section">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search jobs..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>
            {activeFilters.search && (
              <button
                className="clear-filter-btn"
                onClick={() => {
                  dispatch(clearFilterType('search'));
                  setLocalSearch('');
                }}
              >
                Clear search
              </button>
            )}
          </div>

          {/* Categories Filter */}
          {loading.options ? (
            <div className="filter-loading">Loading filters...</div>
          ) : (
            <>
              {renderFilterSection(
                'Categories',
                filterOptions.categories,
                activeFilters.categories,
                toggleCategoryFilter,
                'categories',
                'categories'
              )}

              {/* Companies Filter */}
              {renderFilterSection(
                'Companies',
                filterOptions.companies,
                activeFilters.companies,
                toggleCompanyFilter,
                'companies',
                'companies'
              )}

              {/* Locations Filter */}
              {renderFilterSection(
                'Locations',
                filterOptions.locations,
                activeFilters.locations,
                toggleLocationFilter,
                'locations',
                'locations'
              )}

              {/* Job Types Filter */}
              {renderFilterSection(
                'Job Type',
                filterOptions.types,
                activeFilters.types,
                toggleTypeFilter,
                'types',
                'types'
              )}

              {/* Experience Level Filter */}
              {renderFilterSection(
                'Experience Level',
                filterOptions.experienceLevels,
                activeFilters.experienceLevels,
                toggleExperienceFilter,
                'experienceLevels',
                'experience'
              )}

              {/* Salary Range Filter */}
              <div className="filter-section">
                <div 
                  className="filter-section-header"
                  onClick={() => dispatch(toggleExpandedSection('salary'))}
                >
                  <h3>Salary Range</h3>
                  <span className={`expand-icon ${ui.expandedSections.salary ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {ui.expandedSections.salary && (
                  <div className="salary-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={salaryRange.min || ''}
                      onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
                      className="salary-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={salaryRange.max || ''}
                      onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
                      className="salary-input"
                    />
                    <button onClick={handleSalaryApply} className="apply-salary-btn">
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="filter-main-content">
          {/* Header with controls */}
          <div className="content-header">
            <button 
              className="mobile-filter-toggle"
              onClick={() => dispatch(toggleFilterPanel())}
            >
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="filter-badge">{getActiveFilterCount()}</span>
              )}
            </button>

            <div className="results-info">
              <span className="results-count">
                {loading.jobs ? 'Loading...' : `${pagination.totalJobs} jobs found`}
              </span>
            </div>

            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sorting.sortBy}
                onChange={(e) => dispatch(setFilterSorting({ sortBy: e.target.value }))}
                className="sort-select"
              >
                <option value="created_at">Date Posted</option>
                <option value="title">Job Title</option>
                <option value="salary_min">Salary</option>
              </select>
              <select
                value={sorting.sortOrder}
                onChange={(e) => dispatch(setFilterSorting({ sortOrder: e.target.value }))}
                className="sort-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="active-filters">
              <span className="active-filters-label">Active filters:</span>
              <div className="active-filter-tags">
                {activeFilters.search && (
                  <span className="filter-tag">
                    Search: {activeFilters.search}
                    <button onClick={() => dispatch(clearFilterType('search'))}>×</button>
                  </span>
                )}
                {activeFilters.categories.map(catId => {
                  const cat = filterOptions.categories.find(c => c.id === catId);
                  return cat && (
                    <span key={catId} className="filter-tag">
                      {cat.name}
                      <button onClick={() => dispatch(toggleCategoryFilter(catId))}>×</button>
                    </span>
                  );
                })}
                {activeFilters.companies.map(compId => {
                  const comp = filterOptions.companies.find(c => c.id === compId);
                  return comp && (
                    <span key={compId} className="filter-tag">
                      {comp.name}
                      <button onClick={() => dispatch(toggleCompanyFilter(compId))}>×</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Jobs List */}
          <div className="jobs-list">
            {loading.jobs ? (
              <div className="loading-spinner">Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="no-results">
                <p>No jobs found matching your criteria.</p>
                <button onClick={handleClearAll} className="clear-filters-cta">
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    {job.companies?.logo && (
                      <img 
                        src={job.companies.logo} 
                        alt={job.companies.name}
                        className="company-logo"
                      />
                    )}
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="company-name">{job.companies?.name}</p>
                    </div>
                  </div>
                  
                  <div className="job-details">
                    <span className="job-detail">
                      <span className="detail-icon">📍</span>
                      {job.location}
                    </span>
                    <span className="job-detail">
                      <span className="detail-icon">💼</span>
                      {job.type}
                    </span>
                    {job.experience && (
                      <span className="job-detail">
                        <span className="detail-icon">📊</span>
                        {job.experience}
                      </span>
                    )}
                    {job.salary_min && (
                      <span className="job-detail">
                        <span className="detail-icon">💰</span>
                        ${job.salary_min.toLocaleString()}
                        {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="job-description">
                      {job.description.substring(0, 150)}...
                    </p>
                  )}

                  <div className="job-card-footer">
                    <span className="job-category">
                      {job.categories?.name}
                    </span>
                    <button className="view-job-btn">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => dispatch(setFilterPage(pagination.currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              <button
                onClick={() => dispatch(setFilterPage(pagination.currentPage + 1))}
                disabled={!pagination.hasNextPage}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvancedJobFilter;