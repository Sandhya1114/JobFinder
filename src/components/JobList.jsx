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
} from '../redux/store';
import './Joblist.css';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);

  const fetchInitialData = async () => {
    dispatch(setLoading(true));
    try {
      const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/categories'),
        fetch('/api/companies'),
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

  const filteredJobs = jobs.filter((job) => {
    const category = categories.find((cat) => cat.id === job.categoryId);
    const company = companies.find((comp) => comp.id === job.company.id);
    if (!category || !company) return false;

    if (filters.selectedCategory?.length > 0 && !filters.selectedCategory.includes(job.categoryId)) return false;
    if (filters.selectedCompany?.length > 0 && !filters.selectedCompany.includes(job.company.id)) return false;
    if (filters.selectedExperience?.length > 0 && !filters.selectedExperience.includes(job.experience)) return false;
    if (filters.selectedLocation?.length > 0 && !filters.selectedLocation.includes(job.location)) return false;
    if (filters.selectedType?.length > 0 && !filters.selectedType.includes(job.type)) return false;
    if (filters.selectedSalary?.length > 0) {
      const [minSalary, maxSalary] = job.salary ? [job.salary.min, job.salary.max] : [0, 0];
      const match = filters.selectedSalary.some(range => {
        const [min, max] = range.split('-').map(Number);
        return minSalary >= min && maxSalary <= max;
      });
      if (!match) return false;
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

  const formatSalary = (salary) => {
    if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
              <h4>Experience (yrs)</h4>
              {['Fresher', '1 yr', '2 yrs', '3 yrs', '4 yrs','5 yrs'].map((level) => (
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
              {['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India'].map((location) => (
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
              {['Full-time', 'Part-time', 'Contract'].map((type) => (
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
              <h4>Salary</h4>
              {['0-50000', '50001-100000', '100001-150000', '150001-200000'].map((range) => (
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
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="search-input"
            />
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
      </div>
    </div>
  );
};

export default JobList;

