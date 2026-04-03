import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-line" style={{ width: '60%' }}></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line" style={{ width: '80%' }}></div>
      </div>
    );
  }
  return <div className="skeleton">Loading...</div>;
};

export default LoadingSkeleton;