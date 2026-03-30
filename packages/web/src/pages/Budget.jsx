import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const res = await api.get('/budget');
      setBudget(res.data);
    } catch (err) {
      setError('Failed to fetch budget');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget({ ...budget, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const total = budget.needsPercent + budget.wantsPercent + budget.savingsPercent;
    if (total !== 100) {
      setError('Percentages must sum to 100');
      setSaving(false);
      return;
    }
    try {
      await api.put('/budget', budget);
      alert('Budget updated');
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!budget) return <div>No budget found</div>;

  return (
    <div>
      <h1>Budget Allocation (50/30/20 default)</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Needs (%):
          <input type="number" name="needsPercent" value={budget.needsPercent} onChange={handleChange} step="1" />
        </label>
        <label>
          Wants (%):
          <input type="number" name="wantsPercent" value={budget.wantsPercent} onChange={handleChange} step="1" />
        </label>
        <label>
          Savings (%):
          <input type="number" name="savingsPercent" value={budget.savingsPercent} onChange={handleChange} step="1" />
        </label>
        <button type="submit" disabled={saving}>Save</button>
      </form>
    </div>
  );
};

export default Budget;