// import React,{ memo,useEffect, useState, useCallback, useRef, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useDataLoader } from '../hooks/useDataLoader';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// import {
//   setSelectedCategory,
//   setSelectedCompany,
//   setSearchQuery,
//   setSelectedExperience,
//   setSelectedLocation,
//   setSelectedType,
//   setSelectedSalary,
//   setCurrentPage,
//   setJobsPerPage,
//   clearFilters,
//   appendJobs,
//   resetInfiniteScroll,
//   setInfiniteScrollLoading
// } from '../redux/store';
// import './Joblist.css';
// import { saveJob } from '../redux/savedJobsSlice';

// // Memoized Job Details Modal Component
// const JobDetailsModal = memo(({ job, isOpen, onClose, onSave, onApply }) => {
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = '';
//     };
//   }, [isOpen, onClose]);

//   // Memoize salary formatting to avoid recalculation
//   const formattedSalary = useMemo(() => {
//     if (!job?.salary?.min || !job?.salary?.max) return 'Salary not specified';
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: job.salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(job.salary.min)} - ${formatter.format(job.salary.max)}`;
//   }, [job?.salary]);

//   // Early return optimization
//   if (!isOpen || !job) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <div className="modal-title-section">
//             <h1 className="modal-job-title">{job.title || 'No Title'}</h1>
//             <div className="modal-company-info">
//               <span className="modal-company-name">
//                 {job.companies?.name || job.company?.name || 'Company not specified'}
//               </span>
//               <span className="modal-separator">||</span>
//               <span className="modal-location">{job.location || 'Location not specified'}</span>
//             </div>
//           </div>
//           <button className="modal-close-btn" onClick={onClose}>
//             <i className="fa fa-times"></i>
//           </button>
//         </div>

//         <div className="modal-tabs">
//           <button 
//             className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button 
//             className={`modal-tab ${activeTab === 'requirements' ? 'active' : ''}`}
//             onClick={() => setActiveTab('requirements')}
//           >
//             Requirements
//           </button>
//           <button 
//             className={`modal-tab ${activeTab === 'details' ? 'active' : ''}`}
//             onClick={() => setActiveTab('details')}
//           >
//             Job Details
//           </button>
//         </div>

//         <div className="modal-body">
//           {activeTab === 'overview' && (
//             <div className="modal-tab-content">
//               <div className="modal-quick-info">
//                 <div className="modal-info-item">
//                   <span className="modal-info-label">Category:</span>
//                   <span className="modal-category-badge">
//                     {job.categories?.name || job.category?.name || 'Category not specified'}
//                   </span>
//                 </div>
//                 <div className="modal-info-item">
//                   <span className="modal-info-label">Experience:</span>
//                   <span>{job.experience || 'Not specified'}</span>
//                 </div>
//                 <div className="modal-info-item">
//                   <span className="modal-info-label">Type:</span>
//                   <span>{job.type || 'Not specified'}</span>
//                 </div>
//                 {job.salary && (
//                   <div className="modal-info-item">
//                     <span className="modal-info-label">Salary:</span>
//                     <span className="modal-salary">{formattedSalary}</span>
//                   </div>
//                 )}
//                 <div className="modal-info-item">
//                   <span className="modal-info-label">Posted:</span>
//                   <span>{job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}</span>
//                 </div>
//               </div>
              
//               <div className="modal-description">
//                 <h3>Job Description</h3>
//                 <p>{job.description || 'No description available'}</p>
//               </div>
//             </div>
//           )}

//           {activeTab === 'requirements' && (
//             <div className="modal-tab-content">
//               {job.requirements?.length > 0 ? (
//                 <div className="modal-requirements">
//                   <h3>Requirements</h3>
//                   <ul>
//                     {job.requirements.map((req, index) => (
//                       <li key={index}>{req}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <div className="modal-no-content">
//                   <p>No specific requirements listed for this position.</p>
//                 </div>
//               )}
              
//               {job.responsibilities?.length > 0 && (
//                 <div className="modal-responsibilities">
//                   <h3>Responsibilities</h3>
//                   <ul>
//                     {job.responsibilities.map((resp, index) => (
//                       <li key={index}>{resp}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'details' && (
//             <div className="modal-tab-content">
//               <div className="modal-additional-details">
//                 <h3>Additional Information</h3>
                
//                 {job.benefits?.length > 0 && (
//                   <div className="modal-section">
//                     <h4>Benefits</h4>
//                     <ul>
//                       {job.benefits.map((benefit, index) => (
//                         <li key={index}>{benefit}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="modal-section">
//                   <h4>Job Information</h4>
//                   <div className="modal-info-grid">
//                     <div className="modal-info-item">
//                       <span className="modal-info-label">Department:</span>
//                       <span>{job.department || 'Not specified'}</span>
//                     </div>
//                     <div className="modal-info-item">
//                       <span className="modal-info-label">Employment Type:</span>
//                       <span>{job.employmentType || job.type || 'Not specified'}</span>
//                     </div>
//                     <div className="modal-info-item">
//                       <span className="modal-info-label">Work Schedule:</span>
//                       <span>{job.schedule || 'Not specified'}</span>
//                     </div>
//                     <div className="modal-info-item">
//                       <span className="modal-info-label">Remote Work:</span>
//                       <span>{job.remoteWork ? 'Available' : job.location?.includes('Remote') ? 'Available' : 'Not available'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="modal-footer">
//           <div className="modal-actions">
//             <button onClick={onSave} className="modal-save-btn">
//               Save Job
//             </button>
//             {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
//               <button onClick={onApply} className="modal-apply-btn">
//                 Apply Now
//               </button>
//             ) : (
//               <button className="modal-apply-btn disabled" disabled>
//                 Apply Link Unavailable
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Memoized Pagination Component - Only shown on desktop
// const Pagination = React.memo(({ pagination, onPageChange, onJobsPerPageChange }) => {
//   const { 
//     currentPage, 
//     totalPages, 
//     totalJobs, 
//     jobsPerPage, 
//     startIndex, 
//     endIndex,
//     hasNextPage,
//     hasPreviousPage
//   } = pagination;

//   // Don't render pagination on mobile
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Memoize page numbers calculation
//   const pageNumbers = useMemo(() => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         pages.push(1, 2, 3, 4, '...', totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
//       }
//     }
    
//     return pages;
//   }, [currentPage, totalPages]);

//   if (isMobile) return null;

//   return (
//     <div className="pagination-container">
//       <div className="pagination-info">
//         Showing {startIndex}-{endIndex} of {totalJobs} jobs
//       </div>
      
//       <div className="pagination-controls">
//         <button
//           className={`pagination-btn ${!hasPreviousPage ? 'disabled' : ''}`}
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={!hasPreviousPage}
//         >
//           <i className="fa fa-chevron-left"></i> Previous
//         </button>

//         <div className="pagination-numbers">
//           {pageNumbers.map((page, index) => (
//             <button
//               key={index}
//               className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
//               onClick={() => typeof page === 'number' && onPageChange(page)}
//               disabled={page === '...'}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         <button
//           className={`pagination-btn ${!hasNextPage ? 'disabled' : ''}`}
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={!hasNextPage}
//         >
//           Next <i className="fa fa-chevron-right"></i>
//         </button>
//       </div>

//       <div className="jobs-per-page">
//         <label>
//           Jobs per page:
//           <select
//             value={jobsPerPage}
//             onChange={(e) => onJobsPerPageChange(parseInt(e.target.value))}
//             className="jobs-per-page-select"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// });

// // Memoized Mobile Infinite Scroll Component
// const MobileInfiniteScroll = React.memo(({ jobs, hasMore, loadMore, loading }) => {
//   const loaderRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const target = entries[0];
//         if (target.isIntersecting && hasMore && !loading) {
//           console.log('Intersection observer triggered - loading more jobs');
//           loadMore();
//         }
//       },
//       { 
//         threshold: 0.1, 
//         rootMargin: '100px' 
//       }
//     );

//     const currentRef = loaderRef.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, [hasMore, loading, loadMore]);

//   return (
//     <div ref={loaderRef} className="mobile-infinite-loader">
//       {loading && hasMore && (
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <span>Loading more jobs...</span>
//         </div>
//       )}
//       {!hasMore && jobs.length > 0 && (
//         <div className="end-message">
//           🎉 You've seen all available jobs!
//         </div>
//       )}
//       {!hasMore && jobs.length === 0 && (
//         <div className="end-message">
//           No jobs found matching your criteria.
//         </div>
//       )}
//     </div>
//   );
// });

// // Memoized Job Card Component
// const JobCard = React.memo(({ job, index, isMobile, onViewDetails, onSave }) => {
//   // Memoize truncated description
//   const truncatedDescription = useMemo(() => {
//     if (!job.description) return 'No description available';
//     return job.description.length > 150 
//       ? job.description.substring(0, 150) + '...' 
//       : job.description;
//   }, [job.description]);

//   // Memoize formatted date
//   const formattedDate = useMemo(() => {
//     return job.postedDate || job.created_at 
//       ? new Date(job.postedDate || job.created_at).toLocaleDateString() 
//       : 'Date not available';
//   }, [job.postedDate, job.created_at]);

//   const handleSaveJob = useCallback(async () => {
//     try {
//       await onSave(job.id);
//     } catch (error) {
//       console.error('Error saving job:', error);
//     }
//   }, [job.id, onSave]);

//   return (
//     <div key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card job-card-minimal">
//       <div className="job-header">
//         <h2 className="job-title">{job.title || 'No Title'}</h2>
//         <div className="job-meta">
//           <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
//           <span className="job-location">{job.location || 'Location not specified'}</span>
//         </div>
//       </div>

//       <div className="job-details job-details-minimal">
//         <div className="job-category">
//           <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
//         </div>

//         <div className="job-info job-info-minimal">
//           <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
//           <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
//         </div>

//         <div className="job-description job-description-minimal">
//           <p>{truncatedDescription}</p>
//         </div>

//         <div className="job-footer">
//           <span className="posted-date">Posted: {formattedDate}</span>
//           <div className="job-actions">
//             <button
//               onClick={() => onViewDetails(job)}
//               className="view-details-btn"
//             >
//               <i className="fa fa-eye"></i>
//               View Details
//             </button>
//             <button onClick={handleSaveJob} className="save-btn">
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Memoized Filter Option Component
// const FilterOption = React.memo(({ option, isChecked, onChange, filterType }) => (
//   <label className="filter-option">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={(e) => onChange(filterType, option, e.target.checked)}
//     />
//     <span className="checkmark-mini"></span>
//     {filterType === 'selectedSalary' ? `$${option.replace('-', ' - ')}` : option}
//   </label>
// ));

// // Fixed Filter Dropdown Component with proper event handling
// const FilterDropdown = React.memo(({ 
//   id, 
//   icon, 
//   title, 
//   options, 
//   selectedValues, 
//   onFilterChange, 
//   onApply, 
//   onClear,
//   isActive,
//   onClick
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
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
//               const optionLabel = option.name || option;
              
//               return (
//                 <FilterOption
//                   key={optionValue}
//                   option={optionValue}
//                   isChecked={selectedValues?.includes(optionValue)}
//                   onChange={handleOptionChange}
//                   filterType={id}
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

// const JobList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const { 
//     jobs, 
//     categories, 
//     companies, 
//     loading, 
//     error, 
//     filters, 
//     pagination, 
//     infiniteScroll 
//   } = useSelector((state) => state.jobs);
  
//   const { loadJobs, loadAllData, loadMoreJobs } = useDataLoader();
//   const [toast, setToast] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const isJobPage = location.pathname === '/jobs';

//   // Separate state for input fields to avoid losing user input
//   const [localFilters, setLocalFilters] = useState({
//     searchInput: '',
//     locationSearchInput: ''
//   });

//   // State for pending filters (not applied yet)
//   const [pendingFilters, setPendingFilters] = useState({
//     selectedCategory: [],
//     selectedCompany: [],
//     selectedExperience: [],
//     selectedLocation: [],
//     selectedType: [],
//     selectedSalary: []
//   });

//   // Track if filters have changed but not applied
//   const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);

//   // Track initial load and prevent infinite loops
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [infiniteScrollInitialized, setInfiniteScrollInitialized] = useState(false);
  
//   // Refs to prevent infinite loops and race conditions
//   const lastFiltersRef = useRef(null);
//   const isLoadingMoreRef = useRef(false);
//   const initializationRef = useRef(false);
//   const urlSyncRef = useRef(false);

//   // Memoize static filter options
//   const experienceOptions = useMemo(() => ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'], []);
//   const locationOptions = useMemo(() => ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'], []);
//   const typeOptions = useMemo(() => ['Full-time', 'Part-time', 'Contract'], []);
//   const salaryRangeOptions = useMemo(() => ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'], []);

//   // Memoize display jobs
//   const displayJobs = useMemo(() => {
//     return isMobile ? infiniteScroll.allJobs : jobs;
//   }, [isMobile, infiniteScroll.allJobs, jobs]);

//   // URL Parameter Management Functions
//   const updateURL = useCallback(() => {
//     if (urlSyncRef.current) return;
    
//     const params = new URLSearchParams();
    
//     if (filters.searchQuery && filters.searchQuery.trim()) {
//       params.set('search', filters.searchQuery.trim());
//     }
//     if (filters.selectedCategory && filters.selectedCategory.length > 0) {
//       params.set('categories', filters.selectedCategory.join(','));
//     }
//     if (filters.selectedCompany && filters.selectedCompany.length > 0) {
//       params.set('companies', filters.selectedCompany.join(','));
//     }
//     if (filters.selectedExperience && filters.selectedExperience.length > 0) {
//       params.set('experience', filters.selectedExperience.join(','));
//     }
//     if (filters.selectedLocation && filters.selectedLocation.length > 0) {
//       params.set('location', filters.selectedLocation.join(','));
//     }
//     if (filters.selectedType && filters.selectedType.length > 0) {
//       params.set('type', filters.selectedType.join(','));
//     }
//     if (filters.selectedSalary && filters.selectedSalary.length > 0) {
//       params.set('salary', filters.selectedSalary.join(','));
//     }
//     if (pagination.currentPage > 1) {
//       params.set('page', pagination.currentPage.toString());
//     }
//     if (pagination.jobsPerPage !== 20) {
//       params.set('limit', pagination.jobsPerPage.toString());
//     }

//     const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
//     navigate(newURL, { replace: true });
//   }, [filters, pagination, location.pathname, navigate]);

//   const parseURLAndSetFilters = useCallback(() => {
//     urlSyncRef.current = true;
    
//     const search = searchParams.get('search') || '';
//     const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    
//     const companies = searchParams.get('companies')?.split(',').filter(Boolean) || [];
//     const experience = searchParams.get('experience')?.split(',').filter(Boolean) || [];
//     const locationParam = searchParams.get('location')?.split(',').filter(Boolean) || [];
//     const type = searchParams.get('type')?.split(',').filter(Boolean) || [];
//     const salary = searchParams.get('salary')?.split(',').filter(Boolean) || [];
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 20;

//     if (search !== filters.searchQuery) {
//       dispatch(setSearchQuery(search));
//     }
//     if (JSON.stringify(categories) !== JSON.stringify(filters.selectedCategory)) {
//       dispatch(setSelectedCategory(categories));
//     }
//     if (JSON.stringify(companies) !== JSON.stringify(filters.selectedCompany)) {
//       dispatch(setSelectedCompany(companies));
//     }
//     if (JSON.stringify(experience) !== JSON.stringify(filters.selectedExperience)) {
//       dispatch(setSelectedExperience(experience));
//     }
//     if (JSON.stringify(locationParam) !== JSON.stringify(filters.selectedLocation)) {
//       dispatch(setSelectedLocation(locationParam));
//     }
//     if (JSON.stringify(type) !== JSON.stringify(filters.selectedType)) {
//       dispatch(setSelectedType(type));
//     }
//     if (JSON.stringify(salary) !== JSON.stringify(filters.selectedSalary)) {
//       dispatch(setSelectedSalary(salary));
//     }
//     if (page !== pagination.currentPage) {
//       dispatch(setCurrentPage(page));
//     }
//     if (limit !== pagination.jobsPerPage) {
//       dispatch(setJobsPerPage(limit));
//     }

//     setLocalFilters({
//       searchInput: search,
//       locationSearchInput: locationParam.length > 0 ? locationParam[0] : ''
//     });

//     setPendingFilters({
//       selectedCategory: categories,
//       selectedCompany: companies,
//       selectedExperience: experience,
//       selectedLocation: locationParam,
//       selectedType: type,
//       selectedSalary: salary
//     });

//     setTimeout(() => {
//       urlSyncRef.current = false;
//     }, 100);
//   }, [searchParams, dispatch, filters, pagination]);

//   // Parse URL on component mount and when search params change
//   useEffect(() => {
//     if (isJobPage && !initializationRef.current) {
//       parseURLAndSetFilters();
//     }
//   }, [parseURLAndSetFilters, isJobPage]);

//   // Update URL when filters change
//   useEffect(() => {
//     if (initialLoadComplete && !urlSyncRef.current) {
//       updateURL();
//     }
//   }, [filters, pagination.currentPage, pagination.jobsPerPage, updateURL, initialLoadComplete]);

//   // Check if device is mobile
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       const wasMobile = isMobile;
//       setIsMobile(mobile);
      
//       if (wasMobile !== mobile) {
//         dispatch(resetInfiniteScroll());
//         setInfiniteScrollInitialized(false);
//         if (!mobile && isSidebarOpen) {
//           setIsSidebarOpen(false);
//         }
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch, isMobile, isSidebarOpen]);

//   // Initialize pending filters from current filters
//   useEffect(() => {
//     setPendingFilters({
//       selectedCategory: filters.selectedCategory || [],
//       selectedCompany: filters.selectedCompany || [],
//       selectedExperience: filters.selectedExperience || [],
//       selectedLocation: filters.selectedLocation || [],
//       selectedType: filters.selectedType || [],
//       selectedSalary: filters.selectedSalary || []
//     });
//   }, [filters]);

//   // Check if pending filters differ from applied filters
//   useEffect(() => {
//     const currentFiltersStr = JSON.stringify({
//       selectedCategory: filters.selectedCategory || [],
//       selectedCompany: filters.selectedCompany || [],
//       selectedExperience: filters.selectedExperience || [],
//       selectedLocation: filters.selectedLocation || [],
//       selectedType: filters.selectedType || [],
//       selectedSalary: filters.selectedSalary || []
//     });
    
//     const pendingFiltersStr = JSON.stringify(pendingFilters);
    
//     setHasUnappliedFilters(currentFiltersStr !== pendingFiltersStr);
//   }, [filters, pendingFilters]);

//   // Debounce search input
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (localFilters.searchInput !== filters.searchQuery) {
//         dispatch(setSearchQuery(localFilters.searchInput));
//       }
//     }, 800);

//     return () => clearTimeout(debounceTimer);
//   }, [localFilters.searchInput, filters.searchQuery, dispatch]);

//   // Update local state when Redux filters change
//   useEffect(() => {
//     if (!urlSyncRef.current) {
//       setLocalFilters(prev => ({
//         ...prev,
//         searchInput: prev.searchInput === '' ? (filters.searchQuery || '') : prev.searchInput,
//         locationSearchInput: prev.locationSearchInput === '' ? 
//           (filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '') : 
//           prev.locationSearchInput
//       }));
//     }
//   }, [filters.selectedLocation, filters.searchQuery]);

//   const showToast = useCallback((message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   }, []);

//   // Sidebar management effects
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     if (isSidebarOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.classList.add('body-no-scroll');
//     } else {
//       document.body.classList.remove('body-no-scroll');
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.classList.remove('body-no-scroll');
//     };
//   }, [isSidebarOpen]);

//   // Load initial data only once
//   useEffect(() => {
//     if (!initialLoadComplete && !initializationRef.current) {
//       initializationRef.current = true;
//       console.log('Loading initial data...');
      
//       loadAllData().then(() => {
//         console.log('Initial data loaded');
//         setInitialLoadComplete(true);
//       }).catch(error => {
//         console.error('Failed to load initial data:', error);
//         initializationRef.current = false;
//       });
//     }
//   }, [loadAllData, initialLoadComplete]);

//   // Reload jobs when filters change
//   useEffect(() => {
//     if (!initialLoadComplete || !initializationRef.current) return;

//     const currentFilters = JSON.stringify(filters);
//     const lastFilters = lastFiltersRef.current;

//     if (currentFilters !== lastFilters) {
//       console.log('Filters changed, reloading jobs');
//       lastFiltersRef.current = currentFilters;
      
//       setInfiniteScrollInitialized(false);
//       isLoadingMoreRef.current = false;
//       dispatch(resetInfiniteScroll());
      
//       loadJobs().catch(error => {
//         console.error('Failed to reload jobs:', error);
//       });
//     }
//   }, [filters, loadJobs, initialLoadComplete, dispatch]);

//   // Initialize mobile infinite scroll data when jobs are loaded
//   useEffect(() => {
//     if (
//       isMobile && 
//       jobs.length > 0 && 
//       initialLoadComplete && 
//       !infiniteScrollInitialized &&
//       infiniteScroll.allJobs.length === 0
//     ) {
//       console.log('Initializing infinite scroll with jobs:', jobs.length);
//       dispatch(appendJobs({ 
//         jobs: jobs, 
//         pagination: pagination, 
//         resetList: true 
//       }));
//       setInfiniteScrollInitialized(true);
//       isLoadingMoreRef.current = false;
//     }
//   }, [jobs, isMobile, pagination, dispatch, initialLoadComplete, infiniteScrollInitialized, infiniteScroll.allJobs.length]);

//   // Scroll to top when page changes (desktop only)
//   useEffect(() => {
//     if (!isMobile && pagination.currentPage > 1) {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [pagination.currentPage, isMobile]);

//   // Memoized handlers
//   const handlePageChange = useCallback((newPage) => {
//     if (!isMobile && newPage !== pagination.currentPage) {
//       console.log('Page change requested:', newPage, 'Current:', pagination.currentPage);
//       dispatch(setCurrentPage(newPage));
      
//       loadJobs({ page: newPage }).catch(error => {
//         console.error('Failed to load jobs for page:', newPage, error);
//       });
//     }
//   }, [dispatch, isMobile, pagination.currentPage, loadJobs]);

//   const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
//     if (!isMobile && newJobsPerPage !== pagination.jobsPerPage) {
//       console.log('Jobs per page change requested:', newJobsPerPage);
//       dispatch(setJobsPerPage(newJobsPerPage));
      
//       loadJobs({ limit: newJobsPerPage, page: 1 }).catch(error => {
//         console.error('Failed to load jobs with new page size:', newJobsPerPage, error);
//       });
//     }
//   }, [dispatch, isMobile, pagination.jobsPerPage, loadJobs]);

//   const handleLoadMore = useCallback(async () => {
//     if (!infiniteScroll.hasMore || infiniteScroll.isLoading || isLoadingMoreRef.current) {
//       console.log('Cannot load more:', { 
//         hasMore: infiniteScroll.hasMore, 
//         isLoading: infiniteScroll.isLoading,
//         isLoadingMoreRef: isLoadingMoreRef.current
//       });
//       return;
//     }

//     try {
//       isLoadingMoreRef.current = true;
//       dispatch(setInfiniteScrollLoading(true));
//       console.log('Loading more jobs... Current page:', pagination.currentPage);
      
//       const result = await loadMoreJobs();
      
//       if (result && result.newJobs && result.newJobs.length > 0) {
//         console.log('Successfully loaded page:', result.pagination?.currentPage || 'unknown');
//         console.log('New jobs count:', result.newJobs.length);
//         console.log('Has more pages:', result.hasMore);
        
//         dispatch(appendJobs({ 
//           jobs: result.newJobs, 
//           pagination: result.pagination || {
//             ...pagination, 
//             hasNextPage: result.hasMore,
//             totalJobs: result.totalJobs,
//             currentPage: result.pagination?.currentPage || pagination.currentPage + 1
//           }
//         }));
//       } else {
//         console.log('No more jobs to load or empty result');
//       }
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//       showToast('Error loading more jobs');
//     } finally {
//       dispatch(setInfiniteScrollLoading(false));
//       isLoadingMoreRef.current = false;
//     }
//   }, [infiniteScroll.hasMore, infiniteScroll.isLoading, dispatch, loadMoreJobs, pagination, showToast]);

//   // Fixed filter handlers
//   const handleApplyFilters = useCallback(() => {
//     console.log('Applying filters:', pendingFilters);
    
//     // Apply all pending filters at once
//     dispatch(setSelectedCategory(pendingFilters.selectedCategory));
//     dispatch(setSelectedCompany(pendingFilters.selectedCompany));
//     dispatch(setSelectedExperience(pendingFilters.selectedExperience));
//     dispatch(setSelectedLocation(pendingFilters.selectedLocation));
//     dispatch(setSelectedType(pendingFilters.selectedType));
//     dispatch(setSelectedSalary(pendingFilters.selectedSalary));
    
//     // Reset pagination to first page
//     dispatch(setCurrentPage(1));
    
//     setInfiniteScrollInitialized(false);
//     isLoadingMoreRef.current = false;
    
//     showToast('Filters applied successfully!');
//     setIsSidebarOpen(false);
//   }, [dispatch, pendingFilters, showToast]);

//   const handleClearFilters = useCallback(() => {
//     console.log('Clearing all filters');
    
//     setPendingFilters({
//       selectedCategory: [],
//       selectedCompany: [],
//       selectedExperience: [],
//       selectedLocation: [],
//       selectedType: [],
//       selectedSalary: []
//     });
    
//     dispatch(clearFilters());
//     setLocalFilters({
//       searchInput: '',
//       locationSearchInput: ''
//     });
//     setInfiniteScrollInitialized(false);
//     isLoadingMoreRef.current = false;
    
//     showToast('All filters cleared!');
//     setIsSidebarOpen(false);
    
//     // Clear URL parameters
//     navigate('/jobs', { replace: true });
//   }, [dispatch, showToast, navigate]);

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarOpen(prev => !prev);
//   }, []);

//   // Handle search input changes
//   const handleSearchInputChange = useCallback((value) => {
//     setLocalFilters(prev => ({
//       ...prev,
//       searchInput: value
//     }));
//   }, []);

//   const handleLocationInputChange = useCallback((value) => {
//     setLocalFilters(prev => ({
//       ...prev,
//       locationSearchInput: value
//     }));
    
//     if (value.trim()) {
//       dispatch(setSelectedLocation([value.trim()]));
//     } else {
//       dispatch(setSelectedLocation([]));
//     }
//   }, [dispatch]);

//   // Fixed pending filter change handler
//   const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
//     console.log('Filter change:', filterType, value, isChecked);
    
//     setPendingFilters(prev => {
//       const current = prev[filterType] || [];
//       let updated;
      
//       if (isChecked) {
//         // Add the value if it's not already present
//         updated = current.includes(value) ? current : [...current, value];
//       } else {
//         // Remove the value
//         updated = current.filter(item => item !== value);
//       }
      
//       console.log('Updated pending filters for', filterType, ':', updated);
      
//       return {
//         ...prev,
//         [filterType]: updated
//       };
//     });
//   }, []);

//   // Handle individual filter dropdown actions
//   const handleDropdownApply = useCallback((filterType) => {
//     console.log('Applying single filter:', filterType, pendingFilters[filterType]);
    
//     switch (filterType) {
//       case 'selectedCategory':
//         dispatch(setSelectedCategory(pendingFilters.selectedCategory));
//         break;
//       case 'selectedCompany':
//         dispatch(setSelectedCompany(pendingFilters.selectedCompany));
//         break;
//       case 'selectedExperience':
//         dispatch(setSelectedExperience(pendingFilters.selectedExperience));
//         break;
//       case 'selectedLocation':
//         dispatch(setSelectedLocation(pendingFilters.selectedLocation));
//         break;
//       case 'selectedType':
//         dispatch(setSelectedType(pendingFilters.selectedType));
//         break;
//       case 'selectedSalary':
//         dispatch(setSelectedSalary(pendingFilters.selectedSalary));
//         break;
//       default:
//         console.warn('Unknown filter type:', filterType);
//     }
    
//     dispatch(setCurrentPage(1));
//     showToast(`${filterType.replace('selected', '')} filter applied!`);
//   }, [dispatch, pendingFilters, showToast]);

//   const handleDropdownClear = useCallback((filterType) => {
//     console.log('Clearing single filter:', filterType);
    
//     setPendingFilters(prev => ({
//       ...prev,
//       [filterType]: []
//     }));
    
//     switch (filterType) {
//       case 'selectedCategory':
//         dispatch(setSelectedCategory([]));
//         break;
//       case 'selectedCompany':
//         dispatch(setSelectedCompany([]));
//         break;
//       case 'selectedExperience':
//         dispatch(setSelectedExperience([]));
//         break;
//       case 'selectedLocation':
//         dispatch(setSelectedLocation([]));
//         break;
//       case 'selectedType':
//         dispatch(setSelectedType([]));
//         break;
//       case 'selectedSalary':
//         dispatch(setSelectedSalary([]));
//         break;
//       default:
//         console.warn('Unknown filter type:', filterType);
//     }
    
//     showToast(`${filterType.replace('selected', '')} filter cleared!`);
//   }, [dispatch, showToast]);

//   // Modal handlers
//   const handleViewDetails = useCallback((job) => {
//     setSelectedJob(job);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedJob(null);
//   }, []);

//   const handleSaveFromModal = useCallback(async () => {
//     if (!selectedJob) return;
    
//     try {
//       const result = await dispatch(saveJob({ 
//         jobId: selectedJob.id,
//         notes: '',
//         priority: 0
//       }));

//       if (result.meta.requestStatus === 'fulfilled') {
//         showToast("Job saved successfully!");
//       } else if (result.meta.requestStatus === 'rejected') {
//         const errorMessage = result.payload || "Failed to save job";
//         if (errorMessage.includes('already saved')) {
//           showToast("Job is already saved");
//         } else {
//           showToast(errorMessage);
//         }
//       }
//     } catch (error) {
//       console.error('Error saving job:', error);
//       showToast("Failed to save job");
//     }
//   }, [selectedJob, dispatch, showToast]);

//   const handleApplyFromModal = useCallback(() => {
//     if (!selectedJob) return;
    
//     const applyUrl = selectedJob.applyUrl || selectedJob.apply_url || selectedJob.applicationUrl || selectedJob.application_url || selectedJob.url || selectedJob.link;
//     if (applyUrl) {
//       window.open(applyUrl, '_blank', 'noopener,noreferrer');
//     }
//   }, [selectedJob]);

//   // Optimized save job handler for cards
//   const handleSaveJob = useCallback(async (jobId) => {
//     try {
//       const result = await dispatch(saveJob({ 
//         jobId: jobId,
//         notes: '',
//         priority: 0
//       }));

//       if (result.meta.requestStatus === 'fulfilled') {
//         showToast("Job saved successfully!");
//       } else if (result.meta.requestStatus === 'rejected') {
//         const errorMessage = result.payload || "Failed to save job";
//         if (errorMessage.includes('already saved')) {
//           showToast("Job is already saved");
//         } else {
//           showToast(errorMessage);
//         }
//       }

//       if (isMobile && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     } catch (error) {
//       console.error('Error saving job:', error);
//       showToast("Failed to save job");
//     }
//   }, [dispatch, showToast, isMobile, isSidebarOpen]);

//   // Early returns for loading states
//   if (!initialLoadComplete) {
//     return <div className="loading">Loading jobs...</div>;
//   }

//   if (loading && (!isMobile || infiniteScroll.allJobs.length === 0)) {
//     return <div className="loading">Loading jobs...</div>;
//   }
  
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="job-list-container">
//       {/* Mobile Filter toggle button */}
//       {isMobile && (
//         <button className="filter-toggle" onClick={toggleSidebar}>
//           <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-sliders'}`}></i>
//           <p>{isSidebarOpen ? 'Close' : 'Filters'}</p>
//           {hasUnappliedFilters && !isSidebarOpen && <span className="filter-badge">!</span>}
//         </button>
//       )}

//       {!isMobile && (
//         <div className="horizontal-filters">
//           <div className="filter-dropdown-group">
//             <FilterDropdown
//               id="selectedType"
//               icon="calendar"
//               title="Schedule"
//               options={typeOptions}
//               selectedValues={pendingFilters.selectedType}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedType')}
//               onClear={() => handleDropdownClear('selectedType')}
//             />

//             <FilterDropdown
//               id="selectedCategory"
//               icon="industry"
//               title="Industries"
//               options={categories}
//               selectedValues={pendingFilters.selectedCategory}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedCategory')}
//               onClear={() => handleDropdownClear('selectedCategory')}
//             />

//             <FilterDropdown
//               id="selectedExperience"
//               icon="user"
//               title="Experience"
//               options={experienceOptions}
//               selectedValues={pendingFilters.selectedExperience}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedExperience')}
//               onClear={() => handleDropdownClear('selectedExperience')}
//             />

//             <FilterDropdown
//               id="selectedLocation"
//               icon="map-marker"
//               title="Distance"
//               options={locationOptions}
//               selectedValues={pendingFilters.selectedLocation}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedLocation')}
//               onClear={() => handleDropdownClear('selectedLocation')}
//             />

//             <FilterDropdown
//               id="selectedCompany"
//               icon="building"
//               title="Company"
//               options={companies}
//               selectedValues={pendingFilters.selectedCompany}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedCompany')}
//               onClear={() => handleDropdownClear('selectedCompany')}
//             />

//             <FilterDropdown
//               id="selectedSalary"
//               icon="dollar"
//               title="Salary"
//               options={salaryRangeOptions}
//               selectedValues={pendingFilters.selectedSalary}
//               onFilterChange={handlePendingFilterChange}
//               onApply={() => handleDropdownApply('selectedSalary')}
//               onClear={() => handleDropdownClear('selectedSalary')}
//             />
//           </div>
//         </div>
//       )}

//       {/* Sidebar overlay */}
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

//       <div className="job-list-layout">
//         {/* Mobile Sidebar - Only show on mobile */}
//         {isMobile && (
//           <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//             {/* Header for mobile */}
//             <div className="sidebar-header">
//               <h3><i className="fa fa-sliders"></i> Filters</h3>
//             </div>
            
//             <div className="filters-section">
//               {/* Filter Action Buttons */}
//               <div className="filter-actions">
//                 <button 
//                   onClick={handleApplyFilters} 
//                   className={`apply-filters-btn ${hasUnappliedFilters ? 'highlighted' : ''}`}
//                   disabled={!hasUnappliedFilters}
//                 >
//                   <i className="fa fa-check"></i>
//                   Apply Filters
//                   {hasUnappliedFilters && <span className="pulse-dot"></span>}
//                 </button>
                
//                 <button onClick={handleClearFilters} className="clear-filters-btn">
//                   <i className="fa fa-refresh"></i>
//                   Clear All
//                 </button>
//               </div>

//               <div className="FilterGroup">
//                 <h4>Category</h4>
//                 {categories.map((category) => (
//                   <label key={category.id} className="filter-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={pendingFilters.selectedCategory?.includes(category.id)}
//                       onChange={(e) => handlePendingFilterChange('selectedCategory', category.id, e.target.checked)}
//                     />
//                     <span className="checkmark"></span>
//                     {category.name}
//                   </label>
//                 ))}
//               </div>

//               <div className="FilterGroup">
//                 <h4>Company</h4>
//                 {companies.map((company) => (
//                   <label key={company.id} className="filter-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={pendingFilters.selectedCompany?.includes(company.id)}
//                       onChange={(e) => handlePendingFilterChange('selectedCompany', company.id, e.target.checked)}
//                     />
//                     <span className="checkmark"></span>
//                     {company.name}
//                   </label>
//                 ))}
//               </div>

//               <div className="FilterGroup">
//                 <h4>Experience</h4>
//                 {experienceOptions.map((level) => (
//                   <label key={level} className="filter-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={pendingFilters.selectedExperience?.includes(level)}
//                       onChange={(e) => handlePendingFilterChange('selectedExperience', level, e.target.checked)}
//                     />
//                     <span className="checkmark"></span>
//                     {level}
//                   </label>
//                 ))}
//               </div>

//               <div className="FilterGroup">
//                 <h4>Location</h4>
//                 {locationOptions.map((location) => (
//                   <label key={location} className="filter-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={pendingFilters.selectedLocation?.includes(location)}
//                       onChange={(e) => handlePendingFilterChange('selectedLocation', location, e.target.checked)}
//                     />
//                     <span className="checkmark"></span>
//                     {location}
//                   </label>
//                 ))}
//               </div>

//               <div className="FilterGroup">
//                 <h4>Type</h4>
//                 {typeOptions.map((type) => (
//                   <label key={type} className="filter-checkbox">
//                     <input
//                       type="checkbox"
//                       checked={pendingFilters.selectedType?.includes(type)}
//                       onChange={(e) => handlePendingFilterChange('selectedType', type, e.target.checked)}
//                     />
//                     <span className="checkmark"></span>
//                     {type}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="jobs-content">
//           {/* Mobile job count info */}
//           {isMobile && (
//             <div className="mobile-job-info">
//               <span>Showing {displayJobs.length} jobs</span>
//               {pagination.totalJobs > 0 && (
//                 <span> of {pagination.totalJobs} total</span>
//               )}
//             </div>
//           )}

//           <div className="jobs-grid">
//             {displayJobs.length === 0 ? (
//               <div className="no-jobs">
//                 {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
//               </div>
//             ) : (
//               displayJobs.map((job, index) => (
//                 <JobCard
//                   key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`}
//                   job={job}
//                   index={index}
//                   isMobile={isMobile}
//                   onViewDetails={handleViewDetails}
//                   onSave={handleSaveJob}
//                 />
//               ))
//             )}
//           </div>

//           {/* Mobile Infinite Scroll Loader */}
//           {isMobile && (
//             <MobileInfiniteScroll
//               jobs={displayJobs}
//               hasMore={infiniteScroll.hasMore}
//               loadMore={handleLoadMore}
//               loading={infiniteScroll.isLoading}
//             />
//           )}

//           {/* Pagination - Bottom (Desktop only) */}
//           <Pagination
//             pagination={pagination}
//             onPageChange={handlePageChange}
//             onJobsPerPageChange={handleJobsPerPageChange}
//           />
//         </div>
//       </div>

//       {/* Job Details Modal */}
//       <JobDetailsModal
//         job={selectedJob}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSave={handleSaveFromModal}
//         onApply={handleApplyFromModal}
//       />
      
//       {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
import React,{ memo,useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDataLoader } from '../hooks/useDataLoader';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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

  // Memoize salary formatting to avoid recalculation
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

  // Early return optimization
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

// Memoized Pagination Component - Only shown on desktop
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

  // Don't render pagination on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize page numbers calculation
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
  // Memoize truncated description
  const truncatedDescription = useMemo(() => {
    if (!job.description) return 'No description available';
    return job.description.length > 150 
      ? job.description.substring(0, 150) + '...' 
      : job.description;
  }, [job.description]);

  // Memoize formatted date
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
    <div key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card job-card-minimal">
      <div className="job-header">
        <h2 className="job-title">{job.title || 'No Title'}</h2>
        <div className="job-meta">
          <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
          <span className="job-location">{job.location || 'Location not specified'}</span>
        </div>
      </div>

      <div className="job-details job-details-minimal">
        <div className="job-category">
          <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
        </div>

        <div className="job-info job-info-minimal">
          <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
          <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
        </div>

        <div className="job-description job-description-minimal">
          <p>{truncatedDescription}</p>
        </div>

        <div className="job-footer">
          <span className="posted-date">Posted: {formattedDate}</span>
          <div className="job-actions">
            <button
              onClick={() => onViewDetails(job)}
              className="view-details-btn"
            >
              <i className="fa fa-eye"></i>
              View Details
            </button>
            <button onClick={handleSaveJob} className="save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized Filter Option Component
// const FilterOption = React.memo(({ option, isChecked, onChange, filterType }) => (
//   <label className="filter-option">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={(e) => onChange(filterType, option, e.target.checked)}
//     />
//     <span className="checkmark-mini"></span>
//     {filterType === 'selectedSalary' ? `$${option.replace('-', ' - ')}` : option}
//   </label>
// ));
const FilterOption = React.memo(({ option, isChecked, onChange, filterType, categories, companies }) => {
  // Only fix the display name for categories and companies, keep everything else the same
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

  return (
    <label className="filter-option">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(filterType, option, e.target.checked)}
      />
      <span className="checkmark-mini"></span>
      {getDisplayName()}
    </label>
  );
});

// Fixed Filter Dropdown Component with proper event handling
const FilterDropdown = React.memo(({ 
  id, 
  icon, 
  title, 
  options, 
  selectedValues, 
  onFilterChange, 
  onApply, 
  onClear,
  isActive,
  onClick,
  categories,  // ADD THIS LINE
  companies  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    onFilterChange(filterType, option, isChecked);
  }, [onFilterChange]);

  const handleApply = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onApply();
    setIsOpen(false);
  }, [onApply]);

  const handleClear = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
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
        <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>
      
      {isOpen && (
        <div className="filter-dropdown-content">
          <div className="filter-dropdown-header">
            <h4>{title}</h4>
          </div>
          {/* <div className="filter-options">
            {options.map((option) => {
              // FIX: Check if option is an object with id/name properties (for categories/companies)
              const optionValue = option.id || option.name || option;
              const optionLabel = option.name || option;
              
              return (
                <FilterOption
                  key={optionValue}
                  option={optionValue}
                  isChecked={selectedValues?.includes(optionValue)}
                  onChange={handleOptionChange}
                  filterType={id}
                />
              );
            })}
          </div> */}
          <div className="filter-options">
    {options.map((option) => {
      const optionValue = option.id || option.name || option;
      
      return (
        <FilterOption
          key={optionValue}
          option={optionValue}
          isChecked={selectedValues?.includes(optionValue)}
          onChange={handleOptionChange}
          filterType={id}
          categories={categories}  // ADD THIS
          companies={companies}    // ADD THIS
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
});

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { 
    jobs, 
    categories, 
    companies, 
    loading, 
    error, 
    filters, 
    pagination, 
    infiniteScroll 
  } = useSelector((state) => state.jobs);
  
  const { loadJobs, loadAllData, loadMoreJobs } = useDataLoader();
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isJobPage = location.pathname === '/jobs';

  // Separate state for input fields to avoid losing user input
  const [localFilters, setLocalFilters] = useState({
    searchInput: '',
    locationSearchInput: ''
  });

  // State for pending filters (not applied yet)
  const [pendingFilters, setPendingFilters] = useState({
    selectedCategory: [],
    selectedCompany: [],
    selectedExperience: [],
    selectedLocation: [],
    selectedType: [],
    selectedSalary: []
  });

  // Track if filters have changed but not applied
  const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);

  // Track initial load and prevent infinite loops
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [infiniteScrollInitialized, setInfiniteScrollInitialized] = useState(false);
  
  // Refs to prevent infinite loops and race conditions
  const lastFiltersRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const initializationRef = useRef(false);
  const urlSyncRef = useRef(false);

  // Memoize static filter options
  const experienceOptions = useMemo(() => ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'], []);
  const locationOptions = useMemo(() => ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'], []);
  const typeOptions = useMemo(() => ['Full-time', 'Part-time', 'Contract'], []);
  const salaryRangeOptions = useMemo(() => ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'], []);

  // Memoize display jobs
  const displayJobs = useMemo(() => {
    return isMobile ? infiniteScroll.allJobs : jobs;
  }, [isMobile, infiniteScroll.allJobs, jobs]);

  // FIXED: Properly memoize filter options for dropdowns to show names instead of IDs
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

  // URL Parameter Management Functions
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

  // Parse URL on component mount and when search params change
  useEffect(() => {
    if (isJobPage && !initializationRef.current) {
      parseURLAndSetFilters();
    }
  }, [parseURLAndSetFilters, isJobPage]);

  // Update URL when filters change
  useEffect(() => {
    if (initialLoadComplete && !urlSyncRef.current) {
      updateURL();
    }
  }, [filters, pagination.currentPage, pagination.jobsPerPage, updateURL, initialLoadComplete]);

  // Check if device is mobile
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

  // Initialize pending filters from current filters
  useEffect(() => {
    setPendingFilters({
      selectedCategory: filters.selectedCategory || [],
      selectedCompany: filters.selectedCompany || [],
      selectedExperience: filters.selectedExperience || [],
      selectedLocation: filters.selectedLocation || [],
      selectedType: filters.selectedType || [],
      selectedSalary: filters.selectedSalary || []
    });
  }, [filters]);

  // Check if pending filters differ from applied filters
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

  // FIXED: Debounce search input with preserved filter state
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localFilters.searchInput !== filters.searchQuery) {
        // Preserve all current filters when updating search query
        const currentSearch = filters.searchQuery;
        dispatch(setSearchQuery(localFilters.searchInput));
        
        // Reset page to 1 when search changes
        if (localFilters.searchInput !== currentSearch) {
          dispatch(setCurrentPage(1));
        }
      }
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [localFilters.searchInput, filters.searchQuery, dispatch]);

  // Update local state when Redux filters change (prevent override during typing)
  useEffect(() => {
    if (!urlSyncRef.current) {
      setLocalFilters(prev => ({
        ...prev,
        searchInput: prev.searchInput === '' ? (filters.searchQuery || '') : prev.searchInput,
        locationSearchInput: prev.locationSearchInput === '' ? 
          (filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '') : 
          prev.locationSearchInput
      }));
    }
  }, [filters.selectedLocation, filters.searchQuery]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Sidebar management effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('body-no-scroll');
    };
  }, [isSidebarOpen]);

  // Load initial data only once
  useEffect(() => {
    if (!initialLoadComplete && !initializationRef.current) {
      initializationRef.current = true;
      console.log('Loading initial data...');
      
      loadAllData().then(() => {
        console.log('Initial data loaded');
        setInitialLoadComplete(true);
      }).catch(error => {
        console.error('Failed to load initial data:', error);
        initializationRef.current = false;
      });
    }
  }, [loadAllData, initialLoadComplete]);

  // Reload jobs when filters change
  useEffect(() => {
    if (!initialLoadComplete || !initializationRef.current) return;

    const currentFilters = JSON.stringify(filters);
    const lastFilters = lastFiltersRef.current;

    if (currentFilters !== lastFilters) {
      console.log('Filters changed, reloading jobs');
      lastFiltersRef.current = currentFilters;
      
      setInfiniteScrollInitialized(false);
      isLoadingMoreRef.current = false;
      dispatch(resetInfiniteScroll());
      
      loadJobs().catch(error => {
        console.error('Failed to reload jobs:', error);
      });
    }
  }, [filters, loadJobs, initialLoadComplete, dispatch]);

  // Initialize mobile infinite scroll data when jobs are loaded
  useEffect(() => {
    if (
      isMobile && 
      jobs.length > 0 && 
      initialLoadComplete && 
      !infiniteScrollInitialized &&
      infiniteScroll.allJobs.length === 0
    ) {
      console.log('Initializing infinite scroll with jobs:', jobs.length);
      dispatch(appendJobs({ 
        jobs: jobs, 
        pagination: pagination, 
        resetList: true 
      }));
      setInfiniteScrollInitialized(true);
      isLoadingMoreRef.current = false;
    }
  }, [jobs, isMobile, pagination, dispatch, initialLoadComplete, infiniteScrollInitialized, infiniteScroll.allJobs.length]);

  // Scroll to top when page changes (desktop only)
  useEffect(() => {
    if (!isMobile && pagination.currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.currentPage, isMobile]);

  // Memoized handlers
  const handlePageChange = useCallback((newPage) => {
    if (!isMobile && newPage !== pagination.currentPage) {
      console.log('Page change requested:', newPage, 'Current:', pagination.currentPage);
      dispatch(setCurrentPage(newPage));
      
      loadJobs({ page: newPage }).catch(error => {
        console.error('Failed to load jobs for page:', newPage, error);
      });
    }
  }, [dispatch, isMobile, pagination.currentPage, loadJobs]);

  const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
    if (!isMobile && newJobsPerPage !== pagination.jobsPerPage) {
      console.log('Jobs per page change requested:', newJobsPerPage);
      dispatch(setJobsPerPage(newJobsPerPage));
      
      loadJobs({ limit: newJobsPerPage, page: 1 }).catch(error => {
        console.error('Failed to load jobs with new page size:', newJobsPerPage, error);
      });
    }
  }, [dispatch, isMobile, pagination.jobsPerPage, loadJobs]);

  const handleLoadMore = useCallback(async () => {
    if (!infiniteScroll.hasMore || infiniteScroll.isLoading || isLoadingMoreRef.current) {
      console.log('Cannot load more:', { 
        hasMore: infiniteScroll.hasMore, 
        isLoading: infiniteScroll.isLoading,
        isLoadingMoreRef: isLoadingMoreRef.current
      });
      return;
    }

    try {
      isLoadingMoreRef.current = true;
      dispatch(setInfiniteScrollLoading(true));
      console.log('Loading more jobs... Current page:', pagination.currentPage);
      
      const result = await loadMoreJobs();
      
      if (result && result.newJobs && result.newJobs.length > 0) {
        console.log('Successfully loaded page:', result.pagination?.currentPage || 'unknown');
        console.log('New jobs count:', result.newJobs.length);
        console.log('Has more pages:', result.hasMore);
        
        dispatch(appendJobs({ 
          jobs: result.newJobs, 
          pagination: result.pagination || {
            ...pagination, 
            hasNextPage: result.hasMore,
            totalJobs: result.totalJobs,
            currentPage: result.pagination?.currentPage || pagination.currentPage + 1
          }
        }));
      } else {
        console.log('No more jobs to load or empty result');
      }
    } catch (error) {
      console.error('Error loading more jobs:', error);
      showToast('Error loading more jobs');
    } finally {
      dispatch(setInfiniteScrollLoading(false));
      isLoadingMoreRef.current = false;
    }
  }, [infiniteScroll.hasMore, infiniteScroll.isLoading, dispatch, loadMoreJobs, pagination, showToast]);

  // FIXED: Filter handlers with proper state management
  const handleApplyFilters = useCallback(() => {
    console.log('Applying filters:', pendingFilters);
    
    // Apply all pending filters at once without overriding search
    dispatch(setSelectedCategory(pendingFilters.selectedCategory));
    dispatch(setSelectedCompany(pendingFilters.selectedCompany));
    dispatch(setSelectedExperience(pendingFilters.selectedExperience));
    dispatch(setSelectedLocation(pendingFilters.selectedLocation));
    dispatch(setSelectedType(pendingFilters.selectedType));
    dispatch(setSelectedSalary(pendingFilters.selectedSalary));
    
    // Reset pagination to first page
    dispatch(setCurrentPage(1));
    
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    showToast('Filters applied successfully!');
    setIsSidebarOpen(false);
  }, [dispatch, pendingFilters, showToast]);

  const handleClearFilters = useCallback(() => {
    console.log('Clearing all filters');
    
    setPendingFilters({
      selectedCategory: [],
      selectedCompany: [],
      selectedExperience: [],
      selectedLocation: [],
      selectedType: [],
      selectedSalary: []
    });
    
    // Clear filters but preserve search query
    const currentSearchQuery = filters.searchQuery;
    dispatch(clearFilters());
    
    // Restore search query after clearing filters
    if (currentSearchQuery) {
      dispatch(setSearchQuery(currentSearchQuery));
    }
    
    setLocalFilters(prev => ({
      ...prev,
      locationSearchInput: ''
    }));
    
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    showToast('Filters cleared! Search preserved.');
    setIsSidebarOpen(false);
    
    // Update URL to remove filter parameters but keep search
    const params = new URLSearchParams();
    if (currentSearchQuery) {
      params.set('search', currentSearchQuery);
    }
    const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newURL, { replace: true });
  }, [dispatch, showToast, navigate, location.pathname, filters.searchQuery]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // FIXED: Handle search input changes without affecting filters
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

  // FIXED: Pending filter change handler - properly handles different filter types
  const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
    console.log('Filter change:', filterType, value, isChecked);
    
    setPendingFilters(prev => {
      const current = prev[filterType] || [];
      let updated;
      
      if (isChecked) {
        // Add the value if it's not already present
        updated = current.includes(value) ? current : [...current, value];
      } else {
        // Remove the value
        updated = current.filter(item => item !== value);
      }
      
      console.log('Updated pending filters for', filterType, ':', updated);
      
      return {
        ...prev,
        [filterType]: updated
      };
    });
  }, []);

  // Handle individual filter dropdown actions
  const handleDropdownApply = useCallback((filterType) => {
    console.log('Applying single filter:', filterType, pendingFilters[filterType]);
    
    switch (filterType) {
      case 'selectedCategory':
        dispatch(setSelectedCategory(pendingFilters.selectedCategory));
        break;
      case 'selectedCompany':
        dispatch(setSelectedCompany(pendingFilters.selectedCompany));
        break;
      case 'selectedExperience':
        dispatch(setSelectedExperience(pendingFilters.selectedExperience));
        break;
      case 'selectedLocation':
        dispatch(setSelectedLocation(pendingFilters.selectedLocation));
        break;
      case 'selectedType':
        dispatch(setSelectedType(pendingFilters.selectedType));
        break;
      case 'selectedSalary':
        dispatch(setSelectedSalary(pendingFilters.selectedSalary));
        break;
      default:
        console.warn('Unknown filter type:', filterType);
    }
    
    dispatch(setCurrentPage(1));
    showToast(`${filterType.replace('selected', '')} filter applied!`);
  }, [dispatch, pendingFilters, showToast]);

  const handleDropdownClear = useCallback((filterType) => {
    console.log('Clearing single filter:', filterType);
    
    setPendingFilters(prev => ({
      ...prev,
      [filterType]: []
    }));
    
    switch (filterType) {
      case 'selectedCategory':
        dispatch(setSelectedCategory([]));
        break;
      case 'selectedCompany':
        dispatch(setSelectedCompany([]));
        break;
      case 'selectedExperience':
        dispatch(setSelectedExperience([]));
        break;
      case 'selectedLocation':
        dispatch(setSelectedLocation([]));
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
    
    showToast(`${filterType.replace('selected', '')} filter cleared!`);
  }, [dispatch, showToast]);

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

  // Optimized save job handler for cards
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
   const handleSearchTermMapping = useCallback((searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return;
  
  const term = searchTerm.toLowerCase().trim();
  
  // Map search terms to category filters
  const matchingCategories = categories.filter(category => {
    const categoryName = category.name.toLowerCase();
    // Check for exact matches and partial matches
    return categoryName.includes(term) || 
           term.includes(categoryName.toLowerCase()) ||
           categoryName.split(' ').some(word => term.includes(word) || word.includes(term));
  }).map(cat => cat.id);
  
  // Apply matching category filters if found
  if (matchingCategories.length > 0) {
    const currentCategories = filters.selectedCategory || [];
    const newCategories = [...new Set([...currentCategories, ...matchingCategories])];
    
    // Only update if there are actually new categories to add
    if (newCategories.length > currentCategories.length) {
      setPendingFilters(prev => ({
        ...prev,
        selectedCategory: newCategories
      }));
      dispatch(setSelectedCategory(newCategories));
    }
  }
}, [categories, filters.selectedCategory, dispatch]);

// 5. ADD this useEffect to monitor search changes:

// Add this useEffect in your JobList component:
useEffect(() => {
  // Only trigger search mapping if we have a search query and initial load is complete
  if (filters.searchQuery && initialLoadComplete && categories.length > 0) {
    handleSearchTermMapping(filters.searchQuery);
  }
}, [filters.searchQuery, handleSearchTermMapping, initialLoadComplete, categories.length]);

  // Early returns for loading states
  if (!initialLoadComplete) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (loading && (!isMobile || infiniteScroll.allJobs.length === 0)) {
    return <div className="loading">Loading jobs...</div>;
  }
  
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job-list-container">
      {/* Mobile Filter toggle button */}
      {isMobile && (
        <button className="filter-toggle" onClick={toggleSidebar}>
          <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-sliders'}`}></i>
          <p>{isSidebarOpen ? 'Close' : 'Filters'}</p>
          {hasUnappliedFilters && !isSidebarOpen && <span className="filter-badge">!</span>}
        </button>
      )}

      {/* FIXED: Desktop horizontal filters with proper category/company name display */}
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

            {/* <FilterDropdown
              id="selectedCategory"
              icon="industry"
              title="Industries"
              options={categoryOptionsForDropdown}
              selectedValues={pendingFilters.selectedCategory}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedCategory')}
              onClear={() => handleDropdownClear('selectedCategory')}
            /> */}
            <FilterDropdown
            id="selectedCategory"
            icon="industry"
            title="Industries"
            options={categoryOptionsForDropdown}
            selectedValues={pendingFilters.selectedCategory}
            onFilterChange={handlePendingFilterChange}
            onApply={() => handleDropdownApply('selectedCategory')}
            onClear={() => handleDropdownClear('selectedCategory')}
            categories={categories}  // ADD THIS
            companies={companies}    // ADD THIS
          />

{/* // Also update the Company FilterDropdown: */}


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

            {/* <FilterDropdown
              id="selectedCompany"
              icon="building"
              title="Company"
              options={companyOptionsForDropdown}
              selectedValues={pendingFilters.selectedCompany}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedCompany')}
              onClear={() => handleDropdownClear('selectedCompany')}
            /> */}
            <FilterDropdown
              id="selectedCompany"
              icon="building"
              title="Company"
              options={companyOptionsForDropdown}
              selectedValues={pendingFilters.selectedCompany}
              onFilterChange={handlePendingFilterChange}
              onApply={() => handleDropdownApply('selectedCompany')}
              onClear={() => handleDropdownClear('selectedCompany')}
              categories={categories}  // ADD THIS
              companies={companies}    // ADD THIS
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

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        {/* Mobile Sidebar - Only show on mobile */}
        {isMobile && (
          <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            {/* Header for mobile */}
            <div className="sidebar-header">
              <h3><i className="fa fa-sliders"></i> Filters</h3>
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

              {/* FIXED: Mobile sidebar filters with proper name display */}
              <div className="FilterGroup">
                <h4>Category</h4>
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

              <div className="FilterGroup">
                <h4>Company</h4>
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

              <div className="FilterGroup">
                <h4>Experience</h4>
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

              <div className="FilterGroup">
                <h4>Location</h4>
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

              <div className="FilterGroup">
                <h4>Type</h4>
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
          </div>
        )}

        <div className="jobs-content">
          {/* Mobile job count info */}
          {isMobile && (
            <div className="mobile-job-info">
              <span>Showing {displayJobs.length} jobs</span>
              {pagination.totalJobs > 0 && (
                <span> of {pagination.totalJobs} total</span>
              )}
            </div>
          )}

          <div className="jobs-grid">
            {displayJobs.length === 0 ? (
              <div className="no-jobs">
                {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
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

          {/* Mobile Infinite Scroll Loader */}
          {isMobile && (
            <MobileInfiniteScroll
              jobs={displayJobs}
              hasMore={infiniteScroll.hasMore}
              loadMore={handleLoadMore}
              loading={infiniteScroll.isLoading}
            />
          )}

          {/* Pagination - Bottom (Desktop only) */}
          <Pagination
            pagination={pagination}
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
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;