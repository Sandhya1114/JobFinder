// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// // import { setJobs } from './store';
// import './Joblist.css'; // Import your CSS file
// import { setJobs } from '../redux/store';

// const JobList = () => {
//   const dispatch = useDispatch();
//   const jobs = useSelector(state => state.jobs.jobs);

//   useEffect(() => {
//     fetch('/api/jobs')
//       .then(res => res.json())
//       .then(data => {
//         dispatch(setJobs(data.jobs));
//       });
//   }, [dispatch]);

//   return (
//     <div className="job-list-container">
//       {jobs.map(job => (
//         <div key={job.id} className="job-card">
//           <h2>{job.title}</h2>
//           <p><strong>Company:</strong> {job.company}</p>
//           <p><strong>Location:</strong> {job.location}</p>
//           <p>{job.description}</p>
//           <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
//             <button className="apply-btn">Apply</button>
//           </a>
//         </div>
//       ))}
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

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    if (filters.selectedCategory && job.category.id !== filters.selectedCategory) {
      return false;
    }
    if (filters.selectedCompany && job.company.id !== filters.selectedCompany) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCategoryFilter = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const handleCompanyFilter = (companyId) => {
    dispatch(setSelectedCompany(companyId));
  };

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
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
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-dropdowns">
          <select
            value={filters.selectedCategory || ''}
            onChange={(e) => handleCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.selectedCompany || ''}
            onChange={(e) => handleCompanyFilter(e.target.value || null)}
            className="filter-select"
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <button onClick={handleClearFilters} className="clear-filters-btn">
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