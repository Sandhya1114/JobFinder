



// import { useEffect, useState, useCallback, useRef } from 'react';


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
//   appendJobs,
//   resetInfiniteScroll,
//   setInfiniteScrollLoading
// } from '../redux/store';
// import './Joblist.css';
// import { saveJob } from '../redux/savedJobsSlice';
// import { useLocation } from 'react-router-dom';

// // Job Details Modal Component
// const JobDetailsModal = ({ job, isOpen, onClose, onSave, onApply }) => {
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

//   if (!isOpen || !job) return null;

//   const formatSalary = (salary) => {
//     if (!salary?.min || !salary?.max) return 'Salary not specified';
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//   };

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
//                     <span className="modal-salary">{formatSalary(job.salary)}</span>
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
//               {/* <i className='fa fa-bookmark-o' style={{color: 'white'}}></i> */}
//               Save Job
//             </button>
//             {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
//               <button onClick={onApply} className="modal-apply-btn">
//                 <i className="fa fa-external-link"></i>
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
// };

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
// };

// const JobList = () => {
//   const dispatch = useDispatch();
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
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
  
//   // Separate state for input fields to avoid losing user input
//   const [localFilters, setLocalFilters] = useState({
//     searchInput: '',
//     locationSearchInput: ''
//   });

//   // NEW: State for pending filters (not applied yet)
//   const [pendingFilters, setPendingFilters] = useState({
//     selectedCategory: [],
//     selectedCompany: [],
//     selectedExperience: [],
//     selectedLocation: [],
//     selectedType: [],
//     selectedSalary: []
//   });

//   // NEW: Track if filters have changed but not applied
//   const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);

//   // Track initial load and prevent infinite loops
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [infiniteScrollInitialized, setInfiniteScrollInitialized] = useState(false);
  
//   // Refs to prevent infinite loops and race conditions
//   const lastFiltersRef = useRef(null);
//   const isLoadingMoreRef = useRef(false);
//   const initializationRef = useRef(false);

//   // Check if device is mobile
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       const wasMobile = isMobile;
//       setIsMobile(mobile);
      
//       // Reset infinite scroll when switching between mobile/desktop
//       if (wasMobile !== mobile) {
//         dispatch(resetInfiniteScroll());
//         setInfiniteScrollInitialized(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch, isMobile]);

//   // NEW: Initialize pending filters from current filters
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

//   // NEW: Check if pending filters differ from applied filters
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
//       document.body.classList.add('body-no-scroll');
//     } else {
//       document.body.classList.remove('body-no-scroll');
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.classList.remove('body-no-scroll');
//     };
//   }, [isSidebarOpen]);

//   // FIXED: Load initial data only once with proper initialization
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

//   // FIXED: Reload jobs when filters change (but only after initial load and avoid duplicates)
//   useEffect(() => {
//     if (!initialLoadComplete || !initializationRef.current) return;

//     const currentFilters = JSON.stringify(filters);
//     const lastFilters = lastFiltersRef.current;

//     // Only reload if filters actually changed
//     if (currentFilters !== lastFilters) {
//       console.log('Filters changed, reloading jobs');
//       lastFiltersRef.current = currentFilters;
      
//       // Reset infinite scroll state when filters change
//       setInfiniteScrollInitialized(false);
//       isLoadingMoreRef.current = false;
//       dispatch(resetInfiniteScroll());
      
//       loadJobs().catch(error => {
//         console.error('Failed to reload jobs:', error);
//       });
//     }
//   }, [filters, loadJobs, initialLoadComplete, dispatch]);

//   // FIXED: Initialize mobile infinite scroll data when jobs are loaded
//   useEffect(() => {
//     if (
//       isMobile && 
//       jobs.length > 0 && 
//       initialLoadComplete && 
//       !infiniteScrollInitialized &&
//       infiniteScroll.allJobs.length === 0 // Only initialize if no jobs in infinite scroll
//     ) {
//       console.log('Initializing infinite scroll with jobs:', jobs.length);
//       dispatch(appendJobs({ 
//         jobs: jobs, 
//         pagination: pagination, 
//         resetList: true 
//       }));
//       setInfiniteScrollInitialized(true);
//       isLoadingMoreRef.current = false; // Reset loading ref
//     }
//   }, [jobs, isMobile, pagination, dispatch, initialLoadComplete, infiniteScrollInitialized, infiniteScroll.allJobs.length]);

//   // FIXED: Scroll to top when page changes (desktop only)
//   useEffect(() => {
//     if (!isMobile && pagination.currentPage > 1) {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [pagination.currentPage, isMobile]);

//   // FIXED: Handle page change - ensure it triggers data reload
//   const handlePageChange = useCallback((newPage) => {
//     if (!isMobile && newPage !== pagination.currentPage) {
//       console.log('Page change requested:', newPage, 'Current:', pagination.currentPage);
//       dispatch(setCurrentPage(newPage));
      
//       // Force reload jobs for the new page
//       loadJobs({ page: newPage }).catch(error => {
//         console.error('Failed to load jobs for page:', newPage, error);
//       });
//     }
//   }, [dispatch, isMobile, pagination.currentPage, loadJobs]);

//   // FIXED: Handle jobs per page change - ensure it reloads data
//   const handleJobsPerPageChange = useCallback((newJobsPerPage) => {
//     if (!isMobile && newJobsPerPage !== pagination.jobsPerPage) {
//       console.log('Jobs per page change requested:', newJobsPerPage);
//       dispatch(setJobsPerPage(newJobsPerPage));
      
//       // Force reload jobs with new page size
//       loadJobs({ limit: newJobsPerPage, page: 1 }).catch(error => {
//         console.error('Failed to load jobs with new page size:', newJobsPerPage, error);
//       });
//     }
//   }, [dispatch, isMobile, pagination.jobsPerPage, loadJobs]);

//   // FIXED: Mobile infinite scroll load more function with proper error handling
//   const handleLoadMore = useCallback(async () => {
//     // Prevent multiple simultaneous calls
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
//       // Always reset loading state
//       dispatch(setInfiniteScrollLoading(false));
//       isLoadingMoreRef.current = false;
//     }
//   }, [infiniteScroll.hasMore, infiniteScroll.isLoading, dispatch, loadMoreJobs, pagination, showToast]);

//   // NEW: Apply filters function
//   const handleApplyFilters = useCallback(() => {
//     dispatch(setSelectedCategory(pendingFilters.selectedCategory));
//     dispatch(setSelectedCompany(pendingFilters.selectedCompany));
//     dispatch(setSelectedExperience(pendingFilters.selectedExperience));
//     dispatch(setSelectedLocation(pendingFilters.selectedLocation));
//     dispatch(setSelectedType(pendingFilters.selectedType));
//     dispatch(setSelectedSalary(pendingFilters.selectedSalary));
    
//     setInfiniteScrollInitialized(false);
//     isLoadingMoreRef.current = false;
    
//     showToast('Filters applied successfully!');
    
//     // Close sidebar on mobile after applying
//     if (isMobile) {
//       setIsSidebarOpen(false);
//     }
//   }, [dispatch, pendingFilters, isMobile, showToast]);

//   // NEW: Clear all filters function
//   const handleClearFilters = useCallback(() => {
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
    
//     // Close sidebar on mobile after clearing
//     if (isMobile) {
//       setIsSidebarOpen(false);
//     }
//   }, [dispatch, isMobile, showToast]);

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

//   // NEW: Handle pending filter changes
//   const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
//     setPendingFilters(prev => {
//       const current = prev[filterType] || [];
//       const updated = isChecked
//         ? [...current, value]
//         : current.filter(item => item !== value);
      
//       return {
//         ...prev,
//         [filterType]: updated
//       };
//     });
//   }, []);

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

//   if (!initialLoadComplete) {
//     return <div className="loading">Loading jobs...</div>;
//   }

//   if (loading && (!isMobile || infiniteScroll.allJobs.length === 0)) {
//     return <div className="loading">Loading jobs...</div>;
//   }
  
//   if (error) return <div className="error">Error: {error}</div>;

//   // Static filter options
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

//   // Use infinite scroll jobs for mobile view, regular jobs for desktop
//   const displayJobs = isMobile ? infiniteScroll.allJobs : jobs;

//   return (
//     <div className="job-list-container">
//       {/* Mobile filter toggle button */}
//       <button className="filter-toggle" onClick={toggleSidebar}>
//         <i className="fa fa-filter"></i> <p>Filters</p>
//         {hasUnappliedFilters && <span className="filter-badge">!</span>}
//       </button>

//       {/* Sidebar overlay for mobile */}
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

//       {/* Floating close button - shown when sidebar is open on mobile */}
//       {isMobile && isSidebarOpen && (
//         <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
//           <i className="fa fa-times"></i>
//         </button>
//       )}

//       <div className="job-list-layout">
//         <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           {/* Header for mobile */}
//           {isMobile && (
//             <div className="sidebar-header">
//               <h3><i className="fa fa-filter"></i> Filters</h3>
//             </div>
//           )}
          
//           <div className="filters-section">
//             {/* Filter Action Buttons */}
//             <div className="filter-actions">
//               <button 
//                 onClick={handleApplyFilters} 
//                 className={`apply-filters-btn ${hasUnappliedFilters ? 'highlighted' : ''}`}
//                 disabled={!hasUnappliedFilters}
//               >
//                 <i className="fa fa-check"></i>
//                 Apply Filters
//                 {hasUnappliedFilters && <span className="pulse-dot"></span>}
//               </button>
              
//               <button onClick={handleClearFilters} className="clear-filters-btn">
//                 <i className="fa fa-refresh"></i>
//                 Clear All
//               </button>
//             </div>

//             <div className="FilterGroup">
//               <h4>Category</h4>
//               {categories.map((category) => (
//                 <label key={category.id} className="filter-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={pendingFilters.selectedCategory?.includes(category.id)}
//                     onChange={(e) => handlePendingFilterChange('selectedCategory', category.id, e.target.checked)}
//                   />
//                   <span className="checkmark"></span>
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
//                     checked={pendingFilters.selectedCompany?.includes(company.id)}
//                     onChange={(e) => handlePendingFilterChange('selectedCompany', company.id, e.target.checked)}
//                   />
//                   <span className="checkmark"></span>
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
//                     checked={pendingFilters.selectedExperience?.includes(level)}
//                     onChange={(e) => handlePendingFilterChange('selectedExperience', level, e.target.checked)}
//                   />
//                   <span className="checkmark"></span>
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
//                     checked={pendingFilters.selectedLocation?.includes(location)}
//                     onChange={(e) => handlePendingFilterChange('selectedLocation', location, e.target.checked)}
//                   />
//                   <span className="checkmark"></span>
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
//                     checked={pendingFilters.selectedType?.includes(type)}
//                     onChange={(e) => handlePendingFilterChange('selectedType', type, e.target.checked)}
//                   />
//                   <span className="checkmark"></span>
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="jobs-content">
//           {/* Search Bar in JobList */}
//           {/* {isJobPage && (
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
//           )} */}

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
//           {/* <Pagination
//             pagination={pagination}
//             onPageChange={handlePageChange}
//             onJobsPerPageChange={handleJobsPerPageChange}
//           /> */}

//           <div className="jobs-grid">
//             {displayJobs.length === 0 ? (
//               <div className="no-jobs">
//                 {pagination.totalJobs === 0 ? 'No jobs available' : 'No jobs found matching your criteria'}
//               </div>
//             ) : (
//               displayJobs.map((job, index) => (
//                 <div key={`${job.id}-${index}-${isMobile ? 'mobile' : 'desktop'}`} className="job-card job-card-minimal">
//                   <div className="job-header">
//                     <h2 className="job-title">{job.title || 'No Title'}</h2>
//                     <div className="job-meta">
//                       <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
//                       <span className="job-location">{job.location || 'Location not specified'}</span>
//                     </div>
//                   </div>

//                   <div className="job-details job-details-minimal">
//                     <div className="job-category">
//                       <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
//                     </div>

//                     <div className="job-info job-info-minimal">
//                       <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
//                       <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
//                     </div>

//                     <div className="job-description job-description-minimal">
//                       <p>{job.description ? 
//                         (job.description.length > 150 ? 
//                           job.description.substring(0, 150) + '...' : 
//                           job.description) : 
//                         'No description available'}</p>
//                     </div>

//                     <div className="job-footer">
//                       <span className="posted-date">
//                         Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
//                       </span>
//                       <div className="job-actions">
//                         <button
//                           onClick={() => handleViewDetails(job)}
//                           className="view-details-btn"
//                         >
//                           <i className="fa fa-eye"></i>
//                           View Details
//                         </button>
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
                          
//                           Save
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

// Job Details Modal Component
const JobDetailsModal = ({ job, isOpen, onClose, onSave, onApply }) => {
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

  if (!isOpen || !job) return null;

  const formatSalary = (salary) => {
    if (!salary?.min || !salary?.max) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  };

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
                    <span className="modal-salary">{formatSalary(job.salary)}</span>
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
                <i className="fa fa-external-link"></i>
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
};

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
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  
  // Separate state for input fields to avoid losing user input
  const [localFilters, setLocalFilters] = useState({
    searchInput: '',
    locationSearchInput: ''
  });

  // NEW: State for pending filters (not applied yet)
  const [pendingFilters, setPendingFilters] = useState({
    selectedCategory: [],
    selectedCompany: [],
    selectedExperience: [],
    selectedLocation: [],
    selectedType: [],
    selectedSalary: []
  });

  // NEW: Track if filters have changed but not applied
  const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);

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
        // Close sidebar when switching from mobile to desktop
        if (!mobile && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isMobile, isSidebarOpen]);

  // NEW: Initialize pending filters from current filters
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

  // NEW: Check if pending filters differ from applied filters
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
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('body-no-scroll');
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

  // NEW: Apply filters function
  const handleApplyFilters = useCallback(() => {
    dispatch(setSelectedCategory(pendingFilters.selectedCategory));
    dispatch(setSelectedCompany(pendingFilters.selectedCompany));
    dispatch(setSelectedExperience(pendingFilters.selectedExperience));
    dispatch(setSelectedLocation(pendingFilters.selectedLocation));
    dispatch(setSelectedType(pendingFilters.selectedType));
    dispatch(setSelectedSalary(pendingFilters.selectedSalary));
    
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    showToast('Filters applied successfully!');
    
    // Close sidebar after applying
    setIsSidebarOpen(false);
  }, [dispatch, pendingFilters, showToast]);

  // NEW: Clear all filters function
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
    setLocalFilters({
      searchInput: '',
      locationSearchInput: ''
    });
    setInfiniteScrollInitialized(false);
    isLoadingMoreRef.current = false;
    
    showToast('All filters cleared!');
    
    // Close sidebar after clearing
    setIsSidebarOpen(false);
  }, [dispatch, showToast]);

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

  // NEW: Handle pending filter changes
  const handlePendingFilterChange = useCallback((filterType, value, isChecked) => {
    setPendingFilters(prev => {
      const current = prev[filterType] || [];
      const updated = isChecked
        ? [...current, value]
        : current.filter(item => item !== value);
      
      return {
        ...prev,
        [filterType]: updated
      };
    });
  }, []);

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
      {/* Filter toggle button - now shown for both mobile and desktop */}
      <button className="filter-toggle" onClick={toggleSidebar}>
        <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-sliders'}`}></i>
        <p>{isSidebarOpen ? 'Close' : 'Filters'}</p>
        {hasUnappliedFilters && !isSidebarOpen && <span className="filter-badge">!</span>}
      </button>

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {/* Header for mobile */}
          {isMobile && (
            <div className="sidebar-header">
              <h3><i className="fa fa-sliders"></i> Filters</h3>
            </div>
          )}
          
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

            {/* Schedule Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Schedule</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={() => {}}
              >
                <option value="">Select Schedule</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Categories Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Categories</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const categoryId = parseInt(e.target.value);
                    const isSelected = pendingFilters.selectedCategory?.includes(categoryId);
                    handlePendingFilterChange('selectedCategory', categoryId, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {pendingFilters.selectedCategory?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedCategory.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <span key={categoryId} className="selected-filter-tag">
                        {category.name}
                        <button 
                          onClick={() => handlePendingFilterChange('selectedCategory', categoryId, false)}
                          className="remove-filter"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Industries/Companies Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Industries</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const companyId = parseInt(e.target.value);
                    const isSelected = pendingFilters.selectedCompany?.includes(companyId);
                    handlePendingFilterChange('selectedCompany', companyId, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Industry</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {pendingFilters.selectedCompany?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedCompany.map((companyId) => {
                    const company = companies.find(c => c.id === companyId);
                    return company ? (
                      <span key={companyId} className="selected-filter-tag">
                        {company.name}
                        <button 
                          onClick={() => handlePendingFilterChange('selectedCompany', companyId, false)}
                          className="remove-filter"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Experience Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Experience</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const experience = e.target.value;
                    const isSelected = pendingFilters.selectedExperience?.includes(experience);
                    handlePendingFilterChange('selectedExperience', experience, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Experience</option>
                {experienceOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {pendingFilters.selectedExperience?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedExperience.map((experience) => (
                    <span key={experience} className="selected-filter-tag">
                      {experience}
                      <button 
                        onClick={() => handlePendingFilterChange('selectedExperience', experience, false)}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Distance/Location Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Distance</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const location = e.target.value;
                    const isSelected = pendingFilters.selectedLocation?.includes(location);
                    handlePendingFilterChange('selectedLocation', location, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Location</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {pendingFilters.selectedLocation?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedLocation.map((location) => (
                    <span key={location} className="selected-filter-tag">
                      {location}
                      <button 
                        onClick={() => handlePendingFilterChange('selectedLocation', location, false)}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Job Type</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const type = e.target.value;
                    const isSelected = pendingFilters.selectedType?.includes(type);
                    handlePendingFilterChange('selectedType', type, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Job Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {pendingFilters.selectedType?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedType.map((type) => (
                    <span key={type} className="selected-filter-tag">
                      {type}
                      <button 
                        onClick={() => handlePendingFilterChange('selectedType', type, false)}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Salary Filter */}
            <div className="filter-dropdown-group">
              <label className="filter-label">Salary Range</label>
              <select 
                className="filter-dropdown"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const salary = e.target.value;
                    const isSelected = pendingFilters.selectedSalary?.includes(salary);
                    handlePendingFilterChange('selectedSalary', salary, !isSelected);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Select Salary Range</option>
                {salaryRangeOptions.map((range) => {
                  const [min, max] = range.split('-');
                  const formatNumber = (num) => parseInt(num).toLocaleString();
                  const displayText = max ? 
                    `$${formatNumber(min)} - $${formatNumber(max)}` : 
                    `$${formatNumber(min)}+`;
                  return (
                    <option key={range} value={range}>
                      {displayText}
                    </option>
                  );
                })}
              </select>
              {pendingFilters.selectedSalary?.length > 0 && (
                <div className="selected-filters">
                  {pendingFilters.selectedSalary.map((salary) => {
                    const [min, max] = salary.split('-');
                    const formatNumber = (num) => parseInt(num).toLocaleString();
                    const displayText = max ? 
                      `$${formatNumber(min)} - $${formatNumber(max)}` : 
                      `$${formatNumber(min)}+`;
                    return (
                      <span key={salary} className="selected-filter-tag">
                        {displayText}
                        <button 
                          onClick={() => handlePendingFilterChange('selectedSalary', salary, false)}
                          className="remove-filter"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

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
                      <p>{job.description ? 
                        (job.description.length > 150 ? 
                          job.description.substring(0, 150) + '...' : 
                          job.description) : 
                        'No description available'}</p>
                    </div>

                    <div className="job-footer">
                      <span className="posted-date">
                        Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
                      </span>
                      <div className="job-actions">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="view-details-btn"
                        >
                          <i className="fa fa-eye"></i>
                          View Details
                        </button>
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
                          Save
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