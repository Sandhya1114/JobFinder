// import { createServer } from 'miragejs';

// export function makeServer() {
//   createServer({
//     routes() {
//       this.namespace = 'api';

//       this.get('/jobs', () => {
//         return {
//           jobs: [
//             {
//               id: '2988485',
//               title: 'SOC Support Engineer III – AWS SOC Security Support Engineer',
//               company: 'Amazon',
//               location: 'Seattle, WA (or remote)',
//               description: 'Support AWS Security Operations Center to maintain a secure cloud.',
//               applyUrl: 'https://www.amazon.jobs/en/jobs/2988485/soc-support-engineer-iii-aws-soc-security-support-engineer',
//             },
//             {
//               id: '3023072',
//               title: 'Data Center Engineering Operations Technician (DCC Communities)',
//               company: 'Amazon',
//               location: 'Northern Virginia, USA',
//               description: 'Manage and maintain mission-critical infrastructure in AWS data centers.',
//               applyUrl: 'https://www.amazon.jobs/en/jobs/3023072/data-center-engineering-operations-technician-dcc-communities',
//             },
//             {
//               id: '3037312',
//               title: 'Integ Change Engineer, Robotic Integration Change',
//               company: 'Amazon Robotics',
//               location: 'Boston, MA',
//               description: 'Drive integration and change in robotic systems at Amazon warehouses.',
//               applyUrl: 'https://www.amazon.jobs/en/jobs/3037312/integ-change-engineer-robotic-integration-change',
//             },
//              {
//               id: '3021186',
//               title: 'Application Developer – Professional Services',
//               company: 'Amazon Web Services (AWS)',
//               location: 'Various US Locations',
//               description: 'Build scalable applications and solutions as part of AWS Professional Services, helping enterprise customers migrate and innovate on the cloud.',
//               applyUrl: 'https://www.amazon.jobs/en/jobs/3021186/application-developer-professional-services',
//             },
//             {
//               id: 'nexty-001',
//               title: 'Frontend Developer (React/JavaScript)',
//               company: 'Nexty Electronics (Thailand)',
//               location: 'Bangkok, Thailand',
//               description: 'Develop and maintain front-end applications with modern JavaScript frameworks for the automotive and electronics industries.',
//               applyUrl: 'https://www.th.nexty-ele.com/job-detail?WP=oH9axUF5nrO4pUNzoGM3ARjkoH9axUF5nrO4Ljo7o3Qo7o3Q',
//             },
//             {
//               id: '281122',
//               title: 'Senior Software Engineer – Remote',
//               company: 'BairesDev',
//               location: 'Remote (Global)',
//               description: 'Work with top-tier clients to develop cutting-edge software solutions. Collaborate with cross-functional teams in a fully remote environment.',
//               applyUrl: 'https://applicants.bairesdev.com/job/1/281122/apply?utm_source=linkedinjobposting&utm_medium=jobposting&utm_campaign=-20250716&lang=en',
//             },
//           ],
//         };
//       });
//     },
//   });
// }
import { createServer } from 'miragejs';

// Categories - normalized by ID
const CATEGORIES = {
  1: { id: 1, name: 'Software Engineering', slug: 'software-engineering' },
  2: { id: 2, name: 'Data Science', slug: 'data-science' },
  3: { id: 3, name: 'Security', slug: 'security' },
  4: { id: 4, name: 'DevOps', slug: 'devops' },
  5: { id: 5, name: 'Frontend Development', slug: 'frontend' },
  6: { id: 6, name: 'Backend Development', slug: 'backend' },
  7: { id: 7, name: 'Mobile Development', slug: 'mobile' },
  8: { id: 8, name: 'Infrastructure', slug: 'infrastructure' },
  9: { id: 9, name: 'Robotics', slug: 'robotics' },
  10: { id: 10, name: 'Cloud Engineering', slug: 'cloud' },
};

// Jobs - normalized by ID with category reference
const JOBS = {
  
  1: {
    id: 1,
    title: 'SOC Support Engineer III – AWS SOC Security Support Engineer',
    categoryId: 3,
    location: 'Seattle, WA (or remote)',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description: 'Support AWS Security Operations Center to maintain a secure cloud environment.',
    requirements: ['3+ years security operations', 'AWS security knowledge', 'SIEM tools experience'],
    postedDate: 'July 8, 2025',
    applyUrl: 'https://www.amazon.jobs/en/jobs/2988485/soc-support-engineer-iii-aws-soc-security-support-engineer',
  },
  2:{
  id: 2,
  
  title: 'ASIC Design Engineer, Cloud‑Scale Machine Learning Acceleration team',
  categoryId: 4, // adjust to your internal mapping
  location: 'Cupertino, CA, USA / Austin, TX, USA',
  type: 'Full-time',
  experience: 'Mid-level',
  salary: { min: 129800, max: 212800, currency: 'USD' },
  description: 'Develop and implement high‑performance, power‑ and area‑efficient RTL designs for AWS custom SoCs like Inferentia.',
  requirements: [
    'Bachelor’s degree or equivalent',
    '3+ years ASIC design/architecture experience',
    'Proficiency in SystemVerilog and RTL design',
    'Experience with synthesis, timing, lint, CDC checks',
    'Strong analytical and problem‑solving skills'
  ],
  postedDate: 'April 29, 2025',
  applyUrl: 'https://www.amazon.jobs/en/jobs/2968674/asic-design-engineer-cloud-scale-machine-learning-acceleration-team'
},
  3: {
    id: 3,
    title: 'Data Center Engineering Operations Technician',
    categoryId: 8,
    location: 'Northern Virginia, USA',
    type: 'Full-time',
    experience: 'Mid-level',
    salary: { min: 75000, max: 110000, currency: 'USD' },
    description: 'Manage and maintain mission-critical infrastructure in AWS data centers.',
    requirements: ['2+ years data center experience', 'Electrical/mechanical systems knowledge'],
    postedDate: 'July 8, 2025',
    applyUrl: 'https://www.amazon.jobs/en/jobs/3023072/data-center-engineering-operations-technician',
  },
  4: {
    id: 4,
    title: 'Integration Change Engineer, Robotic Integration',
    categoryId: 9,
    location: 'Boston, MA',
    type: 'Full-time',
    experience: 'Mid-level',
    salary: { min: 130000, max: 170000, currency: 'USD' },
    description: 'Drive integration and change management in robotic systems at Amazon warehouses.',
    requirements: ['Robotics/Engineering degree', '3+ years robotic systems experience'],
    postedDate: 'July 8, 2025',
    applyUrl: 'https://www.amazon.jobs/en/jobs/3037312/integ-change-engineer-robotic-integration-change',
  },
  5: {
    id: 5,
    title: 'Application Developer – Professional Services',
    categoryId: 1,
    location: 'Various US Locations',
    type: 'Full-time',
    experience: 'Mid-level',
    salary: { min: 110000, max: 160000, currency: 'USD' },
    description: 'Build scalable applications and solutions as part of AWS Professional Services.',
    requirements: ['3+ years software development', 'Cloud technologies experience', 'Multiple programming languages'],
    postedDate: 'July 8, 2025',
    applyUrl: 'https://www.amazon.jobs/en/jobs/3021186/application-developer-professional-services',
  },
  6: {
  id: 6,
  title: 'Full Stack Developer',
  categoryId: 3,
  location: 'North Delhi, Delhi, India',
  type: 'Full-time',
  experience: 'Mid–Senior (4–8 years)',
  salary: { min: 1000000, max: 2500000, currency: 'INR' },
  description: 'Lead and mentor full-stack projects, architect and build scalable .NET based solutions, collaborate with cross-functional teams through the full software development lifecycle, and drive process & performance improvements.',
  requirements: [
    '4–8 years of overall full-stack development experience',
    'Proficient in C#, .NET Framework, ASP.NET MVC, and Web API',
    'Strong JavaScript skills and experience with AngularJS or React.js',
    'Experience with NoSQL and MongoDB',
    'Familiarity with AWS and Azure cloud platforms',
    'Skilled in SQL databases and query optimization',
    'Knowledge of DevOps, CI/CD pipelines, version control (Git)',
    'Proven leadership or mentoring experience in development teams'
  ],
  postedDate: 'June 22, 2025',
  applyUrl: 'https://www.sourcingxpress.com/jobs/e6edc57f-0e59-40e2-9843-91046c24e874'
},

  7: {
    id: 7,
    title: 'Senior Software Engineer – Remote',
    categoryId: 1,
    location: 'Remote (Global)',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 80000, max: 140000, currency: 'USD' },
    description: 'Work with top-tier clients to develop cutting-edge software solutions.',
    requirements: ['5+ years software development', 'Multiple programming languages', 'Remote collaboration skills'],
    postedDate: 'July 8, 2025',
    applyUrl: 'https://applicants.bairesdev.com/job/1/281122/apply',
  },
 
  8:{
  id: 8,
  title: 'Sr Technical Program Manager, Production Change Management, Project Kuiper',
  categoryId: 1, 
  location: 'Redmond, WA, USA',
  type: 'Full‑time',
  experience: 'Senior-level',
  salary: { min: 133900, max: 231400, currency: 'USD' },
  description: 'Support Kuiper Production’s Engineering Change Control process: lead process and tool improvements (automation, validation, PLM) to integrate engineering changes into production.',
  requirements: [
    'Bachelor’s degree in engineering, computer science or equivalent',
    '6+ years technical product or program management experience',
    '3+ years aerospace/industrial/manufacturing operations experience',
    'Experience leading continuous improvement and cross-functional programs',
    'Excellent analytical and interpersonal skills'
  ],
  postedDate: "April 30, 2025", // not specified on page
  applyUrl: 'https://www.amazon.jobs/en/jobs/2970236/sr-technical-program-manager-production-change-management-project-kuiper',
},
9:{
  id: 9,
  title: 'Software Development Manager, RDS Proxy, RDS Proxy Controlplane',
  categoryId: 1, // adjust to fit your system
  location: 'Bellevue, WA, USA',
  type: 'Full-time',
  experience: 'Senior-level',
  salary: { min: 166400, max: 287700, currency: 'USD' },
  description: 'Lead the engineering team responsible for building and operating the RDS Proxy control plane: the APIs, workflows, and tools that provision and manage proxy instances.',
  requirements: [
    '3+ years engineering team management experience',
    '7+ years engineering experience',
    '8+ years building multi-tier web services',
    'Knowledge of full SDLC: coding standards, reviews, CI/CD, livesite operations',
    'Experience partnering with product or program management teams'
  ],
  postedDate: 'July 8, 2025',
  applyUrl: 'https://www.amazon.jobs/en/jobs/3030146/software-development-manager-rds-proxy-rds-proxy-controlpane'
},
 10: {
    id: 10,
    title: 'Data Scientist - Machine Learning',
    categoryId: 2,
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 140000, max: 200000, currency: 'USD' },
    description: 'Build and deploy machine learning models for recommendation systems.',
    requirements: ['PhD in Data Science/ML', 'Python/R expertise', 'Big data technologies'],
    postedDate: '2024-12-28',
    applyUrl: 'https://example.com/job/7',
  },
  



};

// Companies - mapping to job IDs
const COMPANIES = {
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    jobs: [1, 2, 3, 4,8,9,10], // Job IDs
  },
  nexty: {
    id: 'nexty',
    name: 'Nexty Electronics',
    logo: 'https://logo.clearbit.com/nexty-ele.com',
    jobs: [5],
  },
  bairesdev: {
    id: 'bairesdev',
    name: 'BairesDev',
    logo: 'https://logo.clearbit.com/bairesdev.com',
    jobs: [6],
  },
  flipkart: {
    id: 'flipkart',
    name: 'Flipkart',
    logo: 'https://logo.clearbit.com/flipkart.com',
    jobs: [7],
  },
};

// Helper Functions
const getJobById = (id) => {
  const job = JOBS[id];
  if (!job) return null;
  
  return {
    ...job,
    category: CATEGORIES[job.categoryId],
    company: Object.values(COMPANIES).find(company => company.jobs.includes(id))
  };
};

const getJobsByCompany = (companyId) => {
  const company = COMPANIES[companyId];
  if (!company) return [];
  
  return company.jobs.map(jobId => getJobById(jobId)).filter(Boolean);
};

const getJobsByCategory = (categoryId) => {
  return Object.values(JOBS)
    .filter(job => job.categoryId === parseInt(categoryId))
    .map(job => getJobById(job.id));
};

const getAllJobs = () => {
  return Object.values(JOBS).map(job => getJobById(job.id));
};

const searchJobs = (query) => {
  return getAllJobs().filter(job =>
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.description.toLowerCase().includes(query.toLowerCase()) ||
    job.company.name.toLowerCase().includes(query.toLowerCase()) ||
    job.category.name.toLowerCase().includes(query.toLowerCase())
  );
};

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'api';

      // Get all jobs
      this.get('/jobs', () => {
        return {
          jobs: getAllJobs(),
          total: Object.keys(JOBS).length
        };
      });

      // Get job by ID
      this.get('/jobs/:id', (schema, request) => {
        const job = getJobById(parseInt(request.params.id));
        if (!job) {
          return new Response(404, {}, { error: 'Job not found' });
        }
        return { job };
      });

      // Get jobs by company
      this.get('/companies/:companyId/jobs', (schema, request) => {
        const jobs = getJobsByCompany(request.params.companyId);
        const company = COMPANIES[request.params.companyId];
        
        return {
          jobs,
          company,
          total: jobs.length
        };
      });

      // Get jobs by category
      this.get('/categories/:categoryId/jobs', (schema, request) => {
        const jobs = getJobsByCategory(request.params.categoryId);
        const category = CATEGORIES[parseInt(request.params.categoryId)];
        
        return {
          jobs,
          category,
          total: jobs.length
        };
      });

      // Search jobs
      this.get('/jobs/search', (schema, request) => {
        const { q } = request.queryParams;
        if (!q) return { jobs: [], total: 0 };
        
        const jobs = searchJobs(q);
        return {
          jobs,
          total: jobs.length,
          query: q
        };
      });

      // Get all categories
      this.get('/categories', () => {
        return {
          categories: Object.values(CATEGORIES),
          total: Object.keys(CATEGORIES).length
        };
      });

      // Get all companies
      this.get('/companies', () => {
        return {
          companies: Object.values(COMPANIES),
          total: Object.keys(COMPANIES).length
        };
      });

      // Get stats
      this.get('/stats', () => {
        const allJobs = getAllJobs();
        
        return {
          totalJobs: allJobs.length,
          totalCompanies: Object.keys(COMPANIES).length,
          totalCategories: Object.keys(CATEGORIES).length,
          jobsByCategory: Object.values(CATEGORIES).map(category => ({
            category: category.name,
            count: getJobsByCategory(category.id).length
          })),
          jobsByCompany: Object.values(COMPANIES).map(company => ({
            company: company.name,
            count: company.jobs.length
          }))
        };
      });
    },
  });
}