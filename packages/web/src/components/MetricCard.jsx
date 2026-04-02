import React from 'react';

const MetricCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="metric-card">
      {icon && <div className="metric-icon">{icon}</div>}
      <h3>{title}</h3>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    </div>
  );
};

export default MetricCard;