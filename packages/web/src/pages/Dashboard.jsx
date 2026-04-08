import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import NetWorthChart from '../components/NetWorthChart';
import BudgetVsActual from '../components/BudgetVsActual';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [emergencyFund, setEmergencyFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, efRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/analytics/emergency-fund')
        ]);
        setSummary(sumRes.data);
        setEmergencyFund(efRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  const timelineData = summary?.timeline.labels.map((label, idx) => ({
    month: label,
    netWorth: summary.timeline.data[idx]
  }));

  return (
    <div className="container">
      <h1>Your Imperium Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <MetricCard title="Net Worth" value={`$${summary?.netWorth.toFixed(2)}`} />
        <MetricCard title="Monthly Savings Rate" value={`${summary?.savingsRate}%`} />
        <MetricCard title="Side Hustle Income" value={`$${summary?.sideHustleIncome}/mo`} />
        <MetricCard title="Investments" value={`$${summary?.investmentBalance.toFixed(2)}`} />
        {emergencyFund && (
          <MetricCard
            title="Emergency Fund"
            value={`$${emergencyFund.current.toFixed(2)}`}
            subtitle={`of $${emergencyFund.target.toFixed(2)}`}
          />
        )}
      </div>

      <div className="card">
        <h2>Net Worth Trend (Last 12 Months)</h2>
        <LineChart width={600} height={300} data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="netWorth" stroke="#D4AF37" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>

      <BudgetVsActual />

      <div className="card">
        <h2>Flywheel Projection</h2>
        <p>Based on your average monthly savings (${(summary?.savingsRate * (summary?.netWorth / 100)).toFixed(2)} estimate).</p>
        {/* You can reuse FlywheelChart with estimated contribution */}
      </div>
    </div>
  );
};

export default Dashboard;