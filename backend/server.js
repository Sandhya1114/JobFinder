// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

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
// Add these routes to your existing Express server
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';
    
    const [
      jobsStats,
      companiesStats,
      categoriesStats,
      recentJobsStats,
      applicationStats,
      savedJobsStats,
      recentJobs,
      categoryJobs,
      profileData
    ] = await Promise.all([
      // Total jobs count
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true }),
      
      // Total companies count
      supabase
        .from('companies')
        .select('*', { count: 'exact', head: true }),
      
      // Total categories count
      supabase
        .from('categories')
        .select('*', { count: 'exact', head: true }),
      
      // Jobs posted in last 7 days
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Applications count
      supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', mockUserId),

      // Saved jobs count
      supabase
        .from('saved_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', mockUserId),

      // Recent jobs
      supabase
        .from('jobs')
        .select(`
          id,
          title,
          location,
          type,
          created_at,
          salary_min,
          salary_max,
          companies (id, name, logo),
          categories (id, name)
        `)
        .order('created_at', { ascending: false })
        .limit(3),

      // Jobs by category for charts
      supabase
        .from('jobs')
        .select(`
          category_id,
          categories (id, name)
        `),

      // User profile
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', mockUserId)
        .single()
    ]);

    // Process category stats
    const categoryStats = {};
    categoryJobs.data?.forEach(job => {
      const categoryName = job.categories?.name || 'Unknown';
      categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
    });

    const chartData = Object.entries(categoryStats).map(([name, count]) => ({
      category: name,
      jobs: count
    })).slice(0, 5); // Top 5 categories

    res.json({
      overview: {
        totalJobs: jobsStats.count || 0,
        totalCompanies: companiesStats.count || 0,
        totalCategories: categoriesStats.count || 0,
        recentJobs: recentJobsStats.count || 0,
        totalApplications: applicationStats.count || 0
      },
      recentJobs: recentJobs.data || [],
      categoryStats: chartData,
      userStats: {
        savedJobs: savedJobsStats.count || 0,
        applications: applicationStats.count || 0,
        unreadMessages: 0 // TODO: Implement messages if needed
      },
      profile: profileData.data || {
        name: 'John Doe',
        email: 'john.doe@example.com',
        resume: '',
        skills: []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', mockUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      name: profile?.name || 'John Doe',
      email: profile?.email || 'john.doe@example.com',
      resume: profile?.resume_url || '',
      skills: profile?.skills || ['React', 'JavaScript', 'Node.js']
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/dashboard/profile', async (req, res) => {
  try {
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';
    const { name, email, skills } = req.body;

    const updateData = {
      user_id: mockUserId,
      updated_at: new Date().toISOString()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (skills) updateData.skills = skills;

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert([updateData])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('user_activities')
      .insert([
        {
          user_id: mockUserId,
          action: 'updated_profile',
          details: 'Profile information updated',
          created_at: new Date().toISOString()
        }
      ]);

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload resume
// Upload Resume
app.post('/api/dashboard/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    // ✅ Get user from Supabase auth token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid user token' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = path.extname(req.file.originalname);
    const fileName = `${user.id}-${Date.now()}${fileExt}`;

    // ✅ Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('resumes')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // ✅ Get public URL
    const { data: publicData } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(fileName);

    // ✅ Update profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ resume_url: publicData.publicUrl })
      .eq('id', user.id); // or whatever your PK is

    if (updateError) throw updateError;

    res.json({
      message: 'Resume uploaded successfully',
      fileUrl: publicData.publicUrl
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Apply to a job
app.post('/api/dashboard/apply/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';
    
    // Check if job exists
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company_id, companies(name)')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('user_id', mockUserId)
      .eq('job_id', jobId)
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('job_applications')
      .insert([
        {
          user_id: mockUserId,
          job_id: jobId,
          status: 'sent',
          applied_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('user_activities')
      .insert([
        {
          user_id: mockUserId,
          action: 'applied_to_job',
          details: `Applied to ${job.title} at ${job.companies?.name}`,
          created_at: new Date().toISOString()
        }
      ]);

    res.json({
      message: 'Application submitted successfully',
      application,
      jobTitle: job.title,
      companyName: job.companies?.name
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save a job
app.post('/api/dashboard/saved-jobs', async (req, res) => {
  try {
    const { jobId } = req.body;
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, company_id, companies(name)')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already saved
    const { data: existingSave } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', mockUserId)
      .eq('job_id', jobId)
      .single();

    if (existingSave) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    // Save job
    const { data: savedJob, error } = await supabase
      .from('saved_jobs')
      .insert([
        {
          user_id: mockUserId,
          job_id: jobId,
          saved_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('user_activities')
      .insert([
        {
          user_id: mockUserId,
          action: 'saved_job',
          details: `Saved ${job.title} at ${job.companies?.name}`,
          created_at: new Date().toISOString()
        }
      ]);

    res.json({
      message: 'Job saved successfully',
      savedJob,
      jobTitle: job.title,
      companyName: job.companies?.name
    });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove saved job
app.delete('/api/dashboard/saved-jobs/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';

    // Delete saved job
    const { data, error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', mockUserId)
      .eq('job_id', jobId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Saved job not found' });
      }
      throw error;
    }

    // Log activity
    await supabase
      .from('user_activities')
      .insert([
        {
          user_id: mockUserId,
          action: 'removed_saved_job',
          details: 'Removed job from saved list',
          created_at: new Date().toISOString()
        }
      ]);

    res.json({
      message: 'Job removed from saved list successfully',
      removedJob: data
    });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's saved jobs
app.get('/api/dashboard/my-saved-jobs', async (req, res) => {
  try {
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';

    const { data: savedJobs, error } = await supabase
      .from('saved_jobs')
      .select(`
        id,
        saved_at,
        jobs (
          id,
          title,
          location,
          type,
          salary_min,
          salary_max,
          created_at,
          companies (id, name, logo),
          categories (id, name)
        )
      `)
      .eq('user_id', mockUserId)
      .order('saved_at', { ascending: false });

    if (error) throw error;

    res.json({
      savedJobs: savedJobs || [],
      total: savedJobs?.length || 0
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's applications
app.get('/api/dashboard/my-applications', async (req, res) => {
  try {
    const mockUserId = '279a101a-69da-4c04-a414-992b339dd001';

    const { data: applications, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        status,
        applied_at,
        jobs (
          id,
          title,
          location,
          type,
          companies (id, name, logo),
          categories (id, name)
        )
      `)
      .eq('user_id', mockUserId)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    res.json({
      applications: applications || [],
      total: applications?.length || 0
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
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