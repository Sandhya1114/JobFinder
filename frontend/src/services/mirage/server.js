// import { createServer } from 'miragejs';

// // Categories - normalized by ID
// const CATEGORIES = {
//   1: { id: 1, name: 'Software Engineering', slug: 'software-engineering' },
//   2: { id: 2, name: 'Data Science', slug: 'data-science' },
//   3: { id: 3, name: 'Security', slug: 'security' },
//   4: { id: 4, name: 'DevOps', slug: 'devops' },
//   5: { id: 5, name: 'Frontend Development', slug: 'frontend' },
//   6: { id: 6, name: 'Backend Development', slug: 'backend' },
//   7: { id: 7, name: 'Mobile Development', slug: 'mobile' },
//   8: { id: 8, name: 'Infrastructure', slug: 'infrastructure' },
//   9: { id: 9, name: 'Robotics', slug: 'robotics' },
//   10: { id: 10, name: 'Cloud Engineering', slug: 'cloud' },
// };

// // Jobs - normalized by ID with category reference
// const JOBS = {
//   1: {
//     id: 1,
//     title: 'SOC Support Engineer III – AWS SOC Security Support Engineer',
//     categoryId: 3,
//     location: 'Seattle, WA (or remote)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 120000, max: 180000, currency: 'USD' },
//     description: 'Support AWS Security Operations Center to maintain a secure cloud environment.',
//     requirements: ['3+ years security operations', 'AWS security knowledge', 'SIEM tools experience'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2988485/soc-support-engineer-iii-aws-soc-security-support-engineer',
//   },
//   2: {
//     id: 2,
//     title: 'ASIC Design Engineer, Cloud‑Scale Machine Learning Acceleration team',
//     categoryId: 8, // Infrastructure - more appropriate than DevOps
//     location: 'Cupertino, CA, USA / Austin, TX, USA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 129800, max: 212800, currency: 'USD' },
//     description: 'Develop and implement high‑performance, power‑ and area‑efficient RTL designs for AWS custom SoCs like Inferentia.',
//     requirements: [
//       "Bachelor's degree or equivalent",
//       '3+ years ASIC design/architecture experience',
//       'Proficiency in SystemVerilog and RTL design',
//       'Experience with synthesis, timing, lint, CDC checks',
//       'Strong analytical and problem‑solving skills'
//     ],
//     postedDate: 'April 29, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2968674/asic-design-engineer-cloud-scale-machine-learning-acceleration-team'
//   },
//   3: {
//     id: 3,
//     title: 'Data Center Engineering Operations Technician',
//     categoryId: 8,
//     location: 'Northern Virginia, USA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 75000, max: 110000, currency: 'USD' },
//     description: 'Manage and maintain mission-critical infrastructure in AWS data centers.',
//     requirements: ['2+ years data center experience', 'Electrical/mechanical systems knowledge'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3023072/data-center-engineering-operations-technician',
//   },
//   4: {
//     id: 4,
//     title: 'Integration Change Engineer, Robotic Integration',
//     categoryId: 9,
//     location: 'Boston, MA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 130000, max: 170000, currency: 'USD' },
//     description: 'Drive integration and change management in robotic systems at Amazon warehouses.',
//     requirements: ['Robotics/Engineering degree', '3+ years robotic systems experience'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3037312/integ-change-engineer-robotic-integration-change',
//   },
//   5: {
//     id: 5,
//     title: 'Application Developer – Professional Services',
//     categoryId: 1,
//     location: 'Various US Locations',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 110000, max: 160000, currency: 'USD' },
//     description: 'Build scalable applications and solutions as part of AWS Professional Services.',
//     requirements: ['3+ years software development', 'Cloud technologies experience', 'Multiple programming languages'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3021186/application-developer-professional-services',
//   },
//   6: {
//     id: 6,
//     title: 'Full Stack Developer',
//     categoryId: 1, // Software Engineering - not Security
//     location: 'North Delhi, Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (4–8 years)',
//     salary: { min: 1000000, max: 2500000, currency: 'INR' },
//     description: 'Lead and mentor full-stack projects, architect and build scalable .NET based solutions, collaborate with cross-functional teams through the full software development lifecycle, and drive process & performance improvements.',
//     requirements: [
//       '4–8 years of overall full-stack development experience',
//       'Proficient in C#, .NET Framework, ASP.NET MVC, and Web API',
//       'Strong JavaScript skills and experience with AngularJS or React.js',
//       'Experience with NoSQL and MongoDB',
//       'Familiarity with AWS and Azure cloud platforms',
//       'Skilled in SQL databases and query optimization',
//       'Knowledge of DevOps, CI/CD pipelines, version control (Git)',
//       'Proven leadership or mentoring experience in development teams'
//     ],
//     postedDate: 'June 22, 2025',
//     applyUrl: 'https://www.sourcingxpress.com/jobs/e6edc57f-0e59-40e2-9843-91046c24e874'
//   },
//   7: {
//     id: 7,
//     title: 'Senior Software Engineer – Remote',
//     categoryId: 1,
//     location: 'Remote (Global)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 80000, max: 140000, currency: 'USD' },
//     description: 'Work with top-tier clients to develop cutting-edge software solutions.',
//     requirements: ['5+ years software development', 'Multiple programming languages', 'Remote collaboration skills'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://applicants.bairesdev.com/job/1/281122/apply',
//   },
//   8: {
//     id: 8,
//     title: 'Sr Technical Program Manager, Production Change Management, Project Kuiper',
//     categoryId: 1, 
//     location: 'Redmond, WA, USA',
//     type: 'Full‑time',
//     experience: 'Senior-level',
//     salary: { min: 133900, max: 231400, currency: 'USD' },
//     description: "Support Kuiper Production's Engineering Change Control process: lead process and tool improvements (automation, validation, PLM) to integrate engineering changes into production.",
//     requirements: [
//       "Bachelor's degree in engineering, computer science or equivalent",
//       '6+ years technical product or program management experience',
//       '3+ years aerospace/industrial/manufacturing operations experience',
//       'Experience leading continuous improvement and cross-functional programs',
//       'Excellent analytical and interpersonal skills'
//     ],
//     postedDate: "April 30, 2025",
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2970236/sr-technical-program-manager-production-change-management-project-kuiper',
//   },
//   9: {
//     id: 9,
//     title: 'Software Development Manager, RDS Proxy, RDS Proxy Controlplane',
//     categoryId: 1,
//     location: 'Bellevue, WA, USA',
//     type: 'Full-time',
//     experience: 'Senior-level',
//     salary: { min: 166400, max: 287700, currency: 'USD' },
//     description: 'Lead the engineering team responsible for building and operating the RDS Proxy control plane: the APIs, workflows, and tools that provision and manage proxy instances.',
//     requirements: [
//       '3+ years engineering team management experience',
//       '7+ years engineering experience',
//       '8+ years building multi-tier web services',
//       'Knowledge of full SDLC: coding standards, reviews, CI/CD, livesite operations',
//       'Experience partnering with product or program management teams'
//     ],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3030146/software-development-manager-rds-proxy-rds-proxy-controlpane'
//   },
//   10: {
//     id: 10,
//     title: 'Data Scientist - Machine Learning',
//     categoryId: 2,
//     location: 'San Francisco, CA',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 140000, max: 200000, currency: 'USD' },
//     description: 'Build and deploy machine learning models for recommendation systems.',
//     requirements: ['PhD in Data Science/ML', 'Python/R expertise', 'Big data technologies'],
//     postedDate: '2024-12-28',
//     applyUrl: 'https://example.com/job/7',
//   },
//   // Removed duplicate job 14 (was identical to job 6)
//   15: {
//     id: 15,
//     title: 'Regional Medical Director',
//     categoryId: 3,
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (10+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Lead the delivery of medical assistance services across the region. Ensure clinical governance, quality control, and client satisfaction while mentoring the medical team and driving operational excellence.',
//     requirements: [
//       'Medical degree (MBBS/MD or equivalent)',
//       '10+ years of clinical experience with managerial responsibilities',
//       'Experience in remote or emergency medical care preferred',
//       'Strong leadership and team management skills',
//       'Excellent communication and client-facing abilities',
//       'Ability to work under pressure and manage crisis situations',
//       'Willingness to travel across the region as required'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://opportunities.internationalsos.com/careers/job/563980759701678'
//   },
//   16: {
//     id: 16,
//     title: 'Technical Specialist – MS Systems',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Provide specialized Microsoft systems support within NTT's global services framework. Manage system deployments, troubleshoot complex issues, and ensure stable, secure environments for enterprise clients.",
//     requirements: [
//       '5+ years hands-on experience with Microsoft server technologies (Windows Server, Active Directory, Exchange, SQL Server)',
//       'Expertise in system deployment, configuration, and management',
//       'Strong troubleshooting skills for complex technical issues',
//       'Experience in enterprise IT environments and client-facing support',
//       'Familiarity with ITIL processes and change management',
//       'Excellent communication and documentation skills'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply'
//   },
//   17: {
//     id: 17,
//     title: '(Senior) Specialist, India Operations',
//     categoryId: 1, // Software Engineering (more appropriate than Security for operations role)
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (2–4 years)',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Manage end-to-end India operations including people, office, logistics, and culture. Optimize systems (recruitment, onboarding/offboarding, compliance), provide executive support, and ensure smooth regional functioning.',
//     requirements: [
//       "Bachelor's degree in Business Administration, HR, or related discipline",
//       "2–4 years experience in operations, HR, logistics, or organisational building",
//       'Experience with full-lifecycle hiring and ATS (iCIMS preferred)',
//       '"Get-things-done" attitude with operational excellence',
//       'Strong communication and stakeholder-management skills',
//       'High attention to detail and ability to drive cross-functional initiatives',
//       'Fluency in English and Hindi',
//       'Passion for global development and working with diverse teams',
//       'Ability to thrive in dynamic environments and handle ambiguity'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://internationalcareers-idinsight.icims.com/jobs/1340/(senior)-specialist,‑india‑operations‑(2025‑india)/job'
//   },
//   18: {
//     id: 18,
//     title: 'Manager, Business Operations',
//     categoryId: 1, // Software Engineering
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (8+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Lead business operations initiatives across engineering and operations teams at Qualcomm India. Drive process improvements, manage stakeholder relationships, and support strategic planning.',
//     requirements: [
//       '8+ years in business operations, program or project management',
//       'Experience in global tech/semiconductor environments',
//       'Strong analytical and problem-solving skills',
//       'Excellent communication and stakeholder engagement abilities',
//       'Proficiency in project planning and operational tools',
//       'MBA or equivalent preferred'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.qualcomm.com/careers/job/446706361287'
//   },
//   // Removed duplicate job 19 (was identical to job 16)
//   20: {
//     id: 20,
//     title: 'Technical Security Specialist – Senior',
//     categoryId: 3,
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Acts as a technical expert in security technology, standards, policy compliance, and analytics. Supports and leads projects involving complex security systems for FedEx AMEA.',
//     requirements: [
//       'Technical expert in Security Technology, security standards policy & compliance, and security analytics',
//       'High accuracy, attention to detail, analytical and problem-solving skills',
//       'Strong judgement, decision-making, and verbal/written communication',
//       'Supports management in analysis, interpretation, and application of complex information',
//       'Ability to support or lead complex security projects'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.fedex.com/m46h0-technical-security-specialist-senior/job/9EE4B8FE8747BD856EF0101371A7B5B8'
//   },
//   21: {
//     id: 21,
//     title: 'Senior Consultant – Power Markets',
//     categoryId: 1, // Software Engineering (consulting role)
//     location: 'Remote (USA)',
//     type: 'Full-time',
//     experience: 'Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Provide consulting expertise in modeling, analysis, and advisory services for U.S. electric power markets. Work on market design, policy impacts, decarbonization, and grid economics with ICF's Energy Advisory team.",
//     requirements: [
//       "Master's or advanced degree in Energy, Economics, Engineering, or related field",
//       "5+ years of experience in power markets, energy consulting, or related sectors",
//       'Hands-on experience with power market modeling tools (PROMOD, PLEXOS, Aurora, or similar)',
//       'Strong quantitative, analytical, and problem-solving skills',
//       'Exceptional written and verbal communication skills',
//       'In-depth understanding of electricity market operations (RTO/ISO/PJM/CAISO etc.)',
//       'Ability to manage client relationships and deliver actionable insights'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
//   },
//   22: {
//     id: 22,
//     title: 'Sr. Specialist, Global Strategy & Ops (GSO)',
//     categoryId: 2, // Data Science (analytics role)
//     location: 'Gurugram (New Delhi region), India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (4–8 years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Lead competitive intelligence and analytics support for Bain's Global Strategy & Operations team at the Gurugram GBS office. Drive research, benchmarking, dashboard optimization, and deliver zero-defect insights for senior leadership.",
//     requirements: [
//       '4–6 years experience (postgraduate) or 6–8 years (graduate) in consulting, research, or business intelligence',
//       'Strong data analysis, interpretation, and research skills',
//       'Proficiency in Excel, PowerPoint, Tableau, Alteryx, and automation (Python preferred)',
//       'Competency in competitive intelligence and market benchmarking',
//       'Experience leading, coaching, and mentoring junior team members',
//       'Excellent communication with technical and non-technical senior stakeholders',
//       'Ability to manage multiple priorities, tight deadlines, and deliver flawless output',
//       'First-class degree from a reputed institution'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://www.bain.com/careers/find-a-role/position/?jobid=95830'
//   },
//   23: {
//     id: 23,
//     title: 'CE Planning & Engineering Specialist – Associate',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid (3–5 years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Manage regional daily uplift escalation requests, automate processes, support quality assurance, design training frameworks, drive performance excellence, and support tech-transformations within FedEx AMEA operations.',
//     requirements: [
//       'Strong analytical, planning, and problem-solving skills',
//       'Experience in quality assurance, process excellence, and performance improvement',
//       'Proficiency in audit controls, governance management, and risk mitigation',
//       'Excellent stakeholder engagement, reporting, and presentation skills',
//       'Ability to support or lead complex projects and UAT',
//       'Familiarity with IT tools, data governance, and performance trend analysis',
//       'Ability to work under pressure and manage crisis/contingency support'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.fedex.com/ce-planning-engineering-specialist-associate/job/CF6B441F0A8604B8B45E1EF5239F1499'
//   },
//   24: {
//     id: 24,
//     title: 'Enterprise Sales Specialist – US Market',
//     categoryId: 1, // Software Engineering
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (2–5 years)',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Drive revenue growth by addressing unique needs of customers and partners in the US/North America region. Develop and execute business and marketing plans, manage leads through the sales pipeline, and ensure high partner satisfaction.',
//     requirements: [
//       'Respond to customer and partner inquiries with tailored information and solutions',
//       'Engage and collaborate with business partners',
//       'Follow up on leads and update internal systems',
//       'Manage full sales cycle: qualify, present, demo, RFPs, negotiate, close',
//       'Develop deep understanding of territory: customers, partners, competitors',
//       'Support US market; generate leads in North America',
//       'Work night shifts aligned with US business hours',
//       'Maintain professional attitude and company values',
//       'Coordinate sales support with technical staff',
//       'Leverage relationships to identify new strategic opportunities',
//       'Hybrid working in Delhi office or remote elsewhere',
//       'Manage a growing team of senior ICs',
//       'Penetrate ABM accounts strategically',
//       'Research new accounts and contacts',
//       'Use HubSpot & LinkedIn for activity tracking'
//     ],
//     postedDate: 'May 9, 2025',
//     applyUrl: 'https://careers.restroworks.com/jobs/Careers/720131000006200092/Enterprise-sales-specialist--US-market'
//   },
//   25: {
//     id: 25,
//     title: 'Technical Specialist – MS Systems',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Ensure assigned infrastructure at client sites is configured, tested, and operational. Manage third-line support, proactive incident resolution, monitoring, and automation. Coach junior teams and support cross-technology domains including Cloud, Security, Networking, Applications, and Collaboration.',
//     requirements: [
//       '5+ years experience with Windows Server, Active Directory, Exchange, SQL Server',
//       'Expertise in system deployment, configuration, and management in enterprise IT environments',
//       'Strong troubleshooting skills for complex technical issues',
//       'Experience in monitoring and responding to alerts using monitoring tools',
//       'Knowledge of ITIL processes and change management',
//       'Ability to coach L2 teams, perform root-cause analysis, and manage third-party vendor escalations',
//       'Strong communication, documentation, and stakeholder management abilities'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply?source=LinkedIn'
//   },
//   26: {
//     id: 26,
//     title: 'Senior Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Build fast, intuitive, mobile-responsive web interfaces; integrate with CRM and APIs; ensure performance, cross-browser compatibility, and documentation.',
//     requirements: [
//       "Associate degree required (Bachelor's preferred)",
//       "3+ years of frontend development experience in startups or similar",
//       '1+ year with frameworks like Angular 2+, React.js, or React Native',
//       'Strong JavaScript, CSS/SASS, HTML skills',
//       'Familiarity with W3C web standards and accessibility (e.g., s508)',
//       'Experience with unit testing tools like Karma, Jasmine, Mocha, or Chai',
//       'Ability to translate UI/UX designs and troubleshoot production issues',
//       'Excellent problem-solving and collaboration skills'
//     ],
//     postedDate: 'June 29, 2025',
//     applyUrl: 'https://www.hirist.tech/j/senior-frontend-developer-1504263'
//   },
//   27: {
//     id: 27,
//     title: 'Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Delhi NCR (Delhi / Gurgaon / Noida)',
//     type: 'Full-time',
//     experience: 'Mid-Senior',
//     salary: { min: 600000, max: 1200000, currency: 'INR' },
//     description: 'Techjockey is looking for a Frontend Developer who is passionate about creating pixel-perfect, performance-optimized web applications. You will work closely with UI/UX designers and backend engineers to deliver outstanding experiences.',
//     requirements: [
//       '2–5 years of experience in frontend development',
//       'Strong proficiency in HTML, CSS, JavaScript',
//       'Expertise in React.js and modern JavaScript frameworks',
//       'Experience with RESTful APIs and cross-browser compatibility',
//       'Good understanding of responsive design and browser rendering behavior',
//       'Strong debugging and problem-solving skills',
//       'Experience with version control tools like Git'
//     ],
//     postedDate: 'July 15, 2025',
//     applyUrl: 'https://cutshort.io/job/Frontend-Developer-Delhi-NCR-Delhi-Gurgaon-Noida-Techjockey-com-qokceGof'
//   },
//   28: {
//     id: 28,
//     title: 'Sr. Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'NCR (Delhi / Gurgaon / Noida)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 1500000, max: 2500000, currency: 'INR' },
//     description: "You'll be responsible for developing new user-facing features using ReactJS, building reusable components, translating UI/UX wireframes into code, optimizing performance across browsers/devices, writing tests and documentation, and understanding asynchronous programming patterns.",
//     requirements: [
//       'Proficient in HTML, CSS, JavaScript (ES6+)',
//       'Strong command of ReactJS / Redux',
//       'Performance optimization techniques knowledge',
//       'Familiar with Redux Saga or Thunk for async behavior',
//       'Experience with RESTful APIs and error handling',
//       'Fundamental understanding of good user experience',
//       'Familiarity with Git',
//       'Good problem-solving skills'
//     ],
//     postedDate: 'July, 2025',
//     applyUrl: 'https://cutshort.io/job/Sr-Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Roadzen-Technologies-mMgrPAuS'
//   },
//   29: {
//     id: 29,
//     title: 'Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Remote or NCR (Delhi | Gurgaon | Noida)',
//     type: 'Full-time',
//     experience: 'Mid (2–3 years)',
//     salary: { min: 600000, max: 800000, currency: 'INR' },
//     description: 'Build high-quality, high-performance, mobile-optimized web applications; translate wireframes into reusable code; ensure brand consistency; identify performance bottlenecks; maintain code quality via reviews and automation.',
//     requirements: [
//       '2+ years of experience in OO JavaScript and front‑end frameworks',
//       'Strong expertise in HTML5, CSS3, JavaScript',
//       'Familiarity with SASS, Bootstrap, CSS Grid',
//       'Proficient in React, AngularJS, jQuery',
//       'Experienced in asynchronous handling, partial page updates, Ajax',
//       'Good understanding of cross-browser compatibility issues',
//       'Experience with bundlers like webpack or gulp',
//       'Familiarity with graphic design tools (Figma, Sketch, Adobe XD, PSD to HTML)',
//       'Proficiency in version control (Git, Mercurial, or SVN)'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Clickpost-lkwNBO9l'
//   },
//   30: {
//     id: 30,
//     title: 'Senior Consultant – Power Markets',
//     categoryId: 1, // FIXED: Changed from 3 (Security) to 1 (Software Engineering)
//     location: 'Remote (USA)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Work with ICF's Energy Advisory team to model and analyze U.S. power markets. Contribute to client solutions in the areas of decarbonization, market design, policy impact, and grid economics.",
//     requirements: [
//       "Master's degree in Energy, Economics, Engineering, or related field",
//       '5+ years experience in power markets or energy consulting',
//       'Expertise in modeling tools (e.g., PROMOD, PLEXOS, Aurora)',
//       'Strong quantitative and analytical skills',
//       'Excellent communication and presentation abilities',
//       'Familiarity with RTO/ISO market operations'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
//   },
// };

// // Companies - mapping to job IDs
// const COMPANIES = {
//   // all:{
//   //   id:"all",
//   //   name:"all",
//   //   jobs:[26,27,28,29,30]
//   // },
//   amazon: {
//     id: 'amazon',
//     name: 'Amazon',
//     logo: 'https://logo.clearbit.com/amazon.com',
//     jobs: [1, 2, 3, 4, 5, 8, 9], // Updated job IDs
//   },
//   sourcingxpress: {
//     id: 'sourcingxpress',
//     name: 'SourcingXpress',
//     logo: 'https://logo.clearbit.com/sourcingxpress.com',
//     jobs: [6],
//   },
//   bairesdev: {
//     id: 'bairesdev',
//     name: 'BairesDev',
//     logo: 'https://logo.clearbit.com/bairesdev.com',
//     jobs: [7],
//   },
//   generic: {
//     id: 'generic',
//     name: 'Various Companies',
//     logo: 'https://logo.clearbit.com/example.com',
//     jobs: [10],
//   },
//   internationalsos: {
//     id: 'internationalsos',
//     name: 'International SOS',
//     logo: 'https://logo.clearbit.com/internationalsos.com',
//     jobs: [15],
//   },
//   ntt: {
//     id: 'ntt',
//     name: 'NTT',
//     logo: 'https://logo.clearbit.com/ntt.com',
//     jobs: [16, 25],
//   },
//   idinsight: {
//     id: 'idinsight',
//     name: 'IDinsight',
//     logo: 'https://logo.clearbit.com/idinsight.org',
//     jobs: [17],
//   },
//   qualcomm: {
//     id: 'qualcomm',
//     name: 'Qualcomm',
//     logo: 'https://logo.clearbit.com/qualcomm.com',
//     jobs: [18],
//   },
//   fedex: {
//     id: 'fedex',
//     name: 'FedEx',
//     logo: 'https://logo.clearbit.com/fedex.com',
//     jobs: [20, 23],
//   },
//   icf: {
//     id: 'icf',
//     name: 'ICF',
//     logo: 'https://logo.clearbit.com/icf.com',
//     jobs: [21],
//   },
//   bain: {
//     id: 'bain',
//     name: 'Bain & Company',
//     logo: 'https://logo.clearbit.com/bain.com',
//     jobs: [22],
//   },
//   restroworks: {
//     id: 'restroworks',
//     name: 'RestroWorks',
//     logo: 'https://logo.clearbit.com/restroworks.com',
//     jobs: [24,25,26,27,28,29,30],
//   }
// };

// // Helper Functions
// const getJobById = (id) => {
//   const job = JOBS[id];
//   if (!job) return null;
  
//   return {
//     ...job,
//     category: CATEGORIES[job.categoryId],
//     company: Object.values(COMPANIES).find(company => company.jobs.includes(id))
//   };
// };

// const getJobsByCompany = (companyId) => {
//   const company = COMPANIES[companyId];
//   if (!company) return [];
  
//   return company.jobs.map(jobId => getJobById(jobId)).filter(Boolean);
// };

// const getJobsByCategory = (categoryId) => {
//   return Object.values(JOBS)
//     .filter(job => job.categoryId === parseInt(categoryId))
//     .map(job => getJobById(job.id));
// };

// const getAllJobs = () => {
//   return Object.values(JOBS).map(job => getJobById(job.id));
// };

// const searchJobs = (query) => {
//   return getAllJobs().filter(job =>
//     job.title.toLowerCase().includes(query.toLowerCase()) ||
//     job.description.toLowerCase().includes(query.toLowerCase()) ||
//     job.company.name.toLowerCase().includes(query.toLowerCase()) ||
//     job.category.name.toLowerCase().includes(query.toLowerCase())
//   );
// };

// export function makeServer() {
//   return createServer({
//     routes() {
//       this.namespace = 'api';

//       // Get all jobs
//       this.get('/jobs', () => {
//         return {
//           jobs: getAllJobs(),
//           total: Object.keys(JOBS).length
//         };
//       });

//       // Get job by ID
//       this.get('/jobs/:id', (schema, request) => {
//         const job = getJobById(parseInt(request.params.id));
//         if (!job) {
//           return new Response(404, {}, { error: 'Job not found' });
//         }
//         return { job };
//       });

//       // Get jobs by company
//       this.get('/companies/:companyId/jobs', (schema, request) => {
//         const jobs = getJobsByCompany(request.params.companyId);
//         const company = COMPANIES[request.params.companyId];
        
//         return {
//           jobs,
//           company,
//           total: jobs.length
//         };
//       });

//       // Get jobs by category
//       this.get('/categories/:categoryId/jobs', (schema, request) => {
//         const jobs = getJobsByCategory(request.params.categoryId);
//         const category = CATEGORIES[parseInt(request.params.categoryId)];
        
//         return {
//           jobs,
//           category,
//           total: jobs.length
//         };
//       });

//       // Search jobs
//       this.get('/jobs/search', (schema, request) => {
//         const { q } = request.queryParams;
//         if (!q) return { jobs: [], total: 0 };
        
//         const jobs = searchJobs(q);
//         return {
//           jobs,
//           total: jobs.length,
//           query: q
//         };
//       });

//       // Get all categories
//       this.get('/categories', () => {
//         return {
//           categories: Object.values(CATEGORIES),
//           total: Object.keys(CATEGORIES).length
//         };
//       });

//       // Get all companies
//       this.get('/companies', () => {
//         return {
//           companies: Object.values(COMPANIES),
//           total: Object.keys(COMPANIES).length
//         };
//       });

//       // Get stats
//       this.get('/stats', () => {
//         const allJobs = getAllJobs();
        
//         return {
//           totalJobs: allJobs.length,
//           totalCompanies: Object.keys(COMPANIES).length,
//           totalCategories: Object.keys(CATEGORIES).length,
//           jobsByCategory: Object.values(CATEGORIES).map(category => ({
//             category: category.name,
//             count: getJobsByCategory(category.id).length
//           })),
//           jobsByCompany: Object.values(COMPANIES).map(company => ({
//             company: company.name,
//             count: company.jobs.length
//           }))
//         };
//       });
//     },
//   });
// }
// FileName: MultipleFiles/server.js
import { createServer } from 'miragejs';

// // Categories - normalized by ID
// const CATEGORIES = {
//   1: { id: 1, name: 'Software Engineering', slug: 'software-engineering' },
//   2: { id: 2, name: 'Data Science', slug: 'data-science' },
//   3: { id: 3, name: 'Security', slug: 'security' },
//   4: { id: 4, name: 'DevOps', slug: 'devops' },
//   5: { id: 5, name: 'Frontend Development', slug: 'frontend' },
//   6: { id: 6, name: 'Backend Development', slug: 'backend' },
//   7: { id: 7, name: 'Mobile Development', slug: 'mobile' },
//   8: { id: 8, name: 'Infrastructure', slug: 'infrastructure' },
//   9: { id: 9, name: 'Robotics', slug: 'robotics' },
//   10: { id: 10, name: 'Cloud Engineering', slug: 'cloud' },
// };

// // Jobs - normalized by ID with category reference
// const JOBS = {
//   1: {
//     id: 1,
//     title: 'SOC Support Engineer III – AWS SOC Security Support Engineer',
//     categoryId: 3,
//     location: 'Seattle, WA (or remote)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 120000, max: 180000, currency: 'USD' },
//     description: 'Support AWS Security Operations Center to maintain a secure cloud environment.',
//     requirements: ['3+ years security operations', 'AWS security knowledge', 'SIEM tools experience'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2988485/soc-support-engineer-iii-aws-soc-security-support-engineer',
//   },
//   2: {
//     id: 2,
//     title: 'ASIC Design Engineer, Cloud‑Scale Machine Learning Acceleration team',
//     categoryId: 8, // Infrastructure - more appropriate than DevOps
//     location: 'Cupertino, CA, USA / Austin, TX, USA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 129800, max: 212800, currency: 'USD' },
//     description: 'Develop and implement high‑performance, power‑ and area‑efficient RTL designs for AWS custom SoCs like Inferentia.',
//     requirements: [
//       "Bachelor's degree or equivalent",
//       '3+ years ASIC design/architecture experience',
//       'Proficiency in SystemVerilog and RTL design',
//       'Experience with synthesis, timing, lint, CDC checks',
//       'Strong analytical and problem‑solving skills'
//     ],
//     postedDate: 'April 29, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2968674/asic-design-engineer-cloud-scale-machine-learning-acceleration-team'
//   },
//   3: {
//     id: 3,
//     title: 'Data Center Engineering Operations Technician',
//     categoryId: 8,
//     location: 'Northern Virginia, USA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 75000, max: 110000, currency: 'USD' },
//     description: 'Manage and maintain mission-critical infrastructure in AWS data centers.',
//     requirements: ['2+ years data center experience', 'Electrical/mechanical systems knowledge'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3023072/data-center-engineering-operations-technician',
//   },
//   4: {
//     id: 4,
//     title: 'Integration Change Engineer, Robotic Integration',
//     categoryId: 9,
//     location: 'Boston, MA',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 130000, max: 170000, currency: 'USD' },
//     description: 'Drive integration and change management in robotic systems at Amazon warehouses.',
//     requirements: ['Robotics/Engineering degree', '3+ years robotic systems experience'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3037312/integ-change-engineer-robotic-integration-change',
//   },
//   5: {
//     id: 5,
//     title: 'Application Developer – Professional Services',
//     categoryId: 1,
//     location: 'Various US Locations',
//     type: 'Full-time',
//     experience: 'Mid-level',
//     salary: { min: 110000, max: 160000, currency: 'USD' },
//     description: 'Build scalable applications and solutions as part of AWS Professional Services.',
//     requirements: ['3+ years software development', 'Cloud technologies experience', 'Multiple programming languages'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3021186/application-developer-professional-services',
//   },
//   6: {
//     id: 6,
//     title: 'Full Stack Developer',
//     categoryId: 1, // Software Engineering - not Security
//     location: 'North Delhi, Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (4–8 years)',
//     salary: { min: 1000000, max: 2500000, currency: 'INR' },
//     description: 'Lead and mentor full-stack projects, architect and build scalable .NET based solutions, collaborate with cross-functional teams through the full software development lifecycle, and drive process & performance improvements.',
//     requirements: [
//       '4–8 years of overall full-stack development experience',
//       'Proficient in C#, .NET Framework, ASP.NET MVC, and Web API',
//       'Strong JavaScript skills and experience with AngularJS or React.js',
//       'Experience with NoSQL and MongoDB',
//       'Familiarity with AWS and Azure cloud platforms',
//       'Skilled in SQL databases and query optimization',
//       'Knowledge of DevOps, CI/CD pipelines, version control (Git)',
//       'Proven leadership or mentoring experience in development teams'
//     ],
//     postedDate: 'June 22, 2025',
//     applyUrl: 'https://www.sourcingxpress.com/jobs/e6edc57f-0e59-40e2-9843-91046c24e874'
//   },
//   7: {
//     id: 7,
//     title: 'Senior Software Engineer – Remote',
//     categoryId: 1,
//     location: 'Remote (Global)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 80000, max: 140000, currency: 'USD' },
//     description: 'Work with top-tier clients to develop cutting-edge software solutions.',
//     requirements: ['5+ years software development', 'Multiple programming languages', 'Remote collaboration skills'],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://applicants.bairesdev.com/job/1/281122/apply',
//   },
//   8: {
//     id: 8,
//     title: 'Sr Technical Program Manager, Production Change Management, Project Kuiper',
//     categoryId: 1, 
//     location: 'Redmond, WA, USA',
//     type: 'Full‑time',
//     experience: 'Senior-level',
//     salary: { min: 133900, max: 231400, currency: 'USD' },
//     description: "Support Kuiper Production's Engineering Change Control process: lead process and tool improvements (automation, validation, PLM) to integrate engineering changes into production.",
//     requirements: [
//       "Bachelor's degree in engineering, computer science or equivalent",
//       '6+ years technical product or program management experience',
//       '3+ years aerospace/industrial/manufacturing operations experience',
//       'Experience leading continuous improvement and cross-functional programs',
//       'Excellent analytical and interpersonal skills'
//     ],
//     postedDate: "April 30, 2025",
//     applyUrl: 'https://www.amazon.jobs/en/jobs/2970236/sr-technical-program-manager-production-change-management-project-kuiper',
//   },
//   9: {
//     id: 9,
//     title: 'Software Development Manager, RDS Proxy, RDS Proxy Controlplane',
//     categoryId: 1,
//     location: 'Bellevue, WA, USA',
//     type: 'Full-time',
//     experience: 'Senior-level',
//     salary: { min: 166400, max: 287700, currency: 'USD' },
//     description: 'Lead the engineering team responsible for building and operating the RDS Proxy control plane: the APIs, workflows, and tools that provision and manage proxy instances.',
//     requirements: [
//       '3+ years engineering team management experience',
//       '7+ years engineering experience',
//       '8+ years building multi-tier web services',
//       'Knowledge of full SDLC: coding standards, reviews, CI/CD, livesite operations',
//       'Experience partnering with product or program management teams'
//     ],
//     postedDate: 'July 8, 2025',
//     applyUrl: 'https://www.amazon.jobs/en/jobs/3030146/software-development-manager-rds-proxy-rds-proxy-controlpane'
//   },
//   10: {
//     id: 10,
//     title: 'Data Scientist - Machine Learning',
//     categoryId: 2,
//     location: 'San Francisco, CA',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 140000, max: 200000, currency: 'USD' },
//     description: 'Build and deploy machine learning models for recommendation systems.',
//     requirements: ['PhD in Data Science/ML', 'Python/R expertise', 'Big data technologies'],
//     postedDate: '2024-12-28',
//     applyUrl: 'https://example.com/job/7',
//   },
//   15: {
//     id: 15,
//     title: 'Regional Medical Director',
//     categoryId: 3,
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (10+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Lead the delivery of medical assistance services across the region. Ensure clinical governance, quality control, and client satisfaction while mentoring the medical team and driving operational excellence.',
//     requirements: [
//       'Medical degree (MBBS/MD or equivalent)',
//       '10+ years of clinical experience with managerial responsibilities',
//       'Experience in remote or emergency medical care preferred',
//       'Strong leadership and team management skills',
//       'Excellent communication and client-facing abilities',
//       'Ability to work under pressure and manage crisis situations',
//       'Willingness to travel across the region as required'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://opportunities.internationalsos.com/careers/job/563980759701678'
//   },
//   16: {
//     id: 16,
//     title: 'Technical Specialist – MS Systems',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Provide specialized Microsoft systems support within NTT's global services framework. Manage system deployments, troubleshoot complex issues, and ensure stable, secure environments for enterprise clients.",
//     requirements: [
//       '5+ years hands-on experience with Microsoft server technologies (Windows Server, Active Directory, Exchange, SQL Server)',
//       'Expertise in system deployment, configuration, and management',
//       'Strong troubleshooting skills for complex technical issues',
//       'Experience in enterprise IT environments and client-facing support',
//       'Familiarity with ITIL processes and change management',
//       'Excellent communication and documentation skills'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply'
//   },
//   17: {
//     id: 17,
//     title: '(Senior) Specialist, India Operations',
//     categoryId: 1, // Software Engineering (more appropriate than Security for operations role)
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (2–4 years)',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Manage end-to-end India operations including people, office, logistics, and culture. Optimize systems (recruitment, onboarding/offboarding, compliance), provide executive support, and ensure smooth regional functioning.',
//     requirements: [
//       "Bachelor's degree in Business Administration, HR, or related discipline",
//       "2–4 years experience in operations, HR, logistics, or organisational building",
//       'Experience with full-lifecycle hiring and ATS (iCIMS preferred)',
//       '"Get-things-done" attitude with operational excellence',
//       'Strong communication and stakeholder-management skills',
//       'High attention to detail and ability to drive cross-functional initiatives',
//       'Fluency in English and Hindi',
//       'Passion for global development and working with diverse teams',
//       'Ability to thrive in dynamic environments and handle ambiguity'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://internationalcareers-idinsight.icims.com/jobs/1340/(senior)-specialist,‑india‑operations‑(2025‑india)/job'
//   },
//   18: {
//     id: 18,
//     title: 'Manager, Business Operations',
//     categoryId: 1, // Software Engineering
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (8+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Lead business operations initiatives across engineering and operations teams at Qualcomm India. Drive process improvements, manage stakeholder relationships, and support strategic planning.',
//     requirements: [
//       '8+ years in business operations, program or project management',
//       'Experience in global tech/semiconductor environments',
//       'Strong analytical and problem-solving skills',
//       'Excellent communication and stakeholder engagement abilities',
//       'Proficiency in project planning and operational tools',
//       'MBA or equivalent preferred'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.qualcomm.com/careers/job/446706361287'
//   },
//   20: {
//     id: 20,
//     title: 'Technical Security Specialist – Senior',
//     categoryId: 3,
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Acts as a technical expert in security technology, standards, policy compliance, and analytics. Supports and leads projects involving complex security systems for FedEx AMEA.',
//     requirements: [
//       'Technical expert in Security Technology, security standards policy & compliance, and security analytics',
//       'High accuracy, attention to detail, analytical and problem-solving skills',
//       'Strong judgement, decision-making, and verbal/written communication',
//       'Supports management in analysis, interpretation, and application of complex information',
//       'Ability to support or lead complex security projects'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.fedex.com/m46h0-technical-security-specialist-senior/job/9EE4B8FE8747BD856EF0101371A7B5B8'
//   },
//   21: {
//     id: 21,
//     title: 'Senior Consultant – Power Markets',
//     categoryId: 1, // Software Engineering (consulting role)
//     location: 'Remote (USA)',
//     type: 'Full-time',
//     experience: 'Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Provide consulting expertise in modeling, analysis, and advisory services for U.S. electric power markets. Work on market design, policy impacts, decarbonization, and grid economics with ICF's Energy Advisory team.",
//     requirements: [
//       "Master's or advanced degree in Energy, Economics, Engineering, or related field",
//       "5+ years of experience in power markets, energy consulting, or related sectors",
//       'Hands-on experience with power market modeling tools (PROMOD, PLEXOS, Aurora, or similar)',
//       'Strong quantitative, analytical, and problem-solving skills',
//       'Exceptional written and verbal communication skills',
//       'In-depth understanding of electricity market operations (RTO/ISO/PJM/CAISO etc.)',
//       'Ability to manage client relationships and deliver actionable insights'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
//   },
//   22: {
//     id: 22,
//     title: 'Sr. Specialist, Global Strategy & Ops (GSO)',
//     categoryId: 2, // Data Science (analytics role)
//     location: 'Gurugram (New Delhi region), India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (4–8 years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Lead competitive intelligence and analytics support for Bain's Global Strategy & Operations team at the Gurugram GBS office. Drive research, benchmarking, dashboard optimization, and deliver zero-defect insights for senior leadership.",
//     requirements: [
//       '4–6 years experience (postgraduate) or 6–8 years (graduate) in consulting, research, or business intelligence',
//       'Strong data analysis, interpretation, and research skills',
//       'Proficiency in Excel, PowerPoint, Tableau, Alteryx, and automation (Python preferred)',
//       'Competency in competitive intelligence and market benchmarking',
//       'Experience leading, coaching, and mentoring junior team members',
//       'Excellent communication with technical and non-technical senior stakeholders',
//       'Ability to manage multiple priorities, tight deadlines, and deliver flawless output',
//       'First-class degree from a reputed institution'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://www.bain.com/careers/find-a-role/position/?jobid=95830'
//   },
//   23: {
//     id: 23,
//     title: 'CE Planning & Engineering Specialist – Associate',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid (3–5 years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Manage regional daily uplift escalation requests, automate processes, support quality assurance, design training frameworks, drive performance excellence, and support tech-transformations within FedEx AMEA operations.',
//     requirements: [
//       'Strong analytical, planning, and problem-solving skills',
//       'Experience in quality assurance, process excellence, and performance improvement',
//       'Proficiency in audit controls, governance management, and risk mitigation',
//       'Excellent stakeholder engagement, reporting, and presentation skills',
//       'Ability to support or lead complex projects and UAT',
//       'Familiarity with IT tools, data governance, and performance trend analysis',
//       'Ability to work under pressure and manage crisis/contingency support'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.fedex.com/ce-planning-engineering-specialist-associate/job/CF6B441F0A8604B8B45E1EF5239F1499'
//   },
//   24: {
//     id: 24,
//     title: 'Enterprise Sales Specialist – US Market',
//     categoryId: 1, // Software Engineering
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (2–5 years)',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Drive revenue growth by addressing unique needs of customers and partners in the US/North America region. Develop and execute business and marketing plans, manage leads through the sales pipeline, and ensure high partner satisfaction.',
//     requirements: [
//       'Respond to customer and partner inquiries with tailored information and solutions',
//       'Engage and collaborate with business partners',
//       'Follow up on leads and update internal systems',
//       'Manage full sales cycle: qualify, present, demo, RFPs, negotiate, close',
//       'Develop deep understanding of territory: customers, partners, competitors',
//       'Support US market; generate leads in North America',
//       'Work night shifts aligned with US business hours',
//       'Maintain professional attitude and company values',
//       'Coordinate sales support with technical staff',
//       'Leverage relationships to identify new strategic opportunities',
//       'Hybrid working in Delhi office or remote elsewhere',
//       'Manage a growing team of senior ICs',
//       'Penetrate ABM accounts strategically',
//       'Research new accounts and contacts',
//       'Use HubSpot & LinkedIn for activity tracking'
//     ],
//     postedDate: 'May 9, 2025',
//     applyUrl: 'https://careers.restroworks.com/jobs/Careers/720131000006200092/Enterprise-sales-specialist--US-market'
//   },
//   25: {
//     id: 25,
//     title: 'Technical Specialist – MS Systems',
//     categoryId: 8, // Infrastructure
//     location: 'New Delhi, India',
//     type: 'Full-time',
//     experience: 'Mid–Senior (5+ years)',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: 'Ensure assigned infrastructure at client sites is configured, tested, and operational. Manage third-line support, proactive incident resolution, monitoring, and automation. Coach junior teams and support cross-technology domains including Cloud, Security, Networking, Applications, and Collaboration.',
//     requirements: [
//       '5+ years experience with Windows Server, Active Directory, Exchange, SQL Server',
//       'Expertise in system deployment, configuration, and management in enterprise IT environments',
//       'Strong troubleshooting skills for complex technical issues',
//       'Experience in monitoring and responding to alerts using monitoring tools',
//       'Knowledge of ITIL processes and change management',
//       'Ability to coach L2 teams, perform root-cause analysis, and manage third-party vendor escalations',
//       'Strong communication, documentation, and stakeholder management abilities'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply?source=LinkedIn'
//   },
//   26: {
//     id: 26,
//     title: 'Senior Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Delhi, India',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: null, max: null, currency: 'INR' },
//     description: 'Build fast, intuitive, mobile-responsive web interfaces; integrate with CRM and APIs; ensure performance, cross-browser compatibility, and documentation.',
//     requirements: [
//       "Associate degree required (Bachelor's preferred)",
//       "3+ years of frontend development experience in startups or similar",
//       '1+ year with frameworks like Angular 2+, React.js, or React Native',
//       'Strong JavaScript, CSS/SASS, HTML skills',
//       'Familiarity with W3C web standards and accessibility (e.g., s508)',
//       'Experience with unit testing tools like Karma, Jasmine, Mocha, or Chai',
//       'Ability to translate UI/UX designs and troubleshoot production issues',
//       'Excellent problem-solving and collaboration skills'
//     ],
//     postedDate: 'June 29, 2025',
//     applyUrl: 'https://www.hirist.tech/j/senior-frontend-developer-1504263'
//   },
//   27: {
//     id: 27,
//     title: 'Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Delhi NCR (Delhi / Gurgaon / Noida)',
//     type: 'Full-time',
//     experience: 'Mid-Senior',
//     salary: { min: 600000, max: 1200000, currency: 'INR' },
//     description: 'Techjockey is looking for a Frontend Developer who is passionate about creating pixel-perfect, performance-optimized web applications. You will work closely with UI/UX designers and backend engineers to deliver outstanding experiences.',
//     requirements: [
//       '2–5 years of experience in frontend development',
//       'Strong proficiency in HTML, CSS, JavaScript',
//       'Expertise in React.js and modern JavaScript frameworks',
//       'Experience with RESTful APIs and cross-browser compatibility',
//       'Good understanding of responsive design and browser rendering behavior',
//       'Strong debugging and problem-solving skills',
//       'Experience with version control tools like Git'
//     ],
//     postedDate: 'July 15, 2025',
//     applyUrl: 'https://cutshort.io/job/Frontend-Developer-Delhi-NCR-Delhi-Gurgaon-Noida-Techjockey-com-qokceGof'
//   },
//   28: {
//     id: 28,
//     title: 'Sr. Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'NCR (Delhi / Gurgaon / Noida)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: 1500000, max: 2500000, currency: 'INR' },
//     description: "You'll be responsible for developing new user-facing features using ReactJS, building reusable components, translating UI/UX wireframes into code, optimizing performance across browsers/devices, writing tests and documentation, and understanding asynchronous programming patterns.",
//     requirements: [
//       'Proficient in HTML, CSS, JavaScript (ES6+)',
//       'Strong command of ReactJS / Redux',
//       'Performance optimization techniques knowledge',
//       'Familiar with Redux Saga or Thunk for async behavior',
//       'Experience with RESTful APIs and error handling',
//       'Fundamental understanding of good user experience',
//       'Familiarity with Git',
//       'Good problem-solving skills'
//     ],
//     postedDate: 'July, 2025',
//     applyUrl: 'https://cutshort.io/job/Sr-Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Roadzen-Technologies-mMgrPAuS'
//   },
//   29: {
//     id: 29,
//     title: 'Frontend Developer',
//     categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
//     location: 'Remote or NCR (Delhi | Gurgaon | Noida)',
//     type: 'Full-time',
//     experience: 'Mid (2–3 years)',
//     salary: { min: 600000, max: 800000, currency: 'INR' },
//     description: 'Build high-quality, high-performance, mobile-optimized web applications; translate wireframes into reusable code; ensure brand consistency; identify performance bottlenecks; maintain code quality via reviews and automation.',
//     requirements: [
//       '2+ years of experience in OO JavaScript and front‑end frameworks',
//       'Strong expertise in HTML5, CSS3, JavaScript',
//       'Familiarity with SASS, Bootstrap, CSS Grid',
//       'Proficient in React, AngularJS, jQuery',
//       'Experienced in asynchronous handling, partial page updates, Ajax',
//       'Good understanding of cross-browser compatibility issues',
//       'Experience with bundlers like webpack or gulp',
//       'Familiarity with graphic design tools (Figma, Sketch, Adobe XD, PSD to HTML)',
//       'Proficiency in version control (Git, Mercurial, or SVN)'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Clickpost-lkwNBO9l'
//   },
//   30: {
//     id: 30,
//     title: 'Senior Consultant – Power Markets',
//     categoryId: 1, // FIXED: Changed from 3 (Security) to 1 (Software Engineering)
//     location: 'Remote (USA)',
//     type: 'Full-time',
//     experience: 'Senior',
//     salary: { min: null, max: null, currency: 'USD' },
//     description: "Work with ICF's Energy Advisory team to model and analyze U.S. power markets. Contribute to client solutions in the areas of decarbonization, market design, policy impact, and grid economics.",
//     requirements: [
//       "Master's degree in Energy, Economics, Engineering, or related field",
//       '5+ years experience in power markets or energy consulting',
//       'Expertise in modeling tools (e.g., PROMOD, PLEXOS, Aurora)',
//       'Strong quantitative and analytical skills',
//       'Excellent communication and presentation abilities',
//       'Familiarity with RTO/ISO market operations'
//     ],
//     postedDate: 'July 2025',
//     applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
//   },
//   31: {
//   id: 31,
//   title: 'Senior Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Delhi, India',
//   type: 'Full-time',
//   experience: 'Mid-Senior', // Equivalent to 3‑5 years
//   salary: { min: null, max: null, currency: 'INR' }, // Salary not specified
//   description:
//     'Develop fast, responsive, and intuitive web interfaces. Implement mobile‑responsive web pages and web forms with CRM integration. Work on API integrations for dynamic communications, and translate UI/UX mockups into high‑quality frontend code. Ensure cross‑browser/platform compatibility, performance, and maintainability.',
//   requirements: [
//     'Associate degree in technology-related field (bachelor’s preferred)',
//     '3+ years of frontend development experience in a startup or similar environment',
//     'Hands-on with Angular 2+, React.js or React Native',
//     'Strong JS proficiency and production-grade HTML/CSS/SASS skills',
//     'Familiarity with web standards and accessibility (W3C, s508)',
//     'Good understanding of web app architecture and cross-browser/platform constraints',
//     'Experience with unit test frameworks (Karma, Jasmine, Mocha, Chai)',
//     'Excellent problem-solving, communication, and collaboration skills',
//     'Ability to multitask and work to deadlines in fast-paced environments'
//   ],
//   postedDate: 'June 29, 2025',
//   applyUrl: 'https://www.hirist.tech/j/senior-frontend-developer-1504263'
// },

// 32: {
//   id: 32,
//   title: 'Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Delhi NCR, India',
//   type: 'Full-time',
//   experience: 'Mid‑Senior', // 4–6 years
//   salary: { min: 500000, max: 900000, currency: 'INR' },
//   description:
//     'Join Techjockey.com to develop front-end applications at scale. Work closely with designers and back-end developers to optimize UI performance, implement responsive, SEO/accessibility-conscious web interfaces, and maintain high code quality standards.',
//   requirements: [
//     '4–6 years of Front‑end development experience at scale',
//     'Strong skills in JavaScript, CSS, Angular, AJAX, jQuery, React, Node.js',
//     'Experience with CSS preprocessors (SASS/LESS), Bootstrap',
//     'In-depth understanding of web development process, cross‑browser/device compatibility, SEO',
//     'Familiar with WordPress theme integration and template customization',
//     'Ability to write W3C‑validated, SEO‑friendly code'
//   ],
//   postedDate: 'July 2025',
//   applyUrl: 'https://cutshort.io/job/Frontend-Developer-Delhi-NCR-Delhi-Gurgaon-Noida-Techjockey-com-qokceGof'
// },

// 33: {
//   id: 33,
//   title: 'Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // 2+ years
//   salary: { min: 600000, max: 800000, currency: 'INR' },
//   description:
//     'Build reusable, high‑performance frontend components and responsive web apps using modern JS frameworks. Optimize for mobile, maintain brand consistency, and collaborate through code reviews and automation.',
//   requirements: [
//     '2+ years experience in OO JavaScript and frontend frameworks',
//     'Expertise in HTML5, CSS3, JavaScript',
//     'Familiar with SASS/Bootstrap, CSS Grid',
//     'Proficient with React, AngularJS, jQuery',
//     'Good understanding of async requests, AJAX, partial page updates',
//     'Experience with webpack, gulp (module bundlers)',
//     'Skilled in graphic UI tools (Figma, Sketch, Adobe XD, PSD to HTML)',
//     'Experience with version control (Git, Mercurial, SVN)',
//     'Nice to have: knowledge of Node.js, Python, isomorphic React'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Clickpost-lkwNBO9l'
// },

// 34: {
//   id: 34,
//   title: 'Sr. Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Delhi NCR (Delhi | Gurgaon | Noida), India',
//   type: 'Full-time',
//   experience: 'Senior', // 3–6 years
//   salary: { min: 1500000, max: 2500000, currency: 'INR' },
//   description:
//     'Design and build efficient, reusable, high-performance frontend applications. Translate UI/UX wireframes into quality code, optimize across devices, write tests and documentation, and contribute to frontend architecture.',
//   requirements: [
//     '3–6 years frontend development experience',
//     'Proficient in HTML5, CSS3, JavaScript (ES6+)',
//     'Strong React.js and Redux skills',
//     'Experience with asynchronous programming (Redux Saga/Thunk)',
//     'Familiarity with REST APIs and error handling',
//     'Performance optimization techniques',
//     'Proficient with Webpack/Babel and Git',
//     'Excellent problem‑solving and communication',
//     'Bachelor’s or Master’s in CS/Engineering or related'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://cutshort.io/job/Sr-Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Roadzen-Technologies-mMgrPAuS'
// },


// 35: {
//   id: 35,
//   title: 'Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // 2–4 years
//   salary: { min: null, max: null, currency: 'INR' }, // "Best in industry" — exact numbers not specified
//   description:
//     'Develop enterprise‑grade, standards‑compliant frontend applications. Translate wireframes into code, build reusable JS libraries and prototypes, optimize performance, and collaborate across teams to shape GUI architecture.',
//   requirements: [
//     '2–4 years of professional frontend development experience',
//     'Expert JavaScript, HTML5, and CSS3 skills',
//     'At least 1 year of React.js experience',
//     'Hands-on with JavaScript frameworks (e.g., jQuery)',
//     'Understanding of design patterns, cross-browser/CSS standards',
//     'Experience with REST APIs, DOM, caching, page rendering',
//     'Adept at performance optimization and test-driven development',
//     'Comfortable in Linux environments and Agile/SCRUM workflows',
//     'Strong attention to detail, dedication, and problem-solving'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Kvantum-Inc--f3FurLnE'
// },

// 36: {
//   id: 36,
//   title: 'Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // 1–2 years
//   salary: { min: 600000, max: 800000, currency: 'INR' },
//   description:
//     'Join MikeLegal to scale and modernize frontend systems for its legal-tech product. Build responsive UIs, handle API integration, and work closely with designers and backend stakeholders to deliver high-quality web applications.',
//   requirements: [
//     '1–2 years of Frontend Web development experience',
//     'Expertise in JavaScript, HTML5, CSS3',
//     'Hands-on with frameworks like React.js and AngularJS (1.x)',
//     'Experience with jQuery, Bootstrap, responsive design',
//     'UI/UX awareness and ability to translate designs into code'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-MikeLegal-jg2lqFbp'
// },

// 37: {
//   id: 37,
//   title: 'Sr. Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Faridabad, NCR (Delhi | Gurgaon | Noida), India',
//   type: 'Full-time',
//   experience: 'Senior', // 5–8 years
//   salary: { min: 800000, max: 1200000, currency: 'INR' },
//   description:
//     'Lead frontend development of scalable React/Redux applications, optimize UI performance, ensure technical feasibility of designs, and build efficient, maintainable codebases.',
//   requirements: [
//     '5–8 years of overall frontend development experience',
//     '2+ years of ReactJS and Redux experience (including SSR)',
//     'Proficient in HTML5, CSS3, LESS/SASS',
//     'Deep understanding of asynchronous requests, AJAX, DOM, cross-browser compatibility',
//     'Experience with Git/SVN',
//     'Familiarity with Preact and charting frameworks (Highcharts, D3JS) a plus',
//     'Bachelor’s degree in CS, MCA, or equivalent'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://cutshort.io/job/Frontend-Developer-Faridabad-NCR-Delhi-Gurgaon-Noida-Cerebry-59bK6prl'
// },

// 38: {
//   id: 38,
//   title: 'Frontend Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Noida, Uttar Pradesh, India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // Estimated: 2–5 years
//   salary: { min: 600000, max: 1000000, currency: 'INR' }, // Approx range
//   description:
//     'We are seeking a skilled Frontend Developer to join our team. You will be responsible for building and optimizing responsive web interfaces using modern JavaScript frameworks. Work closely with backend engineers and designers to deliver high-quality user experiences.',
//   requirements: [
//     '2–5 years of experience in frontend development',
//     'Strong proficiency in JavaScript, HTML5, and CSS3',
//     'Hands-on experience with React.js, Angular, or Vue.js',
//     'Experience with RESTful APIs and asynchronous request handling',
//     'Familiarity with Git, Webpack, and responsive design principles',
//     'Good understanding of cross-browser compatibility issues',
//     'Bachelor’s degree in Computer Science or related field'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://www.timesjobs.com/candidate/JobDetailView.html?from=submit&adId=71130659'
// },

// 39: {
//   id: 39,
//   title: 'Full Stack Developer (MERN, LLMs)',
//   categoryId: 1, // Software Engineering
//   location: 'New Delhi, India (Remote)',
//   type: 'Full-time',
//   experience: 'Mid‑Senior', // 2+ years
//   salary: { min: 1500000, max: 5000000, currency: 'INR' }, // ₹15–50 LPA
//   description:
//     'Join M32 Labs (Wing) as a founding Full Stack Developer in a fast-paced R&D environment. Work on AI-powered talent management platforms, building responsive interfaces and backend APIs, integrating with LLMs, and contributing to DevOps and system design.',
//   requirements: [
//     '2+ years of experience in Full Stack or Software Engineering roles',
//     'Proficient in front-end tech: JavaScript/TypeScript + React, Vue, etc.',
//     'Backend experience building APIs with Node.js, Python, or similar',
//     'Hands-on with LLM APIs (e.g. GPT, Anthropic)',
//     'Experience with databases (SQL or NoSQL)',
//     'Familiar with Docker/Kubernetes and CI/CD pipelines',
//     'Skilled with cloud platforms (AWS, GCP, Azure)',
//     'Comfortable with Linux CLI and server setups',
//     'Familiarity with PHP, GraphQL, Terraform is a plus',
//     'Strong communication, problem-solving, and rapid iteration mindset'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://jobs.lever.co/getwingapp/020c14c7-2f64-463f-849d-a8bd63fb1850/apply'
// },

// 40: {
//   id: 40,
//   title: 'Software Engineer – Full Stack Development',
//   categoryId: 1, // Software Engineering
//   location: 'Waltham, MA, USA',
//   type: 'Full-time',
//   experience: 'Mid‑Senior', // 5–10+ years
//   salary: { min: null, max: null, currency: 'USD' }, // Not disclosed
//   description:
//     'Join a fast-paced, highly collaborative engineering team. Prototype, design, develop, deploy, and support scalable full-stack applications. Contribute to technical direction, code standards, and scrum-based development.',
//   requirements: [
//     '5–10+ years of software engineering experience',
//     'Design scalable distributed systems',
//     'Expert in Object-Oriented development and design principles',
//     'Experience designing technical solutions from scratch',
//     'Proficient with Agile processes and scrum practices',
//     'Advanced problem-solving and clear technical communication',
//     'BSCS or MSCS (or equivalent)'
//   ],
//   postedDate: 'June 2025',
//   applyUrl:
//     'https://www.linkedin.com/jobs/view/software-engineer-full-stack-development-1032388-at-hitachi-vantara'
// },

// 41: {
//   id: 41,
//   title: 'Senior Software Engineer I – Java React JS',
//   categoryId: 1, // Software Engineering
//   location: 'New Delhi, Delhi, India',
//   type: 'Full-time',
//   experience: 'Senior', // 5+ years
//   salary: { min: null, max: null, currency: 'INR' }, // Not disclosed
//   description:
//     'Build scalable, secure, high-performance applications supporting Optum’s healthcare platforms. Work full stack using ReactJS for UI and Java Spring Boot microservices, integrate messaging systems, deploy on Kubernetes, and maintain observability.',
//   requirements: [
//     '5+ years of Full Stack development using Java and ReactJS',
//     'Experience building microservices with Spring Boot and Kafka',
//     'Hands-on with Kubernetes, Docker, GitHub Actions for CI/CD',
//     'Proficiency in SQL and NoSQL databases (PostgreSQL, MongoDB)',
//     'Strong grasp of HTML, CSS, JavaScript, and modern ReactJS',
//     'Familiar with monitoring/observability tools like Grafana, Dynatrace, Splunk',
//     'Ability to write unit/integration tests (JUnit, Mockito)',
//     'Bachelor’s or Master’s in CS, Engineering, or related'
//   ],
//   postedDate: 'June 19, 2025',
//   applyUrl:
//     'https://careers.unitedhealthgroup.com/job/22220526/senior-software-engineer-i-java-react-js-new-delhi-in/'
// },

// 42: {
//   id: 42,
//   title: 'Compensation & Benefits Specialist',
//   categoryId: 2, // Human Resources
//   location: 'Jasola, New Delhi, India',
//   type: 'Full-time',
//   experience: 'Senior', // 5+ years
//   salary: { min: null, max: null, currency: 'INR' }, // Not disclosed
//   description:
//     'Design, implement, and manage competitive global compensation and benefits programs. Provide strategic insights, ensure legal compliance, and collaborate with HR and business stakeholders to support talent retention and mobility.',
//   requirements: [
//     'Master’s degree in HR, Business Administration, or related field',
//     '5+ years experience in compensation and/or benefits in a global or multinational setting',
//     'Strong knowledge of international compensation practices and benefits regulations',
//     'Proficiency with HRIS systems and data analytics tools (e.g., Excel, Workday, SAP SuccessFactors)',
//     'Excellent analytical, communication, and project‑management skills',
//     'Certification such as CCP or CEBS is a plus',
//     'Preferred: experience across multiple regions (India, Americas, Europe)'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://osv-chegg.wd5.myworkdayjobs.com/Chegg/job/Jasola-New-Delhi/Compensation---Benefits-Specialist_R4926-1'
// },

// 43: {
//   id: 43,
//   title: 'US Travel Sales (Voice Process)',
//   categoryId: 3, // Sales / Call Center
//   location: 'Gurugram, Haryana, India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // 2–6 years
//   salary: { min: null, max: 600000, currency: 'INR' }, // Up to ₹6 LPA (~₹42k/month)
//   description:
//     'Urgent hiring for US Travel Sales agents handling PPC-based voice sales leads. Engage with US market clients, convert leads into bookings, and upsell travel products while maintaining customer satisfaction.',
//   requirements: [
//     'Minimum 2 years experience in US travel sales (PPC inbound/outbound calls)',
//     'Excellent spoken English and persuasion skills',
//     'Goal-oriented with proven sales conversion track record'
//   ],
//   postedDate: 'June–July 2025',
//   applyUrl:
//     'https://www.shine.com/jobs/us-travel-sales/sharda-consultancy-services/16965216'
// },

// 44: {
//   id: 44,
//   title: 'Senior Software Engineer',
//   categoryId: 1, // Software Engineering
//   location: 'Princeton, New Jersey, USA',
//   type: 'Full-time',
//   experience: 'Mid‑Senior', // 2+ years post-Master’s
//   salary: { min: 106000, max: 135300, currency: 'USD' }, // Fully disclosed salary range
//   description:
//     'Design, develop, and operate scalable cloud-native solutions on AWS. Build full-stack software using Java, Python, JavaScript. Own CI/CD pipelines, monitor systems, and collaborate in an Agile environment to support ETS’s education and assessment platforms.',
//   requirements: [
//     'Master’s degree in Computer Science, Engineering, or related, plus 2+ years post-baccalaureate full-stack development experience',
//     'Hands-on experience with AWS (CDK, CloudFormation, serverless architectures)',
//     'Proficient in Java, Python (NumPy, Pandas), JavaScript, Spring/Hibernate',
//     'Experience with RESTful web services, UNIX shell scripting, XML/JSON/YAML',
//     'Unit testing expertise (JUnit) and Infrastructure as Code',
//     'Knowledge of monitoring, incident troubleshooting, and agile practices'
//   ],
//   postedDate: 'July 2025', // approx. based on "2 weeks ago" around late July
//   applyUrl:
//     'https://www.linkedin.com/jobs/view/software-developer-senior-at-ets-4246118460'
// },

// 45: {
//   id: 45,
//   title: 'Territory Business Manager – Quantus',
//   categoryId: 3, // Sales / Field Role
//   location: 'Mumbai (Vasai to Virar), Maharashtra, India',
//   type: 'Full-time',
//   experience: 'Associate/Specialist', // Entry-level to mid-level
//   salary: { min: null, max: null, currency: 'INR' }, // Not disclosed
//   description:
//     'Drive business development in the Quantus territory. Conduct market research and feasibility studies, analyze sales and competitive data, and prepare materials for client and partner engagement to support strategic decision-making.',
//   requirements: [
//     'Associate degree or equivalent',
//     'Market research and analytical skills',
//     'Ability to compile and analyze financial, sales, and competitive data',
//     'Strong presentation and documentation capabilities',
//     'Willingness to travel within territory and stand for extended periods',
//     'Excellent communication and interpersonal skills'
//   ],
//   postedDate: 'April–June 2025', // based on timeline from multiple sources
//   applyUrl:
//     'https://www.jobs.abbott/us/en/job/31120912/Territory-Business-Manager---Quantus---Mumbai--Vasai-to-Virar-_31120912-4'
// },

// 46: {
//   id: 46,
//   title: 'Software Engineer – Full Stack Developer',
//   categoryId: 1, // Software Engineering
//   location: 'Hyderabad, Telangana, India',
//   type: 'Full-time',
//   experience: 'Mid‑Level', // 3–5 years
//   salary: { min: 800000, max: 1400000, currency: 'INR' }, // Approximate range
//   description:
//     'We are hiring a Full Stack Software Engineer to join our product development team. You will be responsible for developing modern web applications, collaborating with cross-functional teams, and delivering scalable and maintainable code.',
//   requirements: [
//     '3+ years of experience with JavaScript frameworks like React.js or Angular',
//     'Hands-on experience in backend technologies like Node.js, Java, or Python',
//     'Proficiency in REST APIs and database systems (MySQL, MongoDB)',
//     'Strong understanding of HTML5, CSS3, and responsive design principles',
//     'Familiar with CI/CD pipelines, version control (Git), and Agile methodologies',
//     'Bachelor’s degree in Computer Science or related discipline'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=1967b8dd-0f7b-4982-9500-7ead01d3a132&jobId=974397'
// },

// 47: {
//   id: 47,
//   title: 'Frontend Web Developer (MERN)',
//   categoryId: 1, // Software Engineering
//   location: 'New Delhi, India (Remote)',
//   type: 'Full-time',
//   experience: 'Mid‑Senior', // 2+ years
//   salary: { min: 1200000, max: 2500000, currency: 'INR' }, // ₹12–25 LPA
//   description:
//     'Join M32 Labs at Wing as a Frontend Web Developer contributing to AI-powered talent management platforms. Build responsive, performant, and accessible interfaces, rapidly prototype features in short cycles, and work closely with AI engineers, product managers, and UX designers in a high-impact, low-bureaucracy environment.',
//   requirements: [
//     'Bachelor’s or Master’s in CS, Software Engineering, or equivalent experience',
//     '2+ years of professional frontend development with MERN stack (React, Node.js)',
//     'Proficiency in JavaScript/TypeScript, React/Vue, Tailwind/CSS',
//     'Experience building from 0→1 in agile/hackathon-style settings',
//     'Familiarity with backend integration (Node.js, REST/GraphQL APIs)',
//     'Knowledge of Git workflows, rapid iteration, and remote collaboration',
//     'Excellent communication, problem-solving, and product-minded engineering skills'
//   ],
//   postedDate: 'July 2025',
//   applyUrl:
//     'https://jobs.lever.co/getwingapp/0af28d14-097e-4612-a225-94bb519c700d/apply'
// },

// 48: {
//   id: 48,
//   title: 'Senior Full Stack Developer',
//   categoryId: 1, // Software Engineering
//   location: 'North Delhi, Delhi, India',
//   type: 'Full-time',
//   experience: 'Senior', // 5–10 years
//   salary: { min: 1200000, max: 3000000, currency: 'INR' }, // ₹12–30 LPA
//   description:
//     'Join TeknoBloom as part of a cross-functional team to design and develop scalable front-end and back-end solutions, APIs, responsive UIs, and manage database systems. Ensure software performance, security, and code quality through end-to-end testing and collaboration.',
//   requirements: [
//     '5+ years experience (or 3+ with Master’s) in full-stack development',
//     'Strong proficiency in C#, .NET Framework, ASP.NET MVC, Web API',
//     'Hands-on experience with front-end frameworks like Angular or React, plus HTML, CSS, JavaScript',
//     'Database experience with SQL Server, MongoDB, or Cosmos DB',
//     'Experience with DevOps practices, Git, and CI/CD pipelines',
//     'Skilled in writing resilient APIs, responsive UI, and technical documentation',
//     'Excellent problem-solving, communication, and teamwork skills',
//     'Bachelor’s or Master’s in Computer Science or related field'
//   ],
//   postedDate: 'April–June 2025', // ~87 days ago (April 2025)
//   applyUrl:
//     'https://www.sourcingxpress.com/jobs/e2b57ca2-5afb-4c3c-88b5-8f8eb599dd30?utm_source=linkedin&utm_medium=job_board&utm_campaign=careers_2025'
// },

// 49: {
//   id: 49,
//   title: 'Senior Software Engineer – Azure Storage DPU',
//   categoryId: 1, // Software Engineering
//   location: 'Multiple Locations, India',
//   type: 'Full-time',
//   experience: 'Senior', // 8+ years
//   salary: { min: 119800, max: 258000, currency: 'USD' }, // U.S. base range (global role) 
//   description:
//     'Design and develop next-generation cloud storage backend infrastructure leveraging Fungible DPUs. Work across the full software lifecycle—design, implementation, testing, deployment, and support—to drive innovation in Azure’s massively scalable storage solutions.',
//   requirements: [
//     'Bachelor’s or Master’s in CS or related technical field',
//     '8+ years of experience in systems programming (C, C++, C#, Java, JavaScript, or Python)',
//     'Experience with low-level systems development (e.g., networking, drivers)',
//     'Strong skills in distributed systems, hardware/software integration, and scalability',
//     'Ability to serve as a Designated Responsible Individual (DRI) and lead on-call responsibilities',
//     'Familiarity with cloud infrastructure and performance/efficiency tooling'
//   ],
//   postedDate: 'June 2025',
//   applyUrl:
//     'https://jobs.careers.microsoft.com/us/en/job/1826981/Senior-Software-Engineer'
// },

// 50: {
//   id: 50,
//   title: 'Senior Software Engineer – Full Stack Technologies',
//   categoryId: 1, // Software Engineering
//   location: 'Gurgaon, Haryana, India (3 PM–12 AM IST)',
//   type: 'Full-time',
//   experience: 'Senior', // 5+ years
//   salary: { min: null, max: null, currency: 'INR' }, // Not disclosed
//   description:
//     'Join Avive’s R&D team to design, develop, deploy, and maintain end-to-end web and mobile-facing systems on the public cloud. Build reusable frontend and backend components, optimize UI performance, bridge wireframes with backend services, and deliver robust technical documentation.',
//   requirements: [
//     '5+ years delivering consumer‑facing web apps',
//     '2+ years deep expertise with Angular or React, HTML, CSS, JavaScript (ES6+)',
//     '3+ years using Git',
//     'Experience with RESTful APIs (Postman, Swagger) and CI/CD tooling (Selenium, CodeBuild, GitHub Actions)',
//     'Proficient with Docker and public cloud environments',
//     'BS in CS or Engineering (or equivalent experience)',
//     'Optional skills: Python/Django, MySQL, MongoDB/NoSQL, React Native, Agile/Scrum'
//   ],
//   postedDate: 'June 9, 2025',
//   applyUrl:
//     'https://www.hirist.tech/j/trans-org-analytics-senior-software-engineer-full-stack-technologies-1492858'
// }
// };

// // Companies - mapping to job IDs
// const COMPANIES = {
//   amazon: {
//     id: 'amazon',
//     name: 'Amazon',
//     logo: 'https://logo.clearbit.com/amazon.com',
//     jobs: [1, 2, 3, 4, 5, 8, 9,31], // Updated job IDs
//   },
//   sourcingxpress: {
//     id: 'sourcingxpress',
//     name: 'SourcingXpress',
//     logo: 'https://logo.clearbit.com/sourcingxpress.com',
//     jobs: [6],
//   },
//   bairesdev: {
//     id: 'bairesdev',
//     name: 'BairesDev',
//     logo: 'https://logo.clearbit.com/bairesdev.com',
//     jobs: [7],
//   },
//   generic: {
//     id: 'generic',
//     name: 'Various Companies',
//     logo: 'https://logo.clearbit.com/example.com',
//     jobs: [10],
//   },
//   internationalsos: {
//     id: 'internationalsos',
//     name: 'International SOS',
//     logo: 'https://logo.clearbit.com/internationalsos.com',
//     jobs: [15],
//   },
//   ntt: {
//     id: 'ntt',
//     name: 'NTT',
//     logo: 'https://logo.clearbit.com/ntt.com',
//     jobs: [16, 25],
//   },
//   idinsight: {
//     id: 'idinsight',
//     name: 'IDinsight',
//     logo: 'https://logo.clearbit.com/idinsight.org',
//     jobs: [17],
//   },
//   qualcomm: {
//     id: 'qualcomm',
//     name: 'Qualcomm',
//     logo: 'https://logo.clearbit.com/qualcomm.com',
//     jobs: [18],
//   },
//   fedex: {
//     id: 'fedex',
//     name: 'FedEx',
//     logo: 'https://logo.clearbit.com/fedex.com',
//     jobs: [20, 23],
//   },
//   icf: {
//     id: 'icf',
//     name: 'ICF',
//     logo: 'https://logo.clearbit.com/icf.com',
//     jobs: [21],
//   },
//   bain: {
//     id: 'bain',
//     name: 'Bain & Company',
//     logo: 'https://logo.clearbit.com/bain.com',
//     jobs: [22],
//   },
//   icf: {
//   id: 'icf',
//   name: 'ICF',
//   logo: 'https://logo.clearbit.com/icf.com',
//   jobs: [30]
// },


// techjockey: {
//   id: 'techjockey',
//   name: 'Techjockey',
//   logo: 'https://logo.clearbit.com/techjockey.com',
//   jobs: [32]
// },

// clickpost: {
//   id: 'clickpost',
//   name: 'Clickpost',
//   logo: 'https://logo.clearbit.com/clickpost.in',
//   jobs: [33]
// },

// roadzen: {
//   id: 'roadzen',
//   name: 'Roadzen Technologies',
//   logo: 'https://logo.clearbit.com/roadzen.io',
//   jobs: [34]
// },

// kvantum: {
//   id: 'kvantum',
//   name: 'Kvantum Inc.',
//   logo: 'https://logo.clearbit.com/kvantuminc.com',
//   jobs: [35]
// },

// mikelegal: {
//   id: 'mikelegal',
//   name: 'MikeLegal',
//   logo: 'https://logo.clearbit.com/mikelegal.com',
//   jobs: [36]
// },

// cerebry: {
//   id: 'cerebry',
//   name: 'Cerebry',
//   logo: 'https://logo.clearbit.com/cerebry.co',
//   jobs: [37]
// },

// unitedhealthgroup: {
//   id: 'unitedhealthgroup',
//   name: 'UnitedHealth Group',
//   logo: 'https://logo.clearbit.com/unitedhealthgroup.com',
//   jobs: [38]
// },

// chegg: {
//   id: 'chegg',
//   name: 'Chegg',
//   logo: 'https://logo.clearbit.com/chegg.com',
//   jobs: [39]
// },

// sharda: {
//   id: 'sharda',
//   name: 'Sharda Consultancy Services',
//   logo: 'https://logo.clearbit.com/shine.com',
//   jobs: [40]
// },

// ets: {
//   id: 'ets',
//   name: 'ETS',
//   logo: 'https://logo.clearbit.com/ets.org',
//   jobs: [44]
// },

// abbott: {
//   id: 'abbott',
//   name: 'Abbott',
//   logo: 'https://logo.clearbit.com/abbott.com',
//   jobs: [45]
// },

// adp: {
//   id: 'adp',
//   name: 'ADP',
//   logo: 'https://logo.clearbit.com/adp.com',
//   jobs: [46]
// },

// wing: {
//   id: 'wing',
//   name: 'Wing (M32 Labs)',
//   logo: 'https://logo.clearbit.com/getwingapp.com',
//   jobs: [47]
// },

// teknobloom: {
//   id: 'teknobloom',
//   name: 'TeknoBloom',
//   logo: 'https://logo.clearbit.com/sourcingxpress.com',
//   jobs: [48]
// },

// microsoft: {
//   id: 'microsoft',
//   name: 'Microsoft',
//   logo: 'https://logo.clearbit.com/microsoft.com',
//   jobs: [49]
// },

// transorg: {
//   id: 'transorg',
//   name: 'TransOrg Analytics',
//   logo: 'https://logo.clearbit.com/transorg.com',
//   jobs: [50]
// },
//   restroworks: {
//     id: 'restroworks',
//     name: 'RestroWorks',
//     logo: 'https://logo.clearbit.com/restroworks.com',
//     jobs: [24,25,26,27,28,29,30],
//   }
// };
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
  11: { id: 11, name: 'Human Resources', slug: 'human-resources' },
  12: { id: 12, name: 'Sales & Business Development', slug: 'sales-business' },
  13: { id: 13, name: 'Medical & Healthcare', slug: 'medical-healthcare' },
  14: { id: 14, name: 'Operations & Management', slug: 'operations-management' },
  15: { id: 15, name: 'Consulting', slug: 'consulting' }
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
  2: {
    id: 2,
    title: 'ASIC Design Engineer, Cloud‑Scale Machine Learning Acceleration team',
    categoryId: 8, // Infrastructure
    location: 'Cupertino, CA, USA / Austin, TX, USA',
    type: 'Full-time',
    experience: 'Mid-level',
    salary: { min: 129800, max: 212800, currency: 'USD' },
    description: 'Develop and implement high‑performance, power‑ and area‑efficient RTL designs for AWS custom SoCs like Inferentia.',
    requirements: [
      "Bachelor's degree or equivalent",
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
    categoryId: 1, // Software Engineering
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
  8: {
    id: 8,
    title: 'Sr Technical Program Manager, Production Change Management, Project Kuiper',
    categoryId: 14, // Operations & Management (more appropriate than Software Engineering)
    location: 'Redmond, WA, USA',
    type: 'Full‑time',
    experience: 'Senior-level',
    salary: { min: 133900, max: 231400, currency: 'USD' },
    description: "Support Kuiper Production's Engineering Change Control process: lead process and tool improvements (automation, validation, PLM) to integrate engineering changes into production.",
    requirements: [
      "Bachelor's degree in engineering, computer science or equivalent",
      '6+ years technical product or program management experience',
      '3+ years aerospace/industrial/manufacturing operations experience',
      'Experience leading continuous improvement and cross-functional programs',
      'Excellent analytical and interpersonal skills'
    ],
    postedDate: "April 30, 2025",
    applyUrl: 'https://www.amazon.jobs/en/jobs/2970236/sr-technical-program-manager-production-change-management-project-kuiper',
  },
  9: {
    id: 9,
    title: 'Software Development Manager, RDS Proxy, RDS Proxy Controlplane',
    categoryId: 14, // Operations & Management (management role)
    location: 'Bellevue, WA, USA',
    type: 'Full-time',
    experience: 'Senior-level',
    salary: { min: 166400, max: 287700, currency: 'USD' },
    description: 'Lead the engineering team responsible for building and operating the RDS Proxy control plane: the APIs, workflows, and tools that provision and manage proxy instances.',
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
  15: {
    id: 15,
    title: 'Regional Medical Director',
    categoryId: 13, // Medical & Healthcare (fixed from Security)
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: 'Senior (10+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Lead the delivery of medical assistance services across the region. Ensure clinical governance, quality control, and client satisfaction while mentoring the medical team and driving operational excellence.',
    requirements: [
      'Medical degree (MBBS/MD or equivalent)',
      '10+ years of clinical experience with managerial responsibilities',
      'Experience in remote or emergency medical care preferred',
      'Strong leadership and team management skills',
      'Excellent communication and client-facing abilities',
      'Ability to work under pressure and manage crisis situations',
      'Willingness to travel across the region as required'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://opportunities.internationalsos.com/careers/job/563980759701678'
  },
  16: {
    id: 16,
    title: 'Technical Specialist – MS Systems',
    categoryId: 8, // Infrastructure
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: 'Mid–Senior (5+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: "Provide specialized Microsoft systems support within NTT's global services framework. Manage system deployments, troubleshoot complex issues, and ensure stable, secure environments for enterprise clients.",
    requirements: [
      '5+ years hands-on experience with Microsoft server technologies (Windows Server, Active Directory, Exchange, SQL Server)',
      'Expertise in system deployment, configuration, and management',
      'Strong troubleshooting skills for complex technical issues',
      'Experience in enterprise IT environments and client-facing support',
      'Familiarity with ITIL processes and change management',
      'Excellent communication and documentation skills'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply'
  },
  17: {
    id: 17,
    title: '(Senior) Specialist, India Operations',
    categoryId: 14, // Operations & Management (fixed from Software Engineering)
    location: 'Delhi, India',
    type: 'Full-time',
    experience: 'Mid–Senior (2–4 years)',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Manage end-to-end India operations including people, office, logistics, and culture. Optimize systems (recruitment, onboarding/offboarding, compliance), provide executive support, and ensure smooth regional functioning.',
    requirements: [
      "Bachelor's degree in Business Administration, HR, or related discipline",
      "2–4 years experience in operations, HR, logistics, or organisational building",
      'Experience with full-lifecycle hiring and ATS (iCIMS preferred)',
      '"Get-things-done" attitude with operational excellence',
      'Strong communication and stakeholder-management skills',
      'High attention to detail and ability to drive cross-functional initiatives',
      'Fluency in English and Hindi',
      'Passion for global development and working with diverse teams',
      'Ability to thrive in dynamic environments and handle ambiguity'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://internationalcareers-idinsight.icims.com/jobs/1340/(senior)-specialist,‑india‑operations‑(2025‑india)/job'
  },
  18: {
    id: 18,
    title: 'Manager, Business Operations',
    categoryId: 14, // Operations & Management (fixed from Software Engineering)
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: 'Senior (8+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Lead business operations initiatives across engineering and operations teams at Qualcomm India. Drive process improvements, manage stakeholder relationships, and support strategic planning.',
    requirements: [
      '8+ years in business operations, program or project management',
      'Experience in global tech/semiconductor environments',
      'Strong analytical and problem-solving skills',
      'Excellent communication and stakeholder engagement abilities',
      'Proficiency in project planning and operational tools',
      'MBA or equivalent preferred'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.qualcomm.com/careers/job/446706361287'
  },
  20: {
    id: 20,
    title: 'Technical Security Specialist – Senior',
    categoryId: 3,
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: 'Senior (5+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Acts as a technical expert in security technology, standards, policy compliance, and analytics. Supports and leads projects involving complex security systems for FedEx AMEA.',
    requirements: [
      'Technical expert in Security Technology, security standards policy & compliance, and security analytics',
      'High accuracy, attention to detail, analytical and problem-solving skills',
      'Strong judgement, decision-making, and verbal/written communication',
      'Supports management in analysis, interpretation, and application of complex information',
      'Ability to support or lead complex security projects'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.fedex.com/m46h0-technical-security-specialist-senior/job/9EE4B8FE8747BD856EF0101371A7B5B8'
  },
  21: {
    id: 21,
    title: 'Senior Consultant – Power Markets',
    categoryId: 15, // Consulting (fixed from Software Engineering)
    location: 'Remote (USA)',
    type: 'Full-time',
    experience: 'Senior (5+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: "Provide consulting expertise in modeling, analysis, and advisory services for U.S. electric power markets. Work on market design, policy impacts, decarbonization, and grid economics with ICF's Energy Advisory team.",
    requirements: [
      "Master's or advanced degree in Energy, Economics, Engineering, or related field",
      "5+ years of experience in power markets, energy consulting, or related sectors",
      'Hands-on experience with power market modeling tools (PROMOD, PLEXOS, Aurora, or similar)',
      'Strong quantitative, analytical, and problem-solving skills',
      'Exceptional written and verbal communication skills',
      'In-depth understanding of electricity market operations (RTO/ISO/PJM/CAISO etc.)',
      'Ability to manage client relationships and deliver actionable insights'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
  },
  22: {
    id: 22,
    title: 'Sr. Specialist, Global Strategy & Ops (GSO)',
    categoryId: 2, // Data Science (analytics role)
    location: 'Gurugram (New Delhi region), India',
    type: 'Full-time',
    experience: 'Mid–Senior (4–8 years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: "Lead competitive intelligence and analytics support for Bain's Global Strategy & Operations team at the Gurugram GBS office. Drive research, benchmarking, dashboard optimization, and deliver zero-defect insights for senior leadership.",
    requirements: [
      '4–6 years experience (postgraduate) or 6–8 years (graduate) in consulting, research, or business intelligence',
      'Strong data analysis, interpretation, and research skills',
      'Proficiency in Excel, PowerPoint, Tableau, Alteryx, and automation (Python preferred)',
      'Competency in competitive intelligence and market benchmarking',
      'Experience leading, coaching, and mentoring junior team members',
      'Excellent communication with technical and non-technical senior stakeholders',
      'Ability to manage multiple priorities, tight deadlines, and deliver flawless output',
      'First-class degree from a reputed institution'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://www.bain.com/careers/find-a-role/position/?jobid=95830'
  },
  23: {
    id: 23,
    title: 'CE Planning & Engineering Specialist – Associate',
    categoryId: 8, // Infrastructure
    location: 'New Delhi, Delhi, India',
    type: 'Full-time',
    experience: 'Mid (3–5 years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Manage regional daily uplift escalation requests, automate processes, support quality assurance, design training frameworks, drive performance excellence, and support tech-transformations within FedEx AMEA operations.',
    requirements: [
      'Strong analytical, planning, and problem-solving skills',
      'Experience in quality assurance, process excellence, and performance improvement',
      'Proficiency in audit controls, governance management, and risk mitigation',
      'Excellent stakeholder engagement, reporting, and presentation skills',
      'Ability to support or lead complex projects and UAT',
      'Familiarity with IT tools, data governance, and performance trend analysis',
      'Ability to work under pressure and manage crisis/contingency support'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.fedex.com/ce-planning-engineering-specialist-associate/job/CF6B441F0A8604B8B45E1EF5239F1499'
  },
  24: {
    id: 24,
    title: 'Enterprise Sales Specialist – US Market',
    categoryId: 12, // Sales & Business Development (fixed from Software Engineering)
    location: 'Delhi, India',
    type: 'Full-time',
    experience: 'Mid–Senior (2–5 years)',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Drive revenue growth by addressing unique needs of customers and partners in the US/North America region. Develop and execute business and marketing plans, manage leads through the sales pipeline, and ensure high partner satisfaction.',
    requirements: [
      'Respond to customer and partner inquiries with tailored information and solutions',
      'Engage and collaborate with business partners',
      'Follow up on leads and update internal systems',
      'Manage full sales cycle: qualify, present, demo, RFPs, negotiate, close',
      'Develop deep understanding of territory: customers, partners, competitors',
      'Support US market; generate leads in North America',
      'Work night shifts aligned with US business hours',
      'Maintain professional attitude and company values',
      'Coordinate sales support with technical staff',
      'Leverage relationships to identify new strategic opportunities',
      'Hybrid working in Delhi office or remote elsewhere',
      'Manage a growing team of senior ICs',
      'Penetrate ABM accounts strategically',
      'Research new accounts and contacts',
      'Use HubSpot & LinkedIn for activity tracking'
    ],
    postedDate: 'May 9, 2025',
    applyUrl: 'https://careers.restroworks.com/jobs/Careers/720131000006200092/Enterprise-sales-specialist--US-market'
  },
  25: {
    id: 25,
    title: 'Technical Specialist – MS Systems',
    categoryId: 8, // Infrastructure
    location: 'New Delhi, India',
    type: 'Full-time',
    experience: 'Mid–Senior (5+ years)',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Ensure assigned infrastructure at client sites is configured, tested, and operational. Manage third-line support, proactive incident resolution, monitoring, and automation. Coach junior teams and support cross-technology domains including Cloud, Security, Networking, Applications, and Collaboration.',
    requirements: [
      '5+ years experience with Windows Server, Active Directory, Exchange, SQL Server',
      'Expertise in system deployment, configuration, and management in enterprise IT environments',
      'Strong troubleshooting skills for complex technical issues',
      'Experience in monitoring and responding to alerts using monitoring tools',
      'Knowledge of ITIL processes and change management',
      'Ability to coach L2 teams, perform root-cause analysis, and manage third-party vendor escalations',
      'Strong communication, documentation, and stakeholder management abilities'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.services.global.ntt/global/en/job/R-113682/apply?source=LinkedIn'
  },
  26: {
    id: 26,
    title: 'Senior Frontend Developer',
    categoryId: 5, // Frontend Development
    location: 'Delhi, India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Build fast, intuitive, mobile-responsive web interfaces; integrate with CRM and APIs; ensure performance, cross-browser compatibility, and documentation.',
    requirements: [
      "Associate degree required (Bachelor's preferred)",
      "3+ years of frontend development experience in startups or similar",
      '1+ year with frameworks like Angular 2+, React.js, or React Native',
      'Strong JavaScript, CSS/SASS, HTML skills',
      'Familiarity with W3C web standards and accessibility (e.g., s508)',
      'Experience with unit testing tools like Karma, Jasmine, Mocha, or Chai',
      'Ability to translate UI/UX designs and troubleshoot production issues',
      'Excellent problem-solving and collaboration skills'
    ],
    postedDate: 'June 29, 2025',
    applyUrl: 'https://www.hirist.tech/j/senior-frontend-developer-1504263'
  },
  27: {
    id: 27,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development
    location: 'Delhi NCR (Delhi / Gurgaon / Noida)',
    type: 'Full-time',
    experience: 'Mid-Senior',
    salary: { min: 600000, max: 1200000, currency: 'INR' },
    description: 'Techjockey is looking for a Frontend Developer who is passionate about creating pixel-perfect, performance-optimized web applications. You will work closely with UI/UX designers and backend engineers to deliver outstanding experiences.',
    requirements: [
      '2–5 years of experience in frontend development',
      'Strong proficiency in HTML, CSS, JavaScript',
      'Expertise in React.js and modern JavaScript frameworks',
      'Experience with RESTful APIs and cross-browser compatibility',
      'Good understanding of responsive design and browser rendering behavior',
      'Strong debugging and problem-solving skills',
      'Experience with version control tools like Git'
    ],
    postedDate: 'July 15, 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-Delhi-NCR-Delhi-Gurgaon-Noida-Techjockey-com-qokceGof'
  },
  28: {
    id: 28,
    title: 'Sr. Frontend Developer',
    categoryId: 5, // Frontend Development
    location: 'NCR (Delhi / Gurgaon / Noida)',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 1500000, max: 2500000, currency: 'INR' },
    description: "You'll be responsible for developing new user-facing features using ReactJS, building reusable components, translating UI/UX wireframes into code, optimizing performance across browsers/devices, writing tests and documentation, and understanding asynchronous programming patterns.",
    requirements: [
      'Proficient in HTML, CSS, JavaScript (ES6+)',
      'Strong command of ReactJS / Redux',
      'Performance optimization techniques knowledge',
      'Familiar with Redux Saga or Thunk for async behavior',
      'Experience with RESTful APIs and error handling',
      'Fundamental understanding of good user experience',
      'Familiarity with Git',
      'Good problem-solving skills'
    ],
    postedDate: 'July, 2025',
    applyUrl: 'https://cutshort.io/job/Sr-Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Roadzen-Technologies-mMgrPAuS'
  },
  29: {
    id: 29,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development
    location: 'Remote or NCR (Delhi | Gurgaon | Noida)',
    type: 'Full-time',
    experience: 'Mid (2–3 years)',
    salary: { min: 600000, max: 800000, currency: 'INR' },
    description: 'Build high-quality, high-performance, mobile-optimized web applications; translate wireframes into reusable code; ensure brand consistency; identify performance bottlenecks; maintain code quality via reviews and automation.',
    requirements: [
      '2+ years of experience in OO JavaScript and front‑end frameworks',
      'Strong expertise in HTML5, CSS3, JavaScript',
      'Familiarity with SASS, Bootstrap, CSS Grid',
      'Proficient in React, AngularJS, jQuery',
      'Experienced in asynchronous handling, partial page updates, Ajax',
      'Good understanding of cross-browser compatibility issues',
      'Experience with bundlers like webpack or gulp',
      'Familiarity with graphic design tools (Figma, Sketch, Adobe XD, PSD to HTML)',
      'Proficiency in version control (Git, Mercurial, or SVN)'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Clickpost-lkwNBO9l'
  },
  30: {
    id: 30,
    title: 'Senior Consultant – Power Markets',
    categoryId: 15, // Consulting
    location: 'Remote (USA)',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: null, max: null, currency: 'USD' },
    description: "Work with ICF's Energy Advisory team to model and analyze U.S. power markets. Contribute to client solutions in the areas of decarbonization, market design, policy impact, and grid economics.",
    requirements: [
      "Master's degree in Energy, Economics, Engineering, or related field",
      '5+ years experience in power markets or energy consulting',
      'Expertise in modeling tools (e.g., PROMOD, PLEXOS, Aurora)',
      'Strong quantitative and analytical skills',
      'Excellent communication and presentation abilities',
      'Familiarity with RTO/ISO market operations'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://careers.icf.com/us/en/job/IIIIIIUSR2501063EXTERNALENUS/Senior-Consultant-Power-Markets'
  },
  31: {
    id: 31,
    title: 'Senior Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Delhi, India',
    type: 'Full-time',
    experience: 'Mid-Senior',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Develop fast, responsive, and intuitive web interfaces. Implement mobile‑responsive web pages and web forms with CRM integration. Work on API integrations for dynamic communications, and translate UI/UX mockups into high‑quality frontend code. Ensure cross‑browser/platform compatibility, performance, and maintainability.',
    requirements: [
      "Associate degree in technology-related field (bachelor's preferred)",
      "3+ years of frontend development experience in a startup or similar environment",
      'Hands-on with Angular 2+, React.js or React Native',
      'Strong JS proficiency and production-grade HTML/CSS/SASS skills',
      'Familiarity with web standards and accessibility (W3C, s508)',
      'Good understanding of web app architecture and cross-browser/platform constraints',
      'Experience with unit test frameworks (Karma, Jasmine, Mocha, Chai)',
      'Excellent problem-solving, communication, and collaboration skills',
      'Ability to multitask and work to deadlines in fast-paced environments'
    ],
    postedDate: 'June 29, 2025',
    applyUrl: 'https://www.hirist.tech/j/senior-frontend-developer-1504263'
  },
  32: {
    id: 32,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Delhi NCR, India',
    type: 'Full-time',
    experience: 'Mid‑Senior',
    salary: { min: 500000, max: 900000, currency: 'INR' },
    description: 'Join Techjockey.com to develop front-end applications at scale. Work closely with designers and back-end developers to optimize UI performance, implement responsive, SEO/accessibility-conscious web interfaces, and maintain high code quality standards.',
    requirements: [
      '4–6 years of Front‑end development experience at scale',
      'Strong skills in JavaScript, CSS, Angular, AJAX, jQuery, React, Node.js',
      'Experience with CSS preprocessors (SASS/LESS), Bootstrap',
      'In-depth understanding of web development process, cross‑browser/device compatibility, SEO',
      'Familiar with WordPress theme integration and template customization',
      'Ability to write W3C‑validated, SEO‑friendly code'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-Delhi-NCR-Delhi-Gurgaon-Noida-Techjockey-com-qokceGof'
  },
  33: {
    id: 33,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: 600000, max: 800000, currency: 'INR' },
    description: 'Build reusable, high‑performance frontend components and responsive web apps using modern JS frameworks. Optimize for mobile, maintain brand consistency, and collaborate through code reviews and automation.',
    requirements: [
      '2+ years experience in OO JavaScript and frontend frameworks',
      'Expertise in HTML5, CSS3, JavaScript',
      'Familiar with SASS/Bootstrap, CSS Grid',
      'Proficient with React, AngularJS, jQuery',
      'Good understanding of async requests, AJAX, partial page updates',
      'Experience with webpack, gulp (module bundlers)',
      'Skilled in graphic UI tools (Figma, Sketch, Adobe XD, PSD to HTML)',
      'Experience with version control (Git, Mercurial, SVN)',
      'Nice to have: knowledge of Node.js, Python, isomorphic React'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Clickpost-lkwNBO9l'
  },
  34: {
    id: 34,
    title: 'Sr. Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Delhi NCR (Delhi | Gurgaon | Noida), India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 1500000, max: 2500000, currency: 'INR' },
    description: 'Design and build efficient, reusable, high-performance frontend applications. Translate UI/UX wireframes into quality code, optimize across devices, write tests and documentation, and contribute to frontend architecture.',
    requirements: [
      '3–6 years frontend development experience',
      'Proficient in HTML5, CSS3, JavaScript (ES6+)',
      'Strong React.js and Redux skills',
      'Experience with asynchronous programming (Redux Saga/Thunk)',
      'Familiarity with REST APIs and error handling',
      'Performance optimization techniques',
      'Proficient with Webpack/Babel and Git',
      'Excellent problem‑solving and communication',
      "Bachelor's or Master's in CS/Engineering or related"
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Sr-Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Roadzen-Technologies-mMgrPAuS'
  },
  35: {
    id: 35,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Develop enterprise‑grade, standards‑compliant frontend applications. Translate wireframes into code, build reusable JS libraries and prototypes, optimize performance, and collaborate across teams to shape GUI architecture.',
    requirements: [
      '2–4 years of professional frontend development experience',
      'Expert JavaScript, HTML5, and CSS3 skills',
      'At least 1 year of React.js experience',
      'Hands-on with JavaScript frameworks (e.g., jQuery)',
      'Understanding of design patterns, cross-browser/CSS standards',
      'Experience with REST APIs, DOM, caching, page rendering',
      'Adept at performance optimization and test-driven development',
      'Comfortable in Linux environments and Agile/SCRUM workflows',
      'Strong attention to detail, dedication, and problem-solving'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-Kvantum-Inc--f3FurLnE'
  },
  36: {
    id: 36,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Remote, Delhi NCR (Delhi | Gurgaon | Noida), India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: 600000, max: 800000, currency: 'INR' },
    description: 'Join MikeLegal to scale and modernize frontend systems for its legal-tech product. Build responsive UIs, handle API integration, and work closely with designers and backend stakeholders to deliver high-quality web applications.',
    requirements: [
      '1–2 years of Frontend Web development experience',
      'Expertise in JavaScript, HTML5, CSS3',
      'Hands-on with frameworks like React.js and AngularJS (1.x)',
      'Experience with jQuery, Bootstrap, responsive design',
      'UI/UX awareness and ability to translate designs into code'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-NCR-Delhi-Gurgaon-Noida-MikeLegal-jg2lqFbp'
  },
  37: {
    id: 37,
    title: 'Sr. Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Faridabad, NCR (Delhi | Gurgaon | Noida), India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 800000, max: 1200000, currency: 'INR' },
    description: 'Lead frontend development of scalable React/Redux applications, optimize UI performance, ensure technical feasibility of designs, and build efficient, maintainable codebases.',
    requirements: [
      '5–8 years of overall frontend development experience',
      '2+ years of ReactJS and Redux experience (including SSR)',
      'Proficient in HTML5, CSS3, LESS/SASS',
      'Deep understanding of asynchronous requests, AJAX, DOM, cross-browser compatibility',
      'Experience with Git/SVN',
      'Familiarity with Preact and charting frameworks (Highcharts, D3JS) a plus',
      "Bachelor's degree in CS, MCA, or equivalent"
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://cutshort.io/job/Frontend-Developer-Faridabad-NCR-Delhi-Gurgaon-Noida-Cerebry-59bK6prl'
  },
  38: {
    id: 38,
    title: 'Frontend Developer',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'Noida, Uttar Pradesh, India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: 600000, max: 1000000, currency: 'INR' },
    description: 'We are seeking a skilled Frontend Developer to join our team. You will be responsible for building and optimizing responsive web interfaces using modern JavaScript frameworks. Work closely with backend engineers and designers to deliver high-quality user experiences.',
    requirements: [
      '2–5 years of experience in frontend development',
      'Strong proficiency in JavaScript, HTML5, and CSS3',
      'Hands-on experience with React.js, Angular, or Vue.js',
      'Experience with RESTful APIs and asynchronous request handling',
      'Familiarity with Git, Webpack, and responsive design principles',
      'Good understanding of cross-browser compatibility issues',
      "Bachelor's degree in Computer Science or related field"
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://www.timesjobs.com/candidate/JobDetailView.html?from=submit&adId=71130659'
  },
  39: {
    id: 39,
    title: 'Full Stack Developer (MERN, LLMs)',
    categoryId: 1, // Software Engineering
    location: 'New Delhi, India (Remote)',
    type: 'Full-time',
    experience: 'Mid‑Senior',
    salary: { min: 1500000, max: 5000000, currency: 'INR' },
    description: 'Join M32 Labs (Wing) as a founding Full Stack Developer in a fast-paced R&D environment. Work on AI-powered talent management platforms, building responsive interfaces and backend APIs, integrating with LLMs, and contributing to DevOps and system design.',
    requirements: [
      '2+ years of experience in Full Stack or Software Engineering roles',
      'Proficient in front-end tech: JavaScript/TypeScript + React, Vue, etc.',
      'Backend experience building APIs with Node.js, Python, or similar',
      'Hands-on with LLM APIs (e.g. GPT, Anthropic)',
      'Experience with databases (SQL or NoSQL)',
      'Familiar with Docker/Kubernetes and CI/CD pipelines',
      'Skilled with cloud platforms (AWS, GCP, Azure)',
      'Comfortable with Linux CLI and server setups',
      'Familiarity with PHP, GraphQL, Terraform is a plus',
      'Strong communication, problem-solving, and rapid iteration mindset'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://jobs.lever.co/getwingapp/020c14c7-2f64-463f-849d-a8bd63fb1850/apply'
  },
  40: {
    id: 40,
    title: 'Software Engineer – Full Stack Development',
    categoryId: 1, // Software Engineering
    location: 'Waltham, MA, USA',
    type: 'Full-time',
    experience: 'Mid‑Senior',
    salary: { min: null, max: null, currency: 'USD' },
    description: 'Join a fast-paced, highly collaborative engineering team. Prototype, design, develop, deploy, and support scalable full-stack applications. Contribute to technical direction, code standards, and scrum-based development.',
    requirements: [
      '5–10+ years of software engineering experience',
      'Design scalable distributed systems',
      'Expert in Object-Oriented development and design principles',
      'Experience designing technical solutions from scratch',
      'Proficient with Agile processes and scrum practices',
      'Advanced problem-solving and clear technical communication',
      'BSCS or MSCS (or equivalent)'
    ],
    postedDate: 'June 2025',
    applyUrl: 'https://www.linkedin.com/jobs/view/software-engineer-full-stack-development-1032388-at-hitachi-vantara'
  },
  41: {
    id: 41,
    title: 'Senior Software Engineer I – Java React JS',
    categoryId: 1, // Software Engineering
    location: 'New Delhi, Delhi, India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: null, max: null, currency: 'INR' },
    description: "Build scalable, secure, high-performance applications supporting Optum's healthcare platforms. Work full stack using ReactJS for UI and Java Spring Boot microservices, integrate messaging systems, deploy on Kubernetes, and maintain observability.",
    requirements: [
      '5+ years of Full Stack development using Java and ReactJS',
      'Experience building microservices with Spring Boot and Kafka',
      'Hands-on with Kubernetes, Docker, GitHub Actions for CI/CD',
      'Proficiency in SQL and NoSQL databases (PostgreSQL, MongoDB)',
      'Strong grasp of HTML, CSS, JavaScript, and modern ReactJS',
      'Familiar with monitoring/observability tools like Grafana, Dynatrace, Splunk',
      'Ability to write unit/integration tests (JUnit, Mockito)',
      "Bachelor's or Master's in CS, Engineering, or related"
    ],
    postedDate: 'June 19, 2025',
    applyUrl: 'https://careers.unitedhealthgroup.com/job/22220526/senior-software-engineer-i-java-react-js-new-delhi-in/'
  },
  42: {
    id: 42,
    title: 'Compensation & Benefits Specialist',
    categoryId: 11, // Human Resources (fixed from Data Science)
    location: 'Jasola, New Delhi, India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Design, implement, and manage competitive global compensation and benefits programs. Provide strategic insights, ensure legal compliance, and collaborate with HR and business stakeholders to support talent retention and mobility.',
    requirements: [
      "Master's degree in HR, Business Administration, or related field",
      '5+ years experience in compensation and/or benefits in a global or multinational setting',
      'Strong knowledge of international compensation practices and benefits regulations',
      'Proficiency with HRIS systems and data analytics tools (e.g., Excel, Workday, SAP SuccessFactors)',
      'Excellent analytical, communication, and project‑management skills',
      'Certification such as CCP or CEBS is a plus',
      'Preferred: experience across multiple regions (India, Americas, Europe)'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://osv-chegg.wd5.myworkdayjobs.com/Chegg/job/Jasola-New-Delhi/Compensation---Benefits-Specialist_R4926-1'
  },
  43: {
    id: 43,
    title: 'US Travel Sales (Voice Process)',
    categoryId: 12, // Sales & Business Development (fixed from Sales / Call Center)
    location: 'Gurugram, Haryana, India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: null, max: 600000, currency: 'INR' },
    description: 'Urgent hiring for US Travel Sales agents handling PPC-based voice sales leads. Engage with US market clients, convert leads into bookings, and upsell travel products while maintaining customer satisfaction.',
    requirements: [
      'Minimum 2 years experience in US travel sales (PPC inbound/outbound calls)',
      'Excellent spoken English and persuasion skills',
      'Goal-oriented with proven sales conversion track record'
    ],
    postedDate: 'June–July 2025',
    applyUrl: 'https://www.shine.com/jobs/us-travel-sales/sharda-consultancy-services/16965216'
  },
  44: {
    id: 44,
    title: 'Senior Software Engineer',
    categoryId: 1, // Software Engineering
    location: 'Princeton, New Jersey, USA',
    type: 'Full-time',
    experience: 'Mid‑Senior',
    salary: { min: 106000, max: 135300, currency: 'USD' },
    description: "Design, develop, and operate scalable cloud-native solutions on AWS. Build full-stack software using Java, Python, JavaScript. Own CI/CD pipelines, monitor systems, and collaborate in an Agile environment to support ETS's education and assessment platforms.",
    requirements: [
      "Master's degree in Computer Science, Engineering, or related, plus 2+ years post-baccalaureate full-stack development experience",
      'Hands-on experience with AWS (CDK, CloudFormation, serverless architectures)',
      'Proficient in Java, Python (NumPy, Pandas), JavaScript, Spring/Hibernate',
      'Experience with RESTful web services, UNIX shell scripting, XML/JSON/YAML',
      'Unit testing expertise (JUnit) and Infrastructure as Code',
      'Knowledge of monitoring, incident troubleshooting, and agile practices'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://www.linkedin.com/jobs/view/software-developer-senior-at-ets-4246118460'
  },
  45: {
    id: 45,
    title: 'Territory Business Manager – Quantus',
    categoryId: 12, // Sales & Business Development (fixed from Sales / Field Role)
    location: 'Mumbai (Vasai to Virar), Maharashtra, India',
    type: 'Full-time',
    experience: 'Associate/Specialist',
    salary: { min: null, max: null, currency: 'INR' },
    description: 'Drive business development in the Quantus territory. Conduct market research and feasibility studies, analyze sales and competitive data, and prepare materials for client and partner engagement to support strategic decision-making.',
    requirements: [
      'Associate degree or equivalent',
      'Market research and analytical skills',
      'Ability to compile and analyze financial, sales, and competitive data',
      'Strong presentation and documentation capabilities',
      'Willingness to travel within territory and stand for extended periods',
      'Excellent communication and interpersonal skills'
    ],
    postedDate: 'April–June 2025',
    applyUrl: 'https://www.jobs.abbott/us/en/job/31120912/Territory-Business-Manager---Quantus---Mumbai--Vasai-to-Virar-_31120912-4'
  },
  46: {
    id: 46,
    title: 'Software Engineer – Full Stack Developer',
    categoryId: 1, // Software Engineering
    location: 'Hyderabad, Telangana, India',
    type: 'Full-time',
    experience: 'Mid‑Level',
    salary: { min: 800000, max: 1400000, currency: 'INR' },
    description: 'We are hiring a Full Stack Software Engineer to join our product development team. You will be responsible for developing modern web applications, collaborating with cross-functional teams, and delivering scalable and maintainable code.',
    requirements: [
      '3+ years of experience with JavaScript frameworks like React.js or Angular',
      'Hands-on experience in backend technologies like Node.js, Java, or Python',
      'Proficiency in REST APIs and database systems (MySQL, MongoDB)',
      'Strong understanding of HTML5, CSS3, and responsive design principles',
      'Familiar with CI/CD pipelines, version control (Git), and Agile methodologies',
      "Bachelor's degree in Computer Science or related discipline"
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=1967b8dd-0f7b-4982-9500-7ead01d3a132&jobId=974397'
  },
  47: {
    id: 47,
    title: 'Frontend Web Developer (MERN)',
    categoryId: 5, // Frontend Development (fixed from Software Engineering)
    location: 'New Delhi, India (Remote)',
    type: 'Full-time',
    experience: 'Mid‑Senior',
    salary: { min: 1200000, max: 2500000, currency: 'INR' },
    description: 'Join M32 Labs at Wing as a Frontend Web Developer contributing to AI-powered talent management platforms. Build responsive, performant, and accessible interfaces, rapidly prototype features in short cycles, and work closely with AI engineers, product managers, and UX designers in a high-impact, low-bureaucracy environment.',
    requirements: [
      "Bachelor's or Master's in CS, Software Engineering, or equivalent experience",
      '2+ years of professional frontend development with MERN stack (React, Node.js)',
      'Proficiency in JavaScript/TypeScript, React/Vue, Tailwind/CSS',
      'Experience building from 0→1 in agile/hackathon-style settings',
      'Familiarity with backend integration (Node.js, REST/GraphQL APIs)',
      'Knowledge of Git workflows, rapid iteration, and remote collaboration',
      'Excellent communication, problem-solving, and product-minded engineering skills'
    ],
    postedDate: 'July 2025',
    applyUrl: 'https://jobs.lever.co/getwingapp/0af28d14-097e-4612-a225-94bb519c700d/apply'
  },
  48: {
    id: 48,
    title: 'Senior Full Stack Developer',
    categoryId: 1, // Software Engineering
    location: 'North Delhi, Delhi, India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 1200000, max: 3000000, currency: 'INR' },
    description: 'Join TeknoBloom as part of a cross-functional team to design and develop scalable front-end and back-end solutions, APIs, responsive UIs, and manage database systems. Ensure software performance, security, and code quality through end-to-end testing and collaboration.',
    requirements: [
      "5+ years experience (or 3+ with Master's) in full-stack development",
      'Strong proficiency in C#, .NET Framework, ASP.NET MVC, Web API',
      'Hands-on experience with front-end frameworks like Angular or React, plus HTML, CSS, JavaScript',
      'Database experience with SQL Server, MongoDB, or Cosmos DB',
      'Experience with DevOps practices, Git, and CI/CD pipelines',
      'Skilled in writing resilient APIs, responsive UI, and technical documentation',
      'Excellent problem-solving, communication, and teamwork skills',
      "Bachelor's or Master's in Computer Science or related field"
    ],
    postedDate: 'April–June 2025',
    applyUrl: 'https://www.sourcingxpress.com/jobs/e2b57ca2-5afb-4c3c-88b5-8f8eb599dd30?utm_source=linkedin&utm_medium=job_board&utm_campaign=careers_2025'
  },
  49: {
    id: 49,
    title: 'Senior Software Engineer – Azure Storage DPU',
    categoryId: 1, // Software Engineering
    location: 'Multiple Locations, India',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: 119800, max: 258000, currency: 'USD' },
    description: "Design and develop next-generation cloud storage backend infrastructure leveraging Fungible DPUs. Work across the full software lifecycle—design, implementation, testing, deployment, and support—to drive innovation in Azure's massively scalable storage solutions.",
    requirements: [
      "Bachelor's or Master's in CS or related technical field",
      '8+ years of experience in systems programming (C, C++, C#, Java, JavaScript, or Python)',
      'Experience with low-level systems development (e.g., networking, drivers)',
      'Strong skills in distributed systems, hardware/software integration, and scalability',
      'Ability to serve as a Designated Responsible Individual (DRI) and lead on-call responsibilities',
      'Familiarity with cloud infrastructure and performance/efficiency tooling'
    ],
    postedDate: 'June 2025',
    applyUrl: 'https://jobs.careers.microsoft.com/us/en/job/1826981/Senior-Software-Engineer'
  },
  50: {
    id: 50,
    title: 'Senior Software Engineer – Full Stack Technologies',
    categoryId: 1, // Software Engineering
    location: 'Gurgaon, Haryana, India (3 PM–12 AM IST)',
    type: 'Full-time',
    experience: 'Senior',
    salary: { min: null, max: null, currency: 'INR' },
    description: "Join Avive's R&D team to design, develop, deploy, and maintain end-to-end web and mobile-facing systems on the public cloud. Build reusable frontend and backend components, optimize UI performance, bridge wireframes with backend services, and deliver robust technical documentation.",
    requirements: [
      '5+ years delivering consumer‑facing web apps',
      '2+ years deep expertise with Angular or React, HTML, CSS, JavaScript (ES6+)',
      '3+ years using Git',
      'Experience with RESTful APIs (Postman, Swagger) and CI/CD tooling (Selenium, CodeBuild, GitHub Actions)',
      'Proficient with Docker and public cloud environments',
      'BS in CS or Engineering (or equivalent experience)',
      'Optional skills: Python/Django, MySQL, MongoDB/NoSQL, React Native, Agile/Scrum'
    ],
    postedDate: 'June 9, 2025',
    applyUrl: 'https://www.hirist.tech/j/trans-org-analytics-senior-software-engineer-full-stack-technologies-1492858'
  }
};

// Companies - mapping to job IDs (FIXED: Removed duplicates and inconsistencies)
const COMPANIES = {
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    jobs: [1, 2, 3, 4, 5, 8, 9], // Removed 31 (duplicate)
  },
  sourcingxpress: {
    id: 'sourcingxpress',
    name: 'SourcingXpress',
    logo: 'https://logo.clearbit.com/sourcingxpress.com',
    jobs: [6, 48], // Added job 48
  },
  bairesdev: {
    id: 'bairesdev',
    name: 'BairesDev',
    logo: 'https://logo.clearbit.com/bairesdev.com',
    jobs: [7],
  },
  generic: {
    id: 'generic',
    name: 'Various Companies',
    logo: 'https://logo.clearbit.com/example.com',
    jobs: [10, 38], // Added job 38
  },
  internationalsos: {
    id: 'internationalsos',
    name: 'International SOS',
    logo: 'https://logo.clearbit.com/internationalsos.com',
    jobs: [15],
  },
  ntt: {
    id: 'ntt',
    name: 'NTT',
    logo: 'https://logo.clearbit.com/ntt.com',
    jobs: [16, 25],
  },
  idinsight: {
    id: 'idinsight',
    name: 'IDinsight',
    logo: 'https://logo.clearbit.com/idinsight.org',
    jobs: [17],
  },
  qualcomm: {
    id: 'qualcomm',
    name: 'Qualcomm',
    logo: 'https://logo.clearbit.com/qualcomm.com',
    jobs: [18],
  },
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    logo: 'https://logo.clearbit.com/fedex.com',
    jobs: [20, 23],
  },
  icf: {
    id: 'icf',
    name: 'ICF',
    logo: 'https://logo.clearbit.com/icf.com',
    jobs: [21, 30], // Combined duplicate ICF entries
  },
  bain: {
    id: 'bain',
    name: 'Bain & Company',
    logo: 'https://logo.clearbit.com/bain.com',
    jobs: [22],
  },
  restroworks: {
    id: 'restroworks',
    name: 'RestroWorks',
    logo: 'https://logo.clearbit.com/restroworks.com',
    jobs: [24], // Removed duplicates
  },
  techjockey: {
    id: 'techjockey',
    name: 'Techjockey',
    logo: 'https://logo.clearbit.com/techjockey.com',
    jobs: [27, 32], // Added job 27
  },
  clickpost: {
    id: 'clickpost',
    name: 'Clickpost',
    logo: 'https://logo.clearbit.com/clickpost.in',
    jobs: [29, 33], // Added job 29
  },
  roadzen: {
    id: 'roadzen',
    name: 'Roadzen Technologies',
    logo: 'https://logo.clearbit.com/roadzen.io',
    jobs: [28, 34], // Added job 28
  },
  kvantum: {
    id: 'kvantum',
    name: 'Kvantum Inc.',
    logo: 'https://logo.clearbit.com/kvantuminc.com',
    jobs: [35],
  },
  mikelegal: {
    id: 'mikelegal',
    name: 'MikeLegal',
    logo: 'https://logo.clearbit.com/mikelegal.com',
    jobs: [36],
  },
  cerebry: {
    id: 'cerebry',
    name: 'Cerebry',
    logo: 'https://logo.clearbit.com/cerebry.co',
    jobs: [37],
  },
  hirist: {
    id: 'hirist',
    name: 'Hirist Tech',
    logo: 'https://logo.clearbit.com/hirist.tech',
    jobs: [26, 31, 50], // Added jobs that use Hirist as platform
  },
  wing: {
    id: 'wing',
    name: 'Wing (M32 Labs)',
    logo: 'https://logo.clearbit.com/getwingapp.com',
    jobs: [39, 47],
  },
  hitachi: {
    id: 'hitachi',
    name: 'Hitachi Vantara',
    logo: 'https://logo.clearbit.com/hitachivantara.com',
    jobs: [40],
  },
  unitedhealthgroup: {
    id: 'unitedhealthgroup',
    name: 'UnitedHealth Group',
    logo: 'https://logo.clearbit.com/unitedhealthgroup.com',
    jobs: [41],
  },
  chegg: {
    id: 'chegg',
    name: 'Chegg',
    logo: 'https://logo.clearbit.com/chegg.com',
    jobs: [42],
  },
  sharda: {
    id: 'sharda',
    name: 'Sharda Consultancy Services',
    logo: 'https://logo.clearbit.com/shine.com',
    jobs: [43],
  },
  ets: {
    id: 'ets',
    name: 'ETS',
    logo: 'https://logo.clearbit.com/ets.org',
    jobs: [44],
  },
  abbott: {
    id: 'abbott',
    name: 'Abbott',
    logo: 'https://logo.clearbit.com/abbott.com',
    jobs: [45],
  },
  adp: {
    id: 'adp',
    name: 'ADP',
    logo: 'https://logo.clearbit.com/adp.com',
    jobs: [46],
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    jobs: [49],
  }
};


// Helper Functions (these are for internal use by MirageJS, not directly exposed as API endpoints)
const getJobById = (id) => {
  const job = JOBS[id];
  if (!job) return null;
  
  return {
    ...job,
    category: CATEGORIES[job.categoryId],
    company: Object.values(COMPANIES).find(company => company.jobs.includes(id))
  };
};

const getAllJobs = () => {
  return Object.values(JOBS).map(job => getJobById(job.id));
};


export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'api';
this.post('/upload-resume', (schema, request) => {
  const formData = JSON.parse(request.requestBody); // since real file can't be handled
  const fakeUrl = `https://fakecdn.com/uploads/${formData.filename}`;
  
  return { message: 'Mock upload success', filePath: fakeUrl };
});


      this.get('/profile', () => {
        return {
          name: 'Abhishek Deshwal',
          email: 'abhishek@example.com',
          resume: 'https://example.com/resume.pdf',
          skills: ['React', 'Java Script', 'Redux', 'HTML', 'CSS']
        };
      });

      // Get all jobs (your JobList.jsx fetches all jobs and filters client-side)
      this.get('/jobs', () => {
        return {
          jobs: getAllJobs(),
          total: Object.keys(JOBS).length
        };
      });

      // Get job by ID (if you need a detail page)
      this.get('/jobs/:id', (schema, request) => {
        const job = getJobById(parseInt(request.params.id));
        if (!job) {
          return new Response(404, {}, { error: 'Job not found' });
        }
        return { job };
      });

      // Get all categories (for filter dropdowns)
      this.get('/categories', () => {
        return {
          categories: Object.values(CATEGORIES),
          total: Object.keys(CATEGORIES).length
        };
      });

      // Get all companies (for filter dropdowns)
      this.get('/companies', () => {
        return {
          companies: Object.values(COMPANIES),
          total: Object.keys(COMPANIES).length
        };
      });

      // Get stats (if needed for dashboard/analytics)
      this.get('/stats', () => {
        const allJobs = getAllJobs();
        
        return {
          totalJobs: allJobs.length,
          totalCompanies: Object.keys(COMPANIES).length,
          totalCategories: Object.keys(CATEGORIES).length,
          jobsByCategory: Object.values(CATEGORIES).map(category => ({
            category: category.name,
            count: allJobs.filter(job => job.categoryId === category.id).length
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
