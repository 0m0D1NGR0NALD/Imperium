import React from 'react';

const InfoBox = ({ title, children, icon }) => {
  return (
    <div className="info-box">
      {icon && <div className="info-icon">{icon}</div>}
      <h3>{title}</h3>
      <div className="info-content">{children}</div>
    </div>
  );
};

export default InfoBox;