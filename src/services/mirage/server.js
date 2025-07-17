import { createServer } from 'miragejs';

export function makeServer() {
  createServer({
    routes() {
      this.namespace = 'api';

      this.get('/jobs', () => {
        return {
          jobs: [
            {
              id: '2988485',
              title: 'SOC Support Engineer III – AWS SOC Security Support Engineer',
              company: 'Amazon',
              location: 'Seattle, WA (or remote)',
              description: 'Support AWS Security Operations Center to maintain a secure cloud.',
              applyUrl: 'https://www.amazon.jobs/en/jobs/2988485/soc-support-engineer-iii-aws-soc-security-support-engineer',
            },
            {
              id: '3023072',
              title: 'Data Center Engineering Operations Technician (DCC Communities)',
              company: 'Amazon',
              location: 'Northern Virginia, USA',
              description: 'Manage and maintain mission-critical infrastructure in AWS data centers.',
              applyUrl: 'https://www.amazon.jobs/en/jobs/3023072/data-center-engineering-operations-technician-dcc-communities',
            },
            {
              id: '3037312',
              title: 'Integ Change Engineer, Robotic Integration Change',
              company: 'Amazon Robotics',
              location: 'Boston, MA',
              description: 'Drive integration and change in robotic systems at Amazon warehouses.',
              applyUrl: 'https://www.amazon.jobs/en/jobs/3037312/integ-change-engineer-robotic-integration-change',
            },
             {
              id: '3021186',
              title: 'Application Developer – Professional Services',
              company: 'Amazon Web Services (AWS)',
              location: 'Various US Locations',
              description: 'Build scalable applications and solutions as part of AWS Professional Services, helping enterprise customers migrate and innovate on the cloud.',
              applyUrl: 'https://www.amazon.jobs/en/jobs/3021186/application-developer-professional-services',
            },
            {
              id: 'nexty-001',
              title: 'Frontend Developer (React/JavaScript)',
              company: 'Nexty Electronics (Thailand)',
              location: 'Bangkok, Thailand',
              description: 'Develop and maintain front-end applications with modern JavaScript frameworks for the automotive and electronics industries.',
              applyUrl: 'https://www.th.nexty-ele.com/job-detail?WP=oH9axUF5nrO4pUNzoGM3ARjkoH9axUF5nrO4Ljo7o3Qo7o3Q',
            }
          ],
        };
      });
    },
  });
}
