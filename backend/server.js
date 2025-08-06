// // const express = require('express');
// // const cors = require('cors');
// // const { createClient } = require('@supabase/supabase-js');
// // require('dotenv').config();

// // const app = express();

// // // Setup
// // app.use(cors());
// // app.use(express.json());

// // // Supabase client
// // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// // // ============ API ROUTES ============

// // // Get all jobs
// // app.get('/api/jobs', async (req, res) => {
// //   try {
// //     const { data: jobs, error } = await supabase
// //       .from('jobs')
// //       .select(`
// //         *,
// //         categories (id, name, slug),
// //         companies (id, name, logo)
// //       `)
// //       .order('created_at', { ascending: false });

// //     if (error) throw error;

// //     res.json({
// //       jobs: jobs || [],
// //       total: jobs?.length || 0
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });


// // // Get job by ID
// // app.get('/api/jobs/:id', async (req, res) => {
// //   try {
// //     const { data: job, error } = await supabase
// //       .from('jobs')
// //       .select(`
// //         *,
// //         categories (id, name, slug),
// //         companies (id, name, logo)
// //       `)
// //       .eq('id', req.params.id)
// //       .single();

// //     if (error) throw error;
// //     res.json({ job });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get categories
// // app.get('/api/categories', async (req, res) => {
// //   try {
// //     const { data: categories, error } = await supabase
// //       .from('categories')
// //       .select('*')
// //       .order('name');

// //     if (error) throw error;
// //     res.json({
// //       categories: categories || [],
// //       total: categories?.length || 0
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get companies
// // app.get('/api/companies', async (req, res) => {
// //   try {
// //     const { data: companies, error } = await supabase
// //       .from('companies')
// //       .select('*')
// //       .order('name');

// //     if (error) throw error;
// //     res.json({
// //       companies: companies || [],
// //       total: companies?.length || 0
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Get profile
// // app.get('/api/profile', async (req, res) => {
// //   try {
// //     const { data: profile, error } = await supabase
// //       .from('profiles')
// //       .select('*')
// //       .limit(1)
// //       .single();

// //     if (error && error.code !== 'PGRST116') throw error;

// //     res.json({
// //       name: profile?.name || 'Abhishek Deshwal',
// //       email: profile?.email || 'abhishek@example.com',
// //       resume: profile?.resume_url || 'https://example.com/resume.pdf',
// //       skills: profile?.skills || ['React', 'JavaScript', 'Redux', 'HTML', 'CSS']
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Simple file upload (just return success message)
// // app.post('/api/upload-resume', (req, res) => {
// //   res.json({ 
// //     message: 'Upload successful', 
// //     filePath: 'https://example.com/uploaded-resume.pdf' 
// //   });
// // });


// // // Stats
// // app.get('/api/jobs/stats', async (req, res) => {
// //   try {
// //     const { count: totalJobs } = await supabase
// //       .from('jobs')
// //       .select('*', { count: 'exact', head: true });

// //     const { count: totalCompanies } = await supabase
// //       .from('companies')
// //       .select('*', { count: 'exact', head: true });

// //     const { count: totalCategories } = await supabase
// //       .from('categories')
// //       .select('*', { count: 'exact', head: true });

// //     res.json({
// //       totalJobs: totalJobs || 0,
// //       totalCompanies: totalCompanies || 0,
// //       totalCategories: totalCategories || 0
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'OK', message: 'Server is running' });
// // });

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });
// const express = require('express');
// const cors = require('cors');
// const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

// const app = express();

// // Setup
// app.use(cors());
// app.use(express.json());

// // Supabase client
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// // ============ API ROUTES ============

// // UPDATED: Get all jobs with pagination and filters (FIXED COMPANY SEARCH)
// app.get('/api/jobs', async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       category,
//       company,
//       experience,
//       location,
//       type,
//       salary,
//       search,
//       sortBy = 'created_at',
//       sortOrder = 'desc'
//     } = req.query;

//     // Parse pagination parameters
//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const offset = (pageNum - 1) * limitNum;

//     // Start building the query
//     let query = supabase
//       .from('jobs')
//       .select(`
//         *,
//         categories (id, name, slug),
//         companies (id, name, logo)
//       `, { count: 'exact' });

//     // Apply filters
//     if (category) {
//       const categories = Array.isArray(category) ? category : category.split(',');
//       query = query.in('category_id', categories);
//     }

//     if (company) {
//       const companies = Array.isArray(company) ? company : company.split(',');
//       query = query.in('company_id', companies);
//     }

//     if (experience) {
//       const experiences = Array.isArray(experience) ? experience : experience.split(',');
//       const experienceConditions = experiences.map(exp => `experience.ilike.%${exp}%`).join(',');
//       query = query.or(experienceConditions);
//     }

//     if (location) {
//       const locations = Array.isArray(location) ? location : location.split(',');
//       const locationConditions = locations.map(loc => `location.ilike.%${loc}%`).join(',');
//       query = query.or(locationConditions);
//     }

//     if (type) {
//       const types = Array.isArray(type) ? type : type.split(',');
//       query = query.in('type', types);
//     }

//     if (salary) {
//       const salaryRanges = Array.isArray(salary) ? salary : salary.split(',');
//       const salaryConditions = salaryRanges.map(range => {
//         const [min, max] = range.split('-').map(Number);
//         if (max) {
//           return `salary_min.gte.${min},salary_max.lte.${max}`;
//         } else {
//           return `salary_min.gte.${min}`;
//         }
//       }).join(',');
//       if (salaryConditions) {
//         query = query.or(salaryConditions);
//       }
//     }

//     // ENHANCED SEARCH - Handle company name search
//     if (search && search.trim().length > 0) {
//       const searchTerm = search.trim();
//       console.log('Applying search term:', searchTerm);
      
//       // First, find company IDs that match the search term
//       const { data: matchingCompanies } = await supabase
//         .from('companies')
//         .select('id')
//         .ilike('name', `%${searchTerm}%`);

//       // Find category IDs that match the search term
//       const { data: matchingCategories } = await supabase
//         .from('categories')
//         .select('id')
//         .ilike('name', `%${searchTerm}%`);

//       // Build search conditions
//       const searchConditions = [
//         `title.ilike.%${searchTerm}%`,
//         `description.ilike.%${searchTerm}%`,
//         `location.ilike.%${searchTerm}%`
//       ];

//       // Add company filter if matching companies found
//       if (matchingCompanies && matchingCompanies.length > 0) {
//         const companyIds = matchingCompanies.map(c => c.id);
//         searchConditions.push(`company_id.in.(${companyIds.join(',')})`);
//       }

//       // Add category filter if matching categories found
//       if (matchingCategories && matchingCategories.length > 0) {
//         const categoryIds = matchingCategories.map(c => c.id);
//         searchConditions.push(`category_id.in.(${categoryIds.join(',')})`);
//       }

//       // Apply search conditions
//       query = query.or(searchConditions.join(','));
//     }

//     // Apply sorting
//     const ascending = sortOrder.toLowerCase() === 'asc';
//     query = query.order(sortBy, { ascending });

//     // Apply pagination
//     query = query.range(offset, offset + limitNum - 1);

//     console.log('Executing query with search:', search);

//     const { data: jobs, error, count } = await query;

//     if (error) {
//       console.error('Supabase query error:', error);
//       throw error;
//     }

//     // Calculate pagination metadata
//     const totalJobs = count || 0;
//     const totalPages = Math.ceil(totalJobs / limitNum);
//     const hasNextPage = pageNum < totalPages;
//     const hasPreviousPage = pageNum > 1;

//     console.log(`Search results: ${totalJobs} jobs found for search term: "${search}"`);

//     res.json({
//       jobs: jobs || [],
//       pagination: {
//         currentPage: pageNum,
//         totalPages,
//         totalJobs,
//         jobsPerPage: limitNum,
//         hasNextPage,
//         hasPreviousPage,
//         startIndex: offset + 1,
//         endIndex: Math.min(offset + limitNum, totalJobs)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get job by ID
// app.get('/api/jobs/:id', async (req, res) => {
//   try {
//     const { data: job, error } = await supabase
//       .from('jobs')
//       .select(`
//         *,
//         categories (id, name, slug),
//         companies (id, name, logo)
//       `)
//       .eq('id', req.params.id)
//       .single();

//     if (error) throw error;
//     res.json({ job });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get categories
// app.get('/api/categories', async (req, res) => {
//   try {
//     const { data: categories, error } = await supabase
//       .from('categories')
//       .select('*')
//       .order('name');

//     if (error) throw error;
//     res.json({
//       categories: categories || [],
//       total: categories?.length || 0
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get companies
// app.get('/api/companies', async (req, res) => {
//   try {
//     const { data: companies, error } = await supabase
//       .from('companies')
//       .select('*')
//       .order('name');

//     if (error) throw error;
//     res.json({
//       companies: companies || [],
//       total: companies?.length || 0
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get profile
// app.get('/api/profile', async (req, res) => {
//   try {
//     const { data: profile, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .limit(1)
//       .single();

//     if (error && error.code !== 'PGRST116') throw error;

//     res.json({
//       name: profile?.name || 'Abhishek Deshwal',
//       email: profile?.email || 'abhishek@example.com',
//       resume: profile?.resume_url || 'https://example.com/resume.pdf',
//       skills: profile?.skills || ['React', 'JavaScript', 'Redux', 'HTML', 'CSS']
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Simple file upload (just return success message)
// app.post('/api/upload-resume', (req, res) => {
//   res.json({ 
//     message: 'Upload successful', 
//     filePath: 'https://example.com/uploaded-resume.pdf' 
//   });
// });

// // Stats
// app.get('/api/jobs/stats', async (req, res) => {
//   try {
//     const { count: totalJobs } = await supabase
//       .from('jobs')
//       .select('*', { count: 'exact', head: true });

//     const { count: totalCompanies } = await supabase
//       .from('companies')
//       .select('*', { count: 'exact', head: true });

//     const { count: totalCategories } = await supabase
//       .from('categories')
//       .select('*', { count: 'exact', head: true });

//     res.json({
//       totalJobs: totalJobs || 0,
//       totalCompanies: totalCompanies || 0,
//       totalCategories: totalCategories || 0
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ============ DEBUG ENDPOINTS ============

// // Test company search directly
// app.get('/api/debug/companies', async (req, res) => {
//   try {
//     const { search } = req.query;
    
//     if (!search) {
//       return res.json({ message: 'Please provide a search parameter. Example: /api/debug/companies?search=Google' });
//     }

//     // Search companies
//     const { data: companies, error } = await supabase
//       .from('companies')
//       .select('*')
//       .ilike('name', `%${search}%`);

//     if (error) throw error;

//     res.json({
//       searchTerm: search,
//       matchingCompanies: companies,
//       count: companies?.length || 0
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Test jobs by company name
// app.get('/api/debug/jobs-by-company', async (req, res) => {
//   try {
//     const { search } = req.query;
    
//     if (!search) {
//       return res.json({ message: 'Please provide a search parameter. Example: /api/debug/jobs-by-company?search=Google' });
//     }

//     // First find matching companies
//     const { data: companies, error: companyError } = await supabase
//       .from('companies')
//       .select('id, name')
//       .ilike('name', `%${search}%`);

//     if (companyError) throw companyError;

//     if (!companies || companies.length === 0) {
//       return res.json({
//         searchTerm: search,
//         matchingCompanies: [],
//         jobs: [],
//         message: 'No companies found matching the search term'
//       });
//     }

//     // Then find jobs for these companies
//     const companyIds = companies.map(c => c.id);
//     const { data: jobs, error: jobsError } = await supabase
//       .from('jobs')
//       .select(`
//         *,
//         companies (id, name, logo),
//         categories (id, name, slug)
//       `)
//       .in('company_id', companyIds);

//     if (jobsError) throw jobsError;

//     res.json({
//       searchTerm: search,
//       matchingCompanies: companies,
//       jobs: jobs || [],
//       jobCount: jobs?.length || 0
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Test the full search functionality
// app.get('/api/debug/full-search', async (req, res) => {
//   try {
//     const { search } = req.query;
    
//     if (!search) {
//       return res.json({ 
//         message: 'Please provide a search parameter. Example: /api/debug/full-search?search=developer' 
//       });
//     }

//     const searchTerm = search.trim();

//     // Search in different areas
//     const [companiesResult, categoriesResult, jobsResult] = await Promise.all([
//       // Companies
//       supabase
//         .from('companies')
//         .select('id, name')
//         .ilike('name', `%${searchTerm}%`),
      
//       // Categories  
//       supabase
//         .from('categories')
//         .select('id, name')
//         .ilike('name', `%${searchTerm}%`),
      
//       // Jobs (title, description, location)
//       supabase
//         .from('jobs')
//         .select('id, title, description, location')
//         .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
//     ]);

//     res.json({
//       searchTerm,
//       results: {
//         companies: {
//           data: companiesResult.data || [],
//           count: companiesResult.data?.length || 0,
//           error: companiesResult.error
//         },
//         categories: {
//           data: categoriesResult.data || [],
//           count: categoriesResult.data?.length || 0,
//           error: categoriesResult.error
//         },
//         jobs: {
//           data: jobsResult.data || [],
//           count: jobsResult.data?.length || 0,
//           error: jobsResult.error
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Test database structure
// app.get('/api/debug/structure', async (req, res) => {
//   try {
//     // Get sample data from each table to understand structure
//     const [jobsSample, companiesSample, categoriesSample] = await Promise.all([
//       supabase.from('jobs').select('*').limit(1),
//       supabase.from('companies').select('*').limit(1),
//       supabase.from('categories').select('*').limit(1)
//     ]);

//     res.json({
//       tables: {
//         jobs: {
//           sample: jobsSample.data?.[0] || null,
//           error: jobsSample.error,
//           columns: jobsSample.data?.[0] ? Object.keys(jobsSample.data[0]) : []
//         },
//         companies: {
//           sample: companiesSample.data?.[0] || null,
//           error: companiesSample.error,
//           columns: companiesSample.data?.[0] ? Object.keys(companiesSample.data[0]) : []
//         },
//         categories: {
//           sample: categoriesSample.data?.[0] || null,
//           error: categoriesSample.error,
//           columns: categoriesSample.data?.[0] ? Object.keys(categoriesSample.data[0]) : []
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Debug endpoints available at:`);
//   console.log(`   - http://localhost:${PORT}/api/debug/companies?search=YourCompanyName`);
//   console.log(`   - http://localhost:${PORT}/api/debug/jobs-by-company?search=YourCompanyName`);
//   console.log(`   - http://localhost:${PORT}/api/debug/full-search?search=YourSearchTerm`);
//   console.log(`   - http://localhost:${PORT}/api/debug/structure`);
// });
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

// ============ HELPER FUNCTIONS ============

// Cache for search results to improve performance
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params) {
  return JSON.stringify(params);
}

function getFromCache(key) {
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  searchCache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Clean up old cache entries
  if (searchCache.size > 100) {
    const oldestKey = searchCache.keys().next().value;
    searchCache.delete(oldestKey);
  }
}

// Build search conditions for companies and categories
async function buildSearchConditions(searchTerm) {
  const conditions = [
    `title.ilike.%${searchTerm}%`,
    `description.ilike.%${searchTerm}%`,
    `location.ilike.%${searchTerm}%`,
    `experience.ilike.%${searchTerm}%`,
    `type.ilike.%${searchTerm}%`
  ];

  try {
    // Parallel search for companies and categories
    const [companiesResult, categoriesResult] = await Promise.all([
      supabase
        .from('companies')
        .select('id')
        .ilike('name', `%${searchTerm}%`),
      supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${searchTerm}%`)
    ]);

    // Add company conditions
    if (companiesResult.data && companiesResult.data.length > 0) {
      const companyIds = companiesResult.data.map(c => c.id);
      conditions.push(`company_id.in.(${companyIds.join(',')})`);
    }

    // Add category conditions
    if (categoriesResult.data && categoriesResult.data.length > 0) {
      const categoryIds = categoriesResult.data.map(c => c.id);
      conditions.push(`category_id.in.(${categoryIds.join(',')})`);
    }
  } catch (error) {
    console.error('Error building search conditions:', error);
  }

  return conditions;
}

// ============ API ROUTES ============

// ENHANCED: Get all jobs with optimized pagination and filters for infinite scroll
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

    // Validate and parse pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Max 100 jobs per request
    const offset = (pageNum - 1) * limitNum;

    console.log(`📄 Page ${pageNum}, Limit ${limitNum}, Offset ${offset}`);

    // Create cache key for this request
    const cacheKey = getCacheKey({
      page: pageNum,
      limit: limitNum,
      category,
      company,
      experience,
      location,
      type,
      salary,
      search: search?.trim(),
      sortBy,
      sortOrder
    });

    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      console.log('📦 Returning cached result');
      return res.json(cachedResult);
    }

    // Start building the query with optimized select
    let query = supabase
      .from('jobs')
      .select(`
        id,
        title,
        description,
        location,
        experience,
        type,
        salary_min,
        salary_max,
        salary_currency,
        apply_url,
        created_at,
        updated_at,
        company_id,
        category_id,
        requirements,
        categories!inner (id, name, slug),
        companies!inner (id, name, logo)
      `, { count: 'exact' });

    // Apply filters in order of selectivity (most selective first)
    if (company) {
      const companies = Array.isArray(company) ? company : company.split(',').filter(Boolean);
      if (companies.length > 0) {
        query = query.in('company_id', companies);
      }
    }

    if (category) {
      const categories = Array.isArray(category) ? category : category.split(',').filter(Boolean);
      if (categories.length > 0) {
        query = query.in('category_id', categories);
      }
    }

    if (type) {
      const types = Array.isArray(type) ? type : type.split(',').filter(Boolean);
      if (types.length > 0) {
        query = query.in('type', types);
      }
    }

    // Handle experience filter with flexible matching
    if (experience) {
      const experiences = Array.isArray(experience) ? experience : experience.split(',').filter(Boolean);
      if (experiences.length > 0) {
        const experienceConditions = experiences.map(exp => {
          // Handle different experience formats
          if (exp.toLowerCase() === 'fresher') {
            return 'experience.ilike.%fresher%,experience.ilike.%0%,experience.ilike.%entry%';
          }
          return `experience.ilike.%${exp}%`;
        }).join(',');
        query = query.or(experienceConditions);
      }
    }

    // Handle location filter with flexible matching
    if (location) {
      const locations = Array.isArray(location) ? location : location.split(',').filter(Boolean);
      if (locations.length > 0) {
        const locationConditions = locations.map(loc => `location.ilike.%${loc.trim()}%`).join(',');
        query = query.or(locationConditions);
      }
    }

    // Handle salary range filter
    if (salary) {
      const salaryRanges = Array.isArray(salary) ? salary : salary.split(',').filter(Boolean);
      if (salaryRanges.length > 0) {
        const salaryConditions = [];
        
        for (const range of salaryRanges) {
          const parts = range.split('-');
          const min = parseInt(parts[0]);
          const max = parts[1] ? parseInt(parts[1]) : null;
          
          if (!isNaN(min)) {
            if (max && !isNaN(max)) {
              // Range: salary_min >= min AND salary_max <= max
              salaryConditions.push(`and(salary_min.gte.${min},salary_max.lte.${max})`);
            } else {
              // Minimum only: salary_min >= min
              salaryConditions.push(`salary_min.gte.${min}`);
            }
          }
        }
        
        if (salaryConditions.length > 0) {
          query = query.or(salaryConditions.join(','));
        }
      }
    }

    // Enhanced search functionality
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      console.log('🔍 Applying search term:', searchTerm);
      
      // Build comprehensive search conditions
      const searchConditions = await buildSearchConditions(searchTerm);
      
      if (searchConditions.length > 0) {
        query = query.or(searchConditions.join(','));
      }
    }

    // Apply sorting with index-friendly defaults
    const validSortFields = ['created_at', 'updated_at', 'title', 'salary_min', 'salary_max'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const ascending = sortOrder.toLowerCase() === 'asc';
    
    query = query.order(finalSortBy, { ascending });

    // Add secondary sort for consistency in pagination
    if (finalSortBy !== 'id') {
      query = query.order('id', { ascending: true });
    }

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    console.log('⏳ Executing query...');
    const startTime = Date.now();

    const { data: jobs, error, count } = await query;

    const queryTime = Date.now() - startTime;
    console.log(`✅ Query completed in ${queryTime}ms`);

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw error;
    }

    // Process jobs data for consistent format
    const processedJobs = (jobs || []).map(job => ({
      ...job,
      // Ensure salary object format for frontend compatibility
      salary: job.salary_min && job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.salary_currency || 'USD'
      } : null,
      // Ensure consistent URL field
      applyUrl: job.apply_url,
      // Ensure requirements is always an array
      requirements: Array.isArray(job.requirements) ? job.requirements : 
                   (job.requirements ? [job.requirements] : [])
    }));

    // Calculate pagination metadata
    const totalJobs = count || 0;
    const totalPages = Math.ceil(totalJobs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;
    const startIndex = Math.min(offset + 1, totalJobs);
    const endIndex = Math.min(offset + limitNum, totalJobs);

    const result = {
      jobs: processedJobs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        jobsPerPage: limitNum,
        hasNextPage,
        hasPreviousPage,
        startIndex,
        endIndex
      },
      meta: {
        queryTime: `${queryTime}ms`,
        cached: false
      }
    };

    // Cache the result
    setCache(cacheKey, result);

    console.log(`📊 Returning ${processedJobs.length} jobs (${startIndex}-${endIndex} of ${totalJobs})`);

    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get job by ID with enhanced error handling
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Validate ID format
    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        categories (id, name, slug),
        companies (id, name, logo)
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Job not found' });
      }
      throw error;
    }

    // Process job data for consistent format
    const processedJob = {
      ...job,
      salary: job.salary_min && job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.salary_currency || 'USD'
      } : null,
      applyUrl: job.apply_url,
      requirements: Array.isArray(job.requirements) ? job.requirements : 
                   (job.requirements ? [job.requirements] : [])
    };

    res.json({ job: processedJob });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get categories with caching
app.get('/api/categories', async (req, res) => {
  try {
    const cacheKey = 'categories_all';
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    const result = {
      categories: categories || [],
      total: categories?.length || 0
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get companies with caching
app.get('/api/companies', async (req, res) => {
  try {
    const cacheKey = 'companies_all';
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) throw error;

    const result = {
      companies: companies || [],
      total: companies?.length || 0
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching companies:', error);
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
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced file upload endpoint
app.post('/api/upload-resume', (req, res) => {
  // In a real implementation, you would handle file upload here
  // For now, return a mock success response
  res.json({ 
    message: 'Upload successful', 
    filePath: `https://example.com/uploaded-resume-${Date.now()}.pdf`,
    uploadedAt: new Date().toISOString()
  });
});

// Enhanced stats endpoint
app.get('/api/jobs/stats', async (req, res) => {
  try {
    const cacheKey = 'stats_overview';
    const cached = getFromCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Parallel execution for better performance
    const [jobsResult, companiesResult, categoriesResult] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true })
    ]);

    const result = {
      totalJobs: jobsResult.count || 0,
      totalCompanies: companiesResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      lastUpdated: new Date().toISOString()
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ENHANCED DEBUG ENDPOINTS ============

// Clear cache endpoint (for development)
app.delete('/api/debug/cache', (req, res) => {
  searchCache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

// Cache status endpoint
app.get('/api/debug/cache', (req, res) => {
  const cacheEntries = Array.from(searchCache.entries()).map(([key, value]) => ({
    key: JSON.parse(key),
    size: JSON.stringify(value.data).length,
    age: Date.now() - value.timestamp,
    expired: Date.now() - value.timestamp > CACHE_TTL
  }));

  res.json({
    totalEntries: searchCache.size,
    entries: cacheEntries.slice(0, 10), // Show first 10 entries
    memory: {
      totalSize: cacheEntries.reduce((sum, entry) => sum + entry.size, 0),
      expiredEntries: cacheEntries.filter(entry => entry.expired).length
    }
  });
});

// Performance test endpoint
app.get('/api/debug/performance', async (req, res) => {
  try {
    const { iterations = 3, page = 1, limit = 20 } = req.query;
    
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      await supabase
        .from('jobs')
        .select(`
          id, title, description, location,
          categories (id, name),
          companies (id, name)
        `)
        .range((page - 1) * limit, page * limit - 1);
      
      results.push(Date.now() - startTime);
    }
    
    res.json({
      iterations: results.length,
      times: results,
      average: results.reduce((sum, time) => sum + time, 0) / results.length,
      min: Math.min(...results),
      max: Math.max(...results)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test infinite scroll endpoint
app.get('/api/debug/infinite-scroll', async (req, res) => {
  try {
    const { startPage = 1, endPage = 5, limit = 20 } = req.query;
    
    const pages = [];
    const start = parseInt(startPage);
    const end = parseInt(endPage);
    
    for (let page = start; page <= end; page++) {
      const response = await fetch(`http://localhost:${PORT}/api/jobs?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      pages.push({
        page,
        jobCount: data.jobs?.length || 0,
        hasNextPage: data.pagination?.hasNextPage,
        totalJobs: data.pagination?.totalJobs
      });
    }
    
    res.json({
      testRange: `${start}-${end}`,
      pages,
      summary: {
        totalJobsLoaded: pages.reduce((sum, p) => sum + p.jobCount, 0),
        pagesWithJobs: pages.filter(p => p.jobCount > 0).length,
        lastPageHasNext: pages[pages.length - 1]?.hasNextPage
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Original debug endpoints (kept for compatibility)
app.get('/api/debug/companies', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return res.json({ 
        message: 'Please provide a search parameter. Example: /api/debug/companies?search=Google' 
      });
    }

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

// Health check with enhanced information
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    cache: {
      entries: searchCache.size,
      memoryUsage: process.memoryUsage()
    }
  });
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============ SERVER START ============

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Enhanced API with infinite scroll support`);
  console.log(`🔧 Debug endpoints:`);
  console.log(`   - GET  /api/debug/cache - View cache status`);
  console.log(`   - DELETE /api/debug/cache - Clear cache`);
  console.log(`   - GET  /api/debug/performance - Performance test`);
  console.log(`   - GET  /api/debug/infinite-scroll - Test infinite scroll`);
  console.log(`   - GET  /api/debug/companies?search=term - Company search`);
  console.log(`📈 Performance optimizations enabled`);
});