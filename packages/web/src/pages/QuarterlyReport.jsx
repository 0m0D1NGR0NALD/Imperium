import React, { useState, useEffect } from 'react';
import api from '../services/api';

const QuarterlyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [ef, budget, con, hustles, steps] = await Promise.all([
          api.get('/analytics/emergency-fund'),
          api.get('/budget'),
          api.get('/constitution'),
          api.get('/side-hustles'),
          api.get('/investment')
        ]);
        setReport({ ef: ef.data, budget: budget.data, con: con.data, hustles: hustles.data, steps: steps.data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>No data available.</div>;

  const { ef, budget, con, hustles, steps } = report;

  return (
    <div className="container">
      <h1>State of the Imperium</h1>
      <p>Quarterly Review – {new Date().toLocaleDateString()}</p>
      <button onClick={handlePrint}>Print / Save as PDF</button>

      <div className="card">
        <h2>Constitution & Goals</h2>
        <ul>
          <li>Savings Rate Target: {con.savingsRate}%</li>
          <li>Emergency Fund Target: {con.emergencyFundMonths} months of expenses</li>
          <li>Windfall Rule: {con.windfallRule}</li>
        </ul>
      </div>

      <div className="card">
        <h2>Emergency Fund</h2>
        <p>Monthly Expenses: ${ef.monthlyExpenses.toFixed(2)}</p>
        <p>Target: ${ef.target.toFixed(2)}</p>
        <p>Current: ${ef.current.toFixed(2)}</p>
        <p>Progress: {ef.progress.toFixed(0)}%</p>
      </div>

      <div className="card">
        <h2>Budget (50/30/20)</h2>
        <p>Needs: {budget.needsPercent}% | Wants: {budget.wantsPercent}% | Savings: {budget.savingsPercent}%</p>
      </div>

      <div className="card">
        <h2>Investment Hierarchy</h2>
        <ul>
          {steps.map(step => (
            <li key={step.id}>
              {step.step}. {step.name} – {step.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Side Hustles (Mittelstand)</h2>
        {hustles.length === 0 ? (
          <p>No side hustles recorded yet.</p>
        ) : (
          <ul>
            {hustles.map(h => (
              <li key={h.id}>{h.name}: ${h.monthlyIncome}/month, {h.profitAllocationPercent}% invested</li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Next Steps</h2>
        <p>Review your progress, update your constitution if needed, and continue automating your savings.</p>
      </div>
    </div>
  );
};

export default QuarterlyReport;