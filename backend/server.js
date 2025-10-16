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
import axios from "axios";
import * as cheerio from "cheerio";
dotenv.config();

const app = express();
// const axios = require('axios');
// const cheerio = require('cheerio');

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ============ API ROUTES ============
// Add this to your existing server.js file after your other route definitions
// Add this endpoint to your server.js file
// Place it before your other job routes for better organization

// LinkedIn Profile Analyzer - URL Based Endpoint
app.post('/api/analyze-linkedin-profile-url', async (req, res) => {
  try {
    const { profileUrl } = req.body;

    if (!profileUrl || profileUrl.trim().length === 0) {
      return res.status(400).json({ 
        error: 'LinkedIn profile URL is required' 
      });
    }

    // Validate URL format
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
    if (!linkedinRegex.test(profileUrl.trim())) {
      return res.status(400).json({ 
        error: 'Please provide a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)' 
      });
    }

    console.log('🔍 Scraping LinkedIn profile:', profileUrl);

    // Fetch public profile data
    const profileData = await scrapeLinkedInProfile(profileUrl);

    if (!profileData) {
      return res.status(404).json({ 
        error: 'Could not fetch profile. Make sure the profile is public and the URL is correct.' 
      });
    }

    // Now analyze the extracted profile data
    return await analyzeProfileData(profileData, res);

  } catch (error) {
    console.error('❌ Error analyzing profile:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze profile' });
  }
});

// Helper function to scrape LinkedIn profile
async function scrapeLinkedInProfile(profileUrl) {
  try {
    const response = await axios.get(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // Extract profile data from public fields
    const profileData = {
      headline: extractText($, '[data-testid="top-card-headline"]') || extractMetaTag($, 'headline'),
      about: extractText($, '[data-testid="about"]') || extractText($, '.summary'),
      skills: extractSkills($),
      experience: extractExperience($),
      education: extractEducation($),
      picture: checkProfilePicture($),
      connections: extractConnections($)
    };

    return profileData.headline ? profileData : null;

  } catch (error) {
    console.error('Scraping error:', error.message);
    return null;
  }
}

// Extract text from selector
function extractText($, selector) {
  const text = $(selector).text()?.trim();
  return text || null;
}

// Extract from meta tags (JSON-LD)
function extractMetaTag($, property) {
  const jsonLd = $('script[type="application/ld+json"]').first().text();
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd);
      if (property === 'headline') return data.headline || data.jobTitle;
      if (property === 'about') return data.description;
    } catch (e) {}
  }
  return null;
}

// Extract skills from profile
function extractSkills($) {
  const skills = [];
  $('[data-testid="skill"]').each((_, el) => {
    const skill = $(el).text().trim();
    if (skill) skills.push(skill);
  });
  
  // Fallback: extract from text
  if (skills.length === 0) {
    const skillText = $('h3:contains("Skills")').next().text();
    return skillText ? skillText.split(',').map(s => s.trim()) : [];
  }
  
  return skills;
}

// Extract experience from profile
function extractExperience($) {
  const experience = [];
  $('[data-testid="experience-section"] li').each((_, el) => {
    const title = $(el).find('[data-testid="title"]').text().trim();
    const company = $(el).find('[data-testid="company-name"]').text().trim();
    const duration = $(el).find('[data-testid="duration"]').text().trim();
    
    if (title || company) {
      experience.push(`${title} at ${company} (${duration})`);
    }
  });
  return experience;
}

// Extract education from profile
function extractEducation($) {
  const education = [];
  $('[data-testid="education-section"] li').each((_, el) => {
    const school = $(el).find('[data-testid="school-name"]').text().trim();
    const degree = $(el).find('[data-testid="degree"]').text().trim();
    
    if (school || degree) {
      education.push(`${degree} from ${school}`);
    }
  });
  return education;
}

// Check if profile has picture
function checkProfilePicture($) {
  const picture = $('img[data-testid="profile-photo"]').attr('src');
  return !!picture;
}

// Extract connection count
function extractConnections($) {
  const connText = $('[data-testid="topcard-connections"]').text();
  const match = connText?.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Analyze profile data and return results
async function analyzeProfileData(profileData, res) {
  try {
    console.log('📋 Analyzing LinkedIn profile data');
    
    const { 
      headline = '',
      about = '',
      skills = [],
      experience = [],
      education = [],
      picture = false,
      connections = 0
    } = profileData;

    const profile = {
      headline,
      about,
      skills: Array.isArray(skills) ? skills : [],
      experience: Array.isArray(experience) ? experience : [],
      education: Array.isArray(education) ? education : [],
      hasPicture: picture,
      connectionCount: connections
    };

    // ============ RULE-BASED SCORING ============
    
    // 1. Detect spelling errors in headline and about
    const spellingErrors = detectSpellingErrors(profile.headline, profile.about);
    
    // 2. Check for common issues
    const issues = [];
    const warnings = [];
    
    // Headline issues
    if (!profile.headline || profile.headline.trim().length === 0) {
      issues.push({
        section: 'Headline',
        severity: 'error',
        message: 'Missing headline - this is critical for first impressions',
        suggestion: 'Add a compelling headline that includes your role and key skills'
      });
    } else if (profile.headline.length < 20) {
      warnings.push({
        section: 'Headline',
        severity: 'warning',
        message: 'Headline is too short and may not fully describe your role',
        suggestion: 'Expand to include specific technologies or expertise'
      });
    } else if (profile.headline.includes('||')) {
      issues.push({
        section: 'Headline',
        severity: 'warning',
        message: 'Using "||" symbols looks unprofessional',
        suggestion: 'Use pipes "|" or remove separators. Example: "Full Stack Developer | Java & React | 3+ years"'
      });
    }

    // About section issues
    if (!profile.about || profile.about.trim().length === 0) {
      issues.push({
        section: 'About',
        severity: 'error',
        message: 'Missing About section reduces profile completeness',
        suggestion: 'Write a compelling summary (3-5 sentences) highlighting your expertise and goals'
      });
    } else if (profile.about.length < 50) {
      warnings.push({
        section: 'About',
        severity: 'warning',
        message: 'About section is very brief - add more details',
        suggestion: 'Expand with specific skills, achievements, and what you\'re looking for'
      });
    }

    // Skills issues
    if (!profile.skills || profile.skills.length === 0) {
      issues.push({
        section: 'Skills',
        severity: 'error',
        message: 'No skills listed - ATS systems rely heavily on this',
        suggestion: 'Add 10-15 relevant skills including technical stack (e.g., Java, React, SQL)'
      });
    } else if (profile.skills.length < 5) {
      warnings.push({
        section: 'Skills',
        severity: 'warning',
        message: 'Limited skills listed - add more technical and soft skills',
        suggestion: `Currently have ${profile.skills.length} skills. Aim for 10-15 relevant skills`
      });
    }

    // Experience issues
    if (!profile.experience || profile.experience.length === 0) {
      issues.push({
        section: 'Experience',
        severity: 'error',
        message: 'No work experience listed - critical for professional profiles',
        suggestion: 'Add current and past roles with specific achievements and metrics'
      });
    } else {
      // Check for metrics in experience
      const experienceText = profile.experience.join(' ').toLowerCase();
      if (!experienceText.match(/\d+%|increased|improved|grew|launched|built|developed \d+/)) {
        warnings.push({
          section: 'Experience',
          severity: 'warning',
          message: 'Experience lacks quantifiable achievements (numbers, percentages)',
          suggestion: 'Add metrics: "Increased performance by 40%", "Led team of 5", "Shipped 3+ features"'
        });
      }
    }

    // Education issues
    if (!profile.education || profile.education.length === 0) {
      warnings.push({
        section: 'Education',
        severity: 'warning',
        message: 'No education listed - helps build credibility',
        suggestion: 'Add your degree, university, and graduation year'
      });
    }

    // Picture check
    if (!profile.hasPicture) {
      issues.push({
        section: 'Profile Picture',
        severity: 'error',
        message: 'Missing professional profile picture - critical first impression',
        suggestion: 'Add a clear, professional headshot against a simple background'
      });
    }

    // ============ CALCULATE SCORES ============
    
    const completenessScore = calculateCompletenessScore({
      headline: profile.headline,
      about: profile.about,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      hasPicture: profile.hasPicture
    });

    const issueScore = Math.max(0, 100 - (issues.length * 15 + warnings.length * 5));
    
    // ============ AI SUGGESTIONS ============
    
    const aiSuggestions = await generateAISuggestions(profile, issues, detectedRole);

    // ============ ROLE DETECTION ============
    
    const detectedRole = detectRole(profile.headline, profile.skills, profile.about);

    // ============ BUILD RESPONSE ============
    
    const analysisResult = {
      overallScore: Math.round((completenessScore + issueScore) / 2),
      completenessScore,
      issueScore,
      detectedRole,
      sections: {
        headline: {
          present: !!profile.headline,
          score: profile.headline ? Math.min(100, Math.max(0, (profile.headline.length / 100) * 100)) : 0,
          length: profile.headline ? profile.headline.length : 0
        },
        about: {
          present: !!profile.about,
          score: profile.about ? Math.min(100, Math.max(0, (profile.about.length / 500) * 100)) : 0,
          length: profile.about ? profile.about.length : 0
        },
        skills: {
          present: profile.skills && profile.skills.length > 0,
          count: profile.skills ? profile.skills.length : 0,
          score: profile.skills ? Math.min(100, (profile.skills.length / 15) * 100) : 0
        },
        experience: {
          present: profile.experience && profile.experience.length > 0,
          count: profile.experience ? profile.experience.length : 0
        },
        education: {
          present: profile.education && profile.education.length > 0,
          count: profile.education ? profile.education.length : 0
        },
        picture: {
          present: profile.hasPicture
        }
      },
      issues: {
        errors: issues.filter(i => i.severity === 'error'),
        warnings: warnings.filter(w => w.severity === 'warning'),
        total: issues.length + warnings.length
      },
      spellingErrors: spellingErrors,
      aiSuggestions: aiSuggestions,
      recommendations: generateRecommendations(issues, warnings, detectedRole)
    };

    console.log('✅ Profile analysis complete');
    return res.json(analysisResult);

  } catch (error) {
    console.error('❌ Error analyzing profile:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Enhanced endpoint that accepts profile data as text (for manual input)
app.post('/api/check-linkedin-profile', async (req, res) => {
  try {
    console.log('📋 Checking LinkedIn profile');
    
    const { 
      headline = '',
      about = '',
      skills = [],
      experience = [],
      education = [],
      picture = false,
      connections = 0
    } = req.body;

    const profileData = {
      headline,
      about,
      skills: Array.isArray(skills) ? skills : [],
      experience: Array.isArray(experience) ? experience : [],
      education: Array.isArray(education) ? education : [],
      picture,
      connections
    };

    return await analyzeProfileData(profileData, res);

  } catch (error) {
    console.error('❌ Error checking profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions

function detectSpellingErrors(headline = '', about = '') {
  const commonErrors = {
    'devloveper': 'developer',
    'developper': 'developer',
    'managment': 'management',
    'bussiness': 'business',
    'experiance': 'experience',
    'occured': 'occurred',
    'recieve': 'receive',
    'acheive': 'achieve',
    'seperete': 'separate',
    'refered': 'referred',
    'recomend': 'recommend'
  };

  const text = (headline + ' ' + about).toLowerCase();
  const errors = [];

  for (const [wrong, correct] of Object.entries(commonErrors)) {
    if (text.includes(wrong)) {
      errors.push({
        word: wrong,
        suggestion: correct,
        found_in: text.includes(wrong) ? 'profile' : null
      });
    }
  }

  return errors;
}

function calculateCompletenessScore(profile) {
  let score = 0;
  const maxPoints = 100;
  
  if (profile.headline && profile.headline.length > 20) score += 15;
  if (profile.about && profile.about.length > 50) score += 20;
  if (profile.skills && profile.skills.length >= 10) score += 20;
  if (profile.experience && profile.experience.length > 0) score += 20;
  if (profile.education && profile.education.length > 0) score += 15;
  if (profile.hasPicture) score += 10;

  return Math.min(maxPoints, score);
}

function detectRole(headline = '', skills = [], about = '') {
  const roles = {
    'full stack': 'Full Stack Developer',
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'data scientist': 'Data Scientist',
    'devops': 'DevOps Engineer',
    'qa': 'QA Engineer',
    'product manager': 'Product Manager',
    'designer': 'UX/UI Designer',
    'manager': 'Engineering Manager'
  };

  const text = (headline + ' ' + skills.join(' ') + ' ' + about).toLowerCase();
  
  for (const [keyword, role] of Object.entries(roles)) {
    if (text.includes(keyword)) {
      return role;
    }
  }

  return 'Professional';
}

async function generateAISuggestions(profile, issues, detectedRole) {
  try {
    console.log('🤖 Generating AI suggestions using Groq');

    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not found, using fallback suggestions');
      return generateFallbackSuggestions(profile, issues, detectedRole);
    }

    const systemPrompt = `You are a LinkedIn profile optimization expert. Generate specific, actionable suggestions to improve a user's LinkedIn profile. Focus on their actual content and role. Return ONLY valid JSON, no markdown.`;

    const userPrompt = `Analyze this LinkedIn profile and generate AI suggestions:

CURRENT PROFILE:
- Role: ${detectedRole}
- Headline: "${profile.headline || '[Missing]'}"
- About: "${profile.about?.substring(0, 200) || '[Missing]'}"
- Skills: ${profile.skills.slice(0, 5).join(', ') || '[None listed]'}
- Experience: ${profile.experience.slice(0, 2).join(' | ') || '[None listed]'}

ISSUES FOUND:
${issues.map(i => `- ${i.section}: ${i.message}`).join('\n')}

Generate 3-4 specific, personalized suggestions as JSON:

{
  "suggestions": [
    {
      "type": "headline",
      "priority": "high",
      "current": "current headline from profile",
      "suggestion": "improved headline specific to their role and skills",
      "explanation": "why this is better"
    },
    {
      "type": "about",
      "priority": "high",
      "suggestion": "improved about section specific to their skills and experience",
      "explanation": "why this is better"
    },
    {
      "type": "skills",
      "priority": "medium",
      "suggestion": "list of skills to add based on their role",
      "explanation": "why these skills matter for ${detectedRole}"
    },
    {
      "type": "experience",
      "priority": "medium",
      "suggestion": "how to improve their experience bullet points",
      "explanation": "add metrics and specifics"
    }
  ]
}`;

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
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return generateFallbackSuggestions(profile, issues, detectedRole);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(cleanContent);
    return result.suggestions || generateFallbackSuggestions(profile, issues, detectedRole);

  } catch (error) {
    console.error('Error generating AI suggestions:', error.message);
    return generateFallbackSuggestions(profile, issues, detectedRole);
  }
}

function generateFallbackSuggestions(profile, issues, detectedRole) {
  const suggestions = [];

  if (issues.some(i => i.section === 'Headline') || !profile.headline) {
    suggestions.push({
      type: 'headline',
      priority: 'high',
      current: profile.headline || '[Missing]',
      suggestion: `${detectedRole} | Expert in ${profile.skills.slice(0, 2).join(' & ') || 'cutting-edge technologies'} | Building impactful solutions`,
      explanation: 'Include your role, top skills, and value proposition for better visibility'
    });
  }

  if (issues.some(i => i.section === 'About') || !profile.about) {
    const skillsText = profile.skills.slice(0, 3).join(', ');
    suggestions.push({
      type: 'about',
      priority: 'high',
      suggestion: `Passionate ${detectedRole} with expertise in ${skillsText}. I specialize in building scalable, user-centric solutions. My approach combines technical excellence with problem-solving. I'm committed to continuous learning and collaborating with talented teams to deliver high-impact projects. Let's connect if you're looking for someone who's dedicated to excellence.`,
      explanation: 'Make it personal: add your expertise, passion, and what you\'re seeking'
    });
  }

  if (issues.some(i => i.section === 'Experience')) {
    suggestions.push({
      type: 'experience',
      priority: 'high',
      suggestion: 'Transform each role with metrics: Instead of "Built features", use "Architected microservices handling 100K+ requests/day, reducing latency by 45%"',
      explanation: 'Add numbers: user count, performance gains, team size, revenue impact'
    });
  }

  if (profile.skills.length < 10) {
    suggestions.push({
      type: 'skills',
      priority: 'medium',
      suggestion: `Add these relevant skills for ${detectedRole}: Technical Leadership, Agile/Scrum, Problem-Solving, Communication, System Design`,
      explanation: 'Expand skills beyond technical to include soft skills and industry-relevant competencies'
    });
  }

  return suggestions;
}

function generateRecommendations(errors, warnings, role) {
  const recommendations = [];
  
  if (errors.length > 0) {
    recommendations.push(`Fix ${errors.length} critical error(s) - these directly impact your profile visibility`);
  }
  
  if (warnings.length > 0) {
    recommendations.push(`Address ${warnings.length} warning(s) to improve profile strength`);
  }

  recommendations.push(`Tailor profile content to ${role} opportunities - use role-specific keywords`);
  recommendations.push('Request endorsements from colleagues to boost credibility');
  recommendations.push('Share or engage with industry content to increase visibility');

  return recommendations;
}cd
// ============ DYNAMIC FILTER OPTIONS ENDPOINT ============

/**
 * Get all unique filter values from the database
 * This endpoint provides dynamic filter options based on actual job data
 * Returns: locations, types, experiences, salary ranges
 */
app.get('/api/filter-options', async (req, res) => {
  try {
    console.log('📊 Fetching dynamic filter options from database');
    
    // Fetch all jobs to extract unique values
    // Using select with specific columns for better performance
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('location, type, experience, salary_min, salary_max, salary_currency');

    if (error) {
      console.error('Error fetching jobs for filter options:', error);
      throw error;
    }

    // Process locations - handle comma-separated values
    const locationsSet = new Set();
    (jobs || []).forEach(job => {
      if (job.location) {
        // Split comma-separated locations and add each one
        job.location.split(',').forEach(loc => {
          const trimmed = loc.trim();
          if (trimmed) locationsSet.add(trimmed);
        });
      }
    });

    // Process job types
    const typesSet = new Set();
    (jobs || []).forEach(job => {
      if (job.type) {
        typesSet.add(job.type.trim());
      }
    });

    // Process experience levels
    const experienceSet = new Set();
    (jobs || []).forEach(job => {
      if (job.experience) {
        experienceSet.add(job.experience.trim());
      }
    });

    // Calculate dynamic salary ranges based on actual data
    const salaries = (jobs || [])
      .filter(job => job.salary_min !== null && job.salary_min !== undefined)
      .map(job => ({
        min: job.salary_min,
        max: job.salary_max || job.salary_min,
        currency: job.salary_currency || 'USD'
      }));

    let salaryRanges = [];
    if (salaries.length > 0) {
      const minSalary = Math.min(...salaries.map(s => s.min));
      const maxSalary = Math.max(...salaries.map(s => s.max));
      
      // Create 5 evenly distributed salary ranges
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
          value: rangeMax ? `${rangeMin}-${rangeMax}` : `${rangeMin}-`,
          min: rangeMin,
          max: rangeMax
        });
      }
    }

    // Prepare response
    const filterOptions = {
      locations: Array.from(locationsSet).sort(),
      types: Array.from(typesSet).sort(),
      experiences: Array.from(experienceSet).sort(),
      salaryRanges: salaryRanges,
      stats: {
        totalLocations: locationsSet.size,
        totalTypes: typesSet.size,
        totalExperiences: experienceSet.size,
        totalSalaryRanges: salaryRanges.length,
        jobsAnalyzed: jobs?.length || 0
      }
    };

    console.log('✅ Filter options generated:', filterOptions.stats);
    res.json(filterOptions);
  } catch (error) {
    console.error('❌ Error fetching filter options:', error);
    res.status(500).json({ 
      error: error.message,
      filterOptions: {
        locations: [],
        types: [],
        experiences: [],
        salaryRanges: []
      }
    });
  }
});

// Optional: Get filter options with job counts for each option
app.get('/api/filter-options/with-counts', async (req, res) => {
  try {
    console.log('📊 Fetching filter options with job counts');
    
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('location, type, experience, salary_min, salary_max');

    if (error) throw error;

    // Count jobs for each filter option
    const locationCounts = {};
    const typeCounts = {};
    const experienceCounts = {};

    (jobs || []).forEach(job => {
      // Count locations
      if (job.location) {
        job.location.split(',').forEach(loc => {
          const trimmed = loc.trim();
          if (trimmed) {
            locationCounts[trimmed] = (locationCounts[trimmed] || 0) + 1;
          }
        });
      }

      // Count types
      if (job.type) {
        const type = job.type.trim();
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }

      // Count experiences
      if (job.experience) {
        const exp = job.experience.trim();
        experienceCounts[exp] = (experienceCounts[exp] || 0) + 1;
      }
    });

    // Format response with counts
    const response = {
      locations: Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      types: Object.entries(typeCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      experiences: Object.entries(experienceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      totalJobs: jobs?.length || 0
    };

    console.log('✅ Filter options with counts generated');
    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching filter options with counts:', error);
    res.status(500).json({ error: error.message });
  }
});
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
/// Enhanced ATS Resume Analysis Endpoint - With Specific Examples
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
    
    // Token limit management
    const maxResumeLength = 3000;
    const maxJobDescLength = 1500;
    const truncatedResume = resumeContent.slice(0, maxResumeLength);
    const truncatedJobDesc = jobDescContent ? jobDescContent.slice(0, maxJobDescLength) : '';
    
    const systemPrompt = `ATS expert. Find SPECIFIC problems in the resume and provide EXACT corrections with examples. Return ONLY valid JSON.`;
    
    const userPrompt = `Analyze this resume. Find EVERY problem and show EXACTLY how to fix it with specific examples from the resume.

RESUME:
${truncatedResume}
${hasJobDesc ? `\nJOB:\n${truncatedJobDesc}` : ''}

INSTRUCTIONS:
1. First, identify the candidate's role (e.g., "Full Stack Developer", "Frontend Developer", etc.)
2. Find SPECIFIC problems - quote exact text from resume that's wrong
3. For EACH problem, provide:
   - What's wrong (quote the actual text)
   - Why it's a problem
   - EXACTLY how to fix it
   - A before/after example
4. Suggest missing skills relevant to the identified role
5. If there are spelling errors, list the EXACT misspelled words
6. If achievements lack numbers, show EXACT sentences that need metrics

CRITICAL: Do NOT just say "add metrics" - show the ACTUAL sentence from the resume that needs improvement!

JSON format:
{
  "ats_score": <0-100>,
  "parse_rate": <0-100>,
  "total_issues": <count ALL issues found>,
  "identified_role": "<exact role from resume>",
  "content": {
    "score": <0-100>,
    "issues": [
      {
        "type": "quantifying_impact",
        "severity": "error",
        "message": "Your experience 'Worked as Full Stack Developer' lacks quantifiable achievements",
        "found_in_resume": "Worked as Full Stack Developer",
        "suggestion": "Add specific metrics: number of projects, team size, performance improvements, or technologies used",
        "example": "Before: Worked as Full Stack Developer\\n\\nAfter: Led development of 5+ full-stack applications using React and Node.js, improving page load time by 40% and serving 10,000+ daily users"
      },
      {
        "type": "spelling_grammar",
        "severity": "error",
        "message": "Spelling error found",
        "found_in_resume": "experiance",
        "suggestion": "Correct spelling",
        "example": "Before: experiance\\n\\nAfter: experience"
      },
      {
        "type": "repetition",
        "severity": "warning",
        "message": "Word 'developed' appears 6 times - makes resume repetitive",
        "found_in_resume": "developed, developed, developed...",
        "suggestion": "Use synonyms: created, built, engineered, designed, implemented, architected",
        "example": "Instead of: developed, developed, developed\\n\\nUse: developed, created, built, engineered"
      }
    ]
  },
  "section": {
    "score": <0-100>,
    "issues": [
      {
        "type": "essential_sections",
        "severity": "error",
        "message": "Missing 'Skills' section - ATS systems look for this",
        "found_in_resume": "N/A - section not found",
        "suggestion": "Add a Skills section with: Technical Skills, Frameworks, Tools, Languages",
        "example": "Add section:\\n\\nSKILLS\\n• Languages: JavaScript, Python, Java\\n• Frameworks: React, Node.js, Express\\n• Tools: Git, Docker, AWS"
      }
    ]
  },
  "ats_essentials": {
    "score": <0-100>,
    "issues": [
      {
        "type": "design",
        "severity": "warning",
        "message": "Complex formatting may not parse correctly in ATS",
        "found_in_resume": "tables, columns, or graphics detected",
        "suggestion": "Use simple formatting: standard fonts, clear headers, bullet points",
        "example": "Avoid: Tables, text boxes, columns\\n\\nUse: Simple single-column layout with clear section headers"
      }
    ]
  },
  "tailoring": {
    "score": <0-100>,
    "issues": [
      {
        "type": "hard_skills",
        "severity": "warning",
        "message": "Missing key skills for ${hasJobDesc ? 'this job' : 'identified_role'}",
        "found_in_resume": "Skills listed: React, Node.js",
        "suggestion": "Add missing technical skills that match the role",
        "example": "Currently have: React, Node.js\\n\\nShould add: TypeScript, Redux, MongoDB, REST APIs, Git"
      }
    ]
  },
  "present_skills": ["list ONLY skills found in resume"],
  "missing_skills": {
    "critical": ["skills absolutely needed for identified_role"],
    "important": ["skills that strengthen candidacy"],
    "nice_to_have": ["bonus skills for the role"]
  },
  "overall_assessment": "Brief summary of resume quality and main areas to improve",
  "top_recommendations": [
    "1. Add metrics to all 4 experience bullets (currently none have numbers)",
    "2. Create a Skills section with technical stack",
    "3. Fix spelling: 'experiance' → 'experience', 'managment' → 'management'"
  ]
}

REMEMBER: 
- Quote ACTUAL text from the resume in "found_in_resume"
- Show real before/after examples
- List EXACT spelling errors found
- Point to SPECIFIC sentences that need metrics
- Suggest skills relevant to identified_role only`;

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
        temperature: 0.3,  // Slightly higher for more detailed responses
        max_tokens: 2800   // Increased for detailed examples
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      
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
      console.log('Total issues found:', analysisResults.total_issues);
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
// Add these endpoints to your backend API


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