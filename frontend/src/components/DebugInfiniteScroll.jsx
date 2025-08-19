// DebugInfiniteScroll.js - Add this temporarily to your JobList component
import React from 'react';
import { useSelector } from 'react-redux';

const DebugInfiniteScroll = () => {
  const { jobs, pagination, loading, loadingMore } = useSelector((state) => state.jobs);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
        🐛 Debug: Infinite Scroll Status
      </h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>📊 Current State:</strong>
        <br />
        • Jobs Loaded: <span style={{color: '#FFD700'}}>{jobs.length}</span>
        <br />
        • Current Page: <span style={{color: '#FFD700'}}>{pagination.currentPage}</span>
        <br />
        • Total Pages: <span style={{color: '#FFD700'}}>{pagination.totalPages}</span>
        <br />
        • Total Available: <span style={{color: '#FFD700'}}>{pagination.totalJobs}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>🔄 Loading States:</strong>
        <br />
        • Initial Loading: <span style={{color: loading ? '#FF6B6B' : '#4CAF50'}}>{loading ? 'YES' : 'NO'}</span>
        <br />
        • Loading More: <span style={{color: loadingMore ? '#FF6B6B' : '#4CAF50'}}>{loadingMore ? 'YES' : 'NO'}</span>
        <br />
        • Has Next Page: <span style={{color: pagination.hasNextPage ? '#4CAF50' : '#FF6B6B'}}>{pagination.hasNextPage ? 'YES' : 'NO'}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>📈 Expected vs Actual:</strong>
        <br />
        • Expected Jobs: <span style={{color: '#87CEEB'}}>{pagination.currentPage * pagination.jobsPerPage}</span>
        <br />
        • Actual Jobs: <span style={{color: jobs.length === (pagination.currentPage * pagination.jobsPerPage) ? '#4CAF50' : '#FF6B6B'}}>{jobs.length}</span>
        <br />
        • Match: <span style={{color: jobs.length === (pagination.currentPage * pagination.jobsPerPage) ? '#4CAF50' : '#FF6B6B'}}>
          {jobs.length === (pagination.currentPage * pagination.jobsPerPage) ? '✅' : '❌'}
        </span>
      </div>

      <div style={{ fontSize: '10px', opacity: 0.7 }}>
        💡 This should show: Page 1 = 20 jobs, Page 2 = 40 jobs, etc.
      </div>
    </div>
  );
};

// Usage in JobList.js:
// Add this line after your other imports:
// import DebugInfiniteScroll from './DebugInfiniteScroll';

// Add this component right after your opening div:
// {process.env.NODE_ENV === 'development' && <DebugInfiniteScroll />}

export default DebugInfiniteScroll;