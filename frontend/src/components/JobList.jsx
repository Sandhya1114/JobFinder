// import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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

// // Pagination Component - Only shown on desktop
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

//   // Don't render pagination on mobile
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   if (isMobile) return null;

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

// // Mobile Infinite Scroll Component
// const MobileInfiniteScroll = ({ jobs, hasMore, loadMore, loading }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const loaderRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !isLoading) {
//           setIsLoading(true);
//           loadMore().finally(() => setIsLoading(false));
//         }
//       },
//       { threshold: 1.0, rootMargin: '100px' }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => {
//       if (loaderRef.current) {
//         observer.unobserve(loaderRef.current);
//       }
//     };
//   }, [hasMore, loading, isLoading, loadMore]);

//   return (
//     <div ref={loaderRef} className="mobile-infinite-loader">
//       {(isLoading || loading) && hasMore && (
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
//     </div>
//   );
// };

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters, pagination } = useSelector((state) => state.jobs);
//   const { loadJobs, loadAllData, loadMoreJobs } = useDataLoader(); // Assuming loadMoreJobs exists
//   const [toast, setToast] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
  
//   // Separate state for input fields to avoid losing user input
//   const [localFilters, setLocalFilters] = useState({
//     searchInput: '',
//     locationSearchInput: ''
//   });
  
//   // Mobile infinite scroll state
//   const [mobileJobs, setMobileJobs] = useState([]);
//   const [hasMoreJobs, setHasMoreJobs] = useState(true);
//   const [mobileLoading, setMobileLoading] = useState(false);

//   // Check if device is mobile
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
      
//       // Reset mobile state when switching between mobile/desktop
//       if (!mobile) {
//         setMobileJobs([]);
//         setHasMoreJobs(true);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Initialize mobile jobs on first load or filter change
//   useEffect(() => {
//     if (isMobile && jobs.length > 0) {
//       setMobileJobs(jobs);
//       setHasMoreJobs(pagination.hasNextPage);
//     }
//   }, [jobs, isMobile, pagination.hasNextPage]);

//   // Debounce search input while preserving all existing filters
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (localFilters.searchInput !== filters.searchQuery) {
//         dispatch(setSearchQuery(localFilters.searchInput));
//       }
//     }, 500);

//     return () => clearTimeout(debounceTimer);
//   }, [localFilters.searchInput, filters.searchQuery, dispatch]);

//   // Update local state when Redux filters change (but preserve user input)
//   useEffect(() => {
//     setLocalFilters(prev => ({
//       ...prev,
//       searchInput: prev.searchInput === '' ? (filters.searchQuery || '') : prev.searchInput,
//       locationSearchInput: prev.locationSearchInput === '' ? 
//         (filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '') : 
//         prev.locationSearchInput
//     }));
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
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   // Load initial data
//   useEffect(() => {
//     loadAllData();
//   }, [loadAllData]);

//   // Reload jobs when filters change
//   useEffect(() => {
//     if (isMobile) {
//       // Reset mobile infinite scroll when filters change
//       setMobileJobs([]);
//       setHasMoreJobs(true);
//     }
//     loadJobs();
//   }, [loadJobs, filters, isMobile]);

//   // Scroll to top when page changes (desktop only)
//   useEffect(() => {
//     if (!isMobile) {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [pagination.currentPage, isMobile]);

//   const handlePageChange = useCallback((newPage) => {
//     if (!isMobile) {
//       dispatch(setCurrentPage(newPage));
//     }
//   }, [dispatch, isMobile]);

//   const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
//     if (!isMobile) {
//       dispatch(setJobsPerPage(newJobsPerPage));
//     }
//   }, [dispatch, isMobile]);

//   // Mobile infinite scroll load more function
//   const handleLoadMore = useCallback(async () => {
//     if (!hasMoreJobs || mobileLoading) return;

//     setMobileLoading(true);
//     try {
//       const nextPage = Math.floor(mobileJobs.length / 20) + 1;
//       dispatch(setCurrentPage(nextPage));
      
//       // Simulate API call - replace with actual loadMoreJobs function
//       await loadMoreJobs();
      
//       // This would be handled by the Redux state update
//       // The useEffect above will append new jobs to mobileJobs
//     } catch (error) {
//       console.error('Error loading more jobs:', error);
//       showToast('Error loading more jobs');
//     } finally {
//       setMobileLoading(false);
//     }
//   }, [hasMoreJobs, mobileLoading, mobileJobs.length, dispatch, loadMoreJobs, showToast]);

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
//     setLocalFilters({
//       searchInput: '',
//       locationSearchInput: ''
//     });
//     if (isMobile) {
//       setMobileJobs([]);
//       setHasMoreJobs(true);
//     }
//   }, [dispatch, isMobile]);

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

//   if (loading && (!isMobile || mobileJobs.length === 0)) {
//     return <div className="loading">Loading jobs...</div>;
//   }
  
//   if (error) return <div className="error">Error: {error}</div>;

//   // Static filter options
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

//   // Use mobile jobs for mobile view, regular jobs for desktop
//   const displayJobs = isMobile ? mobileJobs : jobs;

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
//           {/* Close button for mobile */}
//           {isMobile && (
//             <div className="sidebar-header">
//               <h3>Filters</h3>
//               <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
//                 <i className="fa fa-times"></i>
//               </button>
//             </div>
//           )}
          
//           <div className="filters-section">
//             <div className="FilterGroup">
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

//             <div className="FilterGroup">
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

//             <div className="FilterGroup">
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

//             <div className="FilterGroup">
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

//             <div className="FilterGroup">
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

//             <div className="FilterGroup">
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
//                   value={localFilters.searchInput}
//                   onChange={(e) => handleSearchInputChange(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       dispatch(setSearchQuery(localFilters.searchInput));
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
//                 value={localFilters.locationSearchInput}
//                 onChange={(e) => handleLocationInputChange(e.target.value)}
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
//                 dispatch(setSearchQuery(localFilters.searchInput.trim()));
//               }}>
//                 Search
//               </button>
//             </div>
//           )}

//           {/* Mobile job count info */}
//           {isMobile && (
//             <div className="mobile-job-info">
//               <span>Showing {displayJobs.length} jobs</span>
//               {pagination.totalJobs > 0 && (
//                 <span> of {pagination.totalJobs} total</span>
//               )}
//             </div>
//           )}

//           {/* Pagination - Top (Desktop only) */}
//           <Pagination
//             pagination={pagination}
//             onPageChange={handlePageChange}
//             onJobsPerPageChange={handleJobsPerPageChange}
//           />

//           <div className="jobs-grid">
//             {displayJobs.length === 0 ? (
//               <div className="no-jobs">
//                 {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
//               </div>
//             ) : (
//               displayJobs.map((job) => (
//                 <div key={`${job.id}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card">
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
//                           onClick={async () => {
//                             try {
//                               const result = await dispatch(saveJob({ 
//                                 jobId: job.id,
//                                 notes: '',
//                                 priority: 0
//                               }));

//                               if (result.meta.requestStatus === 'fulfilled') {
//                                 showToast("Job saved successfully!");
//                               } else if (result.meta.requestStatus === 'rejected') {
//                                 const errorMessage = result.payload || "Failed to save job";
//                                 if (errorMessage.includes('already saved')) {
//                                   showToast("Job is already saved");
//                                 } else {
//                                   showToast(errorMessage);
//                                 }
//                               }

//                               if (isMobile && isSidebarOpen) {
//                                 setIsSidebarOpen(false);
//                               }
//                             } catch (error) {
//                               console.error('Error saving job:', error);
//                               showToast("Failed to save job");
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

//           {/* Mobile Infinite Scroll Loader */}
//           {isMobile && (
//             <MobileInfiniteScroll
//               jobs={displayJobs}
//               hasMore={hasMoreJobs}
//               loadMore={handleLoadMore}
//               loading={mobileLoading}
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
      
//       {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
import { useEffect, useState, useCallback, useRef } from 'react';
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
  appendJobs,
  resetInfiniteScroll,
  setInfiniteScrollLoading
} from '../redux/store';
import './Joblist.css';
import { saveJob } from '../redux/savedJobsSlice';
import { useLocation } from 'react-router-dom';

// Pagination Component - Only shown on desktop
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

  // Don't render pagination on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) return null;

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

// Mobile Infinite Scroll Component
const MobileInfiniteScroll = ({ jobs, hasMore, loadMore, loading }) => {
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
};

const JobList = () => {
  const dispatch = useDispatch();
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
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  
  // Separate state for input fields to avoid losing user input
  const [localFilters, setLocalFilters] = useState({
    searchInput: '',
    locationSearchInput: ''
  });

  // Track initial load and prevent infinite loops
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [infiniteScrollInitialized, setInfiniteScrollInitialized] = useState(false);
  
  // Refs to prevent infinite loops and race conditions
  const lastFiltersRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const initializationRef = useRef(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Reset infinite scroll when switching between mobile/desktop
      if (wasMobile !== mobile) {
        dispatch(resetInfiniteScroll());
        setInfiniteScrollInitialized(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isMobile]);

  // Debounce search input while preserving all existing filters
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localFilters.searchInput !== filters.searchQuery) {
        dispatch(setSearchQuery(localFilters.searchInput));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [localFilters.searchInput, filters.searchQuery, dispatch]);

  // Update local state when Redux filters change (but preserve user input)
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      searchInput: prev.searchInput === '' ? (filters.searchQuery || '') : prev.searchInput,
      locationSearchInput: prev.locationSearchInput === '' ? 
        (filters.selectedLocation?.length > 0 ? filters.selectedLocation[0] : '') : 
        prev.locationSearchInput
    }));
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // FIXED: Load initial data only once with proper initialization
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

  // FIXED: Reload jobs when filters change (but only after initial load and avoid duplicates)
  useEffect(() => {
    if (!initialLoadComplete || !initializationRef.current) return;

    const currentFilters = JSON.stringify(filters);
    const lastFilters = lastFiltersRef.current;

    // Only reload if filters actually changed
    if (currentFilters !== lastFilters) {
      console.log('Filters changed, reloading jobs');
      lastFiltersRef.current = currentFilters;
      
      // Reset infinite scroll state when filters change
      setInfiniteScrollInitialized(false);
      isLoadingMoreRef.current = false;
      dispatch(resetInfiniteScroll());
      
      loadJobs().catch(error => {
        console.error('Failed to reload jobs:', error);
      });
    }
  }, [filters, loadJobs, initialLoadComplete, dispatch]);

  // FIXED: Initialize mobile infinite scroll data when jobs are loaded
  useEffect(() => {
    if (
      isMobile && 
      jobs.length > 0 && 
      initialLoadComplete && 
      !infiniteScrollInitialized &&
      infiniteScroll.allJobs.length === 0 // Only initialize if no jobs in infinite scroll
    ) {
      console.log('Initializing infinite scroll with jobs:', jobs.length);
      dispatch(appendJobs({ 
        jobs: jobs, 
        pagination: pagination, 
        resetList: true 
      }));
      setInfiniteScrollInitialized(true);
      isLoadingMoreRef.current = false; // Reset loading ref
    }
  }, [jobs, isMobile, pagination, dispatch, initialLoadComplete, infiniteScrollInitialized, infiniteScroll.allJobs.length]);

  // FIXED: Scroll to top when page changes (desktop only)
  useEffect(() => {
    if (!isMobile && pagination.currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.currentPage, isMobile]);

  // FIXED: Handle page change - ensure it triggers data reload
  const handlePageChange = useCallback((newPage) => {
    if (!isMobile && newPage !== pagination.currentPage) {
      console.log('Page change requested:', newPage, 'Current:', pagination.currentPage);
      dispatch(setCurrentPage(newPage));
      
      // Force reload jobs for the new page
      loadJobs({ page: newPage }).catch(error => {
        console.error('Failed to load jobs for page:', newPage, error);
      });
    }
  }, [dispatch, isMobile, pagination.currentPage, loadJobs]);

  // FIXED: Handle jobs per page change - ensure it reloads data
  const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
    if (!isMobile && newJobsPerPage !== pagination.jobsPerPage) {
      console.log('Jobs per page change requested:', newJobsPerPage);
      dispatch(setJobsPerPage(newJobsPerPage));
      
      // Force reload jobs with new page size
      loadJobs({ limit: newJobsPerPage, page: 1 }).catch(error => {
        console.error('Failed to load jobs with new page size:', newJobsPerPage, error);
      });
    }
  }, [dispatch, isMobile, pagination.jobsPerPage, loadJobs]);

  // FIXED: Mobile infinite scroll load more function with proper error handling
  const handleLoadMore = useCallback(async () => {
    // Prevent multiple simultaneous calls
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
      // Always reset loading state
      dispatch(setInfiniteScrollLoading(false));
      isLoadingMoreRef.current = false;
    }
  }, [infiniteScroll.hasMore, infiniteScroll.isLoading, dispatch, loadMoreJobs, pagination, showToast]);

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
    setLocalFilters({
      searchInput: '',
      locationSearchInput: ''
    });
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Handle search input changes
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

  if (!initialLoadComplete) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (loading && (!isMobile || infiniteScroll.allJobs.length === 0)) {
    return <div className="loading">Loading jobs...</div>;
  }
  
  if (error) return <div className="error">Error: {error}</div>;

  // Static filter options
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

  // Use infinite scroll jobs for mobile view, regular jobs for desktop
  const displayJobs = isMobile ? infiniteScroll.allJobs : jobs;

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
          {/* Close button for mobile */}
          {isMobile && (
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="filters-section">
            <div className="FilterGroup">
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

            <div className="FilterGroup">
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

            <div className="FilterGroup">
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

            <div className="FilterGroup">
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

            <div className="FilterGroup">
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

            <div className="FilterGroup">
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
                  value={localFilters.searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      dispatch(setSearchQuery(localFilters.searchInput));
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
                value={localFilters.locationSearchInput}
                onChange={(e) => handleLocationInputChange(e.target.value)}
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
                dispatch(setSearchQuery(localFilters.searchInput.trim()));
              }}>
                Search
              </button>
            </div>
          )}

          {/* Mobile job count info */}
          {isMobile && (
            <div className="mobile-job-info">
              <span>Showing {displayJobs.length} jobs</span>
              {pagination.totalJobs > 0 && (
                <span> of {pagination.totalJobs} total</span>
              )}
            </div>
          )}

          {/* Pagination - Top (Desktop only) */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onJobsPerPageChange={handleJobsPerPageChange}
          />

          <div className="jobs-grid">
            {displayJobs.length === 0 ? (
              <div className="no-jobs">
                {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
              </div>
            ) : (
              displayJobs.map((job, index) => (
                <div key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card">
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
                          onClick={async () => {
                            try {
                              const result = await dispatch(saveJob({ 
                                jobId: job.id,
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
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;