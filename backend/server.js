const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Setup
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ============ API ROUTES ============

// UPDATED: Get all jobs with pagination and filters (FIXED COMPANY SEARCH)
app.get('/api/jobs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      company,
      experience,
      location,
      type,
      salary,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Parse pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Start building the query
    let query = supabase
      .from('jobs')
      .select(`
        *,
        categories (id, name, slug),
        companies (id, name, logo)
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      const categories = Array.isArray(category) ? category : category.split(',');
      query = query.in('category_id', categories);
    }

    if (company) {
      const companies = Array.isArray(company) ? company : company.split(',');
      query = query.in('company_id', companies);
    }

    if (experience) {
      const experiences = Array.isArray(experience) ? experience : experience.split(',');
      const experienceConditions = experiences.map(exp => `experience.ilike.%${exp}%`).join(',');
      query = query.or(experienceConditions);
    }

    if (location) {
      const locations = Array.isArray(location) ? location : location.split(',');
      const locationConditions = locations.map(loc => `location.ilike.%${loc}%`).join(',');
      query = query.or(locationConditions);
    }

    if (type) {
      const types = Array.isArray(type) ? type : type.split(',');
      query = query.in('type', types);
    }

    if (salary) {
      const salaryRanges = Array.isArray(salary) ? salary : salary.split(',');
      const salaryConditions = salaryRanges.map(range => {
        const [min, max] = range.split('-').map(Number);
        if (max) {
          return `salary_min.gte.${min},salary_max.lte.${max}`;
        } else {
          return `salary_min.gte.${min}`;
        }
      }).join(',');
      if (salaryConditions) {
        query = query.or(salaryConditions);
      }
    }

    // ENHANCED SEARCH - Handle company name search
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      console.log('Applying search term:', searchTerm);
      
      // First, find company IDs that match the search term
      const { data: matchingCompanies } = await supabase
        .from('companies')
        .select('id')
        .ilike('name', `%${searchTerm}%`);

      // Find category IDs that match the search term
      const { data: matchingCategories } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${searchTerm}%`);

      // Build search conditions
      const searchConditions = [
        `title.ilike.%${searchTerm}%`,
        `description.ilike.%${searchTerm}%`,
        `location.ilike.%${searchTerm}%`
      ];

      // Add company filter if matching companies found
      if (matchingCompanies && matchingCompanies.length > 0) {
        const companyIds = matchingCompanies.map(c => c.id);
        searchConditions.push(`company_id.in.(${companyIds.join(',')})`);
      }

      // Add category filter if matching categories found
      if (matchingCategories && matchingCategories.length > 0) {
        const categoryIds = matchingCategories.map(c => c.id);
        searchConditions.push(`category_id.in.(${categoryIds.join(',')})`);
      }

      // Apply search conditions
      query = query.or(searchConditions.join(','));
    }

    // Apply sorting
    const ascending = sortOrder.toLowerCase() === 'asc';
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    console.log('Executing query with search:', search);

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Calculate pagination metadata
    const totalJobs = count || 0;
    const totalPages = Math.ceil(totalJobs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    console.log(`Search results: ${totalJobs} jobs found for search term: "${search}"`);

    res.json({
      jobs: jobs || [],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        jobsPerPage: limitNum,
        hasNextPage,
        hasPreviousPage,
        startIndex: offset + 1,
        endIndex: Math.min(offset + limitNum, totalJobs)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        categories (id, name, slug),
        companies (id, name, logo)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json({
      categories: categories || [],
      total: categories?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get companies
app.get('/api/companies', async (req, res) => {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json({
      companies: companies || [],
      total: companies?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile
app.get('/api/profile', async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      name: profile?.name || 'Abhishek Deshwal',
      email: profile?.email || 'abhishek@example.com',
      resume: profile?.resume_url || 'https://example.com/resume.pdf',
      skills: profile?.skills || ['React', 'JavaScript', 'Redux', 'HTML', 'CSS']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple file upload (just return success message)
app.post('/api/upload-resume', (req, res) => {
  res.json({ 
    message: 'Upload successful', 
    filePath: 'https://example.com/uploaded-resume.pdf' 
  });
});

// Stats
app.get('/api/jobs/stats', async (req, res) => {
  try {
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    const { count: totalCompanies } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    const { count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    res.json({
      totalJobs: totalJobs || 0,
      totalCompanies: totalCompanies || 0,
      totalCategories: totalCategories || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DEBUG ENDPOINTS ============

// Test company search directly
app.get('/api/debug/companies', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return res.json({ message: 'Please provide a search parameter. Example: /api/debug/companies?search=Google' });
    }

    // Search companies
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${search}%`);

    if (error) throw error;

    res.json({
      searchTerm: search,
      matchingCompanies: companies,
      count: companies?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test jobs by company name
app.get('/api/debug/jobs-by-company', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return res.json({ message: 'Please provide a search parameter. Example: /api/debug/jobs-by-company?search=Google' });
    }

    // First find matching companies
    const { data: companies, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .ilike('name', `%${search}%`);

    if (companyError) throw companyError;

    if (!companies || companies.length === 0) {
      return res.json({
        searchTerm: search,
        matchingCompanies: [],
        jobs: [],
        message: 'No companies found matching the search term'
      });
    }

    // Then find jobs for these companies
    const companyIds = companies.map(c => c.id);
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (id, name, logo),
        categories (id, name, slug)
      `)
      .in('company_id', companyIds);

    if (jobsError) throw jobsError;

    res.json({
      searchTerm: search,
      matchingCompanies: companies,
      jobs: jobs || [],
      jobCount: jobs?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test the full search functionality
app.get('/api/debug/full-search', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return res.json({ 
        message: 'Please provide a search parameter. Example: /api/debug/full-search?search=developer' 
      });
    }

    const searchTerm = search.trim();

    // Search in different areas
    const [companiesResult, categoriesResult, jobsResult] = await Promise.all([
      // Companies
      supabase
        .from('companies')
        .select('id, name')
        .ilike('name', `%${searchTerm}%`),
      
      // Categories  
      supabase
        .from('categories')
        .select('id, name')
        .ilike('name', `%${searchTerm}%`),
      
      // Jobs (title, description, location)
      supabase
        .from('jobs')
        .select('id, title, description, location')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
    ]);

    res.json({
      searchTerm,
      results: {
        companies: {
          data: companiesResult.data || [],
          count: companiesResult.data?.length || 0,
          error: companiesResult.error
        },
        categories: {
          data: categoriesResult.data || [],
          count: categoriesResult.data?.length || 0,
          error: categoriesResult.error
        },
        jobs: {
          data: jobsResult.data || [],
          count: jobsResult.data?.length || 0,
          error: jobsResult.error
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test database structure
app.get('/api/debug/structure', async (req, res) => {
  try {
    // Get sample data from each table to understand structure
    const [jobsSample, companiesSample, categoriesSample] = await Promise.all([
      supabase.from('jobs').select('*').limit(1),
      supabase.from('companies').select('*').limit(1),
      supabase.from('categories').select('*').limit(1)
    ]);

    res.json({
      tables: {
        jobs: {
          sample: jobsSample.data?.[0] || null,
          error: jobsSample.error,
          columns: jobsSample.data?.[0] ? Object.keys(jobsSample.data[0]) : []
        },
        companies: {
          sample: companiesSample.data?.[0] || null,
          error: companiesSample.error,
          columns: companiesSample.data?.[0] ? Object.keys(companiesSample.data[0]) : []
        },
        categories: {
          sample: categoriesSample.data?.[0] || null,
          error: categoriesSample.error,
          columns: categoriesSample.data?.[0] ? Object.keys(categoriesSample.data[0]) : []
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Debug endpoints available at:`);
  console.log(`   - http://localhost:${PORT}/api/debug/companies?search=YourCompanyName`);
  console.log(`   - http://localhost:${PORT}/api/debug/jobs-by-company?search=YourCompanyName`);
  console.log(`   - http://localhost:${PORT}/api/debug/full-search?search=YourSearchTerm`);
  console.log(`   - http://localhost:${PORT}/api/debug/structure`);
});