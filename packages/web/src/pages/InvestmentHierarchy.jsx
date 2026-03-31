import React, { useState, useEffect } from 'react';
import api from '../services/api';

const InvestmentHierarchy = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const res = await api.get('/investment');
      setSteps(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (stepId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/investment/step/${stepId}`, { status: newStatus });
      await fetchSteps();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Investment Hierarchy (The 5 Steps)</h1>
      <ul>
        {steps.map(step => (
          <li key={step.id}>
            <strong>{step.step}. {step.name}</strong> - Status: {step.status}
            {step.status !== 'completed' && (
              <>
                <button onClick={() => updateStatus(step.id, 'in_progress')} disabled={updating}>Start</button>
                <button onClick={() => updateStatus(step.id, 'completed')} disabled={updating}>Complete</button>
              </>
            )}
            {step.status === 'completed' && <span> ✓</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestmentHierarchy;