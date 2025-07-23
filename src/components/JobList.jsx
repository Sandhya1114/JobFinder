// import { useEffect } from 'react';
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
// import './Joblist.css';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

//   useEffect(() => {
//     fetchInitialData();
//   }, [dispatch]);

//   const fetchInitialData = async () => {
//     dispatch(setLoading(true));
//     try {
//       const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
//         fetch('/api/jobs'),
//         fetch('/api/categories'),
//         fetch('/api/companies'),
//       ]);

//       const jobsData = await jobsRes.json();
//       const categoriesData = await categoriesRes.json();
//       const companiesData = await companiesRes.json();

//       dispatch(setJobs(jobsData.jobs));
//       dispatch(setCategories(categoriesData.categories));
//       dispatch(setCompanies(companiesData.companies));
//     } catch (err) {
//       dispatch(setError('Failed to fetch data'));
//     }
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const category = categories.find((cat) => cat.id === job.categoryId);
//     const company = companies.find((comp) => comp.id === job.company.id);
//     if (!category || !company) return false;

//     if (filters.selectedCategory?.length > 0 && !filters.selectedCategory.includes(job.categoryId)) return false;
//     if (filters.selectedCompany?.length > 0 && !filters.selectedCompany.includes(job.company.id)) return false;
//     if (filters.selectedExperience?.length > 0 && !filters.selectedExperience.includes(job.experience)) return false;
//     if (filters.selectedLocation?.length > 0 && !filters.selectedLocation.includes(job.location)) return false;
//     if (filters.selectedType?.length > 0 && !filters.selectedType.includes(job.type)) return false;
//     if (filters.selectedSalary?.length > 0) {
//       const [minSalary, maxSalary] = job.salary ? [job.salary.min, job.salary.max] : [0, 0];
//       const match = filters.selectedSalary.some(range => {
//         const [min, max] = range.split('-').map(Number);
//         return minSalary >= min && maxSalary <= max;
//       });
//       if (!match) return false;
//     }
//     if (filters.searchQuery) {
//       const query = filters.searchQuery.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(query) ||
//         company.name.toLowerCase().includes(query) ||
//         job.location.toLowerCase().includes(query) ||
//         job.description.toLowerCase().includes(query)
//       );
//     }

//     return true;
//   });

//   const formatSalary = (salary) => {
//     if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
//     return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
//   };

//   if (loading) return <div className="loading">Loading jobs...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

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
//               <h4>Experience (yrs)</h4>
//               {['Fresher', '1 yr', '2 yrs', '3 yrs', '4 yrs','5 yrs'].map((level) => (
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
//               {['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India'].map((location) => (
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
//               {['Full-time', 'Part-time', 'Contract'].map((type) => (
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
//               <h4>Salary</h4>
//               {['0-50000', '50001-100000', '100001-150000', '150001-200000'].map((range) => (
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

//             <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search jobs..."
//               value={filters.searchQuery}
//               onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//               className="search-input"
//             />
//           </div>

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
//                       <span className="company-name">{job.company.name}</span>
//                       <span className="job-location">{job.location}</span>
//                     </div>
//                   </div>

//                   <div className="job-details">
//                     <div className="job-category">
//                       <span className="category-badge">{job.category.name}</span>
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
//                       <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//                         <button className="apply-btn">Apply Now</button>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobList;

// FileName: JobList.jsx
// import { useEffect } from 'react';
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
// } from '../redux/store'; // Assuming your Redux store actions are correctly defined here
// import './Joblist.css'; // Your CSS file
// import { saveJob } from '../redux/savedJobsSlice';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

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
//           company: companiesData.companies.find(comp => comp.jobs.includes(job.id)) // Find company by job ID
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
//   }, [dispatch]); // Dependency array ensures this runs only once on mount

//   // Client-side filtering logic
//   const filteredJobs = jobs.filter((job) => {
//     // Ensure job has associated category and company data before filtering
//     if (!job.category || !job.company) {
//       // This should ideally not happen if processedJobs in useEffect is correct,
//       // but acts as a safeguard.
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
//     // This mapping is crucial as your filter options ('1 yr', '2 yrs')
//     // don't directly match job experience strings ('Mid-level', 'Senior').
//     // You need a more robust mapping or a different way to represent experience.
//     // For now, I'll use a simple 'includes' check, which might not be perfect.
//     // A better approach would be to normalize experience levels in your data or filters.
//     if (filters.selectedExperience && filters.selectedExperience.length > 0) {
//         const jobExperienceLower = job.experience.toLowerCase();
//         const match = filters.selectedExperience.some(filterExp => {
//             const filterExpLower = filterExp.toLowerCase();
//             // Simple check: if job experience contains the filter string (e.g., 'senior' contains 'senior')
//             // Or if filter string is 'fresher' and job experience implies entry-level
//             if (filterExpLower === 'fresher' && (jobExperienceLower.includes('entry') || jobExperienceLower.includes('junior') || jobExperienceLower.includes('fresher'))) {
//                 return true;
//             }
//             // For year-based filters, you might need to parse numbers
//             if (filterExpLower.includes('yr')) {
//                 const filterYears = parseInt(filterExpLower);
//                 // This is a very basic heuristic. You'd need a proper range check.
//                 if (jobExperienceLower.includes('mid') && filterYears >= 2 && filterYears <= 5) return true;
//                 if (jobExperienceLower.includes('senior') && filterYears >= 5) return true;
//                 // Add more specific logic based on your data's experience strings
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
//             // Check if job location string contains the filter location string
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
//         // If job has no salary info, it won't match any salary range filter
//         return false;
//       }

//       const match = filters.selectedSalary.some(rangeStr => {
//         const [minFilter, maxFilter] = rangeStr.split('-').map(Number);
//         // A job matches if its salary range overlaps with the selected filter range
//         // This logic assumes job.salary.min and job.salary.max define the job's salary range.
//         // If the job's min is within the filter range, or its max is within the filter range,
//         // or the job's range completely encompasses the filter range.
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
//       const categoryNameMatch = job.category.name.toLowerCase().includes(query); // Added category name search

//       return titleMatch || companyNameMatch || locationMatch || descriptionMatch || categoryNameMatch;
//     }

//     return true; // If no filters applied or all applied filters pass
//   });

//   const formatSalary = (salary) => {
//     if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
//     // Handle different currencies if necessary, for now assuming USD for formatting
//     const formatter = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: salary.currency || 'USD', // Default to USD if not specified
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
//   };

//   if (loading) return <div className="loading">Loading jobs...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   // Define filter options for rendering (these should ideally come from your data or a config)
//   const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs', 'Mid–Senior (4–8 years)', 'Senior (10+ years)']; // Expanded to include data values
//   const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Northern Virginia, USA', 'Boston, MA', 'Various US Locations', 'Redmond, WA, USA', 'Bellevue, WA, USA', 'San Francisco, CA', 'Gurugram (New Delhi region), India', 'Delhi, India', 'North Delhi, Delhi, India', 'Delhi NCR (Delhi / Gurgaon / Noida)', 'NCR (Delhi / Gurgaon / Noida)']; // Expanded
//   const typeOptions = ['Full-time', 'Part-time', 'Contract'];
//   const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000', '300001-500000', '500001-1000000', '1000001-2500000']; // Expanded to cover INR ranges

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
//               <h4>Experience</h4> {/* Changed from (yrs) to be more general */}
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
//               <h4>Salary Range</h4> {/* Changed from Salary */}
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

//             <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search jobs..."
//               value={filters.searchQuery || ''} // Ensure it's not undefined
//               onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//               className="search-input"
//             />
//           </div>

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
//                       {/* <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//                         <button className="apply-btn">Apply Now</button>
//                       </a> */}
//                      <div className="job-actions">
//                         <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//                         <button className="apply-btn">Apply Now</button>
//                          </a>
//                         <button onClick={() => dispatch(saveJob(job))} className="save-btn">
//                           Save Job
//                         </button>
//                     </div> 
                      
                      
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobList;
// import { useEffect } from 'react';
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
// } from '../redux/store'; // Assuming your Redux store actions are correctly defined here
// import './JobList.css'; // Your CSS file
// import { saveJob } from '../redux/savedJobsSlice';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

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
//           company: companiesData.companies.find(comp => comp.jobs.includes(job.id)) // Find company by job ID
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
//   }, [dispatch]); // Dependency array ensures this runs only once on mount

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

//     return true; // If no filters applied or all applied filters pass
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

//             <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         <div className="jobs-content">
//           {/* Stylish Search Bar */}
//           <div className="search-bar">
//             <div className="search-field">
//               {/* <span className="icon"><a href="#" class="fa fa-search"></a></span> You can replace this with an actual icon */}
//               <input
//                 type="text"
//                 placeholder="Enter skills / designations / companies"
//                 value={filters.searchQuery || ''} // Ensure it's not undefined
//                 onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//               />
//             </div>
//             <div className="divider" />
//             <select
//               className="experience-dropdown"
//               value={filters.selectedExperience || ''}
//               onChange={(e) => dispatch(setSelectedExperience([e.target.value]))}
//             >
//               <option value="">Select experience</option>
//               <option value="Fresher">Fresher</option>
//               <option value="Mid-level">Mid-level</option>
//               <option value="Senior">Senior (10+ years)</option>
//               <option value="7+ years">7+ years</option>
//             </select>
//             <div className="divider" />
//             <input
//               type="text"
//               className="location-input"
//               placeholder="Enter location"
//               value={filters.selectedLocation || ''} // Ensure it's not undefined
//               onChange={(e) => dispatch(setSelectedLocation([e.target.value]))}
//             />
//             <button className="search-btn" onClick={() => dispatch(setSearchQuery(filters.searchQuery))}>Search</button>
//           </div>

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
//                         <button onClick={() => dispatch(saveJob(job))} className="save-btn">
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
//     </div>
//   );
// };

// export default JobList;
import { useEffect } from 'react';
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
} from '../redux/store'; // Assuming your Redux store actions are correctly defined here
import './JobList.css'; // Your CSS file
import { saveJob } from '../redux/savedJobsSlice';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

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
          company: companiesData.companies.find(comp => comp.jobs.includes(job.id)) // Find company by job ID
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
  }, [dispatch]); // Dependency array ensures this runs only once on mount

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

    return true; // If no filters applied or all applied filters pass
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

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Define filter options for rendering
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs', 'Mid–Senior (4–8 years)', 'Senior (10+ years)'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Northern Virginia, USA', 'Boston, MA', 'Various US Locations', 'Redmond, WA, USA', 'Bellevue, WA, USA', 'San Francisco, CA', 'Gurugram (New Delhi region), India', 'Delhi, India', 'North Delhi, Delhi, India', 'Delhi NCR (Delhi / Gurgaon / Noida)', 'NCR (Delhi / Gurgaon / Noida)'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000', '300001-500000', '500001-1000000', '1000001-2500000'];

  return (
    <div className="job-list-container">
      <div className="job-list-layout">
        <div className="filters-sidebar">
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

            <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="jobs-content">
          {/* Stylish Search Bar */}
          <div className="search-bar">
            <div className="search-field">
              <span className="icon"> <a href="#" class="fa fa-search"></a></span> {/* You can replace this with an actual icon */}
              <input
                type="text"
                placeholder="Enter skills / designations / companies"
                value={filters.searchQuery || ''} // Ensure it's not undefined
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>
            <div className="divider" />
            <select
              className="experience-dropdown"
              value={filters.selectedExperience || ''}
              onChange={(e) => dispatch(setSelectedExperience([e.target.value]))}
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 years">1-3 years</option>
              <option value="4-6 years">4-6 years</option>
              <option value="7+ years">7+ years</option>
            </select>
            <div className="divider" />
            <input
              type="text"
              className="location-input"
              placeholder="Enter location"
              value={filters.selectedLocation || ''} // Ensure it's not undefined
              onChange={(e) => dispatch(setSelectedLocation([e.target.value]))}
            />
            <button className="search-btn" onClick={() => {
              // Trigger search functionality
              const searchQuery = filters.searchQuery;
              const selectedExperience = filters.selectedExperience;
              const selectedLocation = filters.selectedLocation;

              // Update the filters with the current search values
              dispatch(setSearchQuery(searchQuery));
              dispatch(setSelectedExperience(selectedExperience));
              dispatch(setSelectedLocation(selectedLocation));
            }}>Search</button>
          </div>

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
                          <button className="apply-btn">Apply Now</button>
                        </a>
                        <button onClick={() => dispatch(saveJob(job))} className="save-btn">
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
    </div>
  );
};

export default JobList;
