// const express = require('express');
// const cors = require('cors');
// const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

// const app = express();

// // Setup
// app.use(cors());
// app.use(express.json());
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const app = express();

// ===== Middleware =====
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

// Add these routes to your existing Express.js backend

// ============ DASHBOARD API ROUTES ============

// Middleware to get user from auth header (you'll need to implement this)
// Updated authentication middleware in server.js
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
// ============ PROFILE ROUTES ============
// Helper function to ensure profile exists

// Get user profile (Fixed to handle missing profiles)
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    // First, try to get existing profile
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    // If no profile exists, create one
    if (!profile) {
      console.log('No profile found, creating new profile for user:', req.user.id);
      
      const newProfileData = {
        id: req.user.id,
        name: req.user.user_metadata?.full_name || 'New User',
        email: req.user.email,
        about: '',
        phone: '',
        location: '',
        resume_url: '',
        skills: []
      };

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfileData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      profile = newProfile;
    }

    // Return format compatible with your existing endpoint
    res.json({
      name: profile?.name || 'New User',
      email: profile?.email || req.user.email,
      about: profile?.about || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      resume: profile?.resume_url || '',
      skills: profile?.skills || []
    });
  } catch (error) {
    console.error('Profile endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (Fixed to handle upsert)
app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { name, about, phone, location, resume, skills } = req.body;

    // Prepare update data
    const updateData = {
      name,
      about,
      phone,
      location,
      resume_url: resume, // Map resume to resume_url
      skills: Array.isArray(skills) ? skills : []
    };

    // Use upsert to handle both insert and update
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: req.user.id,
          email: req.user.email, // Include email for new records
          ...updateData
        },
        { 
          onConflict: 'id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: data.name,
        email: data.email,
        about: data.about,
        phone: data.phone,
        location: data.location,
        resume: data.resume_url,
        skills: data.skills
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ EDUCATION ROUTES ============

// Get user's education
app.get('/api/education', authenticateUser, async (req, res) => {
  try {
    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', req.user.id)
      .order('start_date', { ascending: false });

    if (error) throw error;

    res.json({
      education: education || [],
      total: education?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add education
app.post('/api/education', authenticateUser, async (req, res) => {
  try {
    const educationData = {
      ...req.body,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('education')
      .insert(educationData)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Education added successfully',
      education: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update education
app.put('/api/education/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('education')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Education updated successfully',
      education: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete education
app.delete('/api/education/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SAVED JOBS ROUTES ============

// Get user's saved jobs with job details
app.get('/api/saved-jobs', authenticateUser, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('saved_jobs')
      .select(`
        *,
        jobs (
          *,
          companies (id, name, logo),
          categories (id, name, slug)
        )
      `, { count: 'exact' })
      .eq('user_id', req.user.id);

    if (status) {
      query = query.eq('application_status', status);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: savedJobs, error, count } = await query;

    if (error) throw error;

    // Calculate pagination
    const totalJobs = count || 0;
    const totalPages = Math.ceil(totalJobs / limitNum);

    res.json({
      savedJobs: savedJobs || [],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        jobsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a job
app.post('/api/saved-jobs', authenticateUser, async (req, res) => {
  try {
    const { job_id, notes, priority } = req.body;

    // Check if job exists
    const { data: jobExists } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', job_id)
      .single();

    if (!jobExists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        user_id: req.user.id,
        job_id,
        notes,
        priority: priority || 0
      })
      .select(`
        *,
        jobs (
          *,
          companies (id, name, logo),
          categories (id, name, slug)
        )
      `)
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Job already saved' });
      }
      throw error;
    }

    res.json({
      message: 'Job saved successfully',
      savedJob: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update saved job status
app.put('/api/saved-jobs/:id', authenticateUser, async (req, res) => {
  try {
    const { application_status, notes, priority, application_date, reminder_date } = req.body;

    const { data, error } = await supabase
      .from('saved_jobs')
      .update({
        application_status,
        notes,
        priority,
        application_date,
        reminder_date
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Saved job updated successfully',
      savedJob: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove saved job
app.delete('/api/saved-jobs/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if job is saved
app.get('/api/jobs/:id/saved', authenticateUser, async (req, res) => {
  try {
    const { data: savedJob, error } = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('job_id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      isSaved: !!savedJob,
      savedJob: savedJob || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SKILLS ROUTES ============

// Get user's skills
app.get('/api/skills', authenticateUser, async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('skills')
      .select('*')
      .eq('user_id', req.user.id);

    if (category) {
      query = query.eq('category', category);
    }

    query = query.order('skill_name');

    const { data: skills, error } = await query;

    if (error) throw error;

    res.json({
      skills: skills || [],
      total: skills?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add skill
app.post('/api/skills', authenticateUser, async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('skills')
      .insert(skillData)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Skill added successfully',
      skill: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update skill
app.put('/api/skills/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Skill updated successfully',
      skill: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete skill
app.delete('/api/skills/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RESUMES ROUTES ============

// Get user's resumes
app.get('/api/resumes', authenticateUser, async (req, res) => {
  try {
    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      resumes: resumes || [],
      total: resumes?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add resume
app.post('/api/resumes', authenticateUser, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('resumes')
      .insert(resumeData)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Resume added successfully',
      resume: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
app.delete('/api/resumes/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DASHBOARD STATS ============
const sanitizeDateFields = (data) => {
  const sanitized = { ...data };
  
  // List of date fields that might be empty strings
  const dateFields = ['start_date', 'end_date', 'application_date', 'reminder_date'];
  
  dateFields.forEach(field => {
    if (sanitized[field] === '' || sanitized[field] === undefined) {
      sanitized[field] = null;
    }
  });
  
  // Special handling for is_current flag
  if (sanitized.is_current === true) {
    sanitized.end_date = null;
  }
  
  return sanitized;
};
// Get user dashboard stats
app.get('/api/dashboard/stats', authenticateUser, async (req, res) => {
  try {
    const [savedJobsResult, appliedJobsResult, skillsResult, educationResult] = await Promise.all([
      // Total saved jobs
      supabase
        .from('saved_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id),
      
      // Applied jobs
      supabase
        .from('saved_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id)
        .eq('application_status', 'applied'),
      
      // Skills count
      supabase
        .from('skills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id),
      
      // Education count
      supabase
        .from('education')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id)
    ]);

    res.json({
      savedJobs: savedJobsResult.count || 0,
      appliedJobs: appliedJobsResult.count || 0,
      totalSkills: skillsResult.count || 0,
      totalEducation: educationResult.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WORK EXPERIENCE ROUTES ============

// Get user's work experience
app.get('/api/work-experience', authenticateUser, async (req, res) => {
  try {
    const { data: experience, error } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', req.user.id)
      .order('start_date', { ascending: false });

    if (error) throw error;

    res.json({
      experience: experience || [],
      total: experience?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add work experience
app.post('/api/work-experience', authenticateUser, async (req, res) => {
  try {
    const experienceData = {
      ...req.body,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('work_experience')
      .insert(experienceData)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Work experience added successfully',
      experience: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update work experience
app.put('/api/work-experience/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('work_experience')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Work experience updated successfully',
      experience: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete work experience
app.delete('/api/work-experience/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('work_experience')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Work experience deleted successfully' });
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