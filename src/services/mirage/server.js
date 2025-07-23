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
  2: {
    id: 2,
    title: 'ASIC Design Engineer, Cloud‑Scale Machine Learning Acceleration team',
    categoryId: 8, // Infrastructure - more appropriate than DevOps
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
    categoryId: 1, // Software Engineering - not Security
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
    categoryId: 1, 
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
    categoryId: 1,
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
    categoryId: 3,
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
    categoryId: 1, // Software Engineering (more appropriate than Security for operations role)
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
    categoryId: 1, // Software Engineering
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
    categoryId: 1, // Software Engineering (consulting role)
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
    categoryId: 1, // Software Engineering
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
    categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
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
    categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
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
    categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
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
    categoryId: 5, // FIXED: Changed from 3 (Security) to 5 (Frontend Development)
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
    categoryId: 1, // FIXED: Changed from 3 (Security) to 1 (Software Engineering)
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
};

// Companies - mapping to job IDs
const COMPANIES = {
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    jobs: [1, 2, 3, 4, 5, 8, 9], // Updated job IDs
  },
  sourcingxpress: {
    id: 'sourcingxpress',
    name: 'SourcingXpress',
    logo: 'https://logo.clearbit.com/sourcingxpress.com',
    jobs: [6],
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
    jobs: [10],
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
    jobs: [21],
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
    jobs: [24,25,26,27,28,29,30],
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
