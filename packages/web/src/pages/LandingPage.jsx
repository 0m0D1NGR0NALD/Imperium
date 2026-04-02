import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing">
      <div className="hero">
        <h1>Imperium</h1>
        <p className="tagline">The Operating System for Your Family Economy</p>
        <div className="cta-buttons">
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Start Your Imperium</button></Link>
        </div>
      </div>
      <div className="pillars">
        <div className="pillar">
          <h2>🇩🇪 Germany</h2>
          <p>Social Market Economy<br/>Mittelstand<br/>Constitution</p>
        </div>
        <div className="pillar">
          <h2>🇳🇴 Norway</h2>
          <p>Sovereign Wealth Fund<br/>Intergenerational Thinking</p>
        </div>
        <div className="pillar">
          <h2>🇸🇬 Singapore</h2>
          <p>Meritocracy<br/>Forced Savings<br/>Global Connectivity</p>
        </div>
      </div>
      <div className="explanation">
        <p>What if we stopped treating personal finance as a budgeting problem and started treating it as a nation-building one?</p>
        <p>Imperium reverse‑engineers the principles of successful national economies and scales them down to the family level.</p>
      </div>
    </div>
  );
};

export default LandingPage;