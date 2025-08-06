
// // export default JobList;
// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useDataLoader } from '../hooks/useDataLoader';

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
// } from '../redux/store';
// import './JobList.css';
// import { saveJob } from '../redux/savedJobsSlice';
// import { useLocation } from 'react-router-dom';

// // Pagination Component
// const Pagination = ({ pagination, onPageChange, onJobsPerPageChange }) => {
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

//   const getPageNumbers = () => {
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
//   };

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
//           {getPageNumbers().map((page, index) => (
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
// };

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters, pagination } = useSelector((state) => state.jobs);
//   const { loadJobs, loadAllData } = useDataLoader();
//   const [toast, setToast] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
//   const [locationSearchInput, setLocationSearchInput] = useState('');
//   const [searchInput, setSearchInput] = useState('');

//   // Debounce search input
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (searchInput !== filters.searchQuery) {
//         dispatch(setSearchQuery(searchInput));
//       }
//     }, 500); // 500ms delay

//     return () => clearTimeout(debounceTimer);
//   }, [searchInput, filters.searchQuery, dispatch]);

//   const showToast = useCallback((message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   }, []);

//   // Update local state when Redux filters change
//   useEffect(() => {
//     if (filters.selectedLocation?.length > 0) {
//       setLocationSearchInput(filters.selectedLocation[0]);
//     }
//     setSearchInput(filters.searchQuery || '');
//   }, [filters.selectedLocation, filters.searchQuery]);

//   // Sidebar management effects
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     if (isSidebarOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768 && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isSidebarOpen]);

//   // Load initial data
//   useEffect(() => {
//     loadAllData();
//   }, [loadAllData]);

//   // Reload jobs when filters or pagination change
//   useEffect(() => {
//     loadJobs();
//   }, [loadJobs]);

//   // Scroll to top when page changes
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [pagination.currentPage]);

//   const handlePageChange = useCallback((newPage) => {
//     dispatch(setCurrentPage(newPage));
//   }, [dispatch]);

//   const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
//     dispatch(setJobsPerPage(newJobsPerPage));
//   }, [dispatch]);

//   // Memoized salary formatter
//   const formatSalary = useCallback((salary) => {
//     if (!salary?.min || !salary?.max) return 'Salary not specified';
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//   }, []);

//   const handleClearFilters = useCallback(() => {
//     dispatch(clearFilters());
//     setLocationSearchInput('');
//     setSearchInput('');
//   }, [dispatch]);

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarOpen(prev => !prev);
//   }, []);

//   if (loading) return <div className="loading">Loading jobs...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   // Static filter options
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

//   return (
//     <div className="job-list-container">
//       {/* Mobile filter toggle button */}
//       <button className="filter-toggle" onClick={toggleSidebar}>
//         <i className="fa fa-filter"></i> Filters
//       </button>

//       {/* Sidebar overlay for mobile */}
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

//       <div className="job-list-layout">
//         <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="filters-section">
//             <div className="filter-group">
//               <h4>Category</h4>
//               {categories.map((category) => (
//                 <label key={category.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCategory?.includes(category.id)}
//                     onChange={() => {
//                       const current = filters.selectedCategory || [];
//                       const updated = current.includes(category.id)
//                         ? current.filter((id) => id !== category.id)
//                         : [...current, category.id];
//                       dispatch(setSelectedCategory(updated));
//                     }}
//                   />
//                   {category.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Company</h4>
//               {companies.map((company) => (
//                 <label key={company.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCompany?.includes(company.id)}
//                     onChange={() => {
//                       const current = filters.selectedCompany || [];
//                       const updated = current.includes(company.id)
//                         ? current.filter((id) => id !== company.id)
//                         : [...current, company.id];
//                       dispatch(setSelectedCompany(updated));
//                     }}
//                   />
//                   {company.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Experience</h4>
//               {experienceOptions.map((level) => (
//                 <label key={level} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedExperience?.includes(level)}
//                     onChange={() => {
//                       const current = filters.selectedExperience || [];
//                       const updated = current.includes(level)
//                         ? current.filter((e) => e !== level)
//                         : [...current, level];
//                       dispatch(setSelectedExperience(updated));
//                     }}
//                   />
//                   {level}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Location</h4>
//               {locationOptions.map((location) => (
//                 <label key={location} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedLocation?.includes(location)}
//                     onChange={() => {
//                       const current = filters.selectedLocation || [];
//                       const updated = current.includes(location)
//                         ? current.filter((l) => l !== location)
//                         : [...current, location];
//                       dispatch(setSelectedLocation(updated));
//                     }}
//                   />
//                   {location}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Type</h4>
//               {typeOptions.map((type) => (
//                 <label key={type} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedType?.includes(type)}
//                     onChange={() => {
//                       const current = filters.selectedType || [];
//                       const updated = current.includes(type)
//                         ? current.filter((t) => t !== type)
//                         : [...current, type];
//                       dispatch(setSelectedType(updated));
//                     }}
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Salary Range</h4>
//               {salaryRangeOptions.map((range) => (
//                 <label key={range} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedSalary?.includes(range)}
//                     onChange={() => {
//                       const current = filters.selectedSalary || [];
//                       const updated = current.includes(range)
//                         ? current.filter((r) => r !== range)
//                         : [...current, range];
//                       dispatch(setSelectedSalary(updated));
//                     }}
//                   />
//                   {range}
//                 </label>
//               ))}
//             </div>

//             <button onClick={handleClearFilters} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           {/* Search Bar in JobList */}
//           {isJobPage && (
//             <div className="search-bar sticky-search-bar">
//               <div className="search-field">
//                 <span className="icon"><i className="fa fa-search"></i></span>
//                 <input
//                   type="text"
//                   placeholder="Enter skills / designations / companies"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       dispatch(setSearchQuery(searchInput));
//                     }
//                   }}
//                 />
//               </div>
//               <div className="divider" />
//               <select
//                 className="experience-dropdown"
//                 value=""
//                 onChange={(e) => {
//                   const selectedExp = e.target.value;
//                   if (selectedExp) {
//                     const current = filters.selectedExperience || [];
//                     const updated = current.includes(selectedExp)
//                       ? current.filter((exp) => exp !== selectedExp)
//                       : [...current, selectedExp];
//                     dispatch(setSelectedExperience(updated));
//                   }
//                 }}
//               >
//                 <option value="">Select experience</option>
//                 {experienceOptions.map((exp) => (
//                   <option key={exp} value={exp}>{exp}</option>
//                 ))}
//               </select>
//               <div className="divider" />
//               <input
//                 type="text"
//                 className="location-input"
//                 placeholder="Enter location"
//                 value={locationSearchInput}
//                 onChange={(e) => {
//                   const locationValue = e.target.value;
//                   setLocationSearchInput(locationValue);
                  
//                   if (locationValue.trim()) {
//                     dispatch(setSelectedLocation([locationValue.trim()]));
//                   } else {
//                     dispatch(setSelectedLocation([]));
//                   }
//                 }}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     const locationValue = e.target.value.trim();
//                     if (locationValue) {
//                       dispatch(setSelectedLocation([locationValue]));
//                     }
//                   }
//                 }}
//               />
//               <button className="search-btn" onClick={() => {
//                 dispatch(setSearchQuery(searchInput.trim()));
//               }}>
//                 Search
//               </button>
//             </div>
//           )}

//           {/* Pagination - Top */}
//           {pagination.totalJobs > 0 && (
//             <Pagination
//               pagination={pagination}
//               onPageChange={handlePageChange}
//               onJobsPerPageChange={handleJobsPerPageChange}
//             />
//           )}

//           <div className="jobs-grid">
//             {jobs.length === 0 ? (
//               <div className="no-jobs">
//                 {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
//               </div>
//             ) : (
//               jobs.map((job) => (
//                 <div key={job.id} className="job-card">
//                   <div className="job-header">
//                     <h2 className="job-title">{job.title || 'No Title'}</h2>
//                     <div className="job-meta">
//                       <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
//                       <span className="job-location">{job.location || 'Location not specified'}</span>
//                     </div>
//                   </div>

//                   <div className="job-details">
//                     <div className="job-category">
//                       <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
//                     </div>

//                     <div className="job-info">
//                       <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
//                       <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
//                       <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
//                     </div>

//                     <div className="job-description">
//                       <p>{job.description || 'No description available'}</p>
//                     </div>

//                     {job.requirements?.length > 0 && (
//                       <div className="job-requirements">
//                         <h4>Requirements:</h4>
//                         <ul>
//                           {job.requirements.map((req, index) => (
//                             <li key={index}>{req}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     <div className="job-footer">
//                       <span className="posted-date">
//                         Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
//                       </span>
//                       <div className="job-actions">
//                         {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
//                           <a href={job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link} target="_blank" rel="noopener noreferrer">
//                             <button className="apply-btn">Apply Now</button>
//                           </a>
//                         ) : (
//                           <button 
//                             className="apply-btn disabled"
//                             onClick={() => showToast("Application link not available for this job")}
//                             title="Application link not available"
//                           >
//                             Apply
//                           </button>
//                         )}
//                         <button
//                           onClick={() => {
//                             dispatch(saveJob(job));
//                             showToast("Job saved successfully!");
//                             if (window.innerWidth <= 768) {
//                               setIsSidebarOpen(false);
//                             }
//                           }}
//                           className="save-btn"
//                         >
//                           Save Job
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Pagination - Bottom */}
//           {pagination.totalJobs > 0 && (
//             <Pagination
//               pagination={pagination}
//               onPageChange={handlePageChange}
//               onJobsPerPageChange={handleJobsPerPageChange}
//             />
//           )}
//         </div>
//       </div>
      
//       {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
// import { useEffect, useState, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useDataLoader } from '../hooks/useDataLoader';
// import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

// import {
//   setSelectedCategory,
//   setSelectedCompany,
//   setSearchQuery,
//   setSelectedExperience,
//   setSelectedLocation,
//   setSelectedType,
//   setSelectedSalary,
//   setJobsPerPage,
//   clearFilters,
//   resetJobs
// } from '../redux/store';
// import './JobList.css';
// import { saveJob } from '../redux/savedJobsSlice';
// import { useLocation } from 'react-router-dom';

// // Loading Spinner Component
// const LoadingSpinner = ({ isLoadingMore = false }) => (
//   <div className={`loading-spinner ${isLoadingMore ? 'loading-more' : 'loading-initial'}`}>
//     <div className="spinner"></div>
//     <span>{isLoadingMore ? 'Loading more jobs...' : 'Loading jobs...'}</span>
//   </div>
// );

// // Job Stats Component
// const JobStats = ({ pagination, infiniteScroll }) => {
//   const currentJobCount = pagination.endIndex || 0;
//   const totalJobs = pagination.totalJobs || 0;
  
//   return (
//     <div className="job-stats">
//       <div className="stats-info">
//         Showing {currentJobCount} of {totalJobs} jobs
//         {infiniteScroll.hasMore && (
//           <span className="more-available"> • Scroll for more</span>
//         )}
//       </div>
//       <div className="jobs-per-page-selector">
//         <label>
//           Jobs per load:
//           <select
//             value={pagination.jobsPerPage}
//             onChange={(e) => {
//               // This will be handled by the parent component
//             }}
//             className="jobs-per-page-select"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={30}>30</option>
//             <option value={50}>50</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// };

// // Infinite Scroll Sentinel Component
// const InfiniteScrollSentinel = ({ sentinelRef, hasMore, isLoading, loadingMore }) => {
//   if (!hasMore) {
//     return (
//       <div className="end-of-results">
//         <div className="end-message">
//           <i className="fa fa-check-circle"></i>
//           <span>You've reached the end of all available jobs</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div ref={sentinelRef} className="infinite-scroll-sentinel">
//       {(isLoading || loadingMore) && <LoadingSpinner isLoadingMore={loadingMore} />}
//     </div>
//   );
// };

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { 
//     jobs, 
//     categories, 
//     companies, 
//     loading, 
//     loadingMore, 
//     error, 
//     filters, 
//     pagination, 
//     infiniteScroll 
//   } = useSelector((state) => state.jobs);
  
//   const { loadMoreJobs, loadAllData, loadInitialJobs } = useDataLoader();
//   const [toast, setToast] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
//   const [locationSearchInput, setLocationSearchInput] = useState('');
//   const [searchInput, setSearchInput] = useState('');

//   // Infinite scroll hook
//   const { sentinelRef } = useInfiniteScroll(
//     loadMoreJobs,
//     infiniteScroll.hasMore,
//     loading || loadingMore
//   );

//   // Debounce search input
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (searchInput !== filters.searchQuery) {
//         dispatch(setSearchQuery(searchInput));
//       }
//     }, 500);

//     return () => clearTimeout(debounceTimer);
//   }, [searchInput, filters.searchQuery, dispatch]);

//   const showToast = useCallback((message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   }, []);

//   // Update local state when Redux filters change
//   useEffect(() => {
//     if (filters.selectedLocation?.length > 0) {
//       setLocationSearchInput(filters.selectedLocation[0]);
//     }
//     setSearchInput(filters.searchQuery || '');
//   }, [filters.selectedLocation, filters.searchQuery]);

//   // Sidebar management effects
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     if (isSidebarOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768 && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isSidebarOpen]);

//   // Load initial data
//   useEffect(() => {
//     loadAllData();
//   }, [loadAllData]);

//   // Reload jobs when filters change (but not on initial load)
//   useEffect(() => {
//     if (!infiniteScroll.isInitialLoad) {
//       loadInitialJobs();
//     }
//   }, [
//     filters.selectedCategory,
//     filters.selectedCompany,
//     filters.searchQuery,
//     filters.selectedExperience,
//     filters.selectedLocation,
//     filters.selectedType,
//     filters.selectedSalary,
//     loadInitialJobs
//   ]);

//   // Handle jobs per page change
//   const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
//     dispatch(setJobsPerPage(newJobsPerPage));
//     // This will trigger a reload via the useEffect above
//   }, [dispatch]);

//   // Memoized salary formatter
//   const formatSalary = useCallback((salary) => {
//     if (!salary?.min || !salary?.max) return 'Salary not specified';
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//   }, []);

//   const handleClearFilters = useCallback(() => {
//     dispatch(clearFilters());
//     setLocationSearchInput('');
//     setSearchInput('');
//   }, [dispatch]);

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarOpen(prev => !prev);
//   }, []);

//   // Back to top functionality
//   const scrollToTop = useCallback(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   if (loading && jobs.length === 0) {
//     return <div className="loading-container"><LoadingSpinner /></div>;
//   }

//   if (error && jobs.length === 0) {
//     return (
//       <div className="error-container">
//         <div className="error-message">
//           <i className="fa fa-exclamation-triangle"></i>
//           <h3>Oops! Something went wrong</h3>
//           <p>{error}</p>
//           <button onClick={() => loadInitialJobs()} className="retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Static filter options
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

//   return (
//     <div className="job-list-container">
//       {/* Back to top button */}
//       <button 
//         className="back-to-top-btn"
//         onClick={scrollToTop}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           zIndex: 1000,
//           display: jobs.length > 10 ? 'block' : 'none'
//         }}
//       >
//         <i className="fa fa-arrow-up"></i>
//       </button>

//       {/* Mobile filter toggle button */}
//       <button className="filter-toggle" onClick={toggleSidebar}>
//         <i className="fa fa-filter"></i> Filters
//       </button>

//       {/* Sidebar overlay for mobile */}
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

//       <div className="job-list-layout">
//         <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="filters-section">
//             <div className="filter-group">
//               <h4>Category</h4>
//               {categories.map((category) => (
//                 <label key={category.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCategory?.includes(category.id)}
//                     onChange={() => {
//                       const current = filters.selectedCategory || [];
//                       const updated = current.includes(category.id)
//                         ? current.filter((id) => id !== category.id)
//                         : [...current, category.id];
//                       dispatch(setSelectedCategory(updated));
//                     }}
//                   />
//                   {category.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Company</h4>
//               {companies.map((company) => (
//                 <label key={company.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCompany?.includes(company.id)}
//                     onChange={() => {
//                       const current = filters.selectedCompany || [];
//                       const updated = current.includes(company.id)
//                         ? current.filter((id) => id !== company.id)
//                         : [...current, company.id];
//                       dispatch(setSelectedCompany(updated));
//                     }}
//                   />
//                   {company.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Experience</h4>
//               {experienceOptions.map((level) => (
//                 <label key={level} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedExperience?.includes(level)}
//                     onChange={() => {
//                       const current = filters.selectedExperience || [];
//                       const updated = current.includes(level)
//                         ? current.filter((e) => e !== level)
//                         : [...current, level];
//                       dispatch(setSelectedExperience(updated));
//                     }}
//                   />
//                   {level}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Location</h4>
//               {locationOptions.map((location) => (
//                 <label key={location} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedLocation?.includes(location)}
//                     onChange={() => {
//                       const current = filters.selectedLocation || [];
//                       const updated = current.includes(location)
//                         ? current.filter((l) => l !== location)
//                         : [...current, location];
//                       dispatch(setSelectedLocation(updated));
//                     }}
//                   />
//                   {location}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Type</h4>
//               {typeOptions.map((type) => (
//                 <label key={type} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedType?.includes(type)}
//                     onChange={() => {
//                       const current = filters.selectedType || [];
//                       const updated = current.includes(type)
//                         ? current.filter((t) => t !== type)
//                         : [...current, type];
//                       dispatch(setSelectedType(updated));
//                     }}
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Salary Range</h4>
//               {salaryRangeOptions.map((range) => (
//                 <label key={range} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedSalary?.includes(range)}
//                     onChange={() => {
//                       const current = filters.selectedSalary || [];
//                       const updated = current.includes(range)
//                         ? current.filter((r) => r !== range)
//                         : [...current, range];
//                       dispatch(setSelectedSalary(updated));
//                     }}
//                   />
//                   {range}
//                 </label>
//               ))}
//             </div>

//             <button onClick={handleClearFilters} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           {/* Search Bar in JobList */}
//           {isJobPage && (
//             <div className="search-bar sticky-search-bar">
//               <div className="search-field">
//                 <span className="icon"><i className="fa fa-search"></i></span>
//                 <input
//                   type="text"
//                   placeholder="Enter skills / designations / companies"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       dispatch(setSearchQuery(searchInput));
//                     }
//                   }}
//                 />
//               </div>
//               <div className="divider" />
//               <select
//                 className="experience-dropdown"
//                 value=""
//                 onChange={(e) => {
//                   const selectedExp = e.target.value;
//                   if (selectedExp) {
//                     const current = filters.selectedExperience || [];
//                     const updated = current.includes(selectedExp)
//                       ? current.filter((exp) => exp !== selectedExp)
//                       : [...current, selectedExp];
//                     dispatch(setSelectedExperience(updated));
//                   }
//                 }}
//               >
//                 <option value="">Select experience</option>
//                 {experienceOptions.map((exp) => (
//                   <option key={exp} value={exp}>{exp}</option>
//                 ))}
//               </select>
//               <div className="divider" />
//               <input
//                 type="text"
//                 className="location-input"
//                 placeholder="Enter location"
//                 value={locationSearchInput}
//                 onChange={(e) => {
//                   const locationValue = e.target.value;
//                   setLocationSearchInput(locationValue);
                  
//                   if (locationValue.trim()) {
//                     dispatch(setSelectedLocation([locationValue.trim()]));
//                   } else {
//                     dispatch(setSelectedLocation([]));
//                   }
//                 }}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     const locationValue = e.target.value.trim();
//                     if (locationValue) {
//                       dispatch(setSelectedLocation([locationValue]));
//                     }
//                   }
//                 }}
//               />
//               <button className="search-btn" onClick={() => {
//                 dispatch(setSearchQuery(searchInput.trim()));
//               }}>
//                 Search
//               </button>
//             </div>
//           )}

//           {/* Job Stats */}
//           <JobStats 
//             pagination={pagination}
//             infiniteScroll={infiniteScroll}
//             onJobsPerPageChange={handleJobsPerPageChange}
//           />

//           {/* Jobs Grid */}
//           <div className="jobs-grid">
//             {jobs.length === 0 && !loading ? (
//               <div className="no-jobs">
//                 <div className="no-jobs-message">
//                   <i className="fa fa-search"></i>
//                   <h3>No jobs found</h3>
//                   <p>Try adjusting your search criteria or filters</p>
//                   <button onClick={handleClearFilters} className="clear-filters-btn">
//                     Clear All Filters
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {jobs.map((job, index) => (
//                   <div key={`${job.id}-${index}`} className="job-card">
//                     <div className="job-header">
//                       <h2 className="job-title">{job.title || 'No Title'}</h2>
//                       <div className="job-meta">
//                         <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
//                         <span className="job-location">{job.location || 'Location not specified'}</span>
//                       </div>
//                     </div>

//                     <div className="job-details">
//                       <div className="job-category">
//                         <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
//                       </div>

//                       <div className="job-info">
//                         <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
//                         <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
//                         <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
//                       </div>

//                       <div className="job-description">
//                         <p>{job.description || 'No description available'}</p>
//                       </div>

//                       {job.requirements?.length > 0 && (
//                         <div className="job-requirements">
//                           <h4>Requirements:</h4>
//                           <ul>
//                             {job.requirements.map((req, reqIndex) => (
//                               <li key={reqIndex}>{req}</li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       <div className="job-footer">
//                         <span className="posted-date">
//                           Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
//                         </span>
//                         <div className="job-actions">
//                           {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
//                             <a href={job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link} target="_blank" rel="noopener noreferrer">
//                               <button className="apply-btn">Apply Now</button>
//                             </a>
//                           ) : (
//                             <button 
//                               className="apply-btn disabled"
//                               onClick={() => showToast("Application link not available for this job")}
//                               title="Application link not available"
//                             >
//                               Apply
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               dispatch(saveJob(job));
//                               showToast("Job saved successfully!");
//                               if (window.innerWidth <= 768) {
//                                 setIsSidebarOpen(false);
//                               }
//                             }}
//                             className="save-btn"
//                           >
//                             Save Job
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {/* Infinite Scroll Sentinel */}
//                 <InfiniteScrollSentinel
//                   sentinelRef={sentinelRef}
//                   hasMore={infiniteScroll.hasMore}
//                   isLoading={loading}
//                   loadingMore={loadingMore}
//                 />
//               </>
//             )}
//           </div>

//           {/* Error Message */}
//           {error && jobs.length > 0 && (
//             <div className="load-more-error">
//               <p>Failed to load more jobs: {error}</p>
//               <button onClick={loadMoreJobs} className="retry-btn">
//                 Try Again
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useDataLoader } from '../hooks/useDataLoader';
// import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

// import {
//   setSelectedCategory,
//   setSelectedCompany,
//   setSearchQuery,
//   setSelectedExperience,
//   setSelectedLocation,
//   setSelectedType,
//   setSelectedSalary,
//   setJobsPerPage, // Make sure this is imported
//   clearFilters,
//   resetJobs // Make sure this is imported
// } from '../redux/store';
// import './JobList.css';
// import { saveJob } from '../redux/savedJobsSlice';
// import { useLocation } from 'react-router-dom';

// // Loading Spinner Component
// const LoadingSpinner = ({ isLoadingMore = false }) => (
//   <div className={`loading-spinner ${isLoadingMore ? 'loading-more' : 'loading-initial'}`}>
//     <div className="spinner"></div>
//     <span>{isLoadingMore ? 'Loading more jobs...' : 'Loading jobs...'}</span>
//   </div>
// );

// // Job Stats Component
// // CORRECTED: Added onJobsPerPageChange prop and used it in onChange
// const JobStats = ({ pagination, infiniteScroll, onJobsPerPageChange }) => {
//   const currentJobCount = pagination.endIndex || 0;
//   const totalJobs = pagination.totalJobs || 0;
  
//   return (
//     <div className="job-stats">
//       <div className="stats-info">
//         Showing {currentJobCount} of {totalJobs} jobs
//         {infiniteScroll.hasMore && (
//           <span className="more-available"> • Scroll for more</span>
//         )}
//       </div>
//       <div className="jobs-per-page-selector">
//         <label>
//           Jobs per load:
//           <select
//             value={pagination.jobsPerPage}
//             onChange={onJobsPerPageChange} // CORRECTED: Now uses the passed handler
//             className="jobs-per-page-select"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={30}>30</option>
//             <option value={50}>50</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// };

// // Infinite Scroll Sentinel Component
// const InfiniteScrollSentinel = ({ sentinelRef, hasMore, isLoading, loadingMore }) => {
//   if (!hasMore) {
//     return (
//       <div className="end-of-results">
//         <div className="end-message">
//           <i className="fa fa-check-circle"></i>
//           <span>You've reached the end of all available jobs</span>
//         </div>
//       </div>
//     );
//   }

//   // Show spinner if either initial loading or loading more is active
//   if (isLoading || loadingMore) {
//     return (
//       <div ref={sentinelRef} className="infinite-scroll-sentinel">
//         <LoadingSpinner isLoadingMore={loadingMore} />
//       </div>
//     );
//   }

//   // If there's more data but not currently loading, the sentinel is just a trigger point
//   return <div ref={sentinelRef} className="infinite-scroll-sentinel"></div>;
// };

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { 
//     jobs, 
//     categories, 
//     companies, 
//     loading, 
//     loadingMore, 
//     error, 
//     filters, 
//     pagination, 
//     infiniteScroll 
//   } = useSelector((state) => state.jobs);
  
//   const { loadMoreJobs, loadAllData, loadInitialJobs } = useDataLoader();
//   const [toast, setToast] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
//   const [locationSearchInput, setLocationSearchInput] = useState('');
//   const [searchInput, setSearchInput] = useState('');

//   // Use a ref to track if it's the very first render, more reliable than state for this
//   const isInitialRender = useRef(true); // CORRECTED: Changed from useState to useRef

//   // Infinite scroll hook
//   const { sentinelRef } = useInfiniteScroll(
//     loadMoreJobs,
//     infiniteScroll.hasMore,
//     loading || loadingMore
//   );

//   // Debounce search input
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (searchInput !== filters.searchQuery) {
//         dispatch(setSearchQuery(searchInput));
//       }
//     }, 500);

//     return () => clearTimeout(debounceTimer);
//   }, [searchInput, filters.searchQuery, dispatch]);

//   const showToast = useCallback((message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   }, []);

//   // Update local state when Redux filters change (e.g., after clearFilters)
//   useEffect(() => {
//     if (filters.selectedLocation?.length > 0) {
//       setLocationSearchInput(filters.selectedLocation[0]);
//     } else {
//       setLocationSearchInput(''); // Clear if no location filter
//     }
//     setSearchInput(filters.searchQuery || '');
//   }, [filters.selectedLocation, filters.searchQuery]);

//   // Sidebar management effects
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
//         setIsSidebarOpen(false);
//       }
//     };

//     if (isSidebarOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768 && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isSidebarOpen]);

//   // Effect for initial data loading (runs only once on mount)
//   useEffect(() => {
//     console.log("JobList: Initial mount - calling loadAllData");
//     loadAllData(); // This calls loadInitialJobs internally
//     isInitialRender.current = false; // Mark that initial render is done after the first render cycle
//   }, [loadAllData]); // Dependency array ensures it runs once on mount

//   // Effect for re-loading jobs when filters or pagination.jobsPerPage change
//   // This should trigger a NEW search/filter, clearing previous results.
//   useEffect(() => {
//     // Prevent this from running on the very first render cycle
//     if (isInitialRender.current) {
//       return;
//     }

//     // This useEffect will now trigger whenever any filter or jobsPerPage changes.
//     // Since `loadInitialJobs` already dispatches `resetJobs` (which clears `jobs` and sets `isInitialLoad` to true),
//     // this will correctly initiate a fresh fetch.
//     console.log("JobList: Filters or jobsPerPage changed, triggering loadInitialJobs.");
//     loadInitialJobs();

//   }, [
//     filters.selectedCategory,
//     filters.selectedCompany,
//     filters.searchQuery,
//     filters.selectedExperience,
//     filters.selectedLocation,
//     filters.selectedType,
//     filters.selectedSalary,
//     pagination.jobsPerPage, // Add jobsPerPage here as it also triggers a reset
//     loadInitialJobs // Dependency for useCallback stability
//   ]);

//   // Handle jobs per page change
//   const handleJobsPerPageChange = useCallback((e) => {
//     const newJobsPerPage = parseInt(e.target.value);
//     if (newJobsPerPage !== pagination.jobsPerPage) { // Prevent unnecessary dispatch if value is same
//       dispatch(setJobsPerPage(newJobsPerPage));
//       // The useEffect above will now correctly trigger loadInitialJobs
//     }
//   }, [dispatch, pagination.jobsPerPage]);

//   // Memoized salary formatter
//   const formatSalary = useCallback((salary) => {
//     if (!salary?.min && !salary?.max) return 'Salary not specified'; // Handle cases where both are null/undefined
    
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });

//     if (salary.min && salary.max) {
//       return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//     } else if (salary.min) {
//       return `From ${formatter.format(salary.min)}`;
//     } else if (salary.max) {
//       return `Up to ${formatter.format(salary.max)}`;
//     }
//     return 'Salary not specified';
//   }, []);

//   const handleClearFilters = useCallback(() => {
//     dispatch(clearFilters());
//     setLocationSearchInput('');
//     setSearchInput('');
//   }, [dispatch]);

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarOpen(prev => !prev);
//   }, []);

//   // Back to top functionality
//   const scrollToTop = useCallback(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   // Conditional rendering for initial full-page loading state
//   // Only show this if it's the very first load AND no jobs are present yet.
//   if (loading && jobs.length === 0 && isInitialRender.current) {
//     return <div className="loading-container"><LoadingSpinner /></div>;
//   }

//   // Conditional rendering for initial full-page error state
//   // Only show this if it's the very first load AND no jobs are present yet.
//   if (error && jobs.length === 0 && isInitialRender.current) {
//     return (
//       <div className="error-container">
//         <div className="error-message">
//           <i className="fa fa-exclamation-triangle"></i>
//           <h3>Oops! Something went wrong</h3>
//           <p>{error}</p>
//           <button onClick={() => loadInitialJobs()} className="retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Static filter options
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

//   return (
//     <div className="job-list-container">
//       {/* Back to top button */}
//       <button 
//         className="back-to-top-btn"
//         onClick={scrollToTop}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           zIndex: 1000,
//           display: jobs.length > 10 ? 'block' : 'none'
//         }}
//       >
//         <i className="fa fa-arrow-up"></i>
//       </button>

//       {/* Mobile filter toggle button */}
//       <button className="filter-toggle" onClick={toggleSidebar}>
//         <i className="fa fa-filter"></i> Filters
//       </button>

//       {/* Sidebar overlay for mobile */}
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

//       <div className="job-list-layout">
//         <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="filters-section">
//             <div className="filter-group">
//               <h4>Category</h4>
//               {categories.map((category) => (
//                 <label key={category.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCategory?.includes(category.id)}
//                     onChange={() => {
//                       const current = filters.selectedCategory || [];
//                       const updated = current.includes(category.id)
//                         ? current.filter((id) => id !== category.id)
//                         : [...current, category.id];
//                       dispatch(setSelectedCategory(updated));
//                     }}
//                   />
//                   {category.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Company</h4>
//               {companies.map((company) => (
//                 <label key={company.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedCompany?.includes(company.id)}
//                     onChange={() => {
//                       const current = filters.selectedCompany || [];
//                       const updated = current.includes(company.id)
//                         ? current.filter((id) => id !== company.id)
//                         : [...current, company.id];
//                       dispatch(setSelectedCompany(updated));
//                     }}
//                   />
//                   {company.name}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Experience</h4>
//               {experienceOptions.map((level) => (
//                 <label key={level} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedExperience?.includes(level)}
//                     onChange={() => {
//                       const current = filters.selectedExperience || [];
//                       const updated = current.includes(level)
//                         ? current.filter((e) => e !== level)
//                         : [...current, level];
//                       dispatch(setSelectedExperience(updated));
//                     }}
//                   />
//                   {level}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Location</h4>
//               {locationOptions.map((location) => (
//                 <label key={location} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedLocation?.includes(location)}
//                     onChange={() => {
//                       const current = filters.selectedLocation || [];
//                       const updated = current.includes(location)
//                         ? current.filter((l) => l !== location)
//                         : [...current, location];
//                       dispatch(setSelectedLocation(updated));
//                     }}
//                   />
//                   {location}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Type</h4>
//               {typeOptions.map((type) => (
//                 <label key={type} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedType?.includes(type)}
//                     onChange={() => {
//                       const current = filters.selectedType || [];
//                       const updated = current.includes(type)
//                         ? current.filter((t) => t !== type)
//                         : [...current, type];
//                       dispatch(setSelectedType(updated));
//                     }}
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>

//             <div className="filter-group">
//               <h4>Salary Range</h4>
//               {salaryRangeOptions.map((range) => (
//                 <label key={range} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={filters.selectedSalary?.includes(range)}
//                     onChange={() => {
//                       const current = filters.selectedSalary || [];
//                       const updated = current.includes(range)
//                         ? current.filter((r) => r !== range)
//                         : [...current, range];
//                       dispatch(setSelectedSalary(updated));
//                     }}
//                   />
//                   {range}
//                 </label>
//               ))}
//             </div>

//             <button onClick={handleClearFilters} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           {/* Search Bar in JobList */}
//           {isJobPage && (
//             <div className="search-bar sticky-search-bar">
//               <div className="search-field">
//                 <span className="icon"><i className="fa fa-search"></i></span>
//                 <input
//                   type="text"
//                   placeholder="Enter skills / designations / companies"
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       dispatch(setSearchQuery(searchInput));
//                     }
//                   }}
//                 />
//               </div>
//               <div className="divider" />
//               <select
//                 className="experience-dropdown"
//                 value=""
//                 onChange={(e) => {
//                   const selectedExp = e.target.value;
//                   if (selectedExp) {
//                     const current = filters.selectedExperience || [];
//                     const updated = current.includes(selectedExp)
//                       ? current.filter((exp) => exp !== selectedExp)
//                       : [...current, selectedExp];
//                     dispatch(setSelectedExperience(updated));
//                   }
//                 }}
//               >
//                 <option value="">Select experience</option>
//                 {experienceOptions.map((exp) => (
//                   <option key={exp} value={exp}>{exp}</option>
//                 ))}
//               </select>
//               <div className="divider" />
//               <input
//                 type="text"
//                 className="location-input"
//                 placeholder="Enter location"
//                 value={locationSearchInput}
//                 onChange={(e) => {
//                   const locationValue = e.target.value;
//                   setLocationSearchInput(locationValue);
                  
//                   if (locationValue.trim()) {
//                     dispatch(setSelectedLocation([locationValue.trim()]));
//                   } else {
//                     dispatch(setSelectedLocation([]));
//                   }
//                 }}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     const locationValue = e.target.value.trim();
//                     if (locationValue) {
//                       dispatch(setSelectedLocation([locationValue]));
//                     }
//                   }
//                 }}
//               />
//               <button className="search-btn" onClick={() => {
//                 dispatch(setSearchQuery(searchInput.trim()));
//               }}>
//                 Search
//               </button>
//             </div>
//           )}

//           {/* Job Stats */}
//           <JobStats 
//             pagination={pagination}
//             infiniteScroll={infiniteScroll}
//             onJobsPerPageChange={handleJobsPerPageChange}
//           />

//           {/* Jobs Grid */}
//           <div className="jobs-grid">
//             {jobs.length === 0 && !loading ? (
//               <div className="no-jobs">
//                 <div className="no-jobs-message">
//                   <i className="fa fa-search"></i>
//                   <h3>No jobs found</h3>
//                   <p>Try adjusting your search criteria or filters</p>
//                   <button onClick={handleClearFilters} className="clear-filters-btn">
//                     Clear All Filters
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {jobs.map((job, index) => (
//                   <div key={`${job.id}-${index}`} className="job-card">
//                     <div className="job-header">
//                       <h2 className="job-title">{job.title || 'No Title'}</h2>
//                       <div className="job-meta">
//                         <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
//                         <span className="job-location">{job.location || 'Location not specified'}</span>
//                       </div>
//                     </div>

//                     <div className="job-details">
//                       <div className="job-category">
//                         <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
//                       </div>

//                       <div className="job-info">
//                         <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
//                         <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
//                         <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
//                       </div>

//                       <div className="job-description">
//                         <p>{job.description || 'No description available'}</p>
//                       </div>

//                       {job.requirements?.length > 0 && (
//                         <div className="job-requirements">
//                           <h4>Requirements:</h4>
//                           <ul>
//                             {job.requirements.map((req, reqIndex) => (
//                               <li key={reqIndex}>{req}</li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       <div className="job-footer">
//                         <span className="posted-date">
//                           Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
//                         </span>
//                         <div className="job-actions">
//                           {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
//                             <a href={job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link} target="_blank" rel="noopener noreferrer">
//                               <button className="apply-btn">Apply Now</button>
//                             </a>
//                           ) : (
//                             <button 
//                               className="apply-btn disabled"
//                               onClick={() => showToast("Application link not available for this job")}
//                               title="Application link not available"
//                             >
//                               Apply
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               dispatch(saveJob(job));
//                               showToast("Job saved successfully!");
//                               if (window.innerWidth <= 768) {
//                                 setIsSidebarOpen(false);
//                               }
//                             }}
//                             className="save-btn"
//                           >
//                             Save Job
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {/* Infinite Scroll Sentinel */}
//                 <InfiniteScrollSentinel
//                   sentinelRef={sentinelRef}
//                   hasMore={infiniteScroll.hasMore}
//                   isLoading={loading}
//                   loadingMore={loadingMore}
//                 />
//               </>
//             )}
//           </div>

//           {/* Error Message */}
//           {error && jobs.length > 0 && (
//             <div className="load-more-error">
//               <p>Failed to load more jobs: {error}</p>
//               <button onClick={loadMoreJobs} className="retry-btn">
//                 Try Again
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
 import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDataLoader } from '../hooks/useDataLoader';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import {
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  setJobsPerPage,
  clearFilters,
  resetJobs
} from '../redux/store';
import './JobList.css';
import { saveJob } from '../redux/savedJobsSlice';
import { useLocation } from 'react-router-dom';

// Loading Spinner Component
const LoadingSpinner = ({ isLoadingMore = false }) => (
  <div className={`loading-spinner ${isLoadingMore ? 'loading-more' : 'loading-initial'}`}>
    <div className="spinner"></div>
    <span>{isLoadingMore ? 'Loading more jobs...' : 'Loading jobs...'}</span>
  </div>
);

// Job Stats Component
const JobStats = ({ pagination, infiniteScroll, onJobsPerPageChange }) => {
  const currentJobCount = pagination.endIndex || 0;
  const totalJobs = pagination.totalJobs || 0;
  
  return (
    <div className="job-stats">
      <div className="stats-info">
        Showing {currentJobCount} of {totalJobs} jobs
        {infiniteScroll.hasMore && (
          <span className="more-available"> • Scroll for more</span>
        )}
      </div>
      <div className="jobs-per-page-selector">
        <label>
          Jobs per load:
          <select
            value={pagination.jobsPerPage}
            onChange={onJobsPerPageChange}
            className="jobs-per-page-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
};

// Infinite Scroll Sentinel Component
const InfiniteScrollSentinel = ({ sentinelRef, hasMore, isLoading, loadingMore }) => {
  console.log('🎯 Sentinel render:', { hasMore, isLoading, loadingMore });
  
  if (!hasMore) {
    return (
      <div className="end-of-results">
        <div className="end-message">
          <i className="fa fa-check-circle"></i>
          <span>You've reached the end of all available jobs</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sentinelRef} 
      className="infinite-scroll-sentinel"
      style={{
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        backgroundColor: 'rgba(150, 132, 192, 0.1)',
        borderRadius: '8px',
        border: '2px dashed #9684C0'
      }}
    >
      {(isLoading || loadingMore) ? (
        <LoadingSpinner isLoadingMore={loadingMore} />
      ) : (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '14px' 
        }}>
          <i className="fa fa-arrow-down" style={{ marginRight: '8px' }}></i>
          Scroll to load more jobs
        </div>
      )}
    </div>
  );
};

const JobList = () => {
  const dispatch = useDispatch();
  const { 
    jobs, 
    categories, 
    companies, 
    loading, 
    loadingMore, 
    error, 
    filters, 
    pagination, 
    infiniteScroll 
  } = useSelector((state) => state.jobs);
  
  const { loadMoreJobs, loadAllData, loadInitialJobs } = useDataLoader();
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Track if component has been initialized
  const isInitializedRef = useRef(false);
  const hasLoadedInitialDataRef = useRef(false);

  // Enhanced infinite scroll hook with logging
  const loadMoreJobsCallback = useCallback(async () => {
    console.log('🔄 loadMoreJobsCallback triggered');
    console.log('Current state:', {
      hasMore: infiniteScroll.hasMore,
      isInitialLoad: infiniteScroll.isInitialLoad,
      lastLoadedPage: infiniteScroll.lastLoadedPage,
      totalJobs: jobs.length
    });
    
    if (infiniteScroll.hasMore && !infiniteScroll.isInitialLoad) {
      await loadMoreJobs();
    } else {
      console.log('⏭️ Skipping loadMore - conditions not met');
    }
  }, [loadMoreJobs, infiniteScroll.hasMore, infiniteScroll.isInitialLoad]);

  // Use infinite scroll hook
  const { sentinelRef } = useInfiniteScroll(
    loadMoreJobsCallback,
    infiniteScroll.hasMore,
    loading || loadingMore
  );

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== filters.searchQuery) {
        dispatch(setSearchQuery(searchInput));
      }
    }, 500);

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
    } else {
      setLocationSearchInput('');
    }
    setSearchInput(filters.searchQuery || '');
  }, [filters.selectedLocation, filters.searchQuery]);

  // Sidebar management effects (unchanged)
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

  // FIXED: Initial data loading - only runs once on mount
  useEffect(() => {
    if (!hasLoadedInitialDataRef.current) {
      console.log("🚀 JobList: Initial mount - calling loadAllData");
      hasLoadedInitialDataRef.current = true;
      loadAllData();
    }
  }, []); // Empty dependency array - runs only once

  // FIXED: Re-loading jobs when filters change - only after initial load
  useEffect(() => {
    // Skip if we haven't loaded initial data yet
    if (!hasLoadedInitialDataRef.current || !isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    console.log("🔄 JobList: Filters changed, triggering loadInitialJobs");
    loadInitialJobs();

  }, [
    filters.selectedCategory,
    filters.selectedCompany,
    filters.searchQuery,
    filters.selectedExperience,
    filters.selectedLocation,
    filters.selectedType,
    filters.selectedSalary,
    pagination.jobsPerPage,
    loadInitialJobs
  ]);

  // Handle jobs per page change
  const handleJobsPerPageChange = useCallback((e) => {
    const newJobsPerPage = parseInt(e.target.value);
    if (newJobsPerPage !== pagination.jobsPerPage) {
      console.log('📊 Jobs per page changed:', newJobsPerPage);
      dispatch(setJobsPerPage(newJobsPerPage));
    }
  }, [dispatch, pagination.jobsPerPage]);

  // Memoized salary formatter
  const formatSalary = useCallback((salary) => {
    if (!salary?.min && !salary?.max) return 'Salary not specified';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (salary.min && salary.max) {
      return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    } else if (salary.min) {
      return `From ${formatter.format(salary.min)}`;
    } else if (salary.max) {
      return `Up to ${formatter.format(salary.max)}`;
    }
    return 'Salary not specified';
  }, []);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setLocationSearchInput('');
    setSearchInput('');
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading state for initial load
  if (loading && jobs.length === 0 && !hasLoadedInitialDataRef.current) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  // Error state for initial load
  if (error && jobs.length === 0 && !loading && !loadingMore) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fa fa-exclamation-triangle"></i>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => loadInitialJobs()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Static filter options
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

  console.log('🎨 JobList render:', {
    jobsCount: jobs.length,
    hasMore: infiniteScroll.hasMore,
    isLoading: loading,
    loadingMore: loadingMore,
    lastLoadedPage: infiniteScroll.lastLoadedPage
  });

  return (
    <div className="job-list-container">
      {/* Back to top button */}
      <button 
        className="back-to-top-btn"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: jobs.length > 10 ? 'block' : 'none'
        }}
      >
        <i className="fa fa-arrow-up"></i>
      </button>

      {/* Mobile filter toggle button */}
      <button className="filter-toggle" onClick={toggleSidebar}>
        <i className="fa fa-filter"></i> Filters
      </button>

      {/* Sidebar overlay for mobile */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="filters-section">
            {/* Filter groups - same as before */}
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

            {/* Other filter groups - experience, location, type, salary */}
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
          {/* Search Bar */}
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

          {/* Job Stats */}
          <JobStats 
            pagination={pagination}
            infiniteScroll={infiniteScroll}
            onJobsPerPageChange={handleJobsPerPageChange}
          />

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {jobs.length === 0 && !loading ? (
              <div className="no-jobs">
                <div className="no-jobs-message">
                  <i className="fa fa-search"></i>
                  <h3>No jobs found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                  <button onClick={handleClearFilters} className="clear-filters-btn">
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {jobs.map((job, index) => (
                  <div key={`job-${job.id}-${index}`} className="job-card">
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
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
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
                ))}
                
                {/* FIXED: Infinite Scroll Sentinel - Always render when there are jobs */}
                {jobs.length > 0 && (
                  <InfiniteScrollSentinel
                    sentinelRef={sentinelRef}
                    hasMore={infiniteScroll.hasMore}
                    isLoading={loading}
                    loadingMore={loadingMore}
                  />
                )}
              </>
            )}
          </div>

          {/* Error Message for load more failures */}
          {error && jobs.length > 0 && (
            <div className="load-more-error">
              <p>Failed to load more jobs: {error}</p>
              <button onClick={loadMoreJobs} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;