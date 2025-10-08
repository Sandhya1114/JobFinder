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
// Add this to your existing server.js file after your other route definitions

// ============ GROQ AI ANALYSIS ROUTES ============
/// Enhanced ATS Resume Analysis Endpoint
// app.post('/api/analyze-resume', async (req, res) => {
//   try {
//     console.log('📄 ATS Resume analysis endpoint hit');
    
//     const { resumeContent, jobDescContent } = req.body;

//     if (!resumeContent || resumeContent.trim().length < 10) {
//       return res.status(400).json({ 
//         error: 'Resume content must be at least 10 characters long' 
//       });
//     }

//     const resumeLength = resumeContent.trim().length;
//     const hasJobDesc = jobDescContent && jobDescContent.trim().length > 0;
    
//     // Truncate content if too long to stay within token limits
//     const maxResumeLength = 6000;
//     const maxJobDescLength = 3000;
//     const truncatedResume = resumeContent.slice(0, maxResumeLength);
//     const truncatedJobDesc = jobDescContent ? jobDescContent.slice(0, maxJobDescLength) : '';
    
//     const systemPrompt = `Expert ATS analyzer. Analyze resumes contextually based on the candidate's field. Return ONLY valid JSON, no markdown.`;
    
//     const userPrompt = `Analyze this resume${hasJobDesc ? ' against the job description' : ' and identify the candidate\'s role/field from their experience'}.

// RESUME:
// ${truncatedResume}
// ${hasJobDesc ? `\nJOB DESCRIPTION:
// ${truncatedJobDesc}` : `

// IMPORTANT: First identify what role/field this resume is for (e.g., Frontend Developer, Backend Developer, Data Scientist, etc.) based on skills and experience listed. Then provide relevant suggestions for THAT specific field only.`}

// ${hasJobDesc ? '' : `
// For missing skills, only suggest skills that are:
// 1. Directly relevant to the identified role
// 2. Commonly required in job postings for that role
// 3. Natural progressions from skills already present

// DO NOT suggest unrelated skills like "Cloud computing" or "Machine learning" for a Frontend Developer.`}

// Return JSON:
// {
//   "ats_score": <0-100>,
//   "parse_rate": <0-100>,
//   "total_issues": <number>,
//   "identified_role": "<detected role from resume, e.g., Frontend Developer>",
//   "content": {
//     "score": <0-100>,
//     "issues": [
//       {"type": "ats_parse_rate|quantifying_impact|repetition|spelling_grammar", "severity": "error|warning|info", "message": "specific issue found", "suggestion": "how to fix it"}
//     ]
//   },
//   "section": {
//     "score": <0-100>,
//     "issues": [
//       {"type": "essential_sections|contact_info", "severity": "error|warning", "message": "missing or incorrect section", "suggestion": "what to add/fix"}
//     ]
//   },
//   "ats_essentials": {
//     "score": <0-100>,
//     "issues": [
//       {"type": "file_format|design|email|hyperlinks", "severity": "error|warning", "message": "ATS compatibility issue", "suggestion": "how to make ATS-friendly"}
//     ]
//   },
//   "tailoring": {
//     "score": <0-100>,
//     "issues": [
//       {"type": "hard_skills|soft_skills|action_verbs|title", "severity": "warning|info", "message": "area for improvement", "suggestion": "specific improvement for the identified role"}
//     ]
//   },
//   "present_skills": ["list only skills actually found in resume"],
//   "missing_skills": {
//     "critical": ["skills critical for identified_role that are missing"],
//     "important": ["important skills for identified_role that are missing"],
//     "nice_to_have": ["beneficial skills for identified_role"]
//   },
//   "overall_assessment": "Brief assessment mentioning the identified role and overall quality",
//   "top_recommendations": ["3-5 actionable recommendations specific to the identified role"]
// }`;

//     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: userPrompt }
//         ],
//         temperature: 0.2,
//         max_tokens: 3000
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Groq API error:', errorData);
//       return res.status(response.status).json({ 
//         error: errorData.error?.message || 'API request failed' 
//       });
//     }

//     const data = await response.json();
//     const content = data.choices[0].message.content.trim();
//     const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//     const analysisResults = JSON.parse(cleanContent);
    
//     console.log('✅ Resume analysis completed successfully');
//     res.json(analysisResults);

//   } catch (error) {
//     console.error('❌ Error analyzing resume:', error);
//     res.status(500).json({ 
//       error: error.message || 'Analysis failed' 
//     });
//   }
// });
/// Enhanced ATS Resume Analysis Endpoint - Optimized for Token Limits
app.post('/api/analyze-resume', async (req, res) => {
  try {
    console.log('📄 ATS Resume analysis endpoint hit');
    
    const { resumeContent, jobDescContent } = req.body;

    if (!resumeContent || resumeContent.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Resume content must be at least 10 characters long' 
      });
    }

    const hasJobDesc = jobDescContent && jobDescContent.trim().length > 0;
    
    // Aggressive truncation to stay under 12,000 TPM limit
    // Assuming ~1.3 tokens per character: 
    // - Max resume: 3000 chars (~3900 tokens)
    // - Max job desc: 1500 chars (~1950 tokens)  
    // - Prompt structure: ~2000 tokens
    // - Response: ~3000 tokens
    // Total: ~10,850 tokens (safe margin)
    
    const maxResumeLength = 3000;
    const maxJobDescLength = 1500;
    const truncatedResume = resumeContent.slice(0, maxResumeLength);
    const truncatedJobDesc = jobDescContent ? jobDescContent.slice(0, maxJobDescLength) : '';
    
    const systemPrompt = `ATS expert. Detect specific problems, explain why they're issues, and provide exact fixes. Return ONLY valid JSON.`;
    
    const userPrompt = `Analyze resume${hasJobDesc ? ' vs job' : ''}. Find SPECIFIC problems with detailed solutions.

RESUME:
${truncatedResume}
${hasJobDesc ? `\nJOB:\n${truncatedJobDesc}` : ''}

CRITICAL: Identify the candidate's role from their resume first.

JSON format:
{
  "ats_score": <0-100>,
  "parse_rate": <0-100>,
  "total_issues": <number>,
  "identified_role": "<detected role>",
  "content": {
    "score": <0-100>,
    "issues": [
      {
        "type": "ats_parse_rate|quantifying_impact|repetition|spelling_grammar",
        "severity": "error|warning|info",
        "message": "SPECIFIC problem found (e.g., 'Repeated word X appears 5 times' or 'Missing numbers in achievement Y')",
        "suggestion": "EXACT fix (e.g., 'Use synonyms: A, B, C' or 'Add metrics: Increased sales by X%')",
        "example": "Before: [bad example] → After: [good example]"
      }
    ]
  },
  "section": {
    "score": <0-100>,
    "issues": [
      {
        "type": "essential_sections|contact_info",
        "severity": "error|warning",
        "message": "SPECIFIC missing/incorrect item",
        "suggestion": "EXACT what to add/fix",
        "example": "Add: [specific format]"
      }
    ]
  },
  "ats_essentials": {
    "score": <0-100>,
    "issues": [
      {
        "type": "file_format|design|email|hyperlinks",
        "severity": "error|warning",
        "message": "SPECIFIC ATS problem",
        "suggestion": "EXACT solution",
        "example": "Change to: [format]"
      }
    ]
  },
  "tailoring": {
    "score": <0-100>,
    "issues": [
      {
        "type": "hard_skills|soft_skills|action_verbs|title",
        "severity": "warning|info",
        "message": "SPECIFIC weakness for identified_role",
        "suggestion": "EXACT improvement",
        "example": "Add: [specific skill/verb]"
      }
    ]
  },
  "present_skills": ["skills actually in resume"],
  "missing_skills": {
    "critical": ["critical for identified_role"],
    "important": ["important for identified_role"],
    "nice_to_have": ["beneficial for identified_role"]
  },
  "overall_assessment": "2-sentence summary",
  "top_recommendations": ["specific action 1", "specific action 2", "specific action 3"]
}

Rules:
- Be SPECIFIC: "Section X is missing" not "Missing sections"
- Give EXACT fixes: "Add: Work Experience (Company, Title, Dates, Bullets)" not "Add work history"
- Provide EXAMPLES: Show before/after
- Focus on identified_role: Only suggest relevant skills
- Keep assessments brief to save tokens`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2500  // Reduced to ensure we stay under limit
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      
      // Check if it's a rate limit error
      if (errorData.error?.message?.includes('Rate limit') || errorData.error?.message?.includes('TPM')) {
        return res.status(429).json({ 
          error: 'Resume too long. Please use a shorter resume (max 1 page recommended).' 
        });
      }
      
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'API request failed' 
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const analysisResults = JSON.parse(cleanContent);
      console.log('✅ Resume analysis completed successfully');
      res.json(analysisResults);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', cleanContent);
      return res.status(500).json({ 
        error: 'Failed to parse analysis results. Please try again with a shorter resume.' 
      });
    }

  } catch (error) {
    console.error('❌ Error analyzing resume:', error);
    res.status(500).json({ 
      error: error.message || 'Analysis failed' 
    });
  }
});

// Health check for Groq integration
app.get('/api/groq/health', (req, res) => {
  const hasApiKey = !!process.env.GROQ_API_KEY;
  res.json({ 
    status: hasApiKey ? 'OK' : 'Missing API Key',
    groqConfigured: hasApiKey,
    message: hasApiKey 
      ? 'Groq API is configured and ready' 
      : 'GROQ_API_KEY environment variable not found'
  });
});
//n ============ ADVANCED FILTER ROUTES (PLACED FIRST) ============

// Get all unique filter values from database
app.get('/api/advanced-filters/options', async (req, res) => {
  try {
    console.log('📊 Advanced filters options endpoint hit');
    
    const [
      categoriesResult,
      companiesResult,
      locationsResult,
      typesResult,
      experienceLevelsResult,
      salaryDataResult
    ] = await Promise.all([
      supabase.from('categories').select('id, name, slug').order('name'),
      supabase.from('companies').select('id, name, logo').order('name'),
      supabase.from('jobs').select('location').not('location', 'is', null),
      supabase.from('jobs').select('type').not('type', 'is', null),
      supabase.from('jobs').select('experience').not('experience', 'is', null),
      supabase.from('jobs').select('salary_min, salary_max, salary_currency').not('salary_min', 'is', null)
    ]);

    // Process locations
    const locationsSet = new Set();
    (locationsResult.data || []).forEach(item => {
      if (item.location) {
        item.location.split(',').forEach(loc => {
          const trimmed = loc.trim();
          if (trimmed) locationsSet.add(trimmed);
        });
      }
    });

    // Process job types
    const typesSet = new Set();
    (typesResult.data || []).forEach(item => {
      if (item.type) typesSet.add(item.type.trim());
    });

    // Process experience levels
    const experienceSet = new Set();
    (experienceLevelsResult.data || []).forEach(item => {
      if (item.experience) experienceSet.add(item.experience.trim());
    });

    // Calculate salary ranges
    const salaries = (salaryDataResult.data || [])
      .filter(item => item.salary_min !== null)
      .map(item => ({
        min: item.salary_min,
        max: item.salary_max || item.salary_min,
        currency: item.salary_currency
      }));

    const minSalary = salaries.length > 0 ? Math.min(...salaries.map(s => s.min)) : 0;
    const maxSalary = salaries.length > 0 ? Math.max(...salaries.map(s => s.max)) : 0;

    // Create dynamic salary ranges
    const salaryRanges = [];
    if (minSalary > 0 && maxSalary > 0) {
      const range = maxSalary - minSalary;
      const step = Math.ceil(range / 5);
      
      for (let i = 0; i < 5; i++) {
        const rangeMin = minSalary + (step * i);
        const rangeMax = i === 4 ? null : minSalary + (step * (i + 1));
        
        salaryRanges.push({
          id: `${rangeMin}-${rangeMax || 'plus'}`,
          label: rangeMax 
            ? `$${rangeMin.toLocaleString()} - $${rangeMax.toLocaleString()}`
            : `$${rangeMin.toLocaleString()}+`,
          min: rangeMin,
          max: rangeMax
        });
      }
    }

    const response = {
      categories: (categoriesResult.data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })),
      companies: (companiesResult.data || []).map(comp => ({
        id: comp.id,
        name: comp.name,
        logo: comp.logo
      })),
      locations: Array.from(locationsSet).sort().map(loc => ({
        id: loc.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: loc,
        value: loc
      })),
      types: Array.from(typesSet).sort().map(type => ({
        id: type.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: type,
        value: type
      })),
      experienceLevels: Array.from(experienceSet).sort().map(exp => ({
        id: exp.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: exp,
        value: exp
      })),
      salaryRanges: salaryRanges,
      stats: {
        totalCategories: categoriesResult.data?.length || 0,
        totalCompanies: companiesResult.data?.length || 0,
        totalLocations: locationsSet.size,
        totalTypes: typesSet.size,
        totalExperienceLevels: experienceSet.size,
        minSalary,
        maxSalary
      }
    };

    console.log('✅ Returning filter options:', response.stats);
    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching filter options:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job counts for each filter option
app.get('/api/advanced-filters/counts', async (req, res) => {
  try {
    console.log('📊 Advanced filters counts endpoint hit');
    
    const { data: allJobs } = await supabase
      .from('jobs')
      .select('category_id, company_id, location, type, experience, salary_min, salary_max');

    const jobs = allJobs || [];

    // Count by category
    const categoryCounts = {};
    jobs.forEach(job => {
      if (job.category_id) {
        categoryCounts[job.category_id] = (categoryCounts[job.category_id] || 0) + 1;
      }
    });

    // Count by company
    const companyCounts = {};
    jobs.forEach(job => {
      if (job.company_id) {
        companyCounts[job.company_id] = (companyCounts[job.company_id] || 0) + 1;
      }
    });

    // Count by location
    const locationCounts = {};
    jobs.forEach(job => {
      if (job.location) {
        job.location.split(',').forEach(loc => {
          const trimmed = loc.trim();
          if (trimmed) {
            locationCounts[trimmed] = (locationCounts[trimmed] || 0) + 1;
          }
        });
      }
    });

    // Count by type
    const typeCounts = {};
    jobs.forEach(job => {
      if (job.type) {
        typeCounts[job.type] = (typeCounts[job.type] || 0) + 1;
      }
    });

    // Count by experience
    const experienceCounts = {};
    jobs.forEach(job => {
      if (job.experience) {
        experienceCounts[job.experience] = (experienceCounts[job.experience] || 0) + 1;
      }
    });

    const response = {
      categories: categoryCounts,
      companies: companyCounts,
      locations: locationCounts,
      types: typeCounts,
      experienceLevels: experienceCounts,
      totalJobs: jobs.length
    };

    console.log('✅ Returning filter counts:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching filter counts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply advanced filters to get filtered jobs
app.get('/api/advanced-filters/jobs', async (req, res) => {
  try {
    console.log('📊 Advanced filters jobs endpoint hit with params:', req.query);
    
    const {
      categories,
      companies,
      locations,
      types,
      experienceLevels,
      salaryMin,
      salaryMax,
      search,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('jobs')
      .select(`
        *,
        categories (id, name, slug),
        companies (id, name, logo)
      `, { count: 'exact' });

    // Apply filters
    if (categories) {
      const categoryArray = categories.split(',').filter(Boolean);
      if (categoryArray.length > 0) {
        query = query.in('category_id', categoryArray);
      }
    }

    if (companies) {
      const companyArray = companies.split(',').filter(Boolean);
      if (companyArray.length > 0) {
        query = query.in('company_id', companyArray);
      }
    }

    if (locations) {
      const locationArray = locations.split(',').filter(Boolean);
      if (locationArray.length > 0) {
        const locationConditions = locationArray.map(loc => `location.ilike.%${loc}%`).join(',');
        query = query.or(locationConditions);
      }
    }

    if (types) {
      const typeArray = types.split(',').filter(Boolean);
      if (typeArray.length > 0) {
        query = query.in('type', typeArray);
      }
    }

    if (experienceLevels) {
      const expArray = experienceLevels.split(',').filter(Boolean);
      if (expArray.length > 0) {
        const expConditions = expArray.map(exp => `experience.ilike.%${exp}%`).join(',');
        query = query.or(expConditions);
      }
    }

    if (salaryMin) {
      query = query.gte('salary_min', parseInt(salaryMin));
    }

    if (salaryMax) {
      query = query.lte('salary_max', parseInt(salaryMax));
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply sorting
    const ascending = sortOrder.toLowerCase() === 'asc';
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: jobs, error, count } = await query;

    if (error) throw error;

    const totalJobs = count || 0;
    const totalPages = Math.ceil(totalJobs / limitNum);

    const response = {
      jobs: jobs || [],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        jobsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      }
    };

    console.log('✅ Returning filtered jobs:', response.pagination);
    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching filtered jobs:', error);
    res.status(500).json({ error: error.message });
  }
});
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
// Add these endpoints to your server.js file


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
const baseUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
// app.listen(PORT, () => {

//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Debug endpoints available at:`);
//   console.log(`   - http://localhost:${PORT}/api/debug/companies?search=YourCompanyName`);
//   console.log(`   - http://localhost:${PORT}/api/debug/jobs-by-company?search=YourCompanyName`);
//   console.log(`   - http://localhost:${PORT}/api/debug/full-search?search=YourSearchTerm`);
//   console.log(`   - http://localhost:${PORT}/api/debug/structure`);
// });
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${baseUrl}`);
  console.log(`📊 Debug endpoints available at:`);
  console.log(`   - ${baseUrl}/api/debug/companies?search=YourCompanyName`);
  console.log(`   - ${baseUrl}/api/debug/jobs-by-company?search=YourCompanyName`);
  console.log(`   - ${baseUrl}/api/debug/full-search?search=YourSearchTerm`);
  console.log(`   - ${baseUrl}/api/debug/structure`);
});