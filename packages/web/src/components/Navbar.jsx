import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/constitution">Constitution</Link>
      <Link to="/budget">Budget</Link>
      <Link to="/accounts">Accounts</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/side-hustles">Side Hustles</Link>
      <Link to="/investment">Investment Hierarchy</Link>
      <Link to="/quarterly-report">Quarterly Report</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;