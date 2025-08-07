import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDataLoader } from '../hooks/useDataLoader';

import {
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  setCurrentPage,
  setJobsPerPage,
  clearFilters,
} from '../redux/store';
import './JobList.css';
import { saveJob } from '../redux/savedJobsSlice';
import { useLocation } from 'react-router-dom';

// Pagination Component
const Pagination = ({ pagination, onPageChange, onJobsPerPageChange }) => {
  const { 
    currentPage, 
    totalPages, 
    totalJobs, 
    jobsPerPage, 
    startIndex, 
    endIndex,
    hasNextPage,
    hasPreviousPage
  } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startIndex}-{endIndex} of {totalJobs} jobs
      </div>
      
      <div className="pagination-controls">
        <button
          className={`pagination-btn ${!hasPreviousPage ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          <i className="fa fa-chevron-left"></i> Previous
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className={`pagination-btn ${!hasNextPage ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next <i className="fa fa-chevron-right"></i>
        </button>
      </div>

      <div className="jobs-per-page">
        <label>
          Jobs per page:
          <select
            value={jobsPerPage}
            onChange={(e) => onJobsPerPageChange(parseInt(e.target.value))}
            className="jobs-per-page-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
};

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, categories, companies, loading, error, filters, pagination } = useSelector((state) => state.jobs);
  const { loadJobs, loadAllData } = useDataLoader();
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== filters.searchQuery) {
        dispatch(setSearchQuery(searchInput));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchInput, filters.searchQuery, dispatch]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Update local state when Redux filters change
  useEffect(() => {
    if (filters.selectedLocation?.length > 0) {
      setLocationSearchInput(filters.selectedLocation[0]);
    }
    setSearchInput(filters.searchQuery || '');
  }, [filters.selectedLocation, filters.searchQuery]);

  // Sidebar management effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Reload jobs when filters or pagination change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagination.currentPage]);

  const handlePageChange = useCallback((newPage) => {
    dispatch(setCurrentPage(newPage));
  }, [dispatch]);

  const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
    dispatch(setJobsPerPage(newJobsPerPage));
  }, [dispatch]);

  // Memoized salary formatter
  const formatSalary = useCallback((salary) => {
    if (!salary?.min || !salary?.max) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  }, []);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setLocationSearchInput('');
    setSearchInput('');
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Static filter options
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

  return (
    <div className="job-list-container">
      {/* Mobile filter toggle button */}
      <button className="filter-toggle" onClick={toggleSidebar}>
        <i className="fa fa-filter"></i> Filters
      </button>

      {/* Sidebar overlay for mobile */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="filters-section">
            <div className="filter-group">
              <h4>Category</h4>
              {categories.map((category) => (
                <label key={category.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedCategory?.includes(category.id)}
                    onChange={() => {
                      const current = filters.selectedCategory || [];
                      const updated = current.includes(category.id)
                        ? current.filter((id) => id !== category.id)
                        : [...current, category.id];
                      dispatch(setSelectedCategory(updated));
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Company</h4>
              {companies.map((company) => (
                <label key={company.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedCompany?.includes(company.id)}
                    onChange={() => {
                      const current = filters.selectedCompany || [];
                      const updated = current.includes(company.id)
                        ? current.filter((id) => id !== company.id)
                        : [...current, company.id];
                      dispatch(setSelectedCompany(updated));
                    }}
                  />
                  {company.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Experience</h4>
              {experienceOptions.map((level) => (
                <label key={level} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedExperience?.includes(level)}
                    onChange={() => {
                      const current = filters.selectedExperience || [];
                      const updated = current.includes(level)
                        ? current.filter((e) => e !== level)
                        : [...current, level];
                      dispatch(setSelectedExperience(updated));
                    }}
                  />
                  {level}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              {locationOptions.map((location) => (
                <label key={location} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedLocation?.includes(location)}
                    onChange={() => {
                      const current = filters.selectedLocation || [];
                      const updated = current.includes(location)
                        ? current.filter((l) => l !== location)
                        : [...current, location];
                      dispatch(setSelectedLocation(updated));
                    }}
                  />
                  {location}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Type</h4>
              {typeOptions.map((type) => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedType?.includes(type)}
                    onChange={() => {
                      const current = filters.selectedType || [];
                      const updated = current.includes(type)
                        ? current.filter((t) => t !== type)
                        : [...current, type];
                      dispatch(setSelectedType(updated));
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Salary Range</h4>
              {salaryRangeOptions.map((range) => (
                <label key={range} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedSalary?.includes(range)}
                    onChange={() => {
                      const current = filters.selectedSalary || [];
                      const updated = current.includes(range)
                        ? current.filter((r) => r !== range)
                        : [...current, range];
                      dispatch(setSelectedSalary(updated));
                    }}
                  />
                  {range}
                </label>
              ))}
            </div>

            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="jobs-content">
          {/* Search Bar in JobList */}
          {isJobPage && (
            <div className="search-bar sticky-search-bar">
              <div className="search-field">
                <span className="icon"><i className="fa fa-search"></i></span>
                <input
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      dispatch(setSearchQuery(searchInput));
                    }
                  }}
                />
              </div>
              <div className="divider" />
              <select
                className="experience-dropdown"
                value=""
                onChange={(e) => {
                  const selectedExp = e.target.value;
                  if (selectedExp) {
                    const current = filters.selectedExperience || [];
                    const updated = current.includes(selectedExp)
                      ? current.filter((exp) => exp !== selectedExp)
                      : [...current, selectedExp];
                    dispatch(setSelectedExperience(updated));
                  }
                }}
              >
                <option value="">Select experience</option>
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <div className="divider" />
              <input
                type="text"
                className="location-input"
                placeholder="Enter location"
                value={locationSearchInput}
                onChange={(e) => {
                  const locationValue = e.target.value;
                  setLocationSearchInput(locationValue);
                  
                  if (locationValue.trim()) {
                    dispatch(setSelectedLocation([locationValue.trim()]));
                  } else {
                    dispatch(setSelectedLocation([]));
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const locationValue = e.target.value.trim();
                    if (locationValue) {
                      dispatch(setSelectedLocation([locationValue]));
                    }
                  }
                }}
              />
              <button className="search-btn" onClick={() => {
                dispatch(setSearchQuery(searchInput.trim()));
              }}>
                Search
              </button>
            </div>
          )}

          {/* Pagination - Top */}
          {pagination.totalJobs > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onJobsPerPageChange={handleJobsPerPageChange}
            />
          )}

          <div className="jobs-grid">
            {jobs.length === 0 ? (
              <div className="no-jobs">
                {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h2 className="job-title">{job.title || 'No Title'}</h2>
                    <div className="job-meta">
                      <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
                      <span className="job-location">{job.location || 'Location not specified'}</span>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="job-category">
                      <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
                    </div>

                    <div className="job-info">
                      <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
                      <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
                      <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
                    </div>

                    <div className="job-description">
                      <p>{job.description || 'No description available'}</p>
                    </div>

                    {job.requirements?.length > 0 && (
                      <div className="job-requirements">
                        <h4>Requirements:</h4>
                        <ul>
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="job-footer">
                      <span className="posted-date">
                        Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
                      </span>
                      <div className="job-actions">
                        {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
                          <a href={job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link} target="_blank" rel="noopener noreferrer">
                            <button className="apply-btn">Apply Now</button>
                          </a>
                        ) : (
                          <button 
                            className="apply-btn disabled"
                            onClick={() => showToast("Application link not available for this job")}
                            title="Application link not available"
                          >
                            Apply
                          </button>
                        )}
                        <button
                          onClick={() => {
                            dispatch(saveJob(job));
                            showToast("Job saved successfully!");
                            if (window.innerWidth <= 768) {
                              setIsSidebarOpen(false);
                            }
                          }}
                          className="save-btn"
                        >
                          Save Job
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination - Bottom */}
          {pagination.totalJobs > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onJobsPerPageChange={handleJobsPerPageChange}
            />
          )}
        </div>
      </div>
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;