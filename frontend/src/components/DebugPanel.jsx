// Add this component at the TOP of your JobList.jsx file (after imports)
// This will help us see what's happening

import React from 'react';

const DebugPanel = ({ filters, pagination, infiniteScroll, displayJobs, isMobile }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '600px',
      overflow: 'auto',
      fontFamily: 'monospace'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#333',
          color: '#0f0',
          border: '1px solid #0f0',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {isOpen ? '▼ Hide Debug' : '▶ Show Debug'}
      </button>

      {isOpen && (
        <>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#ff0' }}>🖥️ Mode:</strong>
            <div>{isMobile ? '📱 Mobile (Infinite Scroll)' : '🖥️ Desktop (Pagination)'}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#ff0' }}>📊 Display Jobs:</strong>
            <div>Count: {displayJobs.length}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#ff0' }}>🔢 Pagination:</strong>
            <div>Current Page: {pagination.currentPage}</div>
            <div>Total Pages: {pagination.totalPages}</div>
            <div>Total Jobs: {pagination.totalJobs}</div>
            <div>Jobs Per Page: {pagination.jobsPerPage}</div>
            <div>Has Next: {pagination.hasNextPage ? '✅' : '❌'}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#ff0' }}>📱 Infinite Scroll:</strong>
            <div>All Jobs Count: {infiniteScroll.allJobs.length}</div>
            <div>Has More: {infiniteScroll.hasMore ? '✅' : '❌'}</div>
            <div>Is Loading: {infiniteScroll.isLoading ? '⏳' : '✅'}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#ff0' }}>🔍 Active Filters:</strong>
            <div>Search: {filters.searchQuery || '(none)'}</div>
            <div>Categories: {filters.selectedCategory?.length || 0}</div>
            <div>Companies: {filters.selectedCompany?.length || 0}</div>
            <div>Experience: {filters.selectedExperience?.length || 0}</div>
            <div>Location: {filters.selectedLocation?.length || 0}</div>
            <div>Type: {filters.selectedType?.length || 0}</div>
            <div>Salary: {filters.selectedSalary?.length || 0}</div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#ff0' }}>📝 Job IDs:</strong>
            <div style={{ 
              maxHeight: '100px', 
              overflow: 'auto', 
              fontSize: '10px',
              background: '#111',
              padding: '5px',
              borderRadius: '4px'
            }}>
              {displayJobs.slice(0, 10).map((job, i) => (
                <div key={job.id}>{i + 1}. {job.id} - {job.title}</div>
              ))}
              {displayJobs.length > 10 && <div>... and {displayJobs.length - 10} more</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;

// ============================================
// HOW TO USE IN JOBLIST.JSX:
// ============================================
// 1. Import at the top:
//    import DebugPanel from './DebugPanel';
//
// 2. Add before the return statement:
//    return (
//      <div className="job-list-container">
//        <DebugPanel 
//          filters={filters}
//          pagination={pagination}
//          infiniteScroll={infiniteScroll}
//          displayJobs={displayJobs}
//          isMobile={isMobile}
//        />
//        {/* rest of your JSX */}
//      </div>
//    );
// ============================================