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
//   clearFilters
// } from '../redux/store';
// import './Joblist.css';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const { 
//     jobs, 
//     categories, 
//     companies, 
//     loading, 
//     error, 
//     filters 
//   } = useSelector(state => state.jobs);

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchInitialData();
//   }, [dispatch]);

//   const fetchInitialData = async () => {
//     dispatch(setLoading(true));
//     try {
//       // Fetch all jobs, categories, and companies
//       const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
//         fetch('/api/jobs'),
//         fetch('/api/categories'),
//         fetch('/api/companies')
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

//   // Filter jobs based on current filters and valid company/category
//   const filteredJobs = jobs.filter(job => {
//     // Check if the job has a valid category and company
//     const category = categories.find(cat => cat.id === job.categoryId);
//     const company = companies.find(comp => comp.id === job.company.id);

//     // If category or company is not valid, exclude the job
//     if (!category || !company) {
//       return false;
//     }

//     // Apply additional filters
//     if (filters.selectedCategory && job.categoryId !== filters.selectedCategory) {
//       return false;
//     }
//     if (filters.selectedCompany && job.company.id !== filters.selectedCompany) {
//       return false;
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

//   // Define formatSalary function
//   const formatSalary = (salary) => {
//     // Check if salary object exists
//     if (!salary) return 'Salary not specified';
    
//     // Check if min and max values exist and are not null
//     if (salary.min === null || salary.max === null) {
//       return 'Salary not specified';
//     }
    
//     return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
//   };

//   if (loading) return <div className="loading">Loading jobs...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="job-list-container">
//       {/* Filters Section */}
//       <div className="filters-section">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search jobs..."
//             value={filters.searchQuery}
//             onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//             className="search-input"
//           />
//         </div>
//         <div className="filter-dropdowns">
//           <select
//             value={filters.selectedCategory || ''}
//             onChange={(e) => dispatch(setSelectedCategory(e.target.value ? parseInt(e.target.value) : null))}
//             className="filter-select"
//           >
//             <option value="">All Categories</option>
//             {categories.map(category => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>

//           <select
//             value={filters.selectedCompany || ''}
//             onChange={(e) => dispatch(setSelectedCompany(e.target.value || null))}
//             className="filter-select"
//           >
//             <option value="">All Companies</option>
//             {companies.map(company => (
//               <option key={company.id} value={company.id}>
//                 {company.name}
//               </option>
//             ))}
//           </select>

//           <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Results Count */}
//       <div className="results-count">
//         Showing {filteredJobs.length} jobs
//       </div>

//       {/* Jobs List */}
//       <div className="jobs-grid">
//         {filteredJobs.length === 0 ? (
//           <div className="no-jobs">No jobs found matching your criteria</div>
//         ) : (
//           filteredJobs.map(job => (
//             <div key={job.id} className="job-card">
//               <div className="job-header">
//                 <h2 className="job-title">{job.title}</h2>
//                 <div className="job-meta">
//                   <span className="company-name">{job.company.name}</span>
//                   <span className="job-location">{job.location}</span>
//                 </div>
//               </div>

//               <div className="job-details">
//                 <div className="job-category">
//                   <span className="category-badge">{job.category.name}</span>
//                 </div>
                
//                 <div className="job-info">
//                   <p><strong>Experience:</strong> {job.experience}</p>
//                   <p><strong>Type:</strong> {job.type}</p>
//                   <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
//                 </div>

//                 <div className="job-description">
//                   <p>{job.description}</p>
//                 </div>

//                 {job.requirements && job.requirements.length > 0 && (
//                   <div className="job-requirements">
//                     <h4>Requirements:</h4>
//                     <ul>
//                       {job.requirements.map((req, index) => (
//                         <li key={index}>{req}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="job-footer">
//                   <span className="posted-date">
//                     Posted: {new Date(job.postedDate).toLocaleDateString()}
//                   </span>
//                   <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//                     <button className="apply-btn">Apply Now</button>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobList;
import React, { useEffect } from 'react';
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
  setSelectedExperience, // Import new filter action
  setSelectedLocation, // Import new filter action
  setSelectedType, // Import new filter action
  setSelectedSalary, // Import new filter action
  clearFilters
} from '../redux/store';
import './Joblist.css';

const JobList = () => {
  const dispatch = useDispatch();
  const { 
    jobs, 
    categories, 
    companies, 
    loading, 
    error, 
    filters 
  } = useSelector(state => state.jobs);

  // Fetch all data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);

  const fetchInitialData = async () => {
    dispatch(setLoading(true));
    try {
      // Fetch all jobs, categories, and companies
      const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/categories'),
        fetch('/api/companies')
      ]);

      const jobsData = await jobsRes.json();
      const categoriesData = await categoriesRes.json();
      const companiesData = await companiesRes.json();

      dispatch(setJobs(jobsData.jobs));
      dispatch(setCategories(categoriesData.categories));
      dispatch(setCompanies(companiesData.companies));
    } catch (err) {
      dispatch(setError('Failed to fetch data'));
    }
  };

  // Filter jobs based on current filters and valid company/category
  const filteredJobs = jobs.filter(job => {
    // Check if the job has a valid category and company
    const category = categories.find(cat => cat.id === job.categoryId);
    const company = companies.find(comp => comp.id === job.company.id);

    // If category or company is not valid, exclude the job
    if (!category || !company) {
      return false;
    }

    // Apply additional filters
    if (filters.selectedCategory && job.categoryId !== filters.selectedCategory) {
      return false;
    }
    if (filters.selectedCompany && job.company.id !== filters.selectedCompany) {
      return false;
    }
    if (filters.selectedExperience && job.experience !== filters.selectedExperience) {
      return false;
    }
    if (filters.selectedLocation && job.location !== filters.selectedLocation) {
      return false;
    }
    if (filters.selectedType && job.type !== filters.selectedType) {
      return false;
    }
    if (filters.selectedSalary) {
      const [minSalary, maxSalary] = filters.selectedSalary.split('-').map(Number);
      if (job.salary.min < minSalary || job.salary.max > maxSalary) {
        return false;
      }
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        company.name.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Define formatSalary function
  const formatSalary = (salary) => {
    // Check if salary object exists
    if (!salary) return 'Salary not specified';
    
    // Check if min and max values exist and are not null
    if (salary.min === null || salary.max === null) {
      return 'Salary not specified';
    }
    
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job-list-container">
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="search-input"
          />
        </div>
        <div className="filter-dropdowns">
          {/* Category Filter */}
          <select
            value={filters.selectedCategory || ''}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value ? parseInt(e.target.value) : null))}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Company Filter */}
          <select
            value={filters.selectedCompany || ''}
            onChange={(e) => dispatch(setSelectedCompany(e.target.value || null))}
            className="filter-select"
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {/* Experience Filter */}
          <select
            value={filters.selectedExperience || ''}
            onChange={(e) => dispatch(setSelectedExperience(e.target.value || null))}
            className="filter-select"
          >
            <option value="">All Experience Levels</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>

          {/* Location Filter */}
          <select
            value={filters.selectedLocation || ''}
            onChange={(e) => dispatch(setSelectedLocation(e.target.value || null))}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Seattle, WA">Seattle, WA</option>
            <option value="Cupertino, CA">Cupertino, CA</option>
            <option value="New Delhi, India">New Delhi, India</option>
            {/* Add more locations as needed */}
          </select>

          {/* Type Filter */}
          <select
            value={filters.selectedType || ''}
            onChange={(e) => dispatch(setSelectedType(e.target.value || null))}
            className="filter-select"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            {/* Add more types as needed */}
          </select>

          {/* Salary Filter */}
          <select
            value={filters.selectedSalary || ''}
            onChange={(e) => dispatch(setSelectedSalary(e.target.value || null))}
            className="filter-select"
          >
            <option value="">All Salary Ranges</option>
            <option value="0-50000">Up to $50,000</option>
            <option value="50001-100000">$50,001 - $100,000</option>
            <option value="100001-150000">$100,001 - $150,000</option>
            <option value="150001-200000">$150,001 - $200,000</option>
            {/* Add more salary ranges as needed */}
          </select>

          <button onClick={() => dispatch(clearFilters())} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredJobs.length} jobs
      </div>

      {/* Jobs List */}
      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">No jobs found matching your criteria</div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h2 className="job-title">{job.title}</h2>
                <div className="job-meta">
                  <span className="company-name">{job.company.name}</span>
                  <span className="job-location">{job.location}</span>
                </div>
              </div>

              <div className="job-details">
                <div className="job-category">
                  <span className="category-badge">{job.category.name}</span>
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
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    <button className="apply-btn">Apply Now</button>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;
