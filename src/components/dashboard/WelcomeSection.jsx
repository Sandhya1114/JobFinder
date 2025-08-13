// import React from 'react';

// const WelcomeSection = ({ profile }) => {
//   const { name, email } = profile || {};

//   return (
//     <section style={{ marginBottom: '20px' }}>
//       <h2>Welcome{ name ? `, ${name}` : '' }!</h2>
//       {email && <p>Email: {email}</p>}
//     </section>
//   );
// };

// export default WelcomeSection;
// components/WelcomeSection.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { applyToJobAsync, saveJobAsync } from '../../redux/dashboardSlice';

const WelcomeSection = ({ profile, overview = {}, recentJobs = [] }) => {
  const dispatch = useDispatch();

  const handleQuickApply = async (jobId, jobTitle) => {
    if (window.confirm(`Apply to "${jobTitle}"?`)) {
      try {
        await dispatch(applyToJobAsync(jobId)).unwrap();
        alert(`Successfully applied to ${jobTitle}!`);
      } catch (error) {
        alert(`Failed to apply: ${error}`);
      }
    }
  };

  const handleQuickSave = async (jobId, jobTitle) => {
    try {
      await dispatch(saveJobAsync(jobId)).unwrap();
      alert(`"${jobTitle}" saved successfully!`);
    } catch (error) {
      alert(`Failed to save job: ${error}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `$${min?.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)', 
      padding: '30px', 
      borderRadius: '16px',
      marginBottom: '30px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '2rem', 
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          {getGreeting()}, {profile.name || 'Job Seeker'}! 👋
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: '1.1rem',
          margin: '0'
        }}>
          Here's your job search overview
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <QuickStat 
          label="Total Jobs Available" 
          value={overview.totalJobs || 0} 
          icon="💼"
          color="#667eea"
        />
        <QuickStat 
          label="Active Companies" 
          value={overview.totalCompanies || 0} 
          icon="🏢"
          color="#764ba2"
        />
        <QuickStat 
          label="New This Week" 
          value={overview.recentJobs || 0} 
          icon="🆕"
          color="#f093fb"
        />
        <QuickStat 
          label="Job Categories" 
          value={overview.totalCategories || 0} 
          icon="📂"
          color="#4facfe"
        />
      </div>

      {/* Recent Jobs Preview */}
      {recentJobs.length > 0 && (
        <div>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.3rem', 
            marginBottom: '15px',
            fontWeight: '500'
          }}>
            🔥 Hot Jobs This Week
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {recentJobs.map((job) => (
              <JobPreviewCard 
                key={job.id} 
                job={job} 
                onApply={handleQuickApply}
                onSave={handleQuickSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const QuickStat = ({ label, value, icon, color }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s ease'
  }}
  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
    <div style={{ 
      fontSize: '1.8rem', 
      fontWeight: '700', 
      color: 'white',
      marginBottom: '4px'
    }}>
      {value.toLocaleString()}
    </div>
    <div style={{ 
      fontSize: '0.9rem', 
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </div>
);

const JobPreviewCard = ({ job, onApply, onSave }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
    e.target.style.transform = 'translateX(4px)';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
    e.target.style.transform = 'translateX(0)';
  }}
  >
    <div style={{ flex: 1 }}>
      <h4 style={{ 
        color: 'white', 
        fontSize: '1.1rem', 
        margin: '0 0 8px 0',
        fontWeight: '600'
      }}>
        {job.title}
      </h4>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.8)', 
        margin: '0 0 8px 0',
        fontSize: '0.95rem'
      }}>
        {job.companies?.name || 'Company'} • {job.location || 'Remote'}
      </p>
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        {job.type && (
          <span>📋 {job.type}</span>
        )}
        {(job.salary_min || job.salary_max) && (
          <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
        )}
        <span>🕒 {new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </div>
    
    <div style={{ 
      display: 'flex', 
      gap: '10px',
      marginLeft: '20px'
    }}>
      <button
        onClick={() => onSave(job.id, job.title)}
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        💾 Save
      </button>
      
      <button
        onClick={() => onApply(job.id, job.title)}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        🚀 Apply
      </button>
    </div>
  </div>
);

// Helper function moved inside component
const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed';
  if (min && max) return `${min?.toLocaleString()} - ${max?.toLocaleString()}`;
  if (min) return `${min?.toLocaleString()}+`;
  return `Up to ${max?.toLocaleString()}`;
};

export default WelcomeSection;