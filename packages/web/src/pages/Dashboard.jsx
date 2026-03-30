import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [emergencyFund, setEmergencyFund] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [efRes, expRes] = await Promise.all([
          api.get('/analytics/emergency-fund'),
          api.get('/analytics/monthly-expenses?months=1')
        ]);
        setEmergencyFund(efRes.data);
        setMonthlyExpenses(expRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Emergency Fund</h2>
        {emergencyFund && (
          <>
            <p>Monthly Expenses: ${emergencyFund.monthlyExpenses.toFixed(2)}</p>
            <p>Target (months): {emergencyFund.emergencyFundMonths}</p>
            <p>Target Amount: ${emergencyFund.target.toFixed(2)}</p>
            <p>Current: ${emergencyFund.current.toFixed(2)}</p>
            <p>Progress: {emergencyFund.progress.toFixed(1)}%</p>
          </>
        )}
      </section>
      <section>
        <h2>Monthly Expenses (Needs)</h2>
        {monthlyExpenses && (
          <p>Total last {monthlyExpenses.periodMonths} month(s): ${monthlyExpenses.totalExpenses.toFixed(2)}</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;