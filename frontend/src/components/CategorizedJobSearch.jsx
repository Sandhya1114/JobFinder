import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Building2, Clock, DollarSign, Users, Code, Briefcase, Star, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const CategorizedJobSearch = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experience: '',
    type: '',
    location: '',
    salary: ''
  });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [pagination, setPagination] = useState({});

  // Sample data structure based on your API
  const jobCategories = [
    { id: 'all', name: 'All Jobs', icon: Briefcase, count: 0 },
    { id: 'skills', name: 'By Skills', icon: Code, count: 0 },
    { id: 'profession', name: 'By Profession', icon: Users, count: 0 },
    { id: 'experience', name: 'By Experience', icon: Star, count: 0 },
    { id: 'education', name: 'By Education', icon: BookOpen, count: 0 },
    { id: 'company', name: 'By Company', icon: Building2, count: 0 },
    { id: 'location', name: 'By Location', icon: MapPin, count: 0 }
  ];

  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const salaryRanges = ['0-30000', '30000-60000', '60000-100000', '100000+'];

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchCompanies();
    fetchJobs();
  }, []);

  // Fetch jobs when category or filters change
  useEffect(() => {
    fetchJobs();
  }, [activeCategory, searchTerm, filters]);

  const fetchCategories = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.salary) params.append('salary', filters.salary);

      // Add category-specific filters
      if (activeCategory !== 'all') {
        switch (activeCategory) {
          case 'skills':
            if (searchTerm) params.append('search', searchTerm);
            break;
          case 'profession':
            if (categories.length > 0) params.append('category', categories[0]?.id);
            break;
          case 'company':
            if (companies.length > 0) params.append('company', companies[0]?.id);
            break;
        }
      }

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();
      
      setJobs(data.jobs || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `$${min?.toLocaleString()}+`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {job.companies?.logo ? (
            <img 
              src={job.companies.logo} 
              alt={job.companies?.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600">{job.companies?.name}</p>
          </div>
        </div>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {job.categories?.name}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {job.type}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          {formatSalary(job.salary_min, job.salary_max)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Posted {new Date(job.created_at).toLocaleDateString()}
        </span>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Job</h1>
        <p className="text-gray-600">Browse jobs by categories, skills, and preferences</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {jobCategories.map(category => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filters */}
        <button
          onClick={() => setExpandedFilters(!expandedFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
          {expandedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.experience === level}
                        onChange={() => handleFilterChange('experience', level)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type === type}
                        onChange={() => handleFilterChange('type', type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Salary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div className="space-y-2">
                  {salaryRanges.map(range => (
                    <label key={range} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.salary === range}
                        onChange={() => handleFilterChange('salary', range)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        ${range.replace('-', ' - ').replace('+', '+')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-600">
          {pagination.totalJobs ? (
            <span>
              Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalJobs} jobs
            </span>
          ) : (
            <span>No jobs found</span>
          )}
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="created_at">Latest</option>
          <option value="title">Title A-Z</option>
          <option value="salary_min">Salary Low to High</option>
          <option value="salary_max">Salary High to Low</option>
        </select>
      </div>

      {/* Job Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => fetchJobs(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchJobs(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchJobs(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse different categories
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
              setFilters({ experience: '', type: '', location: '', salary: '' });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorizedJobSearch;