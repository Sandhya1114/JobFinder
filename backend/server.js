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

// // Get all jobs
// app.get('/api/jobs', async (req, res) => {
//   try {
//     const { data: jobs, error } = await supabase
//       .from('jobs')
//       .select(`
//         *,
//         categories (id, name, slug),
//         companies (id, name, logo)
//       `)
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     res.json({
//       jobs: jobs || [],
//       total: jobs?.length || 0
//     });
//   } catch (error) {
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

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
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

// ============ API ROUTES ============

// Get all jobs with pagination and filters
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
      // Use OR condition for multiple experience levels
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
      // Handle salary range filtering (assuming salary is stored as min-max or single values)
      // This is a simplified implementation - adjust based on your salary data structure
      const salaryConditions = salaryRanges.map(range => {
        const [min, max] = range.split('-').map(Number);
        return `salary_min.gte.${min},salary_max.lte.${max}`;
      }).join(',');
      if (salaryConditions) {
        query = query.or(salaryConditions);
      }
    }

    // Apply search
    if (search) {
      const searchTerm = search.trim();
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,companies.name.ilike.%${searchTerm}%,categories.name.ilike.%${searchTerm}%`);
    }

    // Apply sorting
    const ascending = sortOrder.toLowerCase() === 'asc';
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: jobs, error, count } = await query;

    if (error) throw error;

    // Calculate pagination metadata
    const totalJobs = count || 0;
    const totalPages = Math.ceil(totalJobs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});