import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import FlywheelChart from '../components/FlywheelChart';

const Dashboard = () => {
  const [emergencyFund, setEmergencyFund] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState(null);
  const [constitution, setConstitution] = useState(null);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [efRes, expRes, conRes] = await Promise.all([
          api.get('/analytics/emergency-fund'),
          api.get('/analytics/monthly-expenses?months=1'),
          api.get('/constitution')
        ]);
        setEmergencyFund(efRes.data);
        setMonthlyExpenses(expRes.data);
        setConstitution(conRes.data);
        // optional: set monthly contribution from constitution savings rate (if we had income)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContributionChange = (e) => {
    setMonthlyContribution(parseFloat(e.target.value) || 0);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Your Imperium Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {emergencyFund && (
          <>
            <MetricCard
              title="Emergency Fund"
              value={`$${emergencyFund.current.toFixed(2)}`}
              subtitle={`of $${emergencyFund.target.toFixed(2)} target (${emergencyFund.progress.toFixed(0)}%)`}
            />
            <MetricCard
              title="Monthly Expenses (Needs)"
              value={`$${monthlyExpenses?.totalExpenses.toFixed(2)}`}
              subtitle="Last 30 days"
            />
            <MetricCard
              title="Constitution Savings Rate"
              value={`${constitution?.savingsRate || 20}%`}
              subtitle="of total income"
            />
          </>
        )}
      </div>

      <div className="card">
        <h2>Flywheel Projection</h2>
        <p>See how your monthly contributions compound over time.</p>
        <div style={{ marginBottom: '1rem' }}>
          <label>Monthly Contribution ($): </label>
          <input type="number" value={monthlyContribution} onChange={handleContributionChange} step="50" />
        </div>
        <FlywheelChart monthlyContribution={monthlyContribution} />
        <p className="metric-subtitle">Assumes 7% annual return, reinvested.</p>
      </div>

      <div className="card">
        <h2>State of the Imperium</h2>
        <ul>
          <li>✓ Constitution: Active</li>
          <li>{emergencyFund?.progress === 100 ? '✓' : '◌'} Emergency Fund: {emergencyFund?.progress.toFixed(0)}% funded</li>
          <li>◌ Sovereign Wealth Fund: Building</li>
          <li>◌ Mittelstand: Not started</li>
        </ul>
        <button>Review Quarterly (coming soon)</button>
      </div>
    </div>
  );
};

export default Dashboard;