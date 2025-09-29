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

  const handleViewJobDetails = (jobId) => {
    // Navigate to job details page or open modal
    console.log('View job details for job ID:', jobId);
    // Example: navigate(`/jobs/${jobId}`);
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
      <div className="advancedFilterSection">
        <div 
          className="advancedFilterSectionHeader"
          onClick={() => dispatch(toggleExpandedSection(sectionKey))}
        >
          <h3>{title}</h3>
          <div className="advancedFilterSectionControls">
            {activeItems.length > 0 && (
              <span className="advancedFilterActiveCount">{activeItems.length}</span>
            )}
            <span className={`advancedFilterExpandIcon ${isExpanded ? 'advancedFilterExpanded' : ''}`}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="advancedFilterOptions">
            {items.map((item, index) => {
              // Create unique key by combining multiple properties
              const itemId = item.id || item.value;
              const uniqueKey = `${sectionKey}-${itemId}-${index}`;
              const isActive = activeItems.includes(itemId);
              const count = filterCounts[countKey]?.[itemId] || 0;
              
              return (
                <label key={uniqueKey} className="advancedFilterOption">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => dispatch(toggleAction(itemId))}
                  />
                  <span className="advancedFilterLabel">
                    <span className="advancedFilterName">{item.name}</span>
                    {count > 0 && (
                      <span className="advancedFilterCount">({count})</span>
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
    <div className="advancedFilterContainer">
      <div className="advancedFilterWrapper">
        {/* Filter Sidebar */}
        <aside className={`advancedFilterSidebar ${ui.isFilterPanelOpen ? 'advancedFilterOpen' : ''}`}>
          <div className="advancedFilterHeader">
            <h2>Filters</h2>
            {getActiveFilterCount() > 0 && (
              <button 
                className="advancedFilterClearAllBtn"
                onClick={handleClearAll}
              >
                Clear All ({getActiveFilterCount()})
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="advancedFilterSection">
            <form onSubmit={handleSearchSubmit} className="advancedFilterSearchForm">
              <input
                type="text"
                placeholder="Search jobs..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="advancedFilterSearchInput"
              />
              <button type="submit" className="advancedFilterSearchBtn">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
            {activeFilters.search && (
              <button
                className="advancedFilterClearFilterBtn"
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
            <div className="advancedFilterLoading">
              <i className="fas fa-spinner fa-spin"></i> Loading filters...
            </div>
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
              <div className="advancedFilterSection">
                <div 
                  className="advancedFilterSectionHeader"
                  onClick={() => dispatch(toggleExpandedSection('salary'))}
                >
                  <h3>Salary Range</h3>
                  <span className={`advancedFilterExpandIcon ${ui.expandedSections.salary ? 'advancedFilterExpanded' : ''}`}>
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </div>
                
                {ui.expandedSections.salary && (
                  <div className="advancedFilterSalaryInputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={salaryRange.min || ''}
                      onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
                      className="advancedFilterSalaryInput"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={salaryRange.max || ''}
                      onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
                      className="advancedFilterSalaryInput"
                    />
                    <button onClick={handleSalaryApply} className="advancedFilterApplySalaryBtn">
                      <i className="fas fa-check"></i> Apply
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="advancedFilterMainContent">
          {/* Header with controls */}
          <div className="advancedFilterContentHeader">
            <button 
              className="advancedFilterMobileToggle"
              onClick={() => dispatch(toggleFilterPanel())}
            >
              <i className="fas fa-filter"></i>
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="advancedFilterBadge">{getActiveFilterCount()}</span>
              )}
            </button>

            <div className="advancedFilterResultsInfo">
              <span className="advancedFilterResultsCount">
                {loading.jobs ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-briefcase"></i> {pagination.totalJobs} jobs found
                  </>
                )}
              </span>
            </div>

            <div className="advancedFilterSortControls">
              <label>Sort by:</label>
              <select
                value={sorting.sortBy}
                onChange={(e) => dispatch(setFilterSorting({ sortBy: e.target.value }))}
                className="advancedFilterSortSelect"
              >
                <option value="created_at">Date Posted</option>
                <option value="title">Job Title</option>
                <option value="salary_min">Salary</option>
              </select>
              <select
                value={sorting.sortOrder}
                onChange={(e) => dispatch(setFilterSorting({ sortOrder: e.target.value }))}
                className="advancedFilterSortSelect"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="advancedFilterActiveFilters">
              <span className="advancedFilterActiveFiltersLabel">Active filters:</span>
              <div className="advancedFilterActiveTags">
                {activeFilters.search && (
                  <span className="advancedFilterTag">
                    Search: {activeFilters.search}
                    <button onClick={() => dispatch(clearFilterType('search'))}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                {activeFilters.categories.map((catId, index) => {
                  const cat = filterOptions.categories.find(c => c.id === catId);
                  return cat && (
                    <span key={`cat-${catId}-${index}`} className="advancedFilterTag">
                      {cat.name}
                      <button onClick={() => dispatch(toggleCategoryFilter(catId))}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  );
                })}
                {activeFilters.companies.map((compId, index) => {
                  const comp = filterOptions.companies.find(c => c.id === compId);
                  return comp && (
                    <span key={`comp-${compId}-${index}`} className="advancedFilterTag">
                      {comp.name}
                      <button onClick={() => dispatch(toggleCompanyFilter(compId))}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  );
                })}
                {activeFilters.locations.map((locId, index) => {
                  const loc = filterOptions.locations.find(l => l.id === locId);
                  return loc && (
                    <span key={`loc-${locId}-${index}`} className="advancedFilterTag">
                      {loc.name}
                      <button onClick={() => dispatch(toggleLocationFilter(locId))}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  );
                })}
                {activeFilters.types.map((typeId, index) => {
                  const type = filterOptions.types.find(t => t.id === typeId);
                  return type && (
                    <span key={`type-${typeId}-${index}`} className="advancedFilterTag">
                      {type.name}
                      <button onClick={() => dispatch(toggleTypeFilter(typeId))}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  );
                })}
                {activeFilters.experienceLevels.map((expId, index) => {
                  const exp = filterOptions.experienceLevels.find(e => e.id === expId);
                  return exp && (
                    <span key={`exp-${expId}-${index}`} className="advancedFilterTag">
                      {exp.name}
                      <button onClick={() => dispatch(toggleExperienceFilter(expId))}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  );
                })}
                {(activeFilters.salaryMin || activeFilters.salaryMax) && (
                  <span className="advancedFilterTag">
                    Salary: ${activeFilters.salaryMin || 0} - ${activeFilters.salaryMax || '∞'}
                    <button onClick={() => dispatch(setSalaryRange({ min: null, max: null }))}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="advancedFilterErrorMessage">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {/* Jobs List */}
          <div className="advancedFilterJobsList">
            {loading.jobs ? (
              <div className="advancedFilterLoadingSpinner">
                <i className="fas fa-spinner fa-spin"></i> Loading jobs...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="advancedFilterNoResults">
                <i className="fas fa-search" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '20px' }}></i>
                <p>No jobs found matching your criteria.</p>
                <button onClick={handleClearAll} className="advancedFilterClearFiltersCta">
                  <i className="fas fa-redo"></i> Clear all filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <div key={`job-${job.id}-${index}`} className="advancedFilterJobCard">
                  <div className="advancedFilterJobCardHeader">
                    {job.companies?.logo && (
                      <img 
                        src={job.companies.logo} 
                        alt={job.companies.name}
                        className="advancedFilterCompanyLogo"
                      />
                    )}
                    <div className="advancedFilterJobTitleSection">
                      <h3 className="advancedFilterJobTitle">{job.title}</h3>
                      <p className="advancedFilterCompanyName">{job.companies?.name}</p>
                    </div>
                  </div>
                  
                  <div className="advancedFilterJobDetails">
                    <span className="advancedFilterJobDetail">
                      <i className="fas fa-map-marker-alt advancedFilterDetailIcon"></i>
                      {job.location}
                    </span>
                    <span className="advancedFilterJobDetail">
                      <i className="fas fa-briefcase advancedFilterDetailIcon"></i>
                      {job.type}
                    </span>
                    {job.experience && (
                      <span className="advancedFilterJobDetail">
                        <i className="fas fa-chart-line advancedFilterDetailIcon"></i>
                        {job.experience}
                      </span>
                    )}
                    {job.salary_min && (
                      <span className="advancedFilterJobDetail">
                        <i className="fas fa-dollar-sign advancedFilterDetailIcon"></i>
                        {job.salary_min.toLocaleString()}
                        {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="advancedFilterJobDescription">
                      {job.description.substring(0, 150)}...
                    </p>
                  )}

                  <div className="advancedFilterJobCardFooter">
                    <span className="advancedFilterJobCategory">
                      <i className="fas fa-tag"></i> {job.categories?.name}
                    </span>
                    <button 
                      className="advancedFilterViewJobBtn"
                      onClick={() => handleViewJobDetails(job.id)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="advancedFilterPagination">
              <button
                onClick={() => dispatch(setFilterPage(pagination.currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                className="advancedFilterPaginationBtn"
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              
              <div className="advancedFilterPaginationInfo">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              <button
                onClick={() => dispatch(setFilterPage(pagination.currentPage + 1))}
                disabled={!pagination.hasNextPage}
                className="advancedFilterPaginationBtn"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvancedJobFilter;