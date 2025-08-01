// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// import {
//   setJobs,
//   setCategories,
//   setCompanies,
//   setLoading,
//   setError,
//   setSelectedCategory,
//   setSelectedCompany,
//   setSearchQuery,
//   setSelectedExperience,
//   setSelectedLocation,
//   setSelectedType,
//   setSelectedSalary,
//   clearFilters,
// } from '../redux/store';
// import './JobList.css';
// import { saveJob } from '../redux/savedJobsSlice';
// import { useLocation } from 'react-router-dom';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);
//   const [toast, setToast] = useState(null);
//   const location = useLocation();
//   const isJobPage = location.pathname === '/jobs';
//   const showToast = (message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   };
//   // Local state for search inputs
//   const [locationSearchInput, setLocationSearchInput] = useState('');

//   // Update local state when Redux filters change (from Hero component)
//   useEffect(() => {
//     if (filters.selectedLocation && filters.selectedLocation.length > 0) {
//       setLocationSearchInput(filters.selectedLocation[0]);
//     }
//   }, [filters.selectedLocation]);
  
//   // Fetch initial data (all jobs, categories, companies) only once on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       dispatch(setLoading(true));
//       try {
//         const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
//           fetch('/api/jobs'),
//           fetch('/api/categories'),
//           fetch('/api/companies'),
//         ]);

//         if (!jobsRes.ok || !categoriesRes.ok || !companiesRes.ok) {
//           throw new Error('Failed to fetch initial data from API');
//         }

//         const jobsData = await jobsRes.json();
//         const categoriesData = await categoriesRes.json();
//         const companiesData = await companiesRes.json();

//         // Ensure jobs have company and category objects attached for easier filtering
//         const processedJobs = jobsData.jobs.map(job => ({
//           ...job,
//           category: categoriesData.categories.find(cat => cat.id === job.categoryId),
//           company: companiesData.companies.find(comp => comp.jobs.includes(job.id))
//         }));

//         dispatch(setJobs(processedJobs));
//         dispatch(setCategories(categoriesData.categories));
//         dispatch(setCompanies(companiesData.companies));
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//         dispatch(setError('Failed to fetch data. Please try again.'));
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchInitialData();
//   }, [dispatch]);

//   // Client-side filtering logic
//   const filteredJobs = jobs.filter((job) => {
//     // Ensure job has associated category and company data before filtering
//     if (!job.category || !job.company) {
//       return false;
//     }

//     // 1. Category Filter
//     if (filters.selectedCategory && filters.selectedCategory.length > 0 &&
//         !filters.selectedCategory.includes(job.categoryId)) {
//       return false;
//     }

//     // 2. Company Filter
//     if (filters.selectedCompany && filters.selectedCompany.length > 0 &&
//         !filters.selectedCompany.includes(job.company.id)) {
//       return false;
//     }

//     // 3. Experience Filter
//     if (filters.selectedExperience && filters.selectedExperience.length > 0) {
//         const jobExperienceLower = job.experience.toLowerCase();
//         const match = filters.selectedExperience.some(filterExp => {
//             const filterExpLower = filterExp.toLowerCase();
//             if (filterExpLower === 'fresher' && (jobExperienceLower.includes('entry') || jobExperienceLower.includes('junior') || jobExperienceLower.includes('fresher'))) {
//                 return true;
//             }
//             if (filterExpLower.includes('yr')) {
//                 const filterYears = parseInt(filterExpLower);
//                 if (jobExperienceLower.includes('mid') && filterYears >= 2 && filterYears <= 5) return true;
//                 if (jobExperienceLower.includes('senior') && filterYears >= 5) return true;
//             }
//             return jobExperienceLower.includes(filterExpLower);
//         });
//         if (!match) return false;
//     }

//     // 4. Location Filter
//     if (filters.selectedLocation && filters.selectedLocation.length > 0) {
//         const jobLocationLower = job.location.toLowerCase();
//         const match = filters.selectedLocation.some(filterLoc => {
//             const filterLocLower = filterLoc.toLowerCase();
//             return jobLocationLower.includes(filterLocLower);
//         });
//         if (!match) return false;
//     }

//     // 5. Type Filter
//     if (filters.selectedType && filters.selectedType.length > 0 &&
//         !filters.selectedType.includes(job.type)) {
//       return false;
//     }

//     // 6. Salary Filter
//     if (filters.selectedSalary && filters.selectedSalary.length > 0) {
//       const jobMinSalary = job.salary ? job.salary.min : null;
//       const jobMaxSalary = job.salary ? job.salary.max : null;

//       if (jobMinSalary === null || jobMaxSalary === null) {
//         return false;
//       }

//       const match = filters.selectedSalary.some(rangeStr => {
//         const [minFilter, maxFilter] = rangeStr.split('-').map(Number);
//         return (jobMinSalary >= minFilter && jobMinSalary <= maxFilter) ||
//                (jobMaxSalary >= minFilter && jobMaxSalary <= maxFilter) ||
//                (minFilter >= jobMinSalary && maxFilter <= jobMaxSalary);
//       });
//       if (!match) return false;
//     }

//     // 7. Search Query Filter (text search)
//     if (filters.searchQuery) {
//       const query = filters.searchQuery.toLowerCase();
//       const titleMatch = job.title.toLowerCase().includes(query);
//       const companyNameMatch = job.company.name.toLowerCase().includes(query);
//       const locationMatch = job.location.toLowerCase().includes(query);
//       const descriptionMatch = job.description.toLowerCase().includes(query);
//       const categoryNameMatch = job.category.name.toLowerCase().includes(query);

//       return titleMatch || companyNameMatch || locationMatch || descriptionMatch || categoryNameMatch;
//     }

//     return true;
//   });

//   const formatSalary = (salary) => {
//     if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//   };

//   const handleClearFilters = () => {
//     dispatch(clearFilters());
//     setLocationSearchInput('');
//   };

//   if (loading) return <div className="loading">Loading jobs...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   // Define filter options for rendering
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs', 'Mid–Senior (4–8 years)', 'Senior (10+ years)'];
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Northern Virginia, USA', 'Boston, MA', 'Various US Locations', 'Redmond, WA, USA', 'Bellevue, WA, USA', 'San Francisco, CA', 'Gurugram (New Delhi region), India', 'Delhi, India', 'North Delhi, Delhi, India', 'Delhi NCR (Delhi / Gurgaon / Noida)', 'NCR (Delhi / Gurgaon / Noida)'];
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000', '300001-500000', '500001-1000000', '1000001-2500000'];

//   return (
//     <div className="job-list-container">
//       <div className="job-list-layout">
//         <div className="filters-sidebar">
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
//            {isJobPage && (
//             <div className="search-bar sticky-search-bar">
//             <div className="search-field">
//               <span className="icon"><a href="#" className="search fa fa-search"></a></span>
//               <input
//                 type="text"
//                 placeholder="Enter skills / designations / companies"
//                 value={filters.searchQuery || ''}
//                 onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//               />
//             </div>
//             <div className="divider" />
//             <select
//               className="experience-dropdown"
//               value=""
//               onChange={(e) => {
//                 const selectedExp = e.target.value;
//                 if (selectedExp) {
//                   const current = filters.selectedExperience || [];
//                   const updated = current.includes(selectedExp)
//                     ? current.filter((exp) => exp !== selectedExp)
//                     : [...current, selectedExp];
//                   dispatch(setSelectedExperience(updated));
//                 }
//               }}
//             >
//               <option value="">Select experience</option>
//               {experienceOptions.map((exp) => (
//                 <option key={exp} value={exp}>{exp}</option>
//               ))}
//             </select>
//             <div className="divider" />
//             <input
//               type="text"
//               className="location-input"
//               placeholder="Enter location"
//               value={locationSearchInput}
//               onChange={(e) => {
//                 const locationValue = e.target.value;
//                 setLocationSearchInput(locationValue);
                
//                 if (locationValue.trim()) {
//                   dispatch(setSelectedLocation([locationValue.trim()]));
//                 } else {
//                   dispatch(setSelectedLocation([]));
//                 }
//               }}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   const locationValue = e.target.value.trim();
//                   if (locationValue) {
//                     dispatch(setSelectedLocation([locationValue]));
//                   }
//                 }
//               }}
//             />
//             <button className="search-btn" onClick={() => dispatch(setSearchQuery(filters.searchQuery))}>Search</button>
//           </div>)}

//           <div className="results-count">Showing {filteredJobs.length} jobs</div>

//           <div className="jobs-grid">
//             {filteredJobs.length === 0 ? (
//               <div className="no-jobs">No jobs found matching your criteria</div>
//             ) : (
//               filteredJobs.map((job) => (
//                 <div key={job.id} className="job-card">
//                   <div className="job-header">
//                     <h2 className="job-title">{job.title}</h2>
//                     <div className="job-meta">
//                       <span className="company-name">{job.company?.name || 'N/A'}</span>
//                       <span className="job-location">{job.location}</span>
//                     </div>
//                   </div>

//                   <div className="job-details">
//                     <div className="job-category">
//                       <span className="category-badge">{job.category?.name || 'N/A'}</span>
//                     </div>

//                     <div className="job-info">
//                       <p><strong>Experience:</strong> {job.experience}</p>
//                       <p><strong>Type:</strong> {job.type}</p>
//                       <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
//                     </div>

//                     <div className="job-description">
//                       <p>{job.description}</p>
//                     </div>

//                     {job.requirements && job.requirements.length > 0 && (
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
//                         Posted: {new Date(job.postedDate).toLocaleDateString()}
//                       </span>
//                       <div className="job-actions">
//                         <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//                           <button className="apply-btn">Apply Now</button>
//                         </a>
//                         {/* <button onClick={() => dispatch(saveJob(job))} className="save-btn">
//                           Save Job
//                         </button> */}
//                          <button
//                           onClick={() => {
//                             dispatch(saveJob(job));
//                             showToast("Saved Successfully!");
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
//         </div>
//       </div>
//        {toast && <div className="toast-popup">{toast}</div>}
//     </div>
//   );
// };

// export default JobList;
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setJobs,
  setCategories,
  setCompanies,
  setLoading,
  setError,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  clearFilters,
} from '../redux/store';
import './JobList.css';
import { saveJob } from '../redux/savedJobsSlice';
import { useLocation } from 'react-router-dom';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Local state for search inputs
  const [locationSearchInput, setLocationSearchInput] = useState('');

  // Update local state when Redux filters change (from Hero component)
  useEffect(() => {
    if (filters.selectedLocation && filters.selectedLocation.length > 0) {
      setLocationSearchInput(filters.selectedLocation[0]);
    }
  }, [filters.selectedLocation]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Close sidebar on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);
  
  // Fetch initial data (all jobs, categories, companies) only once on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/categories'),
          fetch('/api/companies'),
        ]);

        if (!jobsRes.ok || !categoriesRes.ok || !companiesRes.ok) {
          throw new Error('Failed to fetch initial data from API');
        }

        const jobsData = await jobsRes.json();
        const categoriesData = await categoriesRes.json();
        const companiesData = await companiesRes.json();

        // Ensure jobs have company and category objects attached for easier filtering
        const processedJobs = jobsData.jobs.map(job => ({
          ...job,
          category: categoriesData.categories.find(cat => cat.id === job.categoryId),
          company: companiesData.companies.find(comp => comp.jobs.includes(job.id))
        }));

        dispatch(setJobs(processedJobs));
        dispatch(setCategories(categoriesData.categories));
        dispatch(setCompanies(companiesData.companies));
      } catch (err) {
        console.error("Error fetching initial data:", err);
        dispatch(setError('Failed to fetch data. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Client-side filtering logic
  const filteredJobs = jobs.filter((job) => {
    // Ensure job has associated category and company data before filtering
    if (!job.category || !job.company) {
      return false;
    }

    // 1. Category Filter
    if (filters.selectedCategory && filters.selectedCategory.length > 0 &&
        !filters.selectedCategory.includes(job.categoryId)) {
      return false;
    }

    // 2. Company Filter
    if (filters.selectedCompany && filters.selectedCompany.length > 0 &&
        !filters.selectedCompany.includes(job.company.id)) {
      return false;
    }

    // 3. Experience Filter
    if (filters.selectedExperience && filters.selectedExperience.length > 0) {
        const jobExperienceLower = job.experience.toLowerCase();
        const match = filters.selectedExperience.some(filterExp => {
            const filterExpLower = filterExp.toLowerCase();
            if (filterExpLower === 'fresher' && (jobExperienceLower.includes('entry') || jobExperienceLower.includes('junior') || jobExperienceLower.includes('fresher'))) {
                return true;
            }
            if (filterExpLower.includes('yr')) {
                const filterYears = parseInt(filterExpLower);
                if (jobExperienceLower.includes('mid') && filterYears >= 2 && filterYears <= 5) return true;
                if (jobExperienceLower.includes('senior') && filterYears >= 5) return true;
            }
            return jobExperienceLower.includes(filterExpLower);
        });
        if (!match) return false;
    }

    // 4. Location Filter
    if (filters.selectedLocation && filters.selectedLocation.length > 0) {
        const jobLocationLower = job.location.toLowerCase();
        const match = filters.selectedLocation.some(filterLoc => {
            const filterLocLower = filterLoc.toLowerCase();
            return jobLocationLower.includes(filterLocLower);
        });
        if (!match) return false;
    }

    // 5. Type Filter
    if (filters.selectedType && filters.selectedType.length > 0 &&
        !filters.selectedType.includes(job.type)) {
      return false;
    }

    // 6. Salary Filter
    if (filters.selectedSalary && filters.selectedSalary.length > 0) {
      const jobMinSalary = job.salary ? job.salary.min : null;
      const jobMaxSalary = job.salary ? job.salary.max : null;

      if (jobMinSalary === null || jobMaxSalary === null) {
        return false;
      }

      const match = filters.selectedSalary.some(rangeStr => {
        const [minFilter, maxFilter] = rangeStr.split('-').map(Number);
        return (jobMinSalary >= minFilter && jobMinSalary <= maxFilter) ||
               (jobMaxSalary >= minFilter && jobMaxSalary <= maxFilter) ||
               (minFilter >= jobMinSalary && maxFilter <= jobMaxSalary);
      });
      if (!match) return false;
    }

    // 7. Search Query Filter (text search)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(query);
      const companyNameMatch = job.company.name.toLowerCase().includes(query);
      const locationMatch = job.location.toLowerCase().includes(query);
      const descriptionMatch = job.description.toLowerCase().includes(query);
      const categoryNameMatch = job.category.name.toLowerCase().includes(query);

      return titleMatch || companyNameMatch || locationMatch || descriptionMatch || categoryNameMatch;
    }

    return true;
  });

  const formatSalary = (salary) => {
    if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocationSearchInput('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Define filter options for rendering
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs', 'Mid–Senior (4–8 years)', 'Senior (10+ years)'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Northern Virginia, USA', 'Boston, MA', 'Various US Locations', 'Redmond, WA, USA', 'Bellevue, WA, USA', 'San Francisco, CA', 'Gurugram (New Delhi region), India', 'Delhi, India', 'North Delhi, Delhi, India', 'Delhi NCR (Delhi / Gurgaon / Noida)', 'NCR (Delhi / Gurgaon / Noida)'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000', '300001-500000', '500001-1000000', '1000001-2500000'];

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
                  value={filters.searchQuery || ''}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
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
              <button className="search-btn" onClick={() => dispatch(setSearchQuery(filters.searchQuery))}>
                Search
              </button>
            </div>
          )}

          <div className="results-count">Showing {filteredJobs.length} jobs</div>

          <div className="jobs-grid">
            {filteredJobs.length === 0 ? (
              <div className="no-jobs">No jobs found matching your criteria</div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h2 className="job-title">{job.title}</h2>
                    <div className="job-meta">
                      <span className="company-name">{job.company?.name || 'N/A'}</span>
                      <span className="job-location">{job.location}</span>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="job-category">
                      <span className="category-badge">{job.category?.name || 'N/A'}</span>
                    </div>

                    <div className="job-info">
                      <p><strong>Experience:</strong> {job.experience}</p>
                      <p><strong>Type:</strong> {job.type}</p>
                      <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
                    </div>

                    <div className="job-description">
                      <p>{job.description}</p>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
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
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <div className="job-actions">
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                          <button className="apply-btn">Apply</button>
                        </a>
                        <button
                          onClick={() => {
                            dispatch(saveJob(job));
                            showToast("Saved Successfully!");
                            // Close sidebar on mobile after action
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
        </div>
      </div>
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;