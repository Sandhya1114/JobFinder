
import React, { memo, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  useJobsQuery,
  useFilterOptionsQuery,
  useCategoriesQuery,
  useCompaniesQuery,
} from '../hooks/useJobQueries';
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
  appendJobs,
  resetInfiniteScroll,
  setInfiniteScrollLoading
} from '../redux/store';
import './Joblist.css';
import { saveJob } from '../redux/savedJobsSlice';

// Memoized Job Details Modal Component
const JobDetailsModal = memo(({ job, isOpen, onClose, onSave, onApply }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const formattedSalary = useMemo(() => {
    if (!job?.salary?.min || !job?.salary?.max) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: job.salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)}`;
  }, [job?.salary]);

  if (!isOpen || !job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h1 className="modal-job-title">{job.title || 'No Title'}</h1>
            <div className="modal-company-info">
              <span className="modal-company-name">
                {job.companies?.name || job.company?.name || 'Company not specified'}
              </span>
              <span className="modal-separator">||</span>
              <span className="modal-location">{job.location || 'Location not specified'}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`modal-tab ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            Requirements
          </button>
          <button 
            className={`modal-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Job Details
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'overview' && (
            <div className="modal-tab-content">
              <div className="modal-quick-info">
                <div className="modal-info-item">
                  <span className="modal-info-label">Category:</span>
                  <span className="modal-category-badge">
                    {job.categories?.name || job.category?.name || 'Category not specified'}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Experience:</span>
                  <span>{job.experience || 'Not specified'}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Type:</span>
                  <span>{job.type || 'Not specified'}</span>
                </div>
                {job.salary && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Salary:</span>
                    <span className="modal-salary">{formattedSalary}</span>
                  </div>
                )}
                <div className="modal-info-item">
                  <span className="modal-info-label">Posted:</span>
                  <span>{job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}</span>
                </div>
              </div>
              
              <div className="modal-description">
                <h3>Job Description</h3>
                <p>{job.description || 'No description available'}</p>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="modal-tab-content">
              {job.requirements?.length > 0 ? (
                <div className="modal-requirements">
                  <h3>Requirements</h3>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="modal-no-content">
                  <p>No specific requirements listed for this position.</p>
                </div>
              )}
              
              {job.responsibilities?.length > 0 && (
                <div className="modal-responsibilities">
                  <h3>Responsibilities</h3>
                  <ul>
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="modal-tab-content">
              <div className="modal-additional-details">
                <h3>Additional Information</h3>
                
                {job.benefits?.length > 0 && (
                  <div className="modal-section">
                    <h4>Benefits</h4>
                    <ul>
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="modal-section">
                  <h4>Job Information</h4>
                  <div className="modal-info-grid">
                    <div className="modal-info-item">
                      <span className="modal-info-label">Department:</span>
                      <span>{job.department || 'Not specified'}</span>
                    </div>
                    <div className="modal-info-item">
                      <span className="modal-info-label">Employment Type:</span>
                      <span>{job.employmentType || job.type || 'Not specified'}</span>
                    </div>
                    <div className="modal-info-item">
                      <span className="modal-info-label">Work Schedule:</span>
                      <span>{job.schedule || 'Not specified'}</span>
                    </div>
                    <div className="modal-info-item">
                      <span className="modal-info-label">Remote Work:</span>
                      <span>{job.remoteWork ? 'Available' : job.location?.includes('Remote') ? 'Available' : 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button onClick={onSave} className="modal-save-btn">
              Save Job
            </button>
            {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
              <button onClick={onApply} className="modal-apply-btn">
                Apply Now
              </button>
            ) : (
              <button className="modal-apply-btn disabled" disabled>
                Apply Link Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized Pagination Component
const Pagination = React.memo(({ pagination, onPageChange, onJobsPerPageChange }) => {
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageNumbers = useMemo(() => {
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
  }, [currentPage, totalPages]);

  if (isMobile) return null;

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
          {pageNumbers.map((page, index) => (
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
});

// Memoized Mobile Infinite Scroll Component
const MobileInfiniteScroll = React.memo(({ jobs, hasMore, loadMore, loading }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          console.log('Intersection observer triggered - loading more jobs');
          loadMore();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px' 
      }
    );

    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div ref={loaderRef} className="mobile-infinite-loader">
      {loading && hasMore && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading more jobs...</span>
        </div>
      )}
      {!hasMore && jobs.length > 0 && (
        <div className="end-message">
          🎉 You've seen all available jobs!
        </div>
      )}
      {!hasMore && jobs.length === 0 && (
        <div className="end-message">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  );
});

// Memoized Job Card Component
const JobCard = React.memo(({ job, index, isMobile, onViewDetails, onSave }) => {
  const truncatedDescription = useMemo(() => {
    if (!job.description) return 'No description available';
    return job.description.length > 120 
      ? job.description.substring(0, 120) + '...' 
      : job.description;
  }, [job.description]);

  const formattedDate = useMemo(() => {
    return job.postedDate || job.created_at 
      ? new Date(job.postedDate || job.created_at).toLocaleDateString() 
      : 'Date not available';
  }, [job.postedDate, job.created_at]);

  const handleSaveJob = useCallback(async () => {
    try {
      await onSave(job.id);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  }, [job.id, onSave]);

  return (
    <div key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card job-card-horizontal">
      <div className="job-content-horizontal">
        <div className='ROWFELXLOGOJOBS'>
          <div className="job-logo-container">
            {job.companies?.logo || job.company?.logo ? (
              <img 
                src={job.companies?.logo || job.company?.logo} 
                alt={job.companies?.name || job.company?.name || 'Company'}
                className="job-company-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="job-logo-placeholder" style={{ display: (job.companies?.logo || job.company?.logo) ? 'none' : 'flex' }}>
              <i className="fa fa-building"></i>
            </div>
          </div>
          <div className="job-header-horizontal">
            <div className="job-title-section">
              <h2 className="job-title-horizontal">{job.title || 'No Title'}</h2>
              <div className="job-company-info">
                <span className="company-name-horizontal">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="job-meta-horizontal">
          <div className="job-meta-item">
            <i className="fa fa-briefcase"></i>
            <span>{job.experience || 'Not specified'}</span>
          </div>
          <div className="job-meta-item">
            <i className="fa fa-map-marker"></i>
            <span>{job.location || 'Location not specified'}</span>
          </div>
        </div>

        <div className="job-description-horizontal">
          <i className="fa fa-file-text-o"></i>
          <p>{truncatedDescription}</p>
        </div>

        <div className="job-tags-horizontal">
          {job.categories?.name || job.category?.name ? (
            <span className="job-tag">{job.categories?.name || job.category?.name}</span>
          ) : null}
          {job.type ? (
            <span className="job-tag">{job.type}</span>
          ) : null}
          {job.experience ? (
            <span className="job-tag">{job.experience}</span>
          ) : null}
        </div>

        <div className="job-footer-horizontal">
          <span className="posted-date-horizontal">
            <i className="fa fa-clock-o"></i>
            {formattedDate}
          </span>
          <div className="job-actions-horizontal">
            <button onClick={handleSaveJob} className="save-btn-horizontal">
              <i className="fa fa-bookmark-o"></i>
              Save
            </button>
            <button
              onClick={() => onViewDetails(job)}
              className="view-details-btn-horizontal"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Filter Option Component
// const FilterOption = React.memo(({ option, isChecked, onChange, filterType, categories, companies }) => {
//   const getDisplayName = () => {
//     if (filterType === 'selectedCategory' && categories) {
//       const category = categories.find(cat => cat.id === option);
//       return category ? category.name : option;
//     } else if (filterType === 'selectedCompany' && companies) {
//       const company = companies.find(comp => comp.id === option);
//       return company ? company.name : option;
//     } else if (filterType === 'selectedSalary') {
//       return `$${option.replace('-', ' - ')}`;
//     }
//     return option;
//   };

//   return (
//     <label className="filter-option">
//       <input
//         type="checkbox"
//         checked={isChecked}
//         onChange={(e) => onChange(filterType, option, e.target.checked)}
//       />
//       <span className="checkmark-mini"></span>
//       {getDisplayName()}
//     </label>
//   );
// });
// Filter Option Component - WITHOUT React.memo (this is the key fix!)
const FilterOption = ({ option, isChecked, onChange, filterType, categories, companies }) => {
  const getDisplayName = () => {
    if (filterType === 'selectedCategory' && categories) {
      const category = categories.find(cat => cat.id === option);
      return category ? category.name : option;
    } else if (filterType === 'selectedCompany' && companies) {
      const company = companies.find(comp => comp.id === option);
      return company ? company.name : option;
    } else if (filterType === 'selectedSalary') {
      return `$${option.replace('-', ' - ')}`;
    }
    return option;
  };

  const handleChange = (e) => {
    e.stopPropagation();
    console.log('Checkbox clicked:', option, 'New state:', e.target.checked);
    onChange(filterType, option, e.target.checked);
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <label className="filter-option" onClick={handleLabelClick}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      />
      <span className="checkmark-mini" style={{ pointerEvents: 'auto', cursor: 'pointer' }}></span>
      {getDisplayName()}
    </label>
  );
};


// Filter Dropdown Component
// const FilterDropdown = React.memo(({ 
//   id, 
//   icon, 
//   title, 
//   options, 
//   selectedValues, 
//   onFilterChange, 
//   onApply, 
//   onClear,
//   categories,
//   companies  
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleButtonClick = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsOpen(prev => !prev);
//   }, []);

//   const handleOptionChange = useCallback((filterType, option, isChecked) => {
//     onFilterChange(filterType, option, isChecked);
//   }, [onFilterChange]);

//   const handleApply = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onApply();
//     setIsOpen(false);
//   }, [onApply]);

//   const handleClear = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onClear();
//   }, [onClear]);

//   const hasActiveFilters = selectedValues && selectedValues.length > 0;

//   return (
//     <div ref={dropdownRef} className={`filter-dropdown ${isOpen ? 'active' : ''}`}>
//       <button 
//         className={`filter-dropdown-btn ${hasActiveFilters ? 'has-active-filters' : ''}`}
//         onClick={handleButtonClick}
//         type="button"
//       >
//         <i className={`fa fa-${icon}`}></i>
//         {title}
//         {hasActiveFilters && <span className="filter-count">({selectedValues.length})</span>}
//         <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
//       </button>
      
//       {isOpen && (
//         <div className="filter-dropdown-content">
//           <div className="filter-dropdown-header">
//             <h4>{title}</h4>
//           </div>
//           <div className="filter-options">
//             {options.map((option) => {
//               const optionValue = option.id || option.name || option;
              
//               return (
//                 <FilterOption
//                   key={optionValue}
//                   option={optionValue}
//                   isChecked={selectedValues?.includes(optionValue)}
//                   onChange={handleOptionChange}
//                   filterType={id}
//                   categories={categories}
//                   companies={companies}
//                 />
//               );
//             })}
//           </div>
//           <div className="filter-dropdown-actions">
//             <button onClick={handleApply} className="apply-btn-mini" type="button">Apply</button>
//             <button onClick={handleClear} className="clear-btn-mini" type="button">Clear</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });
// Filter Dropdown Component - WITHOUT React.memo (this is the key fix!)
const FilterDropdown = ({ 
  id, 
  icon, 
  title, 
  options, 
  selectedValues, 
  onFilterChange, 
  onApply, 
  onClear,
  categories,
  companies  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Log when selectedValues changes
  useEffect(() => {
    console.log(`FilterDropdown ${id} - selectedValues changed:`, selectedValues);
  }, [selectedValues, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleButtonClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleOptionChange = useCallback((filterType, option, isChecked) => {
    // Don't close dropdown when selecting options
    onFilterChange(filterType, option, isChecked);
  }, [onFilterChange]);

  const handleApply = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onApply();
    setIsOpen(false); // Close on Apply
  }, [onApply]);

  const handleClear = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
    // Don't close dropdown on clear
  }, [onClear]);

  const hasActiveFilters = selectedValues && selectedValues.length > 0;

  return (
    <div ref={dropdownRef} className={`filter-dropdown ${isOpen ? 'active' : ''}`}>
      <button 
        className={`filter-dropdown-btn ${hasActiveFilters ? 'has-active-filters' : ''}`}
        onClick={handleButtonClick}
        type="button"
      >
        <i className={`fa fa-${icon}`}></i>
        {title}
        {hasActiveFilters && <span className="filter-count">({selectedValues.length})</span>}
        <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>
      
      {isOpen && (
        <div className="filter-dropdown-content" onClick={(e) => e.stopPropagation()}>
          <div className="filter-dropdown-header">
            <h4>{title}</h4>
          </div>
          <div className="filter-options">
            {options.map((option) => {
              const optionValue = option.id || option.name || option;
              const isChecked = selectedValues?.includes(optionValue) || false;
              
              console.log('Rendering option:', optionValue, 'isChecked:', isChecked, 'selectedValues:', selectedValues);
              
              return (
                <FilterOption
                  key={optionValue}
                  option={optionValue}
                  isChecked={isChecked}
                  onChange={handleOptionChange}
                  filterType={id}
                  categories={categories}
                  companies={companies}
                />
              );
            })}
          </div>
          <div className="filter-dropdown-actions">
            <button onClick={handleApply} className="apply-btn-mini" type="button">Apply</button>
            <button onClick={handleClear} className="clear-btn-mini" type="button">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Display name for debugging
FilterDropdown.displayName = 'FilterDropdown';
FilterOption.displayName = 'FilterOption';

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { 
    filters, 
    pagination, 
    sorting,
    infiniteScroll 
  } = useSelector((state) => state.jobs);

  // ========================================
  // REACT QUERY HOOKS
  // ========================================
  const jobsQuery = useJobsQuery(filters, pagination, sorting);
  const filterOptionsQuery = useFilterOptionsQuery();
  const categoriesQuery = useCategoriesQuery();
  const companiesQuery = useCompaniesQuery();

  // Extract data from queries
  const { 
    data: jobsData, 
    isLoading: jobsLoading, 
    error: jobsError,
    isFetching: jobsFetching,
    refetch: refetchJobs,
    isPreviousData
  } = jobsQuery;

  const jobs = jobsData?.jobs || [];
  const jobsPagination = jobsData?.pagination || pagination;
  
  const filterOptions = useMemo(() => {
    const data = filterOptionsQuery.data;
    if (!data) return { isLoaded: false, experiences: [], locations: [], types: [], salaryRanges: [] };
    return {
      ...data,
      isLoaded: true
    };
  }, [filterOptionsQuery.data]);
  
  const categories = categoriesQuery.data?.categories || [];
  const companies = companiesQuery.data?.companies || [];

  // Local state
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isJobPage = location.pathname === '/jobs';

  const [localFilters, setLocalFilters] = useState({
    searchInput: '',
    locationSearchInput: ''
  });

  const [pendingFilters, setPendingFilters] = useState({
    selectedCategory: [],
    selectedCompany: [],
    selectedExperience: [],
    selectedLocation: [],
    selectedType: [],
    selectedSalary: []
  });

  const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);
  const [infiniteScrollInitialized, setInfiniteScrollInitialized] = useState(false);

  // Refs
  const urlSyncRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  // ========================================
  // MEMOIZED VALUES
  // ========================================
  const experienceOptions = useMemo(() => {
    return filterOptions.isLoaded ? filterOptions.experiences : [];
  }, [filterOptions.experiences, filterOptions.isLoaded]);

  const locationOptions = useMemo(() => {
    return filterOptions.isLoaded ? filterOptions.locations : [];
  }, [filterOptions.locations, filterOptions.isLoaded]);

  const typeOptions = useMemo(() => {
    return filterOptions.isLoaded ? filterOptions.types : [];
  }, [filterOptions.types, filterOptions.isLoaded]);

  const salaryRangeOptions = useMemo(() => {
    return filterOptions.isLoaded 
      ? filterOptions.salaryRanges.map(range => range.value)
      : [];
  }, [filterOptions.salaryRanges, filterOptions.isLoaded]);

  const displayJobs = useMemo(() => {
    return isMobile ? infiniteScroll.allJobs : jobs;
  }, [isMobile, infiniteScroll.allJobs, jobs]);

  const categoryOptionsForDropdown = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }, [categories]);

  const companyOptionsForDropdown = useMemo(() => {
    return companies.map(company => ({
      id: company.id,
      name: company.name
    }));
  }, [companies]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  const getRelatedFiltersFromSearch = useCallback((searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return { categories: [], companies: [] };
    
    const term = searchTerm.toLowerCase().trim();
    const relatedCategories = [];
    const relatedCompanies = [];
    
    categories.forEach(category => {
      const categoryName = category.name.toLowerCase();
      const categoryWords = categoryName.split(' ').filter(word => word.length > 2);
      const searchWords = term.split(' ').filter(word => word.length > 2);
      
      let isMatch = false;
      
      if (categoryName === term) {
        isMatch = true;
      } else if (categoryName.includes(term)) {
        isMatch = true;
      } else if (term.includes(categoryName)) {
        isMatch = true;
      } else if (categoryWords.some(catWord => 
        searchWords.some(searchWord => 
          catWord.includes(searchWord) || searchWord.includes(catWord)
        )
      )) {
        isMatch = true;
      }
      
      if (isMatch) {
        relatedCategories.push(category.id);
      }
    });
    
    companies.forEach(company => {
      const companyName = company.name.toLowerCase();
      const companyWords = companyName.split(' ').filter(word => word.length > 2);
      const searchWords = term.split(' ').filter(word => word.length > 2);
      
      let isMatch = false;
      
      if (companyName === term) {
        isMatch = true;
      } else if (companyName.includes(term)) {
        isMatch = true;
      } else if (term.includes(companyName)) {
        isMatch = true;
      } else if (companyWords.some(compWord => 
        searchWords.some(searchWord => 
          compWord.includes(searchWord) || searchWord.includes(compWord)
        )
      )) {
        isMatch = true;
      }
      
      if (isMatch) {
        relatedCompanies.push(company.id);
      }
    });
    
    return { categories: relatedCategories, companies: relatedCompanies };
  }, [categories, companies]);

  const isSearchRelatedToFilters = useCallback((searchTerm, filterValues, filterType) => {
    if (!searchTerm || !filterValues || filterValues.length === 0) return false;
    
    const term = searchTerm.toLowerCase().trim();
    
    if (filterType === 'selectedCategory') {
      return categories.some(cat => {
        if (filterValues.includes(cat.id)) {
          const catName = cat.name.toLowerCase();
          return catName.includes(term) || 
                 term.includes(catName) ||
                 catName.split(' ').some(word => term.includes(word) && word.length > 2);
        }
        return false;
      });
    } else if (filterType === 'selectedCompany') {
      return companies.some(comp => {
        if (filterValues.includes(comp.id)) {
          const compName = comp.name.toLowerCase();
          return compName.includes(term) || 
                 term.includes(compName) ||
                 compName.split(' ').some(word => term.includes(word) && word.length > 2);
        }
        return false;
      });
    }
    
    return false;
  }, [categories, companies]);

  // ========================================
  // URL MANAGEMENT
  // ========================================
 const updateURL = useCallback(() => {
  if (urlSyncRef.current) return;
  
  const params = new URLSearchParams();
  
  if (filters.searchQuery && filters.searchQuery.trim()) {
    params.set('search', filters.searchQuery.trim());
  }
  if (filters.selectedCategory && filters.selectedCategory.length > 0) {
    params.set('categories', filters.selectedCategory.join(','));
  }
  if (filters.selectedCompany && filters.selectedCompany.length > 0) {
    params.set('companies', filters.selectedCompany.join(','));
  }
  if (filters.selectedExperience && filters.selectedExperience.length > 0) {
    params.set('experience', filters.selectedExperience.join(','));
  }
  if (filters.selectedLocation && filters.selectedLocation.length > 0) {
    params.set('location', filters.selectedLocation.join(','));
  }
  if (filters.selectedType && filters.selectedType.length > 0) {
    params.set('type', filters.selectedType.join(','));
  }
  if (filters.selectedSalary && filters.selectedSalary.length > 0) {
    params.set('salary', filters.selectedSalary.join(','));
  }
  if (pagination.currentPage > 1) {
    params.set('page', pagination.currentPage.toString());
  }
  if (pagination.jobsPerPage !== 20) {
    params.set('limit', pagination.jobsPerPage.toString());
  }

  const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
  navigate(newURL, { replace: true });
}, [filters, pagination, location.pathname, navigate]);

  const parseURLAndSetFilters = useCallback(() => {
    urlSyncRef.current = true;
    
    const search = searchParams.get('search') || '';
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const companies = searchParams.get('companies')?.split(',').filter(Boolean) || [];
    const experience = searchParams.get('experience')?.split(',').filter(Boolean) || [];
    const locationParam = searchParams.get('location')?.split(',').filter(Boolean) || [];
    const type = searchParams.get('type')?.split(',').filter(Boolean) || [];
    const salary = searchParams.get('salary')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    if (search !== filters.searchQuery) {
      dispatch(setSearchQuery(search));
    }
    if (JSON.stringify(categories) !== JSON.stringify(filters.selectedCategory)) {
      dispatch(setSelectedCategory(categories));
    }
    if (JSON.stringify(companies) !== JSON.stringify(filters.selectedCompany)) {
      dispatch(setSelectedCompany(companies));
    }
    if (JSON.stringify(experience) !== JSON.stringify(filters.selectedExperience)) {
      dispatch(setSelectedExperience(experience));
    }
    if (JSON.stringify(locationParam) !== JSON.stringify(filters.selectedLocation)) {
      dispatch(setSelectedLocation(locationParam));
    }
    if (JSON.stringify(type) !== JSON.stringify(filters.selectedType)) {
      dispatch(setSelectedType(type));
    }
    if (JSON.stringify(salary) !== JSON.stringify(filters.selectedSalary)) {
      dispatch(setSelectedSalary(salary));
    }
    if (page !== pagination.currentPage) {
      dispatch(setCurrentPage(page));
    }
    if (limit !== pagination.jobsPerPage) {
      dispatch(setJobsPerPage(limit));
    }

    setLocalFilters({
      searchInput: search,
      locationSearchInput: locationParam.length > 0 ? locationParam[0] : ''
    });

    setPendingFilters({
      selectedCategory: categories,
      selectedCompany: companies,
      selectedExperience: experience,
      selectedLocation: locationParam,
      selectedType: type,
      selectedSalary: salary
    });

    setTimeout(() => {
      urlSyncRef.current = false;
    }, 100);
  }, [searchParams, dispatch, filters, pagination]);

  // ========================================
  // EFFECTS
  // ========================================

  // Parse URL on mount
  useEffect(() => {
    if (isJobPage) {
      parseURLAndSetFilters();
    }
  }, [parseURLAndSetFilters, isJobPage]);

  // Update URL when filters change
  useEffect(() => {
    if (!urlSyncRef.current) {
      updateURL();
    }
  }, [filters, pagination.currentPage, pagination.jobsPerPage, updateURL]);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      if (wasMobile !== mobile) {
        dispatch(resetInfiniteScroll());
        setInfiniteScrollInitialized(false);
        if (!mobile && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isMobile, isSidebarOpen]);

  // Sync pending filters with Redux
  // useEffect(() => {
  //   const shouldUpdate = (pendingArray, reduxArray) => {
  //     if (!pendingArray || !reduxArray) return true;
  //     if (pendingArray.length !== reduxArray.length) return true;
  //     return !pendingArray.every(item => reduxArray.includes(item));
  //   };

  //   const needsUpdate = {
  //     categories: shouldUpdate(pendingFilters.selectedCategory, filters.selectedCategory),
  //     companies: shouldUpdate(pendingFilters.selectedCompany, filters.selectedCompany),
  //     experience: shouldUpdate(pendingFilters.selectedExperience, filters.selectedExperience),
  //     location: shouldUpdate(pendingFilters.selectedLocation, filters.selectedLocation),
  //     type: shouldUpdate(pendingFilters.selectedType, filters.selectedType),
  //     salary: shouldUpdate(pendingFilters.selectedSalary, filters.selectedSalary)
  //   };

  //   if (Object.values(needsUpdate).some(Boolean)) {
  //     setPendingFilters({
  //       selectedCategory: filters.selectedCategory || [],
  //       selectedCompany: filters.selectedCompany || [],
  //       selectedExperience: filters.selectedExperience || [],
  //       selectedLocation: filters.selectedLocation || [],
  //       selectedType: filters.selectedType || [],
  //       selectedSalary: filters.selectedSalary || []
  //     });
  //   }
  // }, [filters, pendingFilters]);
  // Initialize pendingFilters only once on mount
useEffect(() => {
  console.log('Initializing pendingFilters on mount');
  setPendingFilters({
    selectedCategory: filters.selectedCategory || [],
    selectedCompany: filters.selectedCompany || [],
    selectedExperience: filters.selectedExperience || [],
    selectedLocation: filters.selectedLocation || [],
    selectedType: filters.selectedType || [],
    selectedSalary: filters.selectedSalary || []
  });
}, []); // ✅ Empty dependency array - runs only once on mount
  // Check for unapplied filters
  useEffect(() => {
    const currentFiltersStr = JSON.stringify({
      selectedCategory: filters.selectedCategory || [],
      selectedCompany: filters.selectedCompany || [],
      selectedExperience: filters.selectedExperience || [],
      selectedLocation: filters.selectedLocation || [],
      selectedType: filters.selectedType || [],
      selectedSalary: filters.selectedSalary || []
    });
    
    const pendingFiltersStr = JSON.stringify(pendingFilters);
    
    setHasUnappliedFilters(currentFiltersStr !== pendingFiltersStr);
  }, [filters, pendingFilters]);

  // Debounced search with auto-filter mapping
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localFilters.searchInput !== filters.searchQuery) {
        const oldQuery = filters.searchQuery;
        const newQuery = localFilters.searchInput;
        
        dispatch(setSearchQuery(newQuery));
        
        if (newQuery !== oldQuery) {
          dispatch(setCurrentPage(1));
        }
        
        if (newQuery && newQuery.trim()) {
          const relatedFilters = getRelatedFiltersFromSearch(newQuery.trim());
          
          if (relatedFilters.categories.length > 0) {
            setPendingFilters(prev => {
              const currentCategories = prev.selectedCategory || [];
              const newCategories = [...new Set([...currentCategories, ...relatedFilters.categories])];
              return { ...prev, selectedCategory: newCategories };
            });
            
            const currentCategories = filters.selectedCategory || [];
            const newCategories = [...new Set([...currentCategories, ...relatedFilters.categories])];
            if (newCategories.length > currentCategories.length) {
              dispatch(setSelectedCategory(newCategories));
            }
          }
          
          if (relatedFilters.companies.length > 0) {
            setPendingFilters(prev => {
              const currentCompanies = prev.selectedCompany || [];
              const newCompanies = [...new Set([...currentCompanies, ...relatedFilters.companies])];
              return { ...prev, selectedCompany: newCompanies };
            });
            
            const currentCompanies = filters.selectedCompany || [];
            const newCompanies = [...new Set([...currentCompanies, ...relatedFilters.companies])];
            if (newCompanies.length > currentCompanies.length) {
              dispatch(setSelectedCompany(newCompanies));
            }
          }
          
          if (relatedFilters.categories.length > 0 || relatedFilters.companies.length > 0) {
            const totalAdded = relatedFilters.categories.length + relatedFilters.companies.length;
            showToast(`Auto-added ${totalAdded} matching filter${totalAdded !== 1 ? 's' : ''} for "${newQuery.trim()}"`);
          }
          
          if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
          }
        }
      }
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [localFilters.searchInput, filters.searchQuery, dispatch, getRelatedFiltersFromSearch, filters.selectedCategory, filters.selectedCompany, categories, companies, showToast, isMobile, isSidebarOpen]);

  // Initialize mobile infinite scroll when jobs load
  useEffect(() => {
    if (
      isMobile && 
      jobs.length > 0 && 
      filterOptions.isLoaded &&
      !infiniteScrollInitialized &&
      infiniteScroll.allJobs.length === 0
    ) {
      console.log('Initializing infinite scroll with jobs:', jobs.length);
      dispatch(appendJobs({ 
        jobs: jobs, 
        pagination: jobsPagination, 
        resetList: true 
      }));
      setInfiniteScrollInitialized(true);
      isLoadingMoreRef.current = false;
    }
  }, [jobs, isMobile, jobsPagination, dispatch, filterOptions.isLoaded, infiniteScrollInitialized, infiniteScroll.allJobs.length]);

  // Scroll to top on page change (desktop)
  useEffect(() => {
    if (!isMobile && pagination.currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.currentPage, isMobile]);

  // ========================================
  // HANDLERS
  // ========================================

  const handlePageChange = useCallback((newPage) => {
    if (!isMobile && newPage !== pagination.currentPage) {
      dispatch(setCurrentPage(newPage));
      // React Query will automatically refetch with new page
    }
  }, [dispatch, isMobile, pagination.currentPage]);

  const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
    if (!isMobile && newJobsPerPage !== pagination.jobsPerPage) {
      dispatch(setJobsPerPage(newJobsPerPage));
      // React Query will automatically refetch
    }
  }, [dispatch, isMobile, pagination.jobsPerPage]);

  const handleLoadMore = useCallback(async () => {
    if (!infiniteScroll.hasMore || infiniteScroll.isLoading || isLoadingMoreRef.current || jobsFetching) {
      return;
    }

    try {
      isLoadingMoreRef.current = true;
      dispatch(setInfiniteScrollLoading(true));
      
      const nextPage = pagination.currentPage + 1;
      dispatch(setCurrentPage(nextPage));
      
      // Wait for React Query to fetch with updated page
      // The component will re-render with new data
      
    } catch (error) {
      console.error('Error loading more jobs:', error);
      showToast('Error loading more jobs');
    } finally {
      dispatch(setInfiniteScrollLoading(false));
      isLoadingMoreRef.current = false;
    }
  }, [infiniteScroll.hasMore, infiniteScroll.isLoading, dispatch, pagination.currentPage, jobsFetching, showToast]);

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    const filterActions = [
      () => dispatch(setSelectedCategory(pendingFilters.selectedCategory || [])),
      () => dispatch(setSelectedCompany(pendingFilters.selectedCompany || [])),
      () => dispatch(setSelectedExperience(pendingFilters.selectedExperience || [])),
      () => dispatch(setSelectedLocation(pendingFilters.selectedLocation || [])),
      () => dispatch(setSelectedType(pendingFilters.selectedType || [])),
      () => dispatch(setSelectedSalary(pendingFilters.selectedSalary || []))
    ];

    filterActions.forEach(action => action());
    dispatch(setCurrentPage(1));
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    const totalFiltersApplied = Object.values(pendingFilters).reduce((acc, arr) => acc + (arr?.length || 0), 0);
    showToast(`${totalFiltersApplied} filter${totalFiltersApplied !== 1 ? 's' : ''} applied successfully!`);
    setIsSidebarOpen(false);
    
    // React Query will automatically refetch
  }, [dispatch, pendingFilters, showToast]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setPendingFilters({
      selectedCategory: [],
      selectedCompany: [],
      selectedExperience: [],
      selectedLocation: [],
      selectedType: [],
      selectedSalary: []
    });
    
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
    
    setLocalFilters({
      searchInput: '',
      locationSearchInput: ''
    });
    
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    showToast('All filters and search cleared!');
    setIsSidebarOpen(false);
    navigate(location.pathname, { replace: true });
  }, [dispatch, showToast, navigate, location.pathname]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSearchInputChange = useCallback((value) => {
    setLocalFilters(prev => ({
      ...prev,
      searchInput: value
    }));
  }, []);

  const handleLocationInputChange = useCallback((value) => {
    setLocalFilters(prev => ({
      ...prev,
      locationSearchInput: value
    }));
    
    if (value.trim()) {
      dispatch(setSelectedLocation([value.trim()]));
    } else {
      dispatch(setSelectedLocation([]));
    }
  }, [dispatch]);

  // const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
  //   setPendingFilters(prev => {
  //     const current = prev[filterType] || [];
  //     let updated;
      
  //     if (isChecked) {
  //       updated = current.includes(value) ? current : [...current, value];
  //     } else {
  //       updated = current.filter(item => item !== value);
  //     }
      
  //     return {
  //       ...prev,
  //       [filterType]: updated
  //     };
  //   });
    
  //   const currentReduxFilters = filters[filterType] || [];
  //   let newReduxFilters;
    
  //   if (isChecked) {
  //     newReduxFilters = currentReduxFilters.includes(value) ? currentReduxFilters : [...currentReduxFilters, value];
  //   } else {
  //     newReduxFilters = currentReduxFilters.filter(item => item !== value);
  //   }
    
  //   switch (filterType) {
  //     case 'selectedCategory':
  //       dispatch(setSelectedCategory(newReduxFilters));
  //       break;
  //     case 'selectedCompany':
  //       dispatch(setSelectedCompany(newReduxFilters));
  //       break;
  //     case 'selectedExperience':
  //       dispatch(setSelectedExperience(newReduxFilters));
  //       break;
  //     case 'selectedLocation':
  //       dispatch(setSelectedLocation(newReduxFilters));
  //       break;
  //     case 'selectedType':
  //       dispatch(setSelectedType(newReduxFilters));
  //       break;
  //     case 'selectedSalary':
  //       dispatch(setSelectedSalary(newReduxFilters));
  //       break;
  //     default:
  //       console.warn('Unknown filter type:', filterType);
  //   }
    
  //   dispatch(setCurrentPage(1));
  // }, [dispatch, filters]);
// 3. FIX: Update handlePendingFilterChange to ensure state updates correctly

// CORRECT VERSION - Only update pendingFilters, NOT Redux
const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
  console.log('Filter change:', filterType, value, isChecked);
  
  // ONLY UPDATE PENDING FILTERS - Don't dispatch to Redux yet
  setPendingFilters(prev => {
    const current = Array.isArray(prev[filterType]) ? prev[filterType] : [];
    let updated;
    
    if (isChecked) {
      updated = current.includes(value) ? current : [...current, value];
    } else {
      updated = current.filter(item => item !== value);
    }
    
    console.log('Updated pending filters:', filterType, updated);
    
    return {
      ...prev,
      [filterType]: updated
    };
  });
}, []); // ✅ Empty dependencies - only uses setPendingFilters
 const handleDropdownApply = useCallback((filterType) => {
  const newValues = pendingFilters[filterType];
  
  console.log('=== APPLY CLICKED ===');
  console.log(`Filter Type: ${filterType}`);
  console.log('New Values:', newValues);
  console.log('Current Redux Filters BEFORE dispatch:', {
    selectedCategory: filters.selectedCategory,
    selectedCompany: filters.selectedCompany,
    selectedExperience: filters.selectedExperience,
    selectedLocation: filters.selectedLocation,
    selectedType: filters.selectedType,
    selectedSalary: filters.selectedSalary
  });
  
  switch (filterType) {
    case 'selectedCategory':
      dispatch(setSelectedCategory(newValues));
      console.log('Dispatched setSelectedCategory with:', newValues);
      break;
    case 'selectedCompany':
      dispatch(setSelectedCompany(newValues));
      console.log('Dispatched setSelectedCompany with:', newValues);
      break;
    case 'selectedExperience':
      dispatch(setSelectedExperience(newValues));
      console.log('Dispatched setSelectedExperience with:', newValues);
      break;
    case 'selectedLocation':
      dispatch(setSelectedLocation(newValues));
      console.log('Dispatched setSelectedLocation with:', newValues);
      break;
    case 'selectedType':
      dispatch(setSelectedType(newValues));
      console.log('Dispatched setSelectedType with:', newValues);
      break;
    case 'selectedSalary':
      dispatch(setSelectedSalary(newValues));
      console.log('Dispatched setSelectedSalary with:', newValues);
      break;
    default:
      console.warn('Unknown filter type:', filterType);
  }
  
  dispatch(setCurrentPage(1));
  
  // Reset infinite scroll for mobile
  if (isMobile) {
    dispatch(resetInfiniteScroll());
    setInfiniteScrollInitialized(false);
  }
  
  // Log after a small delay to see if Redux state updated
  setTimeout(() => {
    console.log('Redux Filters AFTER dispatch (should be updated):', {
      selectedCategory: filters.selectedCategory,
      selectedCompany: filters.selectedCompany,
      selectedExperience: filters.selectedExperience,
      selectedLocation: filters.selectedLocation,
      selectedType: filters.selectedType,
      selectedSalary: filters.selectedSalary
    });
  }, 100);
  
  const filterName = filterType.replace('selected', '');
  const count = newValues.length;
  showToast(`${count} ${filterName.toLowerCase()} filter${count !== 1 ? 's' : ''} applied!`);
}, [dispatch, pendingFilters, showToast, isMobile, filters]);

  const handleDropdownClear = useCallback((filterType) => {
    const clearedValues = pendingFilters[filterType] || [];
    
    setPendingFilters(prev => ({
      ...prev,
      [filterType]: []
    }));
    
    switch (filterType) {
      case 'selectedCategory':
        dispatch(setSelectedCategory([]));
        if (clearedValues.length > 0 && localFilters.searchInput) {
          const shouldClearSearch = isSearchRelatedToFilters(
            localFilters.searchInput, 
            clearedValues, 
            filterType
          );
          
          if (shouldClearSearch) {
            setLocalFilters(prev => ({ ...prev, searchInput: '' }));
            dispatch(setSearchQuery(''));
          }
        }
        break;
        
      case 'selectedCompany':
        dispatch(setSelectedCompany([]));
        if (clearedValues.length > 0 && localFilters.searchInput) {
          const shouldClearSearch = isSearchRelatedToFilters(
            localFilters.searchInput, 
            clearedValues, 
            filterType
          );
          
          if (shouldClearSearch) {
            setLocalFilters(prev => ({ ...prev, searchInput: '' }));
            dispatch(setSearchQuery(''));
          }
        }
        break;
        
      case 'selectedExperience':
        dispatch(setSelectedExperience([]));
        break;
      case 'selectedLocation':
        dispatch(setSelectedLocation([]));
        setLocalFilters(prev => ({ ...prev, locationSearchInput: '' }));
        break;
      case 'selectedType':
        dispatch(setSelectedType([]));
        break;
      case 'selectedSalary':
        dispatch(setSelectedSalary([]));
        break;
      default:
        console.warn('Unknown filter type:', filterType);
    }
    
    const filterName = filterType.replace('selected', '');
    showToast(`${filterName} filter cleared!`);
  }, [dispatch, pendingFilters, localFilters.searchInput, isSearchRelatedToFilters, showToast]);

  // Modal handlers
  const handleViewDetails = useCallback((job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedJob(null);
  }, []);

  const handleSaveFromModal = useCallback(async () => {
    if (!selectedJob) return;
    
    try {
      const result = await dispatch(saveJob({ 
        jobId: selectedJob.id,
        notes: '',
        priority: 0
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        showToast("Job saved successfully!");
      } else if (result.meta.requestStatus === 'rejected') {
        const errorMessage = result.payload || "Failed to save job";
        if (errorMessage.includes('already saved')) {
          showToast("Job is already saved");
        } else {
          showToast(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showToast("Failed to save job");
    }
  }, [selectedJob, dispatch, showToast]);

  const handleApplyFromModal = useCallback(() => {
    if (!selectedJob) return;
    
    const applyUrl = selectedJob.applyUrl || selectedJob.apply_url || selectedJob.applicationUrl || selectedJob.application_url || selectedJob.url || selectedJob.link;
    if (applyUrl) {
      window.open(applyUrl, '_blank', 'noopener,noreferrer');
    }
  }, [selectedJob]);

  const handleSaveJob = useCallback(async (jobId) => {
    try {
      const result = await dispatch(saveJob({ 
        jobId: jobId,
        notes: '',
        priority: 0
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        showToast("Job saved successfully!");
      } else if (result.meta.requestStatus === 'rejected') {
        const errorMessage = result.payload || "Failed to save job";
        if (errorMessage.includes('already saved')) {
          showToast("Job is already saved");
        } else {
          showToast(errorMessage);
        }
      }

      if (isMobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showToast("Failed to save job");
    }
  }, [dispatch, showToast, isMobile, isSidebarOpen]);

  // ========================================
  // LOADING & ERROR STATES
  // ========================================

  // Show loading only on initial load (not when refetching with cached data)
  if (jobsLoading && !jobsData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  // Show loading for filter options
  if (filterOptionsQuery.isLoading || categoriesQuery.isLoading || companiesQuery.isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading filters...</p>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="error">
        <p>Error loading jobs: {jobsError.message}</p>
        <button onClick={() => refetchJobs()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="job-list-container">
      {/* Show background loading indicator when fetching new data */}
      {jobsFetching && !isPreviousData && (
        <div className="background-loading-indicator">
          <div className="spinner-small"></div>
          <span>Updating jobs...</span>
        </div>
      )}

      {/* Mobile Filter toggle button */}
      {isMobile && (
        <button className="filter-toggle" onClick={toggleSidebar}>
          <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-sliders'}`}></i>
          <p>{isSidebarOpen ? 'Close' : 'Filters'}</p>
          {hasUnappliedFilters && !isSidebarOpen && <span className="filter-badge">!</span>}
        </button>
      )}

      {/* Desktop horizontal filters */}
      {!isMobile && (
        <div className="horizontal-filters">
          <div className="filter-dropdown-group">
            <FilterDropdown
              id="selectedType"
              icon="calendar"
              title="Schedule"
              options={typeOptions}
              selectedValues={pendingFilters.selectedType}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedType')}
              onClear={() => handleDropdownClear('selectedType')}
            />

            <FilterDropdown
              id="selectedCategory"
              icon="industry"
              title="Industries"
              options={categoryOptionsForDropdown}
              selectedValues={pendingFilters.selectedCategory}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedCategory')}
              onClear={() => handleDropdownClear('selectedCategory')}
              categories={categories}
              companies={companies}
            />

            <FilterDropdown
              id="selectedExperience"
              icon="user"
              title="Experience"
              options={experienceOptions}
              selectedValues={pendingFilters.selectedExperience}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedExperience')}
              onClear={() => handleDropdownClear('selectedExperience')}
            />

            <FilterDropdown
              id="selectedLocation"
              icon="map-marker"
              title="Distance"
              options={locationOptions}
              selectedValues={pendingFilters.selectedLocation}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedLocation')}
              onClear={() => handleDropdownClear('selectedLocation')}
            />

            <FilterDropdown
              id="selectedCompany"
              icon="building"
              title="Company"
              options={companyOptionsForDropdown}
              selectedValues={pendingFilters.selectedCompany}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedCompany')}
              onClear={() => handleDropdownClear('selectedCompany')}
              categories={categories}
              companies={companies}
            />

            <FilterDropdown
              id="selectedSalary"
              icon="dollar"
              title="Salary"
              options={salaryRangeOptions}
              selectedValues={pendingFilters.selectedSalary}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedSalary')}
              onClear={() => handleDropdownClear('selectedSalary')}
            />
          </div>
        </div>
      )}

      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        {/* Mobile Sidebar */}
        {isMobile && (
          <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3><i className="fa fa-sliders"></i> Filters</h3>
              <div className="active-filter-count">
                {Object.values(pendingFilters).reduce((acc, arr) => acc + arr.length, 0)} active
              </div>
            </div>
            
            <div className="filters-section">
              {/* Filter Action Buttons */}
              <div className="filter-actions">
                <button 
                  onClick={handleApplyFilters} 
                  className={`apply-filters-btn ${hasUnappliedFilters ? 'highlighted' : ''}`}
                  disabled={!hasUnappliedFilters}
                >
                  <i className="fa fa-check"></i>
                  Apply Filters
                  {hasUnappliedFilters && <span className="pulse-dot"></span>}
                </button>
                
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  <i className="fa fa-refresh"></i>
                  Clear All
                </button>
              </div>

              {/* Mobile sidebar filters */}
              <div className="FilterGroup">
                <h4>
                  Category
                  {pendingFilters.selectedCategory?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedCategory.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {categories.map((category) => (
                    <label key={category.id} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedCategory?.includes(category.id)}
                        onChange={(e) => handlePendingFilterChange('selectedCategory', category.id, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="FilterGroup">
                <h4>
                  Company
                  {pendingFilters.selectedCompany?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedCompany.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {companies.map((company) => (
                    <label key={company.id} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedCompany?.includes(company.id)}
                        onChange={(e) => handlePendingFilterChange('selectedCompany', company.id, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      {company.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="FilterGroup">
                <h4>
                  Experience
                  {pendingFilters.selectedExperience?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedExperience.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {experienceOptions.map((level) => (
                    <label key={level} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedExperience?.includes(level)}
                        onChange={(e) => handlePendingFilterChange('selectedExperience', level, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className="FilterGroup">
                <h4>
                  Location
                  {pendingFilters.selectedLocation?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedLocation.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {locationOptions.map((location) => (
                    <label key={location} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedLocation?.includes(location)}
                        onChange={(e) => handlePendingFilterChange('selectedLocation', location, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      {location}
                    </label>
                  ))}
                </div>
              </div>

              <div className="FilterGroup">
                <h4>
                  Type
                  {pendingFilters.selectedType?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedType.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {typeOptions.map((type) => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedType?.includes(type)}
                        onChange={(e) => handlePendingFilterChange('selectedType', type, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="FilterGroup">
                <h4>
                  Salary
                  {pendingFilters.selectedSalary?.length > 0 && (
                    <span className="filter-count-badge">({pendingFilters.selectedSalary.length})</span>
                  )}
                </h4>
                <div className="filter-options-container">
                  {salaryRangeOptions.map((salary) => (
                    <label key={salary} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={pendingFilters.selectedSalary?.includes(salary)}
                        onChange={(e) => handlePendingFilterChange('selectedSalary', salary, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      ${salary.replace('-', ' - ')}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="jobs-content">
          {/* Enhanced job count info with active filters display */}
          {isMobile && (
            <div className="mobile-job-info">
              <div className="job-count-display">
                <span>Showing {displayJobs.length} jobs</span>
                {pagination.totalJobs > 0 && (
                  <span> of {pagination.totalJobs} total</span>
                )}
              </div>
              
              {/* Active filters summary on mobile */}
              {(filters.searchQuery || 
                (filters.selectedCategory && filters.selectedCategory.length > 0) ||
                (filters.selectedCompany && filters.selectedCompany.length > 0) ||
                (filters.selectedExperience && filters.selectedExperience.length > 0) ||
                (filters.selectedLocation && filters.selectedLocation.length > 0) ||
                (filters.selectedType && filters.selectedType.length > 0) ||
                (filters.selectedSalary && filters.selectedSalary.length > 0)) && (
                <div className="active-filters-mobile">
                  <div className="active-filters-header">
                    <span>Active Filters:</span>
                    <button onClick={handleClearFilters} className="clear-all-mobile">
                      Clear All
                    </button>
                  </div>
                  <div className="filter-chips">
                    {filters.searchQuery && (
                      <span className="filter-chip search-chip">
                        <i className="fa fa-search"></i>
                        {filters.searchQuery}
                        <button onClick={() => {
                          setLocalFilters(prev => ({ ...prev, searchInput: '' }));
                          dispatch(setSearchQuery(''));
                        }}>×</button>
                      </span>
                    )}
                    
                    {filters.selectedCategory?.map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return category ? (
                        <span key={catId} className="filter-chip category-chip">
                          <i className="fa fa-industry"></i>
                          {category.name}
                          <button onClick={() => {
                            const updated = filters.selectedCategory.filter(id => id !== catId);
                            dispatch(setSelectedCategory(updated));
                          }}>×</button>
                        </span>
                      ) : null;
                    })}
                    
                    {filters.selectedCompany?.map(compId => {
                      const company = companies.find(c => c.id === compId);
                      return company ? (
                        <span key={compId} className="filter-chip company-chip">
                          <i className="fa fa-building"></i>
                          {company.name}
                          <button onClick={() => {
                            const updated = filters.selectedCompany.filter(id => id !== compId);
                            dispatch(setSelectedCompany(updated));
                          }}>×</button>
                        </span>
                      ) : null;
                    })}
                    
                    {filters.selectedExperience?.map(exp => (
                      <span key={exp} className="filter-chip experience-chip">
                        <i className="fa fa-user"></i>
                        {exp}
                        <button onClick={() => {
                          const updated = filters.selectedExperience.filter(e => e !== exp);
                          dispatch(setSelectedExperience(updated));
                        }}>×</button>
                      </span>
                    ))}
                    
                    {filters.selectedLocation?.map(loc => (
                      <span key={loc} className="filter-chip location-chip">
                        <i className="fa fa-map-marker"></i>
                        {loc}
                        <button onClick={() => {
                          const updated = filters.selectedLocation.filter(l => l !== loc);
                          dispatch(setSelectedLocation(updated));
                        }}>×</button>
                      </span>
                    ))}
                    
                    {filters.selectedType?.map(type => (
                      <span key={type} className="filter-chip type-chip">
                        <i className="fa fa-clock"></i>
                        {type}
                        <button onClick={() => {
                          const updated = filters.selectedType.filter(t => t !== type);
                          dispatch(setSelectedType(updated));
                        }}>×</button>
                      </span>
                    ))}
                    
                    {filters.selectedSalary?.map(salary => (
                      <span key={salary} className="filter-chip salary-chip">
                        <i className="fa fa-dollar"></i>
                        ${salary.replace('-', ' - ')}
                        <button onClick={() => {
                          const updated = filters.selectedSalary.filter(s => s !== salary);
                          dispatch(setSelectedSalary(updated));
                        }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop active filters display */}
          {!isMobile && (filters.searchQuery || 
            (filters.selectedCategory && filters.selectedCategory.length > 0) ||
            (filters.selectedCompany && filters.selectedCompany.length > 0) ||
            (filters.selectedExperience && filters.selectedExperience.length > 0) ||
            (filters.selectedLocation && filters.selectedLocation.length > 0) ||
            (filters.selectedType && filters.selectedType.length > 0) ||
            (filters.selectedSalary && filters.selectedSalary.length > 0)) && (
            <div className="desktop-active-filters">
              <div className="active-filters-header">
                <h4>Active Filters & Search:</h4>
                <button onClick={handleClearFilters} className="clear-all-desktop">
                  <i className="fa fa-refresh"></i>
                  Clear All
                </button>
              </div>
              <div className="filter-chips-desktop">
                {filters.searchQuery && (
                  <span className="filter-chip-desktop search-chip">
                    <i className="fa fa-search"></i>
                    Search: "{filters.searchQuery}"
                    <button onClick={() => {
                      setLocalFilters(prev => ({ ...prev, searchInput: '' }));
                      dispatch(setSearchQuery(''));
                    }}>×</button>
                  </span>
                )}
                
                {filters.selectedCategory?.length > 0 && (
                  <span className="filter-chip-desktop category-chip">
                    <i className="fa fa-industry"></i>
                    Categories ({filters.selectedCategory.length})
                    <button onClick={() => dispatch(setSelectedCategory([]))}>×</button>
                  </span>
                )}
                
                {filters.selectedCompany?.length > 0 && (
                  <span className="filter-chip-desktop company-chip">
                    <i className="fa fa-building"></i>
                    Companies ({filters.selectedCompany.length})
                    <button onClick={() => dispatch(setSelectedCompany([]))}>×</button>
                  </span>
                )}
                
                {filters.selectedExperience?.length > 0 && (
                  <span className="filter-chip-desktop experience-chip">
                    <i className="fa fa-user"></i>
                    Experience ({filters.selectedExperience.length})
                    <button onClick={() => dispatch(setSelectedExperience([]))}>×</button>
                  </span>
                )}
                
                {filters.selectedLocation?.length > 0 && (
                  <span className="filter-chip-desktop location-chip">
                    <i className="fa fa-map-marker"></i>
                    Locations ({filters.selectedLocation.length})
                    <button onClick={() => dispatch(setSelectedLocation([]))}>×</button>
                  </span>
                )}
                
                {filters.selectedType?.length > 0 && (
                  <span className="filter-chip-desktop type-chip">
                    <i className="fa fa-clock"></i>
                    Types ({filters.selectedType.length})
                    <button onClick={() => dispatch(setSelectedType([]))}>×</button>
                  </span>
                )}
                
                {filters.selectedSalary?.length > 0 && (
                  <span className="filter-chip-desktop salary-chip">
                    <i className="fa fa-dollar"></i>
                    Salary ({filters.selectedSalary.length})
                    <button onClick={() => dispatch(setSelectedSalary([]))}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="jobs-grid">
            {displayJobs.length === 0 ? (
              <div className="no-jobs">
                <div className="no-jobs-content">
                  <i className="fa fa-search fa-3x"></i>
                  <h3>No Jobs Found</h3>
                  <p>
                    {jobsPagination.totalJobs === 0 
                      ? 'No jobs are currently available.' 
                      : 'No jobs match your current search and filter criteria.'
                    }
                  </p>
                  {(filters.searchQuery || 
                    Object.values(filters).some(filter => 
                      Array.isArray(filter) ? filter.length > 0 : false
                    )) && (
                    <button onClick={handleClearFilters} className="clear-filters-suggestion">
                      <i className="fa fa-refresh"></i>
                      Clear All Filters & Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              displayJobs.map((job, index) => (
                <JobCard
                  key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`}
                  job={job}
                  index={index}
                  isMobile={isMobile}
                  onViewDetails={handleViewDetails}
                  onSave={handleSaveJob}
                />
              ))
            )}
          </div>

          {/* Mobile Infinite Scroll */}
          {isMobile && (
            <MobileInfiniteScroll
              jobs={displayJobs}
              hasMore={infiniteScroll.hasMore}
              loadMore={handleLoadMore}
              loading={infiniteScroll.isLoading || jobsFetching}
            />
          )}

          {/* Pagination - Desktop only */}
          <Pagination
            pagination={jobsPagination}
            onPageChange={handlePageChange}
            onJobsPerPageChange={handleJobsPerPageChange}
          />
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFromModal}
        onApply={handleApplyFromModal}
      />
      
      {/* Toast Notification */}
      {toast && (
        <div className="toast-popup">
          <div className="toast-content">
            <i className="fa fa-check-circle"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;